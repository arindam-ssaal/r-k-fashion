/**
 * SalesPersonIncentiveAssortment.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * SAP-Fiori-style  ·  Sales Person Incentive – Assortment Creation & Management
 *
 * Differences from AssortmentForPromotion reference:
 *   ✔  Assortment Model : Regular / Exclusive  (not Dynamic / Preset)
 *   ✔  Promotion Type   : REMOVED
 *   ✔  Item Promotion   : REMOVED
 *   ✔  Incentive %      : NEW numeric field with live badge + summary banner
 *   ✔  Breadcrumb / Title / Sidebar updated for Sales Person Incentive context
 *
 * Zero external dependencies — pure React + inline styles.
 *
 * Usage
 *   import SalesPersonIncentiveAssortment from './SalesPersonIncentiveAssortment';
 *   export default function App() { return <SalesPersonIncentiveAssortment />; }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import Select from 'react-select';
import { PostAPI, GetAPI } from '@/services/apiCall';
import { toast } from 'sonner';
import { useCookies } from 'react-cookie';
import { X } from 'lucide-react';
import ListingPage from '@/components/ListingTable/ListingPage';
import SkeletonLoaderTable from '@/components/SkeletonLoaderTable';
import '../../../../../../../style.css'

/* ═══════════════════════════════════════════════════════════════════════════
   1.  DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════ */
const T = {
  brand:       "#0A6ED1",
  brandDark:   "#085EB5",
  shell:       "#1B4F8A",
  text:        "#32363A",
  textMuted:   "#6A6D70",
  border:      "#D9D9D9",
  bg:          "#F5F6F7",
  white:       "#FFFFFF",
  selected:    "#E8F2FB",
  selectedB:   "#B0C6E8",
  inputBorder: "#89919A",
  label:       "#6A6D70",
  sectionBg:   "#F7F7F7",
  error:       "#BB0000",
  success:     "#107E3E",
  successDk:   "#0A5C2E",
  warning:     "#E76500",
  warningDk:   "#BF5200",
  r:           "4px",          // border-radius shorthand
};

/* ═══════════════════════════════════════════════════════════════════════════
   2.  STATIC DATA
═══════════════════════════════════════════════════════════════════════════ */
const PROPS_DATA = {
  category:    [["CAT-001","Electronics"],["CAT-002","Apparel"],["CAT-003","Footwear"],["CAT-004","Home & Kitchen"],["CAT-005","Sports & Outdoors"]],
  subcategory: [["SUB-001","Mobile Phones"],["SUB-002","Laptops & Tablets"],["SUB-003","Men's Shirts"],["SUB-004","Running Shoes"],["SUB-005","Kitchen Cookware"]],
  brand:       [["BRD-001","Brand Alpha"],["BRD-002","Brand Beta"],["BRD-003","Brand Gamma"],["BRD-004","Brand Delta"],["BRD-005","Brand Epsilon"]],
  supplier:    [["SUP-001","Global Supplies Pvt Ltd"],["SUP-002","East West Traders"],["SUP-003","Premium Imports Co."],["SUP-004","Sunrise Distributors"]],
  season:      [["SEA-001","Summer 2025"],["SEA-002","Winter 2025"],["SEA-003","Festive 2025"],["SEA-004","Monsoon 2025"]],
};
const GROUP_LABELS = { category:"Category", subcategory:"Sub-Category", brand:"Brand", supplier:"Supplier", season:"Season" };
const SAMPLE_ITEMS = [
  { id:1, code:"ITM-0001", name:"Premium Cotton T-Shirt",  type:"Include" },
  { id:2, code:"ITM-0002", name:"Running Shoes Pro X",      type:"Include" },
  { id:3, code:"ITM-0003", name:"Wireless Earbuds Ultra",   type:"Include" },
  { id:4, code:"ITM-0004", name:"Leather Wallet Slim",      type:"Exclude" },
  { id:5, code:"ITM-0005", name:"Sports Water Bottle",      type:"Include" },
  { id:6, code:"ITM-0006", name:"Yoga Mat Premium",         type:"Include" },
  { id:7, code:"ITM-0007", name:"Formal Dress Shirt",       type:"Include" },
  { id:8, code:"ITM-0008", name:"Casual Sneakers Classic",  type:"Exclude" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   3.  STYLE DICTIONARY
═══════════════════════════════════════════════════════════════════════════ */
const S = {
  /* ── Shell ── */
  shellBar:    { background:T.shell, color:"#fff", display:"flex", alignItems:"center", height:44, padding:"0 16px", gap:12, flexShrink:0 },
  shellLogo:   { fontSize:13, fontWeight:700, letterSpacing:".5px", border:"1.5px solid rgba(255,255,255,.6)", padding:"2px 8px", borderRadius:T.r, color:"#fff" },
  shellSep:    { width:1, height:18, background:"rgba(255,255,255,.25)" },
  shellTitle:  { fontSize:14, color:"rgba(255,255,255,.9)", marginLeft:4 },
  shellRight:  { marginLeft:"auto", display:"flex", alignItems:"center", gap:10 },
  shellDb:     { fontSize:12, background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.3)", padding:"2px 10px", borderRadius:T.r, color:"rgba(255,255,255,.9)" },
  shellUser:   { fontSize:12, color:"rgba(255,255,255,.8)", display:"flex", alignItems:"center", gap:6 },
  avatar:      { width:28, height:28, borderRadius:"50%", background:"#5B738B", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, color:"#fff" },

  /* ── Layout ── */
  layout:      { display:"flex", height:"calc(100vh - 44px)" },

  /* ── Sidebar ── */
  sidebar:     { width:210, background:T.white, borderRight:`1px solid ${T.border}`, overflowY:"auto", flexShrink:0 },
  sbGroup:     { padding:"8px 0", borderBottom:`1px solid ${T.border}` },
  sbGroupTitle:{ fontSize:11, fontWeight:700, color:T.textMuted, padding:"8px 16px 4px", textTransform:"uppercase", letterSpacing:".5px" },

  /* ── Main ── */
  main:        { flex:1, display:"flex", flexDirection:"column", background:T.bg, overflow:"hidden" },

  /* ── Page Header ── */
  pageHeader:  { background:T.white, borderBottom:`1px solid ${T.border}`, padding:"12px 24px 0", flexShrink:0 },
  breadcrumb:  { fontSize:11, color:T.textMuted, display:"flex", alignItems:"center", gap:5, marginBottom:5, flexWrap:"wrap" },
  bcLink:      { color:T.brand, cursor:"pointer" },
  bcSep:       { color:T.border },
  pageTitle:   { fontSize:18, fontWeight:400, color:T.text, marginBottom:10 },
  tabs:        { display:"flex" },
  tab:         { fontSize:13, color:T.textMuted, padding:"8px 20px", cursor:"pointer", borderBottom:"3px solid transparent", marginBottom:-1, whiteSpace:"nowrap" },
  tabActive:   { fontSize:13, color:T.brand, fontWeight:600, padding:"8px 20px", cursor:"pointer", borderBottom:`3px solid ${T.brand}`, marginBottom:-1, whiteSpace:"nowrap" },

  /* ── Content ── */
  content:     { flex:1, overflowY:"auto", padding:"20px 24px" },

  /* ── Split ── */
  splitLayout: { display:"flex", gap:16, alignItems:"flex-start" },
  splitLeft:   { flex:1, minWidth:0 },
  splitRight:  { width:330, flexShrink:0, background:T.white, border:`1px solid ${T.border}`, borderRadius:T.r, overflow:"hidden", position:"sticky", top:0 },

  /* ── Form Card ── */
  card:        { background:T.white, border:`1px solid ${T.border}`, borderRadius:T.r, marginBottom:16, overflow:"hidden" },
  cardHead:    { background:T.sectionBg, borderBottom:`1px solid ${T.border}`, padding:"10px 16px", display:"flex", alignItems:"center", gap:10 },
  cardTitle:   { fontSize:14, fontWeight:600, color:T.text },
  cardSub:     { fontSize:12, color:T.textMuted },
  cardBody:    { padding:16 },

  /* ── Section Bar ── */
  secBar:      { display:"flex", alignItems:"center", gap:8, background:T.selected, borderLeft:`4px solid ${T.brand}`, padding:"10px 16px", marginBottom:16, borderRadius:`0 ${T.r} ${T.r} 0` },
  secBarH:     { fontSize:14, fontWeight:600, color:T.brand },
  secBarP:     { fontSize:12, color:T.textMuted },
  dot:         { width:8, height:8, borderRadius:"50%", background:T.brand, flexShrink:0 },

  /* ── Form Atoms ── */
  fRow:        { display:"flex", gap:24, marginBottom:16, flexWrap:"wrap" },
  fGroup:      { display:"flex", flexDirection:"column", gap:4, flex:1, minWidth:200 },
  fGroupHalf:  { display:"flex", flexDirection:"column", gap:4, flex:"0 0 calc(50% - 12px)" },
  fGroupFull:  { display:"flex", flexDirection:"column", gap:4, flex:"0 0 100%" },
  fLabel:      { fontSize:12, color:T.label },
  req:         { color:T.error, marginLeft:2 },
  input:       { height:32, border:`1px solid ${T.inputBorder}`, borderRadius:T.r, padding:"0 10px", fontSize:13, color:T.text, background:T.white, outline:"none", width:"100%", fontFamily:"inherit" },
  inputF:      { borderColor:T.brand, boxShadow:"0 0 0 2px rgba(10,110,209,.15)" },
  sel:         {
    height:32, border:`1px solid ${T.inputBorder}`, borderRadius:T.r, padding:"0 28px 0 10px",
    fontSize:13, color:T.text, background:T.white, outline:"none", width:"100%",
    cursor:"pointer", appearance:"none", WebkitAppearance:"none", fontFamily:"inherit",
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2389919A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center",
  },
  radioGroup:  { display:"flex", alignItems:"center", gap:20, height:32 },
  radioLabel:  { display:"flex", alignItems:"center", gap:6, fontSize:13, color:T.text, cursor:"pointer" },
  divider:     { border:"none", borderTop:`1px solid ${T.border}`, margin:"8px 0 16px" },

  /* ── MRP ── */
  mrpRow:      { display:"flex", alignItems:"center", gap:8, marginTop:4 },
  mrpLbl:      { fontSize:12, color:T.textMuted, whiteSpace:"nowrap" },
  mrpIn:       { height:32, border:`1px solid ${T.inputBorder}`, borderRadius:T.r, padding:"0 8px", fontSize:13, color:T.text, background:T.white, outline:"none", width:90, fontFamily:"inherit" },

  /* ── Incentive % ── */
  incentiveWrap:   { position:"relative", display:"inline-flex", alignItems:"center" },
  incentiveIn:     { height:32, border:`1px solid ${T.inputBorder}`, borderRadius:T.r, padding:"0 28px 0 10px", fontSize:13, color:T.text, background:T.white, outline:"none", width:130, fontFamily:"inherit" },
  incentiveSuffix: { position:"absolute", right:10, fontSize:13, color:T.textMuted, pointerEvents:"none", fontWeight:500 },
  incentiveHint:   { fontSize:11, color:T.textMuted, marginTop:3 },

  /* ── Inactive ── */
  inactiveWrap:{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:T.textMuted, cursor:"pointer", height:32 },

  /* ── Badges ── */
  badgeBase:   { display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:10, fontSize:11, fontWeight:500 },
  badgeBlue:   { background:T.selected, color:T.brand, border:`1px solid ${T.selectedB}` },
  badgeGreen:  { background:"#E0F4EA", color:T.success, border:"1px solid #A8DDB8" },
  badgeRed:    { background:"#FFF0F0", color:T.error, border:"1px solid #F7C4C4" },

  /* ── Toolbar ── */
  toolbar:     { display:"flex", alignItems:"center", gap:8, padding:"8px 0 12px", borderBottom:`1px solid ${T.border}`, marginBottom:12, flexWrap:"wrap" },
  searchWrap:  { position:"relative", marginLeft:"auto" },
  searchIcon:  { position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" },
  searchIn:    { height:32, border:`1px solid ${T.inputBorder}`, borderRadius:T.r, padding:"0 10px 0 28px", fontSize:12, color:T.text, background:T.white, outline:"none", width:170, fontFamily:"inherit" },

  /* ── Table ── */
  tableWrap:   { border:`1px solid ${T.border}`, borderRadius:T.r, overflow:"hidden" },
  table:       { width:"100%", borderCollapse:"collapse", fontSize:13 },
  th:          { padding:"7px 12px", textAlign:"left", fontSize:12, fontWeight:600, color:T.textMuted, background:T.sectionBg, borderBottom:`2px solid ${T.border}`, whiteSpace:"nowrap" },
  thC:         { padding:"7px 12px", textAlign:"center", fontSize:12, fontWeight:600, color:T.textMuted, background:T.sectionBg, borderBottom:`2px solid ${T.border}`, whiteSpace:"nowrap" },
  td:          { padding:"7px 12px", borderBottom:`1px solid ${T.border}`, color:T.text },
  emptyState:  { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"36px 20px", gap:8, color:T.textMuted },

  /* ── Pagination ── */
  pg:          { display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:8, fontSize:12, color:T.textMuted },
  pgCtrl:      { display:"flex", alignItems:"center", gap:4 },
  pgSz:        { display:"flex", alignItems:"center", gap:6 },
  pgNav:       { background:"none", border:`1px solid ${T.border}`, borderRadius:3, padding:"0 6px", height:22, cursor:"default", fontSize:11, color:T.textMuted, fontFamily:"inherit", opacity:.4 },

  /* ── Right Panel ── */
  rpHead:      { background:T.sectionBg, borderBottom:`1px solid ${T.border}`, padding:"10px 14px", display:"flex", alignItems:"center", gap:9 },
  rpTitle:     { fontSize:14, fontWeight:600, color:T.brand },
  rpSub:       { fontSize:12, color:T.textMuted },
  rpBody:      { padding:14, display:"flex", flexDirection:"column", gap:12 },
  rpFoot:      { padding:"10px 14px", borderTop:`1px solid ${T.border}`, display:"flex", justifyContent:"flex-end", gap:8 },
  propsHolder: { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:T.sectionBg, border:`1px dashed ${T.border}`, borderRadius:T.r, padding:"28px 16px", gap:8, color:T.textMuted, textAlign:"center", minHeight:150 },
  propSecBar:  { display:"flex", alignItems:"center", gap:8, background:T.selected, borderLeft:`4px solid ${T.brand}`, padding:"8px 12px", margin:"10px 10px 0", borderRadius:`0 ${T.r} ${T.r} 0` },
  propSecTtl:  { fontSize:13, fontWeight:600, color:T.brand },
  propsInner:  { maxHeight:250, overflowY:"auto" },
  propItem:    { display:"flex", alignItems:"center", gap:10, padding:"8px 14px", borderBottom:`1px solid ${T.border}`, cursor:"pointer", fontSize:13 },
  propCode:    { color:T.brand, fontWeight:500 },
  propName:    { color:T.textMuted, fontSize:12 },
  infoStrip:   { background:T.selected, border:`1px solid ${T.selectedB}`, borderRadius:T.r, padding:"8px 12px", fontSize:12, color:T.brand, display:"flex", alignItems:"flex-start", gap:7, lineHeight:"1.5" },

  /* ── Footer ── */
  footer:      { background:T.white, borderTop:`1px solid ${T.border}`, padding:"10px 24px", display:"flex", justifyContent:"flex-end", gap:10, flexShrink:0 },

  /* ── Summary ── */
  sumGrid:     { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginBottom:16 },
  sumField:    { display:"flex", flexDirection:"column", gap:4 },
  sumLabel:    { fontSize:12, color:T.label },
  sumVal:      { fontSize:13, color:T.text, borderBottom:`1px solid ${T.border}`, paddingBottom:6 },
  sumValEmpty: { fontSize:13, color:T.textMuted, fontStyle:"italic", borderBottom:`1px solid ${T.border}`, paddingBottom:6 },
  sumValPct:   { fontSize:13, color:T.success, fontWeight:600, borderBottom:`1px solid ${T.border}`, paddingBottom:6 },

  /* ── Incentive Banner ── */
  incBanner:   { background:"#E0F4EA", border:"1px solid #A8DDB8", borderRadius:T.r, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, marginTop:8 },
};

/* ═══════════════════════════════════════════════════════════════════════════
   4.  BUTTON
═══════════════════════════════════════════════════════════════════════════ */
const VARIANTS = {
  primary:   { bg:T.brand,   color:"#fff", bc:T.brand,   hov:T.brandDark },
  secondary: { bg:T.white,   color:T.brand, bc:T.brand,  hov:T.selected  },
  success:   { bg:T.success, color:"#fff", bc:T.success, hov:T.successDk },
  warning:   { bg:T.warning, color:"#fff", bc:T.warning, hov:T.warningDk },
  danger:    { bg:T.error,   color:"#fff", bc:T.error,   hov:"#9a0000"   },
  ghost:     { bg:T.white,   color:T.textMuted, bc:T.border, hov:T.sectionBg },
};
function Btn({ v="primary", children, onClick, style={} }) {
  const [hov, setHov] = useState(false);
  const vt = VARIANTS[v];
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"inline-flex", alignItems:"center", gap:5, height:32, padding:"0 16px",
        borderRadius:T.r, fontSize:13, cursor:"pointer", border:`1px solid ${vt.bc}`,
        background:hov?vt.hov:vt.bg, color:vt.color, fontFamily:"inherit", whiteSpace:"nowrap",
        transition:"all .15s", ...style }}
    >{children}</button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5.  FOCUSED INPUTS
═══════════════════════════════════════════════════════════════════════════ */
const disabledStyle = { background: '#F0F0F0', color: '#6A6D70', cursor: 'not-allowed', opacity: 0.7 };
function FInput({ value, onChange, placeholder, type="text", style={}, disabled=false }) {
  const [f, setF] = useState(false);
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
    style={{ ...S.input, ...(f&&!disabled?S.inputF:{}), ...(disabled?disabledStyle:{}), ...style }}
    onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>;
}
function FSelect({ value, onChange, children, style={}, disabled=false }) {
  const [f, setF] = useState(false);
  return <select value={value} onChange={onChange} disabled={disabled}
    style={{ ...S.sel, ...(f&&!disabled?S.inputF:{}), ...(disabled?disabledStyle:{}), ...style }}
    onFocus={()=>setF(true)} onBlur={()=>setF(false)}
  >{children}</select>;
}
function FMrp({ value, onChange, disabled=false }) {
  const [f, setF] = useState(false);
  return <input type="number" value={value} onChange={onChange} step="0.01" min="0" disabled={disabled}
    style={{ ...S.mrpIn, ...(f&&!disabled?S.inputF:{}), ...(disabled?disabledStyle:{}) }}
    onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>;
}
/** Incentive % input — suffix "%" rendered inside wrapper */
function FIncentive({ value, onChange, disabled=false }) {
  const [f, setF] = useState(false);
  return (
    <div style={S.incentiveWrap}>
      <input type="number" value={value} onChange={onChange} disabled={disabled}
        step="0.01" min="0" max="100" placeholder="0.00"
        style={{ ...S.incentiveIn, ...(f&&!disabled?S.inputF:{}), ...(disabled?disabledStyle:{}) }}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
      />
      <span style={S.incentiveSuffix}>%</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6.  ICONS
═══════════════════════════════════════════════════════════════════════════ */
const ITag   = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="16" rx="3" fill="#E8F2FB" stroke="#0A6ED1" strokeWidth="1.5"/><path d="M3 3h7l5 5-5 5H3V3z" stroke="#0A6ED1" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="6.5" cy="9" r="1.2" fill="#0A6ED1"/></svg>;
const IProps = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="16" rx="3" fill="#E8F2FB" stroke="#0A6ED1" strokeWidth="1.5"/><path d="M4 5h10M4 9h8M4 13h5" stroke="#0A6ED1" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IEye   = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="16" rx="3" fill="#E8F2FB" stroke="#0A6ED1" strokeWidth="1.5"/><path d="M9 5C5.5 5 3 9 3 9s2.5 4 6 4 6-4 6-4-2.5-4-6-4z" stroke="#0A6ED1" strokeWidth="1.5"/><circle cx="9" cy="9" r="1.6" fill="#0A6ED1"/></svg>;
const IPct   = () => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="1" y="1" width="20" height="20" rx="4" fill="#E0F4EA" stroke="#107E3E" strokeWidth="1.5"/><circle cx="7" cy="7" r="2" fill="#107E3E"/><circle cx="15" cy="15" r="2" fill="#107E3E"/><path d="M16 6L6 16" stroke="#107E3E" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IDown  = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M5 8l3 3 3-3M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IUp    = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 11V2M5 5l3-3 3 3M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IGen   = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13 8A5 5 0 1 1 3 8a5 5 0 0 1 10 0z" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5.5V8l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IClear = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const ISearch= () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="#89919A" strokeWidth="1.4"/><path d="M11 11l3 3" stroke="#89919A" strokeWidth="1.4" strokeLinecap="round"/></svg>;
const IInfo  = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,marginTop:1}}><circle cx="8" cy="8" r="6.5" stroke="#0A6ED1" strokeWidth="1.4"/><path d="M8 7v4M8 5v.6" stroke="#0A6ED1" strokeWidth="1.4" strokeLinecap="round"/></svg>;
const IEmpty = () => <svg width="36" height="36" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="5" fill="#E8F2FB" stroke="#D9D9D9" strokeWidth="1.5"/><path d="M12 20h16M12 14h10M12 26h8" stroke="#D9D9D9" strokeWidth="2" strokeLinecap="round"/></svg>;

/* ═══════════════════════════════════════════════════════════════════════════
   7.  SMALL REUSABLE COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

/** Field label with optional asterisk */
function FLabel({ children, required }) {
  return <label style={S.fLabel}>{children}{required&&<span style={S.req}> *</span>}</label>;
}

/** Colour badge */
function Badge({ variant="blue", children }) {
  const map = { blue:S.badgeBlue, green:S.badgeGreen, red:S.badgeRed };
  return <span style={{ ...S.badgeBase, ...(map[variant]||map.blue) }}>{children}</span>;
}

/** Blue section title bar */
function SecBar({ title, sub }) {
  return (
    <div style={S.secBar}>
      <div style={S.dot}/>
      <div>
        <div style={S.secBarH}>{title}</div>
        {sub && <div style={S.secBarP}>{sub}</div>}
      </div>
    </div>
  );
}

/** White card with grey header */
function Card({ icon, title, sub, badge, children }) {
  return (
    <div style={S.card}>
      <div style={S.cardHead}>
        {icon}
        <div><div style={S.cardTitle}>{title}</div>{sub&&<div style={S.cardSub}>{sub}</div>}</div>
        {badge&&<div style={{marginLeft:"auto"}}>{badge}</div>}
      </div>
      <div style={S.cardBody}>{children}</div>
    </div>
  );
}

/** Table row with hover highlight */
function TRow({ item, idx }) {
  const [h, setH] = useState(false);
  return (
    <tr style={{ background:h?T.selected:idx%2===0?T.white:T.bg }}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
      <td style={{ ...S.td, color:T.textMuted }}>{idx+1}</td>
      <td style={S.td}><span style={{color:T.brand,fontWeight:500}}>{item.code}</span></td>
      <td style={S.td}>{item.name}</td>
      <td style={{ ...S.td, textAlign:"center" }}>
        <Badge variant={item.type==="Include"?"green":"red"}>{item.type}</Badge>
      </td>
    </tr>
  );
}

/** Property list row */
function PropRow({ code, name, checked, onToggle }) {
  const [h, setH] = useState(false);
  return (
    <div style={{ ...S.propItem, background:h?T.selected:T.white }}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onToggle}>
      <input type="checkbox" checked={checked} onChange={onToggle}
        onClick={e=>e.stopPropagation()}
        style={{accentColor:T.brand,width:13,height:13,cursor:"pointer",flexShrink:0}}
      />
      <span style={S.propCode}>{code}</span>
      <span style={S.propName}>— {name}</span>
    </div>
  );
}

/** Sidebar navigation item */
function SbItem({ label, active, depth=0 }) {
  const [h, setH] = useState(false);
  const pads = ["7px 16px 7px 24px","5px 16px 5px 36px","5px 16px 5px 48px"];
  const sizes = [13,12,12];
  if (active) return (
    <div style={{ fontSize:sizes[depth], color:T.brand, padding:pads[depth],
      paddingLeft:depth===0?21:depth===1?33:45,
      background:T.selected, borderLeft:`3px solid ${T.brand}`, fontWeight:600 }}>
      {label}
    </div>
  );
  return (
    <div style={{ fontSize:sizes[depth], color:h?T.brand:T.textMuted,
      background:h?T.selected:"transparent", padding:pads[depth], cursor:"pointer" }}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>{label}</div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   8.  MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
function SalesPersonIncentiveForm({ onClose, onSave, mode = 'create', initialData = null }) {
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
  const [saving, setSaving] = useState(false);

  /* ── form state ── */
  const [model,        setModel]        = useState("regular");
  const [assortType,   setAssortType]   = useState("");
  const [assortCode,   setAssortCode]   = useState("");
  const [assortName,   setAssortName]   = useState("");
  const [brand,        setBrand]        = useState(null);
  const [brandsList,   setBrandsList]   = useState([]);
  const [incentivePct,      setIncentivePct]      = useState("");
  const [inactive,     setInactive]     = useState(false);
  const [mrpFrom,      setMrpFrom]      = useState("");
  const [mrpTo,        setMrpTo]        = useState("");

  /* ── Fetch brands from API ── */
  useEffect(() => {
    GetAPI('/api/Brand/GetAllBrand', '', '', '')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setBrandsList(res.data.map(b => ({ value: b.brandID ?? b.brandId ?? b.id, label: b.brandName ?? b.name ?? '', brandCode: b.brandCode ?? '' })));
        }
      })
      .catch(err => console.error('Failed to fetch brands:', err));
  }, []);

  /* ── items ── */
  const [allItems,    setAllItems]    = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  /* ── properties ── */
  const [groupList,      setGroupList]      = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [checkedProps,   setCheckedProps]   = useState({});

  /* ── Fetch item groups from API ── */
  useEffect(() => {
    GetAPI('/api/ItemGroup/GetAllItemGroup?ItemGrpID=0', '', {}, cookies)
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setGroupList(res.data.map(g => ({ value: g.itemGrpID ?? g.itemGroupID ?? g.id, label: g.itemGrpName ?? g.itemGroupName ?? g.name ?? '' })));
        }
      })
      .catch(err => console.error('Failed to fetch groups:', err));
  }, []);

  /* ── Fetch properties when groups change ── */
  useEffect(() => {
    if (selectedGroups.length === 0) { setPropertiesData([]); setCheckedProps({}); return; }
    const fetchProps = async () => {
      try {
        const requestBody = selectedGroups.map(g => ({ column1: String(g.value) }));
        const response = await PostAPI('/api/ItemGroup/GetMultiItemGroupWiseProperty', '', requestBody, cookies);
        setPropertiesData(response.data || []);
      } catch (error) {
        console.error('Error fetching group wise properties:', error);
        setPropertiesData([]);
      }
    };
    fetchProps();
  }, [selectedGroups]);

  /* ── Prefill form when editing or viewing ── */
  useEffect(() => {
    if (!initialData) return;
    const d = Array.isArray(initialData) ? initialData[0] : initialData;
    if (!d) return;
    setModel(d.assortmentModel === 'E' ? 'exclusive' : 'regular');
    setAssortType(d.assortmentType || '');
    setAssortCode(String(d.assortmentID||''));
    setAssortName(d.assortmentName || '');
    setIncentivePct('');
    setInactive(d.isActive === 'N');
    setMrpFrom(d.fromMRP ? String(d.fromMRP) : '');
    setMrpTo(d.toMRP ? String(d.toMRP) : '');

    // Prefill brand
    if (d.brandCode || d.brandName) {
      setBrand({ value: d.brandCode, label: d.brandName || d.brandCode, brandCode: d.brandCode || '' });
    }

    // Prefill items from assortmentDetail
    if (d.assortmentDetail && Array.isArray(d.assortmentDetail)) {
      setAllItems(d.assortmentDetail.map((item, idx) => ({
        id: item.tableID || idx + 1,
        code: item.itemCode || '',
        name: item.itemName || '',
        type: 'Include',
        barCode: item.barcode || '',
        itemGroup: item.group || '',
      })));
    }

    // Prefill selected groups from itemGroup (resolve labels after groupList loads)
    if (d.itemGroup) {
      const groupIds = String(d.itemGroup).split(',').map(g => g.trim()).filter(Boolean);
      setSelectedGroups(prev => {
        return groupIds.map(gId => {
          const numId = Number(gId) || gId;
          const found = groupList.find(gl => gl.value === numId || String(gl.value) === gId);
          return found || { value: numId, label: gId };
        });
      });
    }

    // Prefill checked properties from assortmentProperty
    if (d.assortmentProperty && Array.isArray(d.assortmentProperty)) {
      const checked = {};
      d.assortmentProperty.forEach(p => {
        checked[`${p.propertyID}-${p.value}`] = true;
      });
      setCheckedProps(checked);
    }
  }, [initialData, groupList]);

  /* ── tabs ── */
  const [activeTab, setActiveTab] = useState("creation");

  /* ── derived ── */
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return q ? allItems.filter(i =>
      i.code.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)
    ) : allItems;
  }, [allItems, searchQuery]);

  /* propertiesData is already grouped: [{propertyID, propertyName, propertyValues: [{value}]}] */

  /* valid incentive % (0-100) — applies to the FIncentive field */
  const pctNum = parseFloat(incentivePct);
  const pctValid = incentivePct !== "" && !isNaN(pctNum) && pctNum >= 0 && pctNum <= 100;

  /* ── handlers ── */
  const handleGenerate = useCallback(async () => {
    if (!brand) { toast.error("Please select a brand before generating items."); return; }
    try {
      const brandCodeString = brand.brandCode || '';

      // Build itemProperty from checkedProps + propertiesData
      // checkedProps keys are "propertyID-value", propertiesData is [{propertyID, propertyName, propertyValues:[{value}]}]
      const propertyMap = {};
      Object.entries(checkedProps).forEach(([key, isChecked]) => {
        if (!isChecked) return;
        // key format: "propertyID-valueString"
        const sepIdx = key.indexOf('-');
        if (sepIdx === -1) return;
        const pID = key.substring(0, sepIdx);
        const val = key.substring(sepIdx + 1);
        const prop = propertiesData.find(p => String(p.propertyID) === pID);
        if (!prop) return;
        const pName = prop.propertyName || '';
        const mapKey = `${pID}-${pName}`;
        if (!propertyMap[mapKey]) {
          propertyMap[mapKey] = { propertyID: prop.propertyID, propertyName: pName, propertyValues: [] };
        }
        if (!propertyMap[mapKey].propertyValues.some(v => v.value === val)) {
          propertyMap[mapKey].propertyValues.push({ value: val });
        }
      });
      const itemProperty = Object.values(propertyMap);

      const itemGroupString = selectedGroups.map(g => g.value).join(',');

      const requestBody = {
        itemGrp: itemGroupString,
        brandCode: brandCodeString,
        promotion: "",
        fromMRP: parseFloat(mrpFrom) || 0,
        toMRP: parseFloat(mrpTo) || 0,
        itemProperty: itemProperty,
      };

      const response = await PostAPI('/api/Item/GetItemFilterWise', '', requestBody, cookies);

      if (response && response.data && Array.isArray(response.data)) {
        setAllItems(response.data.map((item, idx) => ({
          id: item.itemID ?? item.itemId ?? idx + 1,
          code: item.itemCode || item.ItemCode || '',
          name: item.itemName || item.ItemName || '',
          type: 'Include',
          barCode: item.barCode || item.barcode || '',
          itemGroup: item.itemGroup || item.group || '',
        })));
      } else {
        setAllItems([]);
        toast.info('No items found for the selected brand.');
      }
      setSearchQuery("");
    } catch (err) {
      console.error('Failed to generate items:', err);
      toast.error(err?.message || 'Failed to generate items. Please try again.');
    }
  }, [brand, checkedProps, propertiesData, selectedGroups, mrpFrom, mrpTo, cookies]);
  const handleClear        = useCallback(() => { setAllItems([]); setSearchQuery(""); }, []);
  const toggleProp         = useCallback(k  => setCheckedProps(p => ({ ...p, [k]:!p[k] })), []);

  const handleCancelProps = () => { setSelectedGroups([]); setCheckedProps({}); setPropertiesData([]); };
  const handleSelectProps = () => {
    const n = Object.values(checkedProps).filter(Boolean).length;
    if (!n) { toast.error("Please select at least one property first."); return; }
    toast.success(`${n} propert${n>1?"ies":"y"} selected and applied.`);
  };

  const handleSave = async () => {
    if (!assortCode.trim() || !assortName.trim()) {
      toast.error("Please fill Assortment Code and Name before saving."); return;
    }
    if (incentivePct !== "" && !pctValid) {
      toast.error("Incentive Percentage must be between 0 and 100."); return;
    }
    try {
      setSaving(true);
      const itemGroupString = selectedGroups.map(g => g.value).join(',');
      const brandCodeString = brand?.brandCode || '';
      const brandNameString = brand?.label || '';

      // Build assortmentProperty from checkedProps + propertiesData
      const assortmentProperty = [];
      Object.entries(checkedProps).forEach(([key, isChecked]) => {
        if (!isChecked) return;
        const sepIdx = key.indexOf('-');
        if (sepIdx === -1) return;
        const pID = key.substring(0, sepIdx);
        const val = key.substring(sepIdx + 1);
        const prop = propertiesData.find(p => String(p.propertyID) === pID);
        if (!prop) return;
        assortmentProperty.push({
          itemGroup: 0,
          propertyID: String(prop.propertyID),
          propertyName: prop.propertyName || '',
          value: val,
        });
      });

      const existingId = initialData ? (Array.isArray(initialData) ? initialData[0]?.assortmentID : initialData.assortmentID) : 0;

      const payload = {
        assortmentID: isEditMode ? (existingId || 0) : 0,
        assortmentName: assortName,
        description: "",
        typeOfAssortment: model === "exclusive" ? "E" : "R",
        assortmentType: assortType || "S",
        enteredBy: String(cookies.UserId || 0),
        usedFor: isEditMode ? "U" : "I",
        store: String(cookies.DefaultStoreId || 0),
        isActive: inactive ? "N" : "Y",
        assortmentModel: model === "exclusive" ? "E" : "R",
        itemGroup: itemGroupString,
        brandCode: brandCodeString,
        brandName: brandNameString,
        promotion: "",
        fromMRP: parseFloat(mrpFrom) || 0,
        toMRP: parseFloat(mrpTo) || 0,
        assortmentDetail: allItems.map((item, idx) => ({
          assortmentID: isEditMode ? (existingId || 0) : 0,
          itemCode: item.code || '',
          itemName: item.name || '',
          tableID: 0,
          lineNum: idx + 1,
          barcode: item.barCode || '',
          group: String(item.itemGroup ?? ''),
        })),
        assortmentProperty: assortmentProperty,
      };
      const response = await PostAPI('/api/AssortmentRep/PostAssortment', '', payload, '');
      setSaving(false);
      if (response.data && response.data[0] && response.data[0].returnCode === 'Y') {
        toast.success(response.data[0].returnMsg || 'Sales Person Incentive saved successfully.');
        if (onSave) onSave();
        if (onClose) onClose();
      } else {
        const msg = (response.data && response.data[0] && response.data[0].returnMsg) || 'Something went wrong.';
        toast.error(msg);
      }
    } catch (error) {
      setSaving(false);
      console.error('Error saving incentive:', error);
      toast.error(error?.message || 'Failed to save Sales Person Incentive.');
    }
  };

  const handleCancel = () => {
    if (onClose) { onClose(); return; }
    if (!window.confirm("Discard all changes?")) return;
    setModel("regular"); setAssortType(""); setAssortCode(""); setAssortName("");
    setBrand(null); setIncentivePct(""); setInactive(false);
    setMrpFrom(""); setMrpTo("");
    setAllItems([]); setSearchQuery(""); setSelectedGroups([]); setCheckedProps({}); setPropertiesData([]);
    setActiveTab("creation");
  };

  /* ─────────────────────────────────────────── RENDER ── */
  return (
    <div style={{ fontFamily:"Arial,sans-serif", fontSize:13, color:T.text, background:T.bg, height:"100%", display:"flex", flexDirection:"column", overflow:"hidden" }}>

      {/* ═══ SHELL BAR ═══ */}
      {/* <div style={S.shellBar}>
        <div style={S.shellLogo}>POS</div>
        <div style={S.shellSep}/>
        <span style={S.shellTitle}>Point of Sale</span>
        <div style={S.shellRight}>
          <span style={S.shellDb}>DB-KATIHAR</span>
          <div style={S.shellUser}>
            <div style={S.avatar}>SP</div>
            Sales Admin
          </div>
        </div>
      </div> */}

      {/* ═══ BODY LAYOUT ═══ */}
      <div style={{ ...S.layout, height: '100%' }}>

        {/* ── SIDEBAR ── */}
        {/* <div style={S.sidebar}>
          <div style={S.sbGroup}>
            <div style={S.sbGroupTitle}>Administration</div>
            <SbItem label="Security"               depth={0}/>
            <SbItem label="Setup"                  depth={0} active/>
            <SbItem label="Policy"                 depth={1} active/>
            <SbItem label="Organization Policy"    depth={2}/>
            <SbItem label="Assortment For Promotion" depth={2}/>
            <SbItem label="Store Wise Policy"      depth={2}/>
            <SbItem label="Discount"               depth={1}/>
            <SbItem label="Promotion"              depth={1}/>
            <SbItem label="Sales Person Incentive" depth={1} active/>
            <SbItem label="Assortment Management"  depth={2} active/>
            <SbItem label="Master"                 depth={0}/>
          </div>
          {["Transaction","Reports","Utilities","Help"].map(g=>(
            <div key={g} style={S.sbGroup}><SbItem label={g} depth={0}/></div>
          ))}
        </div> */}

        {/* ── MAIN ── */}
        <div style={S.main}>

          {/* PAGE HEADER */}
          <div style={S.pageHeader}>
            {/* <div style={S.breadcrumb}>
              {["Home","Administration","Setup","Policy","Sales Person Incentive"].map((b,i)=>(
                <span key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={S.bcLink}>{b}</span>
                  <span style={S.bcSep}>›</span>
                </span>
              ))}
              <strong style={{color:T.brand}}>Assortment Management</strong>
            </div> */}
            <div style={S.pageTitle}>Sales Person Incentive — Assortment Creation &amp; Management</div>
            <div style={S.tabs}>
              {[["creation","Assortment Creation"],["preview","Preview & Summary"]].map(([id,lbl])=>(
                <div key={id} style={activeTab===id?S.tabActive:S.tab} onClick={()=>setActiveTab(id)}>{lbl}</div>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div style={S.content}>

            {/* ══════ TAB: CREATION ══════ */}
            {activeTab==="creation" && (
              <div style={S.splitLayout}>

                {/* LEFT */}
                <div style={S.splitLeft}>
                  <Card icon={<ITag/>} title="Assortment Creation"
                    sub="Define the assortment model, type and identifiers"
                    badge={<Badge variant={isViewMode ? 'green' : isEditMode ? 'blue' : 'blue'}>{isViewMode ? 'View Mode' : isEditMode ? 'Edit Record' : 'New Record'}</Badge>}>

                    {/* ── Basic Configuration ── */}
                    <SecBar title="Basic Configuration" sub="Set model type and core identifiers"/>

                    {/* Model: Regular / Exclusive */}
                    <div style={S.fRow}>
                      <div style={S.fGroupFull}>
                        <FLabel>Assortment Model</FLabel>
                        <div style={S.radioGroup}>
                          {[["regular","Regular"],["exclusive","Exclusive"]].map(([v,l])=>(
                            <label key={v} style={S.radioLabel}>
                              <input type="radio" name="model" value={v} checked={model===v}
                                onChange={()=>setModel(v)} disabled={isViewMode}
                                style={{accentColor:T.brand,width:14,height:14,cursor:isViewMode?"not-allowed":"pointer"}}
                              />{l}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Type + Code */}
                    <div style={S.fRow}>
                      {/* <div style={S.fGroupHalf}>
                        <FLabel required>Assortment Type</FLabel>
                        <FSelect value={assortType} onChange={e=>setAssortType(e.target.value)}>
                          <option value="">Select type</option>
                          <option>Standard</option><option>Exclusive</option>
                          <option>Regional</option><option>Seasonal</option>
                        </FSelect>
                      </div> */}
                      <div style={S.fGroupHalf}>
                        <FLabel required>Assortment Code</FLabel>
                        <FInput value={assortCode} onChange={e=>setAssortCode(e.target.value)} placeholder="Enter assortment code" disabled={isViewMode || isEditMode}/>
                      </div>
                    </div>

                    {/* Name */}
                    <div style={S.fRow}>
                      <div style={S.fGroupFull}>
                        <FLabel required>Assortment Name</FLabel>
                        <FInput value={assortName} onChange={e=>setAssortName(e.target.value)} placeholder="Enter assortment name" disabled={isViewMode}/>
                      </div>
                    </div>

                    <hr style={S.divider}/>

                    {/* ── Incentive & Variant Settings ── */}
                    <SecBar title="Incentive & Variant Settings" sub="Configure brand filters and sales incentive percentage"/>

                    {/* Brand + Inactive */}
                    <div style={S.fRow}>
                      <div style={S.fGroupHalf}>
                        <FLabel>Select Brand</FLabel>
                        <Select
                          options={brandsList}
                          value={brand}
                          onChange={setBrand}
                          isClearable
                          isSearchable
                          isDisabled={isViewMode}
                          className="back-white"
                          placeholder="Search & select brand..."
                          styles={{
                            control: (base, state) => ({
                              ...base, minHeight:32, height:32, fontSize:13, borderColor: state.isFocused ? T.brand : T.inputBorder,
                              boxShadow: state.isFocused ? '0 0 0 2px rgba(10,110,209,.15)' : 'none', borderRadius: T.r, '&:hover': { borderColor: T.brand },
                            }),
                            valueContainer: base => ({ ...base, padding: '0 8px' }),
                            input: base => ({ ...base, margin: 0, padding: 0 }),
                            indicatorSeparator: () => ({ display: 'none' }),
                            dropdownIndicator: base => ({ ...base, padding: '4px 6px' }),
                            option: (base, state) => ({
                              ...base, fontSize: 13, padding: '6px 12px',
                              backgroundColor: state.isSelected ? T.brand : state.isFocused ? T.selected : T.white,
                              color: state.isSelected ? '#fff' : T.text,
                            }),
                            menu: base => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      </div>
                      <div style={S.fGroupHalf}>
                        <FLabel>&nbsp;</FLabel>
                        <label style={{ ...S.inactiveWrap }}>
                          <input type="checkbox" checked={inactive} onChange={e=>setInactive(e.target.checked)} disabled={isViewMode}
                            style={{accentColor:T.brand,width:13,height:13,cursor:isViewMode?"not-allowed":"pointer"}}
                          />Mark as Inactive
                        </label>
                      </div>
                    </div>

                    {/* ── INCENTIVE PERCENTAGE (NEW) ── */}
                    <div style={S.fRow}>
                      <div style={S.fGroupHalf}>
                        <FLabel required>Incentive Percentage</FLabel>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <FIncentive value={incentivePct} onChange={e=>setIncentivePct(e.target.value)} disabled={isViewMode}/>
                          {pctValid && (
                            <Badge variant="green">{pctNum.toFixed(2)}% Incentive</Badge>
                          )}
                        </div>
                        <span style={S.incentiveHint}>Enter percentage between 0.00 – 100.00</span>
                      </div>
                      <div style={S.fGroupHalf}/>
                    </div>

                    {/* MRP Range */}
                    <div style={S.fRow}>
                      <div style={S.fGroupFull}>
                        <FLabel>MRP Range</FLabel>
                        <div style={S.mrpRow}>
                          <span style={S.mrpLbl}>From :</span>
                          <FMrp value={mrpFrom} onChange={e=>setMrpFrom(e.target.value)} disabled={isViewMode}/>
                          <span style={S.mrpLbl}>To :</span>
                          <FMrp value={mrpTo}   onChange={e=>setMrpTo(e.target.value)} disabled={isViewMode}/>
                        </div>
                      </div>
                    </div>

                    {/* Toolbar */}
                    <div style={S.toolbar}>
                      {!isViewMode && <Btn v="success" onClick={()=>alert("Download Template: triggers .xlsx download.")}><IDown/> Download Template</Btn>}
                      {!isViewMode && <Btn v="ghost"   onClick={()=>alert("Upload Excel: opens file picker.")}><IUp/> Upload Excel</Btn>}
                      {!isViewMode && <Btn v="warning" onClick={handleGenerate}><IGen/> Generate</Btn>}
                      {!isViewMode && <Btn v="danger"  onClick={handleClear}><IClear/> Clear</Btn>}
                      <div style={S.searchWrap}>
                        <span style={S.searchIcon}><ISearch/></span>
                        <input type="search" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                          placeholder="Search items…" style={S.searchIn}/>
                      </div>
                    </div>

                    {/* Table */}
                    <div style={S.tableWrap}>
                      <table style={S.table}>
                        <thead>
                          <tr>
                            <th style={{...S.th,width:52}}>Sl No</th>
                            <th style={S.th}>Item Code</th>
                            <th style={S.th}>Item Name</th>
                            <th style={{...S.thC,width:130}}>Exclude / Include</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.length===0 ? (
                            <tr><td colSpan={4}>
                              <div style={S.emptyState}>
                                <IEmpty/>
                                <p>No Rows To Show</p>
                                <span style={{fontSize:12,color:T.inputBorder,textAlign:"center"}}>
                                  Use Generate or Upload Excel to populate items
                                </span>
                              </div>
                            </td></tr>
                          ) : filteredItems.map((item,idx)=>(
                            <TRow key={item.id} item={item} idx={idx}/>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div style={S.pg}>
                      <span>{filteredItems.length>0?`1 to ${filteredItems.length} of ${filteredItems.length}`:"0 to 0 of 0"}</span>
                      <div style={S.pgCtrl}>
                        <div style={S.pgSz}>
                          <span>Page Size:</span>
                          <FSelect style={{width:56,height:26,fontSize:11,padding:"0 18px 0 6px"}}>
                            <option>10</option><option>20</option><option>50</option>
                          </FSelect>
                        </div>
                        <span style={{margin:"0 8px"}}>{filteredItems.length>0?"Page 1 of 1":"Page 0 of 0"}</span>
                        {["⟨⟨","⟨","⟩","⟩⟩"].map((a,i)=>(
                          <button key={i} disabled style={S.pgNav}>{a}</button>
                        ))}
                      </div>
                    </div>

                  </Card>
                </div>{/* /split-left */}

                {/* RIGHT — Select Properties */}
                <div style={S.splitRight}>
                  <div style={S.rpHead}>
                    <IProps/>
                    <div>
                      <div style={S.rpTitle}>Select Properties</div>
                      <div style={S.rpSub}>Filter assortment by group properties</div>
                    </div>
                  </div>
                  <div style={S.rpBody}>

                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      <FLabel required>Select Group</FLabel>
                      <Select
                        options={groupList}
                        value={selectedGroups}
                        onChange={val => { setSelectedGroups(val || []); setCheckedProps({}); }}
                        isMulti
                        isClearable
                        isSearchable
                        isDisabled={isViewMode}
                        placeholder="Search & select groups..."
                        styles={{
                          control: (base, state) => ({
                            ...base, minHeight:32, fontSize:13, borderColor: state.isFocused ? T.brand : T.inputBorder,
                            boxShadow: state.isFocused ? '0 0 0 2px rgba(10,110,209,.15)' : 'none', borderRadius: T.r, '&:hover': { borderColor: T.brand },
                          }),
                          valueContainer: base => ({ ...base, padding: '0 8px' }),
                          input: base => ({ ...base, margin: 0, padding: 0 }),
                          indicatorSeparator: () => ({ display: 'none' }),
                          dropdownIndicator: base => ({ ...base, padding: '4px 6px' }),
                          option: (base, state) => ({
                            ...base, fontSize: 13, padding: '6px 12px',
                            backgroundColor: state.isSelected ? T.brand : state.isFocused ? T.selected : T.white,
                            color: state.isSelected ? '#fff' : T.text,
                          }),
                          multiValue: base => ({ ...base, backgroundColor: T.selected, borderRadius: 3 }),
                          multiValueLabel: base => ({ ...base, color: T.brand, fontSize: 12 }),
                          multiValueRemove: base => ({ ...base, color: T.brand, ':hover': { backgroundColor: T.brand, color: '#fff' } }),
                          menu: base => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    </div>

                    {selectedGroups.length === 0 && (
                      <div style={S.propsHolder}>
                        <svg width="38" height="38" viewBox="0 0 44 44" fill="none">
                          <rect x="4" y="4" width="36" height="36" rx="6" fill="#E8F2FB" stroke="#D9D9D9" strokeWidth="1.5"/>
                          <path d="M14 22h16M14 15h10M14 29h8" stroke="#D9D9D9" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <p style={{fontSize:12}}>Select a group to view properties</p>
                        <span style={{fontSize:11,color:T.inputBorder}}>Properties appear here after a group is chosen</span>
                      </div>
                    )}

                    {selectedGroups.length > 0 && propertiesData.map(property => (
                      <div key={property.propertyID} style={{border:`1px solid ${T.border}`,borderRadius:T.r,overflow:"hidden",marginBottom:8}}>
                        <div style={S.propSecBar}>
                          <div style={S.dot}/>
                          <span style={S.propSecTtl}>{property.propertyName}</span>
                        </div>
                        <div style={S.propsInner}>
                          {(property.propertyValues || []).map((pv, idx) => {
                            const pKey = `${property.propertyID}-${pv.value}`;
                            return (
                              <PropRow key={pKey} code={pv.value} name={pv.value}
                                checked={!!checkedProps[pKey]} onToggle={()=>toggleProp(pKey)}/>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div style={S.infoStrip}>
                      <IInfo/>
                      Selected properties will be applied as variant filters to the assortment items.
                    </div>

                  </div>
                  {!isViewMode && <div style={S.rpFoot}>
                    <Btn v="secondary" onClick={handleCancelProps}>Cancel</Btn>
                    <Btn v="primary"   onClick={handleSelectProps}>Select</Btn>
                  </div>}
                </div>

              </div>
            )}

            {/* ══════ TAB: PREVIEW & SUMMARY ══════ */}
            {activeTab==="preview" && (
              <Card icon={<IEye/>} title="Assortment Summary" sub="Review all settings before saving">

                <SecBar title="Configuration Summary" sub="All configured values for this incentive assortment record"/>

                <div style={S.sumGrid}>
                  {[
                    ["Assortment Model",    model.charAt(0).toUpperCase()+model.slice(1), "normal"],
                    ["Assortment Type",     assortType,   "optional"],
                    ["Assortment Code",     assortCode,   "optional"],
                    ["Assortment Name",     assortName,   "optional"],
                    ["Brand",              brand ? brand.label : "",  "optional"],
                    ["Incentive Percentage", pctValid ? pctNum.toFixed(2)+" %" : "", "incentive"],
                    ["MRP From",           mrpFrom||"0.00", "normal"],
                    ["MRP To",             mrpTo||"0.00",   "normal"],
                    ["Items Loaded",       String(allItems.length), "normal"],
                    ["Status",             inactive?"Inactive":"Active", "normal"],
                  ].map(([lbl,val,kind])=>(
                    <div key={lbl} style={S.sumField}>
                      <span style={S.sumLabel}>{lbl}</span>
                      <span style={
                        kind==="incentive" && val ? S.sumValPct
                        : val ? S.sumVal : S.sumValEmpty
                      }>{val||"—"}</span>
                    </div>
                  ))}
                </div>

                {/* Incentive callout */}
                {pctValid && pctNum>0 && (
                  <div style={S.incBanner}>
                    <IPct/>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:T.success}}>
                        Incentive Rate Configured: {pctNum.toFixed(2)}%
                      </div>
                      <div style={{fontSize:12,color:T.textMuted,marginTop:2}}>
                        Sales persons will earn {pctNum.toFixed(2)}% incentive on items in this {model} assortment.
                      </div>
                    </div>
                  </div>
                )}

              </Card>
            )}

          </div>{/* /content */}

          {/* FOOTER */}
          <div style={S.footer}>
            <Btn v="secondary" onClick={handleCancel}>{isViewMode ? 'Close' : 'Cancel'}</Btn>
            {!isViewMode && <Btn v="primary" onClick={handleSave} style={saving ? {opacity:0.6,pointerEvents:'none'} : {}}>{saving ? 'Saving...' : isEditMode ? 'Update' : 'Save'}</Btn>}
          </div>

        </div>{/* /main */}
      </div>{/* /layout */}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   9.  MAIN LISTING PAGE (default export)
═══════════════════════════════════════════════════════════════════════════ */
export default function SalesPersonIncentivePage() {
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
  const [incentiveData, setIncentiveData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'view' | 'edit'
  const [editData, setEditData] = useState(null);

  const fetchIncentiveList = async () => {
    try {
      setIsLoading(true);
      const response = await GetAPI('/api/assortment/GetAllAssortment?AssortmentID=0&AssortmentType=S', '', {}, cookies);
      const allData = response.data || [];
      setIncentiveData(allData);
    } catch (err) {
      console.error('Failed to fetch sales person incentives:', err);
      setError(err?.message || 'Failed to fetch incentive data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssortmentById = async (assortmentID, mode) => {
    try {
      const response = await GetAPI(`/api/assortment/Getassortment?AssortmentID=${assortmentID}`, '', {}, cookies);
      if (response.data) {
        setEditData(response.data);
        setModalMode(mode);
        setModalOpen(true);
      } else {
        toast.error('Failed to load assortment details.');
      }
    } catch (err) {
      console.error('Failed to fetch assortment:', err);
      toast.error(err?.message || 'Failed to fetch assortment details.');
    }
  };

  useEffect(() => {
    fetchIncentiveList();
  }, []);

  const columns = useMemo(() => [
    { field: 'assortmentID', header: 'ID', type: 'number', width: '80px' },
    { field: 'assortmentName', header: 'Assortment Name', type: 'link' },
    { field: 'assortmentModelLabel', header: 'Assortment Model' },
    { field: 'brandName', header: 'Brand' },
    {
      field: 'status',
      header: 'Status',
      type: 'badge',
      width: '110px',
      badgeMap: {
        Active: { variant: 'success', label: 'Active', dot: true },
        Inactive: { variant: 'warning', label: 'Inactive', dot: true },
      },
    },
  ], []);

  const rowData = useMemo(() => {
    if (!incentiveData) return [];
    return incentiveData.map(item => ({
      ...item,
      id: item.assortmentID,
      assortmentModelLabel: item.assortmentModel === 'E' ? 'Exclusive' : item.assortmentModel === 'R' ? 'Regular' : (item.assortmentModel || ''),
      brandName: item.brandName || '',
      itemGroup: item.itemGroup || '',
      status: item.isActive === 'Y' ? 'Active' : 'Inactive',
    }));
  }, [incentiveData]);

  const handleAdd = () => { setEditData(null); setModalMode('create'); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setEditData(null); setModalMode('create'); };
  const handleSaveSuccess = () => { fetchIncentiveList(); };

  const handleView = useCallback((row) => {
    fetchAssortmentById(row.assortmentID, 'view');
  }, []);

  const handleEdit = useCallback((row) => {
    fetchAssortmentById(row.assortmentID, 'edit');
  }, []);

  const stats = useMemo(() => [
    { label: 'Total', value: rowData.length, icon: '📋', iconClass: 'blue', filterKey: 'all' },
    { label: 'Active', value: rowData.filter((r) => r.status === 'Active').length, icon: '✅', iconClass: 'green', filterKey: 'active' },
    { label: 'Inactive', value: rowData.filter((r) => r.status === 'Inactive').length, icon: '⏸️', iconClass: 'amber', filterKey: 'inactive' },
  ], [rowData]);

  const filterChips = useMemo(() => [
    { key: 'all', label: 'All Incentives', chipClass: 'lp-chip-blue' },
    { key: 'active', label: 'Active', chipClass: 'lp-chip-green', filterFn: (r) => r.status === 'Active' },
    { key: 'inactive', label: 'Inactive', chipClass: 'lp-chip-amber', filterFn: (r) => r.status === 'Inactive' },
  ], []);

  if (isLoading) return <SkeletonLoaderTable />;
  if (error) return <h3 className="text-center p-6">{error}</h3>;

  return (
    <div className="relative z-40 flex flex-col h-full">
      <ListingPage
        title="Sales Person Incentive"
        subtitle="Manage incentive assortments for sales persons"
        titleIcon="💰"
        rowData={rowData}
        columns={columns}
        rowKey="assortmentID"
        loading={isLoading}
        stats={stats}
        filterChips={filterChips}
        defaultFilter="all"
        searchPlaceholder="Search by assortment name, model, brand…"
        searchFields={['assortmentName', 'assortmentModelLabel', 'brandName']}
        defaultSortCol="assortmentID"
        defaultSortDir="desc"
        pageSize={30}
        onView={handleView}
        onEdit={handleEdit}
        primaryAction={{ label: '+ Add Incentive', onClick: handleAdd }}
      />

      {/* Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="fixed inset-0 bg-white shadow-2xl w-screen h-screen flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200  shrink-0" style={{ backgroundColor: '#38bdf8', color: '#fff' }}>
              <h2 className="text-lg font-semibold ">
                {modalMode === 'view' ? 'View Sales Person Incentive' : modalMode === 'edit' ? 'Edit Sales Person Incentive' : 'Create New Sales Person Incentive'}
              </h2>
              <button onClick={handleCloseModal} className="p-1.5 rounded back-red-800 hover:back-red-700  transition-colors cursor-pointer">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="flex-1 min-h-0">
              <SalesPersonIncentiveForm
                onClose={handleCloseModal}
                onSave={handleSaveSuccess}
                mode={modalMode}
                initialData={editData}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
