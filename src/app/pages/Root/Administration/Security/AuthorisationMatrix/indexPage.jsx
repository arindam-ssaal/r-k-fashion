import { Shield, Save, RotateCcw, Search, Info, Loader2, Check } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { GetAPI, PostAPI } from '../../../../../../services/apiCall'
import './index.css'

/* ------------------------------------------------------------------
 * API endpoints  --  CHANGE HERE IF YOUR BACKEND ROUTE DIFFERS
 * ------------------------------------------------------------------ */
const API_GET_ALL_ACTION = '/api/Role/GetAllAction'
const API_GET_ALL_ROLE = '/api/Role/GetAllRole'
const API_GET_ALL_USER = '/api/User/GetAllUser'
const API_GET_ROLE_MATRIX = (roleId) => `/api/Role/GetRoleWiseMenuWiseAction?RoleID=${roleId}`
const API_GET_USER_MATRIX = (userId) => `/api/User/GetUserWiseMenuWiseAction?UserID=${userId}`
const API_POST_ROLE_MENU = '/api/Role/PostRoleMenu'
//! ASSUMPTION — user-side save endpoint was not in the API document.
const API_POST_USER_MENU = '/api/User/PostUserMenu'

const AUTH_COOKIE_LIST = ['AccessKey', 'UserId', 'AuthToken', 'SAPApplicable']

const ACTION_HINT = {
  view: 'open the screen',
  add: 'create records',
  edit: 'modify records',
  delete: 'remove records',
}

/* ── Helpers ────────────────────────────────────────────────────── */
const unwrapList = (response) => {
  const payload = response?.data ?? response
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.Table)) return payload.Table
  return []
}

const toBool = (value) =>
  value === true || value === 1 || value === '1' || value === 'Y' || value === 'y'

const toFlag = (value) => (value ? 'Y' : 'N')

const pick = (row, ...keys) => {
  for (const key of keys) {
    if (row?.[key] !== undefined && row[key] !== null) return row[key]
  }
  return undefined
}

const getCookieValue = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

/* Response rows are PascalCase (MenuID / MenuName) while the master
   lists come back camelCase (roleID / roleName), so read both. */
const toMenuRow = (row) => ({
  menuId: Number(pick(row, 'MenuID', 'MenuId', 'menuID', 'menuId') ?? 0),
  parentMenuId: Number(pick(row, 'ParentMenuID', 'ParentMenuId', 'parentMenuID', 'parentMenuId') ?? 0),
  title: pick(row, 'MenuName', 'menuName', 'Title', 'title') ?? '',
})

/* Menu data contains self-referencing parents (MenuID 10 → Parent 10).
   Treat those, and any missing parent, as a root node. */
const flattenMenuTree = (rows) => {
  const known = new Set(rows.map((r) => r.menuId))
  const childrenOf = new Map()

  rows.forEach((row) => {
    let parentId = row.parentMenuId
    if (parentId === row.menuId || !known.has(parentId)) parentId = 0
    if (!childrenOf.has(parentId)) childrenOf.set(parentId, [])
    childrenOf.get(parentId).push(row)
  })

  const flat = []
  const seen = new Set()

  const walk = (parentId, depth) => {
    ;(childrenOf.get(parentId) || []).forEach((row) => {
      if (seen.has(row.menuId)) return
      seen.add(row.menuId)
      const kids = childrenOf.get(row.menuId) || []
      flat.push({ ...row, depth, hasChildren: kids.length > 0 })
      walk(row.menuId, depth + 1)
    })
  }

  walk(0, 0)

  rows.forEach((row) => {
    if (!seen.has(row.menuId)) {
      seen.add(row.menuId)
      flat.push({ ...row, depth: 0, hasChildren: false })
    }
  })

  return flat
}

const descendantIds = (menus, menuId) => {
  const out = []
  const collect = (parentId) => {
    menus
      .filter((m) => m.parentMenuId === parentId && m.menuId !== parentId)
      .forEach((child) => {
        out.push(child.menuId)
        collect(child.menuId)
      })
  }
  collect(menuId)
  return out
}

const ancestorIds = (menus, menuId) => {
  const byId = new Map(menus.map((m) => [m.menuId, m]))
  const out = []
  let current = byId.get(menuId)
  const guard = new Set()

  while (current && current.parentMenuId && current.parentMenuId !== current.menuId) {
    if (guard.has(current.parentMenuId)) break
    guard.add(current.parentMenuId)
    const parent = byId.get(current.parentMenuId)
    if (!parent) break
    out.push(parent.menuId)
    current = parent
  }
  return out
}

const cloneMatrix = (matrix) =>
  Object.entries(matrix ?? {}).reduce((acc, [menuId, perm]) => ({ ...acc, [menuId]: { ...perm } }), {})

/* ═══════════════════════════════════════════════════════════════ */

const AuthMatrix = () => {
  const [cookies] = useCookies(AUTH_COOKIE_LIST)
  const canEdit = true

  const [viewBy, setViewBy] = useState('role') // 'role' | 'user'
  const [search, setSearch] = useState('')

  const [actions, setActions] = useState([]) // [{ id, name, key }]
  const [roles, setRoles] = useState([])
  const [users, setUsers] = useState([])

  const [selectedId, setSelectedId] = useState(null)
  const [menus, setMenus] = useState([]) // flattened tree for the selected subject
  const [matrix, setMatrix] = useState({}) // { [menuId]: { [actionId]: bool } }
  const [baseline, setBaseline] = useState({})

  const [isLoadingMasters, setIsLoadingMasters] = useState(true)
  const [isLoadingMatrix, setIsLoadingMatrix] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const viewActionId = useMemo(() => actions.find((a) => a.key === 'view')?.id ?? null, [actions])

  /* ── Masters: actions + roles + users ─────────────────────── */
  useEffect(() => {
    if (!cookies.AuthToken) return
    let cancelled = false

    ;(async () => {
      setIsLoadingMasters(true)
      try {
        const [actionRes, roleRes, userRes] = await Promise.all([
          GetAPI(API_GET_ALL_ACTION, '', {}, cookies),
          GetAPI(API_GET_ALL_ROLE, '', {}, cookies),
          GetAPI(API_GET_ALL_USER, '', {}, cookies),
        ])
        if (cancelled) return

        const actionList = unwrapList(actionRes).map((row) => {
          const name = String(pick(row, 'ActionName', 'actionName') ?? '')
          return {
            id: Number(pick(row, 'ActionID', 'ActionId', 'actionID', 'actionId') ?? 0),
            name,
            key: name.trim().toLowerCase(),
          }
        })

        setActions(actionList.filter((a) => a.id && a.name))
        setRoles(unwrapList(roleRes))
        setUsers(unwrapList(userRes))
      } catch {
        if (!cancelled) toast.error('Could not load the action / role / user masters.')
      } finally {
        if (!cancelled) setIsLoadingMasters(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [cookies.AuthToken]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Left panel list ──────────────────────────────────────── */
  const subjects = useMemo(() => {
    if (viewBy === 'role') {
      return roles.map((r) => ({
        id: Number(pick(r, 'RoleID', 'RoleId', 'roleID', 'roleId') ?? 0),
        name: pick(r, 'RoleName', 'roleName') ?? '',
        sub: pick(r, 'Remarks', 'remarks', 'Description', 'description') ?? '',
        isActive: toBool(pick(r, 'IsActive', 'isActive') ?? 'Y'),
      }))
    }
    return users.map((u) => ({
      id: Number(pick(u, 'UserID', 'UserId', 'userID', 'userId') ?? 0),
      name: pick(u, 'UserName', 'userName', 'LoginID', 'loginID') ?? '',
      sub: pick(u, 'RoleName', 'roleName') ?? '',
      roleId: Number(pick(u, 'RoleID', 'RoleId', 'roleID', 'roleId') ?? 0),
      isActive: toBool(pick(u, 'IsActive', 'isActive') ?? 'Y'),
    }))
  }, [viewBy, roles, users])

  const filteredSubjects = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return subjects
    return subjects.filter((s) => `${s.name} ${s.sub}`.toLowerCase().includes(q))
  }, [subjects, search])

  const selectedSubject = useMemo(
    () => subjects.find((s) => s.id === selectedId) ?? null,
    [subjects, selectedId]
  )

  /* ── Load the matrix for the selected role / user ─────────── */
  const loadMatrix = useCallback(
    async (id) => {
      if (!id) return
      setIsLoadingMatrix(true)
      try {
        const url = viewBy === 'role' ? API_GET_ROLE_MATRIX(id) : API_GET_USER_MATRIX(id)
        const response = await GetAPI(url, '', {}, cookies)
        const rows = unwrapList(response)

        const menuRows = rows.map(toMenuRow).filter((m) => m.menuId)
        const flat = flattenMenuTree(menuRows)

        const next = {}
        rows.forEach((row) => {
          const menuId = Number(pick(row, 'MenuID', 'MenuId', 'menuID', 'menuId') ?? 0)
          if (!menuId) return
          const perm = {}
          actions.forEach((action) => {
            perm[action.id] = toBool(pick(row, action.name, action.key, action.name.toLowerCase()))
          })
          next[menuId] = perm
        })

        setMenus(flat)
        setMatrix(next)
        setBaseline(cloneMatrix(next))
      } catch {
        toast.error('Could not load the permission matrix.')
        setMenus([])
        setMatrix({})
        setBaseline({})
      } finally {
        setIsLoadingMatrix(false)
      }
    },
    [viewBy, cookies, actions]
  )

  //! Switching between role / user view clears the selection
  useEffect(() => {
    setSelectedId(null)
    setMenus([])
    setMatrix({})
    setBaseline({})
    setSearch('')
  }, [viewBy])

  const handleSelectSubject = (id) => {
    setSelectedId(id)
    loadMatrix(id)
  }

  /* ── Matrix editing ───────────────────────────────────────── */
  const blankPerm = useMemo(
    () => actions.reduce((acc, a) => ({ ...acc, [a.id]: false }), {}),
    [actions]
  )

  const permOf = useCallback((menuId) => matrix[menuId] ?? blankPerm, [matrix, blankPerm])

  const applyPerm = (draft, menuId, actionId, value) => {
    const current = draft[menuId] ?? { ...blankPerm }
    draft[menuId] = { ...current, [actionId]: value }
  }

  const togglePermission = (menuId, actionId) => {
    if (!canEdit) return

    setMatrix((prev) => {
      const draft = { ...prev }
      const nextValue = !(prev[menuId] ?? blankPerm)[actionId]

      applyPerm(draft, menuId, actionId, nextValue)

      //! Add / Edit need View. Clearing View clears the rest of the row.
      if (viewActionId !== null) {
        if (actionId === viewActionId && !nextValue) {
          actions.forEach((a) => applyPerm(draft, menuId, a.id, false))
        } else if (actionId !== viewActionId && nextValue) {
          applyPerm(draft, menuId, viewActionId, true)
        }
      }

      //! Cascade down to children, and switch parents on when a child is on.
      descendantIds(menus, menuId).forEach((childId) => {
        applyPerm(draft, childId, actionId, nextValue)
        if (viewActionId !== null) {
          if (actionId === viewActionId && !nextValue) {
            actions.forEach((a) => applyPerm(draft, childId, a.id, false))
          } else if (actionId !== viewActionId && nextValue) {
            applyPerm(draft, childId, viewActionId, true)
          }
        }
      })

      if (nextValue) {
        ancestorIds(menus, menuId).forEach((parentId) => {
          applyPerm(draft, parentId, actionId, true)
          if (viewActionId !== null) applyPerm(draft, parentId, viewActionId, true)
        })
      }

      return draft
    })
  }

  const toggleRow = (menuId) => {
    if (!canEdit || actions.length === 0) return
    const current = permOf(menuId)
    const allOn = actions.every((a) => current[a.id])

    setMatrix((prev) => {
      const draft = { ...prev }
      const targets = [menuId, ...descendantIds(menus, menuId)]
      targets.forEach((id) => {
        actions.forEach((a) => applyPerm(draft, id, a.id, !allOn))
      })
      if (!allOn) {
        ancestorIds(menus, menuId).forEach((parentId) => {
          actions.forEach((a) => applyPerm(draft, parentId, a.id, true))
        })
      }
      return draft
    })
  }

  const toggleColumn = (actionId) => {
    if (!canEdit) return
    const allOn = menus.length > 0 && menus.every((m) => permOf(m.menuId)[actionId])

    setMatrix((prev) => {
      const draft = { ...prev }
      menus.forEach((menu) => {
        applyPerm(draft, menu.menuId, actionId, !allOn)
        if (viewActionId !== null) {
          if (actionId === viewActionId && allOn) {
            actions.forEach((a) => applyPerm(draft, menu.menuId, a.id, false))
          } else if (actionId !== viewActionId && !allOn) {
            applyPerm(draft, menu.menuId, viewActionId, true)
          }
        }
      })
      return draft
    })
  }

  const isDirty = useMemo(
    () => JSON.stringify(matrix) !== JSON.stringify(baseline),
    [matrix, baseline]
  )

  /* ── Save ─────────────────────────────────────────────────── */
  const __handleSave = async () => {
    if (!selectedSubject) {
      toast.error('Select a role or user first.')
      return
    }
    if (!canEdit) {
      toast.error('You do not have permission to change the authorisation matrix.')
      return
    }

    setIsSaving(true)
    try {
      const subjectKey = viewBy === 'role' ? 'roleID' : 'userID'
      const subjectId = selectedSubject.id

      const lines = menus.map((menu) => {
        const perm = permOf(menu.menuId)
        return {
          [subjectKey]: subjectId,
          menuID: menu.menuId,
            //   objMenuWiseAction: actions.map((action) => ({
            //     [subjectKey]: subjectId,
            //     menuID: menu.menuId,
            //     actionID: action.id,
            //     checked: toFlag(perm[action.id]),
            //   })),

            // objMenuWiseAction: actions.map((action) => {
            //     const isChecked = !!perm[action.id]
            //     return {
            //         [subjectKey]: subjectId,
            //         menuID: menu.menuId,
            //         actionID: isChecked ? action.id : 0,
            //         checked: isChecked ? 'Y' : '',
            //     }
            // }),

            objMenuWiseAction: actions
                .filter((action) => !!perm[action.id])
                .map((action) => ({
                    [subjectKey]: subjectId,
                    menuID: menu.menuId,
                    actionID: action.id,
                    checked: 'Y',
            })),
        }
      })

      const payload =
        viewBy === 'role'
          ? { objRoleWiseMenu: lines }
          : { objUserWiseMenu: lines, enteredBy: Number(getCookieValue('UserId')) || 0 }

      const endpoint = viewBy === 'role' ? API_POST_ROLE_MENU : API_POST_USER_MENU
      const response = await PostAPI(endpoint, '', payload, cookies)

      const result = Array.isArray(response?.data) ? response.data[0] : response?.data
      const code = pick(result ?? {}, 'ReturnCode', 'returnCode')
      const message = pick(result ?? {}, 'ReturnMsg', 'returnMsg')

      if (code && code !== 'Y') {
        toast.error(message || 'Failed to save permissions.')
        return
      }

      toast.success(`Permissions saved for ${selectedSubject.name}.`)
      setBaseline(cloneMatrix(matrix))
    } catch (error) {
      toast.error(error?.message || 'Could not save the permissions. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = async () => {
        if (!selectedSubject) {
            toast.error('Select a role or user first.')
            return
        }

        if (!canEdit) {
            toast.error('You do not have permission to change the authorisation matrix.')
            return
        }

        setIsSaving(true)

        try {
            const subjectKey = viewBy === 'role' ? 'roleID' : 'userID'
            const subjectId = selectedSubject.id

            const lines = menus
            .map((menu) => {
                const perm = permOf(menu.menuId)

                const objMenuWiseAction = actions
                .filter((action) => !!perm[action.id])
                .map((action) => ({
                    [subjectKey]: subjectId,
                    menuID: menu.menuId,
                    actionID: action.id,
                    checked: 'Y',
                }))

                if (objMenuWiseAction.length === 0) {
                return null
                }

                return {
                [subjectKey]: subjectId,
                menuID: menu.menuId,
                objMenuWiseAction,
                }
            })
            .filter(Boolean)

            const payload =
            viewBy === 'role'
                ? { objRoleWiseMenu: lines }
                : {
                    objUserWiseMenu: lines,
                    enteredBy: Number(getCookieValue('UserId')) || 0,
                }

            const endpoint =
            viewBy === 'role' ? API_POST_ROLE_MENU : API_POST_USER_MENU

            const response = await PostAPI(endpoint, '', payload, cookies)

            const result = Array.isArray(response?.data)
            ? response.data[0]
            : response?.data

            const code = pick(result ?? {}, 'ReturnCode', 'returnCode')
            const message = pick(result ?? {}, 'ReturnMsg', 'returnMsg')

            if (code && code !== 'Y') {
            toast.error(message || 'Failed to save permissions.')
            return
            }

            toast.success(`Permissions saved for ${selectedSubject.name}.`)
            setBaseline(cloneMatrix(matrix))
        } catch (error) {
            toast.error(
            error?.message || 'Could not save the permissions. Please try again.'
            )
        } finally {
            setIsSaving(false)
        }
  }

  const handleReset = () => setMatrix(cloneMatrix(baseline))

  /* ── Render ───────────────────────────────────────────────── */
  const colSpan = actions.length + 2

  return (
    <div className="am-container">
      <div className="am-header">
        <div className="am-header-left">
          <div className="am-title-row">
            <Shield className="am-title-icon" />
            <h1 className="am-title">Authorisation Matrix</h1>
          </div>
          <p className="am-subtitle">Grant screen-level rights per role or per user.</p>
          <ul className="am-breadcrumb">
            <li>
              <Link className="am-breadcrumb-link" to="/dashboard">
                Home
              </Link>
            </li>
            <li className="am-breadcrumb-current">Authorisation Matrix</li>
          </ul>
        </div>

        <div className="am-header-right">
          <div className="am-view-by-wrapper">
            <span className="am-view-by-label">View by</span>
            <select
              className="am-view-select"
              value={viewBy}
              onChange={(e) => setViewBy(e.target.value)}
            >
              <option value="role">Role</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      <div className="am-panels">
        {/* ── Left: role / user picker ── */}
        {/*! Must not be an <aside>: the app layout styles every aside
            inside it as the fixed navigation sidebar. */}
        <div className="am-panel-left">
          <h2 className="am-panel-title">
            <Shield className="am-panel-title-icon" />
            {viewBy === 'role' ? 'Roles' : 'Users'}
          </h2>

          <div className="am-search-wrapper">
            <Search className="am-search-icon" />
            <input
              className="am-search-input"
              placeholder={`Search ${viewBy === 'role' ? 'roles' : 'users'}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="am-role-list">
            {isLoadingMasters && (
              <p className="am-tip">
                <Loader2 className="am-btn-icon am-spin" /> Loading...
              </p>
            )}

            {!isLoadingMasters && filteredSubjects.length === 0 && (
              <p className="am-tip">No {viewBy === 'role' ? 'roles' : 'users'} found.</p>
            )}

            {filteredSubjects.map((subject) => (
              <button
                type="button"
                key={subject.id}
                onClick={() => handleSelectSubject(subject.id)}
                className={`am-role-item ${selectedId === subject.id ? 'am-role-item--active' : ''}`}
              >
                <span className="am-role-radio">
                  {selectedId === subject.id ? <Check size={12} /> : null}
                </span>
                <span>
                  <span className="am-role-name">{subject.name}</span>
                  {subject.sub ? <span className="am-role-sub">{subject.sub}</span> : null}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: the matrix ── */}
        <section className="am-panel-right">
          {!selectedSubject && (
            <div className="am-matrix-empty">
              <Info size={18} />
              <p>Select a {viewBy} on the left to load its permissions.</p>
            </div>
          )}

          {selectedSubject && isLoadingMatrix && (
            <div className="am-matrix-empty">
              <Loader2 size={18} className="am-spin" />
              <p>Loading permissions for {selectedSubject.name}...</p>
            </div>
          )}

          {selectedSubject && !isLoadingMatrix && (
            <div className="am-matrix-wrapper">
              <table className="am-matrix-table">
                <thead className="am-matrix-thead">
                  <tr>
                    <th className="am-matrix-th">Screen</th>
                    {actions.map((action) => (
                      <th key={action.id} className="am-matrix-th am-matrix-th--perm">
                        <button
                          type="button"
                          className="am-th-col-content"
                          onClick={() => toggleColumn(action.id)}
                          disabled={!canEdit}
                          title={`Toggle ${action.name} for every screen`}
                        >
                          <span className={`am-th-col-label am-th-col-label--${action.key}`}>
                            {action.name}
                          </span>
                        </button>
                      </th>
                    ))}
                    <th className="am-matrix-th am-matrix-th--action">All</th>
                  </tr>
                </thead>

                <tbody className="am-matrix-tbody">
                  {menus.length === 0 && (
                    <tr>
                      <td className="am-matrix-item-td" colSpan={colSpan}>
                        No menus returned for this {viewBy}.
                      </td>
                    </tr>
                  )}

                  {menus.map((menu) => {
                    const perm = permOf(menu.menuId)
                    return (
                      <tr
                        className={
                          menu.hasChildren ? 'am-matrix-item-row am-matrix-group-row' : 'am-matrix-item-row'
                        }
                        key={menu.menuId}
                      >
                        <td
                          className="am-matrix-item-td"
                          style={{
                            paddingLeft: 16 + menu.depth * 22,
                            fontWeight: menu.hasChildren ? 600 : 400,
                          }}
                        >
                          {menu.title}
                        </td>

                        {actions.map((action) => (
                          <td className="am-matrix-item-td-perm" key={action.id}>
                            <input
                              type="checkbox"
                              className={`am-checkbox am-checkbox--${action.key}`}
                              checked={Boolean(perm[action.id])}
                              disabled={!canEdit}
                              onChange={() => togglePermission(menu.menuId, action.id)}
                            />
                          </td>
                        ))}

                        <td className="am-matrix-item-td-perm">
                          <input
                            type="checkbox"
                            className="am-checkbox"
                            checked={actions.length > 0 && actions.every((a) => perm[a.id])}
                            disabled={!canEdit}
                            onChange={() => toggleRow(menu.menuId)}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <div className="am-bottom-bar">
        <div className="am-legend">
          {actions.map((action) => (
            <span className="am-legend-item" key={action.id}>
              {action.name}
              {ACTION_HINT[action.key] ? ` — ${ACTION_HINT[action.key]}` : ''}
            </span>
          ))}
        </div>

        <div>
          <button
            type="button"
            className="am-btn-reset"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
          >
            <RotateCcw className="am-btn-icon" /> Reset
          </button>
          <button
            type="button"
            className="am-btn-save"
            onClick={handleSave}
            disabled={!selectedSubject || !isDirty || isSaving || !canEdit}
            title={canEdit ? 'Save permissions' : 'You do not have Edit permission'}
          >
            {isSaving ? <Loader2 className="am-btn-icon am-spin" /> : <Save className="am-btn-icon" />}
            {isSaving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthMatrix