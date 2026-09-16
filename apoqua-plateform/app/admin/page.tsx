"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Lang = "fr" | "en"

const T = {
  fr: {
    admin_title: "Administration GFST",
    admin_sub: "Gestion complète des gammes de fixations",
    logout: "Déconnexion",
    badge: "Super Admin",
    total_fiches: "Total fiches",
    approved: "Approuvées",
    applicable: "Applicables",
    in_process: "En cours",
    cancelled: "Annulées",
    search_placeholder: "Rechercher par référence, désignation, zone...",
    all_status: "Tous les statuts",
    dashboard: "Dashboard →",
    validation: "Validation des demandes →",
    total_label: "fiches",
    reference: "Référence",
    designation_fr: "Désignation FR",
    designation_en: "Désignation EN",
    vehicle_area: "Zone véhicule",
    psa_dec: "PSA DEC",
    lot: "Lot",
    status: "Statut",
    modif: "Modif.",
    loading: "⏳ Chargement...",
    no_data: "Aucune fiche trouvée",
    imports_title: "Fichiers importés",
    imports_close: "Fermer",
    imports_name: "Nom",
    imports_comment: "Commentaire",
    imports_size: "Taille",
    imports_by: "Importé par",
    imports_date: "Date",
    imports_download: "Télécharger",
  },
  en: {
    admin_title: "GFST Administration",
    admin_sub: "Complete fastener range management",
    logout: "Logout",
    badge: "Super Admin",
    total_fiches: "Total Files",
    approved: "Approved",
    applicable: "Applicable",
    in_process: "In Process",
    cancelled: "Cancelled",
    search_placeholder: "Search by reference, designation, zone...",
    all_status: "All statuses",
    dashboard: "Dashboard →",
    validation: "Requests validation →",
    total_label: "files",
    reference: "Reference",
    designation_fr: "Designation FR",
    designation_en: "Designation EN",
    vehicle_area: "Vehicle area",
    psa_dec: "PSA DEC",
    lot: "Lot",
    status: "Status",
    modif: "Modification",
    loading: "⏳ Loading...",
    no_data: "No files found",
    imports_title: "Imported Files",
    imports_close: "Close",
    imports_name: "Name",
    imports_comment: "Comment",
    imports_size: "Size",
    imports_by: "Imported by",
    imports_date: "Date",
    imports_download: "Download",
  },
}

export default function AdminPage() {
  const router = useRouter()
  const [isHydrated, setIsHydrated] = useState(false)
  const [lang, setLang] = useState<Lang>("fr")
  const [dark, setDark] = useState(true)
  const [showImports, setShowImports] = useState(false)
  const [imports, setImports] = useState<any[]>([])
  const [loadingImports, setLoadingImports] = useState(false)
  const [translatedComments, setTranslatedComments] = useState<Record<string, string>>({})
  const [translatingIds, setTranslatingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    const stored = localStorage.getItem("gfst-lang")
    if (stored) setLang(stored as Lang)
    const storedTheme = localStorage.getItem("gfst-theme")
    if (storedTheme === "dark" || storedTheme === "light") setDark(storedTheme === "dark")
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) localStorage.setItem("gfst-theme", dark ? "dark" : "light")
  }, [dark, isHydrated])

  useEffect(() => {
    if (isHydrated) localStorage.setItem("gfst-lang", lang)
  }, [lang, isHydrated])

  const [fiches, setFiches] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    Applicable: 0, "In Process": 0, Approved: 0, Cancelled: 0,
  })
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterArea, setFilterArea] = useState("all")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const PAGE_SIZE = 25
  const t = T[lang]

  useEffect(() => {
    const u = localStorage.getItem("gfst_user")
    if (u) setUser(JSON.parse(u))
  }, [])

  useEffect(() => {
    loadFiches()
  }, [search, filterStatus, filterArea, page])

  useEffect(() => {
    loadStatusCounts()
  }, [])

  useEffect(() => {
    imports.forEach((f: any) => {
      if (f.comment) translateComment(f.id, f.comment, lang)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imports, lang])

  async function loadStatusCounts() {
    const token = localStorage.getItem("gfst_token")
    if (!token) return
    const statuses = ["Applicable", "In Process", "Approved", "Cancelled"]
    const results = await Promise.all(statuses.map(async (s) => {
      const query = new URLSearchParams({ status: s, page: "1", limit: "1" })
      const res = await fetch(`http://localhost:8000/api/fiches?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) return [s, 0] as const
      const data = await res.json()
      return [s, data.total || 0] as const
    }))
    setStatusCounts(Object.fromEntries(results))
  }

  async function loadFiches() {
    setLoading(true)
    try {
      const token = localStorage.getItem("gfst_token")
      if (!token) { router.push("/login"); return }

      const query = new URLSearchParams()
      if (search) query.append("search", search)
      if (filterStatus !== "all") query.append("status", filterStatus)
      if (filterArea !== "all") query.append("area", filterArea)
      query.append("page", String(page))
      query.append("limit", String(PAGE_SIZE))

      const res = await fetch(`http://localhost:8000/api/fiches?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.status === 401) { router.push("/login"); return }

      const data = await res.json()
      setFiches(data.data || [])
      setTotal(data.total || 0)
    } finally {
      setLoading(false)
    }
  }

  async function loadImports() {
    try {
      setLoadingImports(true)
      const token = localStorage.getItem("gfst_token")
      const res = await fetch("http://localhost:8000/api/imports", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        alert("Impossible de charger les fichiers importés")
        return
      }
      const data = await res.json()
      setImports(data)
      setShowImports(true)
    } finally {
      setLoadingImports(false)
    }
  }

  async function translateComment(id: number, text: string, targetLang: Lang) {
    const cacheKey = `${id}_${targetLang}`
    if (translatedComments[cacheKey] !== undefined) return

    setTranslatingIds(prev => new Set(prev).add(id))
    try {
      const token = localStorage.getItem("gfst_token")
      const res = await fetch("http://localhost:8000/api/translate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, target_lang: targetLang }),
      })
      const data = res.ok ? await res.json() : { translated_text: text }
      setTranslatedComments(prev => ({ ...prev, [cacheKey]: data.translated_text }))
    } catch {
      setTranslatedComments(prev => ({ ...prev, [cacheKey]: text }))
    } finally {
      setTranslatingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const STATUS_COLORS: Record<string, string> = {
    "Approved": "#00C6A2",
    "Applicable": "#3D8EF5",
    "In Process": "#9B8CFF",
    "Cancelled": "#FF6B6B",
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .dark-theme { --bg:#0D1117;--surface:#161B22;--surface2:#1C2333;--border:rgba(255,255,255,0.08);--text:#E6EDF3;--muted:#7D8590; }
        .light-theme { --bg:#F5F7FA;--surface:#FFFFFF;--surface2:#EEF1F7;--border:rgba(0,0,0,0.08);--text:#1A2030;--muted:#6B7A99; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
        .page { padding: 24px; max-width: 1400px; margin: 0 auto; }
        .topbar { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .logo { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #00C6A2, #3D8EF5); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; font-size: 13px; flex-shrink: 0; }
        .title { font-size: 1.2rem; font-weight: 700; color: var(--text); }
        .subtitle { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
        .badge { padding: 3px 10px; border-radius: 20px; background: rgba(0,198,162,0.12); color: #00C6A2; font-size: 0.7rem; font-weight: 600; }
        .lang-switcher { display: flex; border: 1px solid var(--border); border-radius: 7px; overflow: hidden; }
        .lang-btn { padding: 4px 8px; font-size: 0.66rem; font-weight: 600; cursor: pointer; background: transparent; border: none; color: var(--muted); transition: all 0.15s; font-family: 'Inter', sans-serif; }
        .lang-btn.active-lang { background: #00C6A2; color: #fff; }
        .lang-btn:hover:not(.active-lang) { background: var(--surface2); color: var(--text); }
        .icon-btn { width:30px;height:30px;border-radius:7px;border:1px solid var(--border);background:transparent;color:var(--muted);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s; }
        .icon-btn:hover { color:var(--text);background:var(--surface2); }
        .logout-btn { padding: 7px 16px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 0.75rem; cursor: pointer; }
        .logout-btn:hover { color: #FF6B6B; border-color: rgba(255,107,107,0.3); }
        .stats-row { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .stat-box { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px 20px; flex: 1; min-width: 140px; }
        .stat-val { font-size: 1.6rem; font-weight: 700; color: var(--text); }
        .stat-lbl { font-size: 0.65rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
        .filters { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
        .search-wrap { position: relative; flex: 1; min-width: 220px; }
        .search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--muted); }
        .search-input { width: 100%; padding: 8px 10px 8px 34px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 0.78rem; outline: none; }
        .search-input:focus { border-color: rgba(0,198,162,0.4); }
        .filter-select { padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 0.72rem; cursor: pointer; outline: none; }
        .count { padding: 4px 10px; border-radius: 20px; background: rgba(0,198,162,0.1); color: #00C6A2; font-size: 0.7rem; font-weight: 600; }
        .table-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        thead th { font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border); background: var(--surface2); white-space: nowrap; }
        tbody tr { transition: background 0.1s; }
        tbody tr:hover { background: var(--surface2); }
        tbody td { padding: 10px 14px; font-size: 0.73rem; border-bottom: 1px solid var(--border); }
        tbody tr:last-child td { border-bottom: none; }
        .td-ref { font-family: 'DM Mono', monospace; font-size: 0.68rem; color: var(--muted); white-space: nowrap; }
        .status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 20px; font-size: 0.62rem; font-weight: 600; white-space: nowrap; }
        .status-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }
        .yn-yes { padding: 2px 7px; border-radius: 4px; font-size: 0.62rem; font-weight: 600; background: rgba(0,198,162,0.1); color: #00C6A2; }
        .yn-no { padding: 2px 7px; border-radius: 4px; font-size: 0.62rem; font-weight: 600; background: rgba(125,133,144,0.12); color: var(--muted); }
        .pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 8px; }
        .pg-info { font-size: 0.7rem; color: var(--muted); }
        .pg-btns { display: flex; gap: 4px; }
        .pg-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 0.7rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .pg-btn:hover:not(:disabled) { background: var(--surface2); color: var(--text); }
        .pg-btn.active { background: #00C6A2; color: #fff; border-color: #00C6A2; }
        .pg-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .empty { padding: 48px; text-align: center; color: var(--muted); }
        .loading-row td { text-align: center; padding: 48px; color: var(--muted); }
        .user-info { display: flex; align-items: center; gap: 8px; }
        .avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #3D8EF5, #9B8CFF); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 600; color: #fff; }
      `}</style>

      <div className={`page ${dark ? "dark-theme" : "light-theme"}`}>

        {/* TOPBAR */}
        <div className="topbar">
          <div className="logo">GF</div>
          <div>
            <div className="title">{isHydrated ? t.admin_title : "Administration GFST"}</div>
            <div className="subtitle">{isHydrated ? t.admin_sub : "Gestion complète des gammes de fixations"}</div>
          </div>
          {user && (
            <div className="user-info">
              <div className="avatar">
                {user.prenom?.[0]}{user.nom?.[0]}
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--text)" }}>
                  {user.prenom} {user.nom}
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{user.role}</div>
              </div>
            </div>
          )}
          <span className="badge">{isHydrated ? t.badge : "Super Admin"}</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
            <button className="icon-btn" onClick={() => setDark(!dark)}>
              {dark ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <div className="lang-switcher">
              {(["fr","en"] as Lang[]).map(l =>
                <button key={l} className={`lang-btn${lang===l?" active-lang":""}`} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
              )}
            </div>
            <button className="logout-btn" onClick={() => {
              localStorage.removeItem("gfst_token")
              localStorage.removeItem("gfst_user")
              document.cookie = "gfst_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
              router.push("/login")
            }}>
              {isHydrated ? t.logout : "Déconnexion"}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-val">{total}</div>
            <div className="stat-lbl">{isHydrated ? t.total_fiches : "Total fiches"}</div>
          </div>
          <div className="stat-box">
            <div className="stat-val" style={{ color: "#3D8EF5" }}>
              {statusCounts["Applicable"]}
            </div>
            <div className="stat-lbl">{isHydrated ? t.applicable : "Applicables"}</div>
          </div>
          <div className="stat-box">
            <div className="stat-val" style={{ color: "#9B8CFF" }}>
              {statusCounts["In Process"]}
            </div>
            <div className="stat-lbl">{isHydrated ? t.in_process : "En cours"}</div>
          </div>
          <div className="stat-box">
            <div className="stat-val" style={{ color: "#00C6A2" }}>
              {statusCounts["Approved"]}
            </div>
            <div className="stat-lbl">{isHydrated ? t.approved : "Approuvées"}</div>
          </div>
          <div className="stat-box">
            <div className="stat-val" style={{ color: "#FF6B6B" }}>
              {statusCounts["Cancelled"]}
            </div>
            <div className="stat-lbl">{isHydrated ? t.cancelled : "Annulées"}</div>
          </div>
        </div>

        {/* FILTRES */}
        <div className="filters">
          <div className="search-wrap">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="search-input"
              placeholder={isHydrated ? t.search_placeholder : "Rechercher par référence, désignation, zone..."}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <select className="filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
            <option value="all">{isHydrated ? t.all_status : "Tous les statuts"}</option>
            <option value="Approved">Approved</option>
            <option value="Applicable">Applicable</option>
            <option value="In Process">In Process</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#00C6A2", color: "#fff", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            {isHydrated ? t.dashboard : "Dashboard →"}
          </button>

          {/* Bouton restauré depuis l'ancienne version */}
          <button
            style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#9B8CFF", color: "#fff", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
            onClick={() => router.push("/admin/demandes")}
          >
            {isHydrated ? t.validation : "Validation des demandes →"}
          </button>

          <button
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: "#3D8EF5",
              color: "#fff",
              fontSize: "0.75rem",
              cursor: "pointer",
              fontWeight: 600
            }}
            onClick={loadImports}
          >
            {isHydrated ? t.imports_title : "Fichiers importés"}
          </button>

          <span className="count">{total} {isHydrated ? t.total_label : "fiches"}</span>
        </div>

        {/* TABLEAU */}
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>{isHydrated ? t.reference : "Référence"}</th>
                <th>{isHydrated ? t.designation_fr : "Désignation FR"}</th>
                <th>{isHydrated ? t.designation_en : "Désignation EN"}</th>
                <th>{isHydrated ? t.vehicle_area : "Zone véhicule"}</th>
                <th>{isHydrated ? t.psa_dec : "PSA DEC"}</th>
                <th>{isHydrated ? t.lot : "Lot"}</th>
                <th>{isHydrated ? t.status : "Statut"}</th>
                <th>{isHydrated ? t.modif : "Modif."}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="loading-row">
                  <td colSpan={10}>{isHydrated ? t.loading : "⏳ Chargement..."}</td>
                </tr>
              ) : fiches.length === 0 ? (
                <tr>
                  <td colSpan={10} className="empty">{isHydrated ? t.no_data : "Aucune fiche trouvée"}</td>
                </tr>
              ) : fiches.map((f: any) => {
                const color = STATUS_COLORS[f.status] || "#7D8590"
                return (
                  <tr key={f.reference}>
                    <td className="td-ref">
                      <span
                        style={{ cursor: "pointer", color: "#00C6A2", textDecoration: "underline" }}
                        onClick={() =>
                          window.open(
                            `https://docinfogroupe.stellantis.com/ead/doc/ref.${f.reference}/v.vc/fiche`,
                            "_blank"
                          )
                        }
                      >
                        {f.reference}
                      </span>
                    </td>
                    <td style={{ color: "var(--text)", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {f.designation_fr}
                    </td>
                    <td style={{ color: "var(--muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.68rem" }}>
                      {f.designation_en}
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: "0.68rem" }}>{f.vehicle_area}</td>
                    <td style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "var(--muted)" }}>{f.psa_dec}</td>
                    <td style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "var(--muted)" }}>{f.lot}</td>
                    <td>
                      <span className="status-badge" style={{ background: `${color}18`, color }}>
                        <span className="status-dot" style={{ background: color }} />
                        {f.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{f.last_modification}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination">
              <span className="pg-info">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} / {total}
              </span>
              <div className="pg-btns">
                <button className="pg-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
                <button className="pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let p: number
                  if (totalPages <= 7) p = i + 1
                  else if (page <= 4) p = i + 1
                  else if (page >= totalPages - 3) p = totalPages - 6 + i
                  else p = page - 3 + i
                  return (
                    <button key={p} className={`pg-btn${page === p ? " active" : ""}`} onClick={() => setPage(p)}>
                      {p}
                    </button>
                  )
                })}
                <button className="pg-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                <button className="pg-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
              </div>
            </div>
          )}
        </div>

        {showImports && (
          <div
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.5)", display: "flex",
              justifyContent: "center", alignItems: "center", zIndex: 999,
            }}
          >
            <div
              style={{
                background: "var(--surface)", color: "var(--text)", width: "900px",
                maxHeight: "80vh", overflowY: "auto", borderRadius: 10, padding: 20,
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>{t.imports_title}</h2>
                <button
                  onClick={() => setShowImports(false)}
                  style={{
                    padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border)",
                    background: "transparent", color: "var(--muted)", cursor: "pointer",
                    fontSize: "0.75rem", fontWeight: 600, transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.background = "var(--surface2)";
                    (e.target as HTMLButtonElement).style.color = "var(--text)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.background = "transparent";
                    (e.target as HTMLButtonElement).style.color = "var(--muted)";
                  }}
                >
                  {t.imports_close}
                </button>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "12px 8px", textAlign: "left", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}>
                      {t.imports_name}
                    </th>
                    <th style={{ padding: "12px 8px", textAlign: "left", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}>
                      {t.imports_comment}
                    </th>
                    <th style={{ padding: "12px 8px", textAlign: "left", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}>
                      {t.imports_size}
                    </th>
                    <th style={{ padding: "12px 8px", textAlign: "left", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}>
                      {t.imports_by}
                    </th>
                    <th style={{ padding: "12px 8px", textAlign: "left", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}>
                      {t.imports_date}
                    </th>
                    <th style={{ padding: "12px 8px", textAlign: "center", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}>
                      {t.imports_download}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingImports ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>
                        {t.loading}
                      </td>
                    </tr>
                  ) : imports.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>
                        {t.no_data}
                      </td>
                    </tr>
                  ) : (
                    imports.map((f: any) => (
                      <tr key={f.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "10px 8px", color: "var(--text)", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {f.file_name}
                        </td>
                        <td style={{ whiteSpace: "normal", maxWidth: 220, color: "var(--muted)" }}>
                          {f.comment
                            ? (translatingIds.has(f.id)
                              ? (lang === "fr" ? "Traduction..." : "Translating...")
                              : (translatedComments[`${f.id}_${lang}`] ?? f.comment))
                            : "—"}
                        </td>
                        <td style={{ padding: "10px 8px", color: "var(--muted)" }}>
                          {(f.size / 1024).toFixed(2)} KB
                        </td>
                        <td style={{ padding: "10px 8px", color: "var(--muted)" }}>
                          {f.uploaded_by_name}
                        </td>
                        <td style={{ padding: "10px 8px", color: "var(--muted)", fontSize: "0.7rem" }}>
                          {new Date(f.uploaded_at).toLocaleString(lang === "fr" ? "fr-FR" : "en-US")}
                        </td>
                        <td style={{ padding: "10px 8px", textAlign: "center" }}>
                          <button
                            onClick={() => {
                              const token = localStorage.getItem("gfst_token")
                              fetch(`http://localhost:8000/api/imports/${f.id}/download`, {
                                headers: { Authorization: `Bearer ${token}` },
                              })
                                .then(async (res) => {
                                  const blob = await res.blob()
                                  const url = window.URL.createObjectURL(blob)
                                  const a = document.createElement("a")
                                  a.href = url
                                  a.download = f.file_name
                                  a.click()
                                  window.URL.revokeObjectURL(url)
                                })
                            }}
                            style={{
                              padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)",
                              background: "transparent", color: "#00C6A2", cursor: "pointer",
                              fontSize: "0.65rem", fontWeight: 600, transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLButtonElement).style.background = "rgba(0,198,162,0.1)";
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLButtonElement).style.background = "transparent";
                            }}
                          >
                            ⬇ {t.imports_download}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </>
  )
}