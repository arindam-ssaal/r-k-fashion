import React, { useMemo, useState } from 'react'

import ListingPage from '@/components/ListingTable/ListingPage'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import '../../../../../../style.css'

// ─── Inline SVG Logo ──────────────────────────────────────────────────────────

function CardLogo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Card body */}
      <rect x="2" y="8" width="36" height="24" rx="4" fill="white" fillOpacity="0.20" />
      <rect x="2" y="8" width="36" height="24" rx="4" stroke="white" strokeWidth="1.8" />
      {/* Mag stripe */}
      <rect x="2" y="13" width="36" height="5" fill="white" fillOpacity="0.30" />
      {/* Chip */}
      <rect x="6" y="20" width="7" height="5" rx="1.2" fill="white" fillOpacity="0.55" />
      {/* Card lines */}
      <line x1="17" y1="21" x2="28" y2="21" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="17" y1="24" x2="24" y2="24" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      {/* Contactless symbol */}
      <path d="M32 20 Q34 20 34 20" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M30.5 18 Q34 18 34 20 Q34 22 30.5 22" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M29 16.5 Q36 16.5 36 20 Q36 23.5 29 23.5" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeOpacity="0.6" />
    </svg>
  )
}

function ModeIcon({ mode }) {
  if (mode === 'edit') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
  if (mode === 'view') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MEMBER_TYPES        = [{ id: 1, name: 'Silver' }, { id: 2, name: 'Gold' }, { id: 3, name: 'Platinum' }]
const CARD_SUFFIX_OPTIONS = [{ value: '26-27', label: '26-27' }]
const CARD_PREFIX         = 'SAS'

const CARD_GENERATOR_COLUMNS = [
  { field: 'batchId',        header: 'Batch ID',          type: 'code',  width: '90px'  },
  { field: 'memberTypeName', header: 'Member Type',        type: 'link'                  },
  { field: 'cardPrefix',     header: 'Prefix'                                             },
  { field: 'cardSuffix',     header: 'Suffix'                                             },
  { field: 'startingNo',     header: 'Starting No',                       width: '110px' },
  { field: 'quantity',       header: 'Quantity',                           width: '90px'  },
  { field: 'validity',       header: 'Validity (months)',                  width: '130px' },
  {
    field: 'status', header: 'Status', type: 'badge', width: '110px',
    badgeMap: {
      Generated: { variant: 'success', label: 'Generated', dot: true },
      Pending:   { variant: 'warning', label: 'Pending',   dot: true },
    },
  },
]

const DUMMY_BATCHES = [
  { batchId: 1, memberTypeName: 'Silver',   memberTypeId: 1, cardPrefix: 'SAS', cardSuffix: '26-27', leadingChar: '0', length: 5, startingNo: 1,  quantity: 20, validity: 12, status: 'Generated' },
  { batchId: 2, memberTypeName: 'Gold',     memberTypeId: 2, cardPrefix: 'SAS', cardSuffix: '26-27', leadingChar: '0', length: 5, startingNo: 21, quantity: 10, validity: 24, status: 'Generated' },
]

const EMPTY_FORM = { memberTypeId: '', memberTypeName: '', cardSuffix: '26-27', length: 5, leadingChar: '0', validity: 12, startingNo: 1, quantity: 10 }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getNextBatchId  = (rows) => rows.reduce((m, r) => Math.max(m, Number(r.batchId) || 0), 0) + 1
const padNumber       = (num, len, ch) => String(num).padStart(len, ch || '0')
const buildSampleCard = (f) => `${CARD_PREFIX} / ${padNumber(Number(f.startingNo) || 1, Number(f.length) || 5, f.leadingChar || '0')} / ${f.cardSuffix || '26-27'}`

function generateTokens(f) {
  const start = Number(f.startingNo) || 1
  const qty   = Math.min(Number(f.quantity) || 1, 500)
  return Array.from({ length: qty }, (_, i) =>
    `${CARD_PREFIX}/${padNumber(start + i, Number(f.length) || 5, f.leadingChar || '0')}/${f.cardSuffix || '26-27'}`
  )
}

function getModalTitle(mode) {
  if (mode === 'edit') return 'Edit — Member Card Generator'
  if (mode === 'view') return 'View — Member Card Generator'
  return 'Add — Member Card Generator'
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function FieldLabel({ children, required }) {
  return (
    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
      {children}
      {required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
    </label>
  )
}

function SectionDivider({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', marginTop: '4px' }}>
      <span style={{ fontSize: '14px' }}>{icon}</span>
      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--sky-500)' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--sky-100)' }} />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const MemberCardGenerator = () => {
  const [batches,   setBatches]   = useState(DUMMY_BATCHES)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [formData,  setFormData]  = useState(EMPTY_FORM)
  const [activeTab, setActiveTab] = useState('details')

  const isViewMode = modalMode === 'view'

  const stats = useMemo(() => {
    const totalCards = batches.reduce((s, b) => s + (Number(b.quantity) || 0), 0)
    return [
      { label: 'Total Batches', value: batches.length, icon: '🗂️', iconClass: 'blue',  filterKey: 'all' },
      { label: 'Total Cards',   value: totalCards,     icon: '💳', iconClass: 'green', filterKey: 'all' },
    ]
  }, [batches])

  const filterChips = useMemo(() => [{ key: 'all', label: 'All', chipClass: 'lp-chip-blue' }], [])

  const sampleCard = useMemo(() => buildSampleCard(formData), [formData])
  const tokens     = useMemo(() => generateTokens(formData),  [formData])

  const setField = (key, val) => setFormData((p) => ({ ...p, [key]: val }))

  const openAddModal  = () => { setModalMode('add');  setFormData({ ...EMPTY_FORM, batchId: getNextBatchId(batches) }); setActiveTab('details'); setModalOpen(true) }
  const openEditModal = (row) => { setModalMode('edit'); setFormData({ ...row }); setActiveTab('details'); setModalOpen(true) }
  const openViewModal = (row) => { setModalMode('view'); setFormData({ ...row }); setActiveTab('details'); setModalOpen(true) }

  const handleSave = () => {
    if (isViewMode) return
    const mt       = MEMBER_TYPES.find((m) => String(m.id) === String(formData.memberTypeId))
    const enriched = { ...formData, memberTypeName: mt?.name || '', status: 'Generated' }
    if (modalMode === 'add') {
      setBatches((p) => [...p, { ...enriched, batchId: getNextBatchId(p) }])
    } else {
      setBatches((p) => p.map((b) => (b.batchId === formData.batchId ? { ...b, ...enriched } : b)))
    }
    setModalOpen(false)
  }

  const canSave =
    !isViewMode &&
    formData.memberTypeId &&
    Number(formData.length)     > 0 &&
    Number(formData.quantity)   > 0 &&
    Number(formData.startingNo) >= 0 &&
    Number(formData.validity)   > 0

  return (
    <>
      <ListingPage
        title="Member Card Generator"
        subtitle="Generate and manage loyalty membership cards"
        titleIcon="💳"
        rowData={batches}
        columns={CARD_GENERATOR_COLUMNS}
        rowKey="batchId"
        loading={false}
        stats={stats}
        filterChips={filterChips}
        defaultFilter="all"
        searchPlaceholder="Search by member type, prefix…"
        searchFields={['memberTypeName', 'cardPrefix', 'cardSuffix']}
        defaultSortCol="batchId"
        defaultSortDir="desc"
        pageSize={8}
        onView={openViewModal}
        onEdit={openEditModal}
        primaryAction={{ label: '+ Generate Cards', onClick: openAddModal }}
        emptyText="No card batches found"
      />

      {/* ══════════════════ DIALOG ══════════════════ */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="max-w-none w-screen h-screen max-h-screen overflow-hidden p-0 m-0 rounded-none gap-0 border-0 shadow-none"
          style={{ background: '#ffffff' }}
        >
          <div className="flex flex-col h-screen">

            {/* ── HEADER ─────────────────────────────────────── */}
            <DialogHeader
              className="back-sky-400 flex-shrink-0"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px 0 20px',
                minHeight: '46px',
              }}
            >
              <DialogTitle style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>
                {getModalTitle(modalMode)}
              </DialogTitle>

              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                style={{
                  width: '28px', height: '28px', borderRadius: '5px',
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.45)',
                  color: '#ffffff', fontSize: '13px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >✕</button>

              <DialogDescription className="sr-only">
                {getModalTitle(modalMode)} — configure card generation settings.
              </DialogDescription>
            </DialogHeader>

            {/* ── BODY ───────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto" style={{ background: '#f0f9ff', padding: '28px 24px' }}>
              <div style={{ maxWidth: '860px', margin: '0 auto' }}>

                <Tabs value={activeTab} onValueChange={setActiveTab}>

                  {/* Tab list */}
                  <TabsList
                    style={{
                      display: 'inline-flex', gap: '4px', marginBottom: '20px',
                      background: '#ffffff', border: '1px solid #e0f2fe',
                      borderRadius: '10px', padding: '4px', boxShadow: '0 1px 4px rgba(14,165,233,0.08)',
                    }}
                  >
                    {[
                      { value: 'details', icon: '🛠️', label: 'Generate Details' },
                      { value: 'tokens',  icon: '🔢', label: `Generated Tokens${tokens.length > 0 ? ` (${tokens.length})` : ''}` },
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        style={{
                          borderRadius: '7px', padding: '6px 18px', fontSize: '13px',
                          fontWeight: 500, border: 'none', cursor: 'pointer',
                          background: activeTab === tab.value ? 'var(--sky-400)' : 'transparent',
                          color: activeTab === tab.value ? '#ffffff' : '#374151',
                          boxShadow: activeTab === tab.value ? '0 1px 4px rgba(14,165,233,0.25)' : 'none',
                          transition: 'all 0.15s',
                        }}
                      >
                        {tab.icon}&nbsp;&nbsp;{tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* ── Tab 1: Generate Details ── */}
                  <TabsContent value="details">
                    <div
                      className="back-white"
                      style={{
                        borderRadius: '12px', border: '1px solid #e0f2fe',
                        padding: '28px 28px 24px',
                        boxShadow: '0 1px 6px rgba(14,165,233,0.08)',
                      }}
                    >

                      {/* Section A */}
                      <SectionDivider icon="🪪" label="Card Identity" />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 20px', marginBottom: '24px' }}>

                        <div>
                          <FieldLabel required>Member Type</FieldLabel>
                          <Select value={String(formData.memberTypeId)} onValueChange={(v) => setField('memberTypeId', v)} disabled={isViewMode}>
                            <SelectTrigger style={{ height: '36px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff' }}>
                              <SelectValue placeholder="Select member type" />
                            </SelectTrigger>
                            <SelectContent>
                              {MEMBER_TYPES.map((m) => (
                                <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <FieldLabel>Card Prefix</FieldLabel>
                          <Input
                            value={CARD_PREFIX}
                            disabled readOnly
                            style={{ height: '36px', fontSize: '13px', background: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '6px', color: '#6b7280', fontFamily: 'monospace' }}
                          />
                        </div>

                        <div>
                          <FieldLabel required>Card Suffix</FieldLabel>
                          <Select value={formData.cardSuffix} onValueChange={(v) => setField('cardSuffix', v)} disabled={isViewMode}>
                            <SelectTrigger style={{ height: '36px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff' }}>
                              <SelectValue placeholder="Select suffix" />
                            </SelectTrigger>
                            <SelectContent>
                              {CARD_SUFFIX_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Section B */}
                      <SectionDivider icon="🔢" label="Card Number Format" />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 20px', marginBottom: '24px' }}>
                        <div>
                          <FieldLabel required>Length (digits)</FieldLabel>
                          <Input type="number" min={1} max={10} value={formData.length}
                            onChange={(e) => setField('length', e.target.value)} disabled={isViewMode} placeholder="e.g. 5"
                            style={{ height: '36px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', background: isViewMode ? '#f9fafb' : '#fff' }}
                          />
                        </div>
                        <div>
                          <FieldLabel>Leading Character</FieldLabel>
                          <Input maxLength={1} value={formData.leadingChar}
                            onChange={(e) => setField('leadingChar', e.target.value)} disabled={isViewMode} placeholder="e.g. 0"
                            style={{ height: '36px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', fontFamily: 'monospace', background: isViewMode ? '#f9fafb' : '#fff' }}
                          />
                        </div>
                      </div>

                      {/* Section C */}
                      <SectionDivider icon="⚙️" label="Generation Config" />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 20px', marginBottom: '24px' }}>
                        {[
                          { key: 'startingNo', label: 'Starting No',         placeholder: 'e.g. 1',  type: 'number', min: 1   },
                          { key: 'quantity',   label: 'Quantity',            placeholder: 'e.g. 10', type: 'number', min: 1   },
                          { key: 'validity',   label: 'Validity (months)',   placeholder: 'e.g. 12', type: 'number', min: 1   },
                        ].map(({ key, label, placeholder, type, min }) => (
                          <div key={key}>
                            <FieldLabel required>{label}</FieldLabel>
                            <Input type={type} min={min} value={formData[key]}
                              onChange={(e) => setField(key, e.target.value)} disabled={isViewMode} placeholder={placeholder}
                              style={{ height: '36px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', background: isViewMode ? '#f9fafb' : '#fff' }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Preview banner */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        background: '#f0f9ff', border: '1px solid #bae6fd',
                        borderRadius: '10px', padding: '16px 20px',
                      }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '10px',
                          background: 'var(--sky-100)', border: '1px solid var(--sky-200)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '20px', flexShrink: 0,
                        }}>👁️</div>
                        <div>
                          <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sky-500)', marginBottom: '4px' }}>
                            Sample Card Number Preview
                          </p>
                          <p style={{ margin: 0, fontSize: '20px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--sky-800)', letterSpacing: '0.12em' }}>
                            {sampleCard}
                          </p>
                          <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                            Format: {CARD_PREFIX} / &lt;padded-number&gt; / {formData.cardSuffix || '26-27'}
                          </p>
                        </div>
                      </div>

                    </div>
                  </TabsContent>

                  {/* ── Tab 2: Generated Tokens ── */}
                  <TabsContent value="tokens">
                    <div className="back-white" style={{ borderRadius: '12px', border: '1px solid #e0f2fe', overflow: 'hidden', boxShadow: '0 1px 6px rgba(14,165,233,0.08)' }}>

                      {/* Token header */}
                      <div className="back-sky-400" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: '13px' }}>Generated Card Numbers</span>
                        <span style={{
                          background: 'rgba(255,255,255,0.20)', border: '1px solid rgba(255,255,255,0.30)',
                          color: '#fff', borderRadius: '99px', padding: '2px 12px',
                          fontSize: '11px', fontWeight: 600,
                        }}>
                          {tokens.length} cards
                        </span>
                      </div>

                      {tokens.length === 0 ? (
                        <div style={{ padding: '56px 24px', textAlign: 'center' }}>
                          <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>🗃️</span>
                          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                            Configure details in the <strong>Generate Details</strong> tab to preview tokens.
                          </p>
                        </div>
                      ) : (
                        <div style={{ overflowY: 'auto', maxHeight: '62vh' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead style={{ position: 'sticky', top: 0 }}>
                              <tr style={{ background: '#f0f9ff', borderBottom: '1px solid #bae6fd' }}>
                                <th style={{ padding: '10px 20px', textAlign: 'left', color: 'var(--sky-600)', fontWeight: 600, fontSize: '12px', width: '60px' }}>#</th>
                                <th style={{ padding: '10px 20px', textAlign: 'left', color: 'var(--sky-600)', fontWeight: 600, fontSize: '12px' }}>Card Number</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tokens.map((token, idx) => (
                                <tr key={token} style={{ borderBottom: '1px solid #e0f2fe', background: idx % 2 === 0 ? '#ffffff' : '#f0f9ff' }}>
                                  <td style={{ padding: '9px 20px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '12px' }}>{idx + 1}</td>
                                  <td style={{ padding: '9px 20px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--sky-800)', letterSpacing: '0.08em' }}>{token}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                </Tabs>
              </div>
            </div>

            {/* ── FOOTER ─────────────────────────────────────── */}
            <div
              className="back-white flex-shrink-0"
              style={{ borderTop: '1px solid #e0f2fe', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}
            >
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                style={{ height: '36px', padding: '0 20px', fontSize: '13px', fontWeight: 500, background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!canSave}
                style={{
                  height: '36px', padding: '0 20px', fontSize: '13px', fontWeight: 500,
                  background: canSave ? '#22c55e' : '#86efac', color: '#ffffff',
                  border: 'none', borderRadius: '6px',
                  cursor: canSave ? 'pointer' : 'not-allowed', opacity: canSave ? 1 : 0.65,
                }}
              >
                Save
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MemberCardGenerator