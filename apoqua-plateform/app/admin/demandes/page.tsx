"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Lang = "fr" | "en"

// Modele aligne sur la table "demandes" du backend (routes/demandes.py, models/demande.py).
interface Demande {
  id: number
  reference: string
  type_demande: string
  statut: string
  description: string
  created_by: number
  created_at: string
  updated_at: string | null
}

// Workflow de validation : Applicable -> En cours -> Validé / Rejeté.
// Cles internes alignees sur celles deja utilisees par la page de consultation
// (Applicable / In Process / Approved / Cancelled), les libelles affiches
// changent selon la langue active.
const STATUS_CONFIG: Record<string, { color: string; label_fr: string; label_en: string }> = {
  "Applicable": { color: "#3D8EF5", label_fr: "Applicable", label_en: "Applicable" },
  "In Process": { color: "#9B8CFF", label_fr: "En cours",   label_en: "In Process" },
  "Approved":   { color: "#00C6A2", label_fr: "Approuvé",     label_en: "Approved" },
  "Cancelled":  { color: "#FF6B6B", label_fr: "Rejeté",     label_en: "Rejected" },
}
const DEFAULT_STATUS = { color: "#7D8590", label_fr: "—", label_en: "—" }
const ALL_STATUSES = ["Applicable", "In Process", "Approved", "Cancelled"]

function statusLabel(key: string, lang: Lang): string {
  const cfg = STATUS_CONFIG[key] || DEFAULT_STATUS
  return lang === "fr" ? cfg.label_fr : cfg.label_en
}

// Normalise un statut brut (espaces, casse, libelle deja en francais ou anglais
// cote backend) vers sa cle canonique.
function normalizeStatus(raw: string): string {
  const s = (raw || "").trim()
  const low = s.toLowerCase()
  if (low === "en attente" || low === "pending") return "Applicable"
  const match = ALL_STATUSES.find(c => {
    const cfg = STATUS_CONFIG[c]
    return c.toLowerCase() === low || cfg.label_fr.toLowerCase() === low || cfg.label_en.toLowerCase() === low
  })
  return match || s
}

function isValidDemande(raw: string): boolean {
  const low = (raw || "").trim().toLowerCase()
  return low.startsWith("créat") || low.startsWith("creat") || low.startsWith("modif")
}

function translateType(raw: string, lang: Lang): string {
  const low = (raw || "").trim().toLowerCase()
  if (low.startsWith("créat") || low.startsWith("creat")) return lang === "fr" ? "Création" : "Creation"
  if (low.startsWith("modif")) return lang === "fr" ? "Modification" : "Modification"
  return raw || "—"
}

function formatDateOnly(value: string | null): string {
  if (!value) return "—"
  return value.split(" ")[0].split("T")[0]
}

interface Translations {
  title: string
  subtitle: string
  back: string
  logout: string
  totalRequests: string
  searchPlaceholder: string
  allStatuses: string
  colReference: string
  colType: string
  colDescription: string
  colDate: string
  colStatus: string
  loading: string
  noData: string
  deniedAdmin: string
  updateError: string
  translating: string
}

const T: Record<Lang, Translations> = {
  fr: {
    title: "Validation des demandes",
    subtitle: "Faire évoluer le statut des demandes de création / modification",
    back: "← Retour",
    logout: "Déconnexion",
    totalRequests: "Total demandes",
    searchPlaceholder: "Rechercher par référence, type, description...",
    allStatuses: "Tous les statuts",
    colReference: "Référence",
    colType: "Type",
    colDescription: "Description",
    colDate: "Date de la demande",
    colStatus: "Statut",
    loading: "⏳ Chargement...",
    noData: "Aucune demande trouvée",
    deniedAdmin: "Accès réservé aux administrateurs.",
    updateError: "Échec de la mise à jour du statut. Réessayez.",
    translating: "Traduction...",
  },
  en: {
    title: "Request Validation",
    subtitle: "Move creation / modification requests through their status",
    back: "← Back",
    logout: "Log out",
    totalRequests: "Total requests",
    searchPlaceholder: "Search by reference, type, description...",
    allStatuses: "All statuses",
    colReference: "Reference",
    colType: "Type",
    colDescription: "Description",
    colDate: "Request date",
    colStatus: "Status",
    loading: "⏳ Loading...",
    noData: "No requests found",
    deniedAdmin: "Restricted to administrators.",
    updateError: "Failed to update status. Please try again.",
    translating: "Translating...",
  },
}

export default function ValidationDemandesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [demandes, setDemandes] = useState<Demande[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const PAGE_SIZE = 25

  // Traduction automatique de la colonne Description, meme mecanisme que les
  // commentaires d'import dans app/admin/page.tsx (cache par id_langue).
  const [translatedDescriptions, setTranslatedDescriptions] = useState<Record<string, string>>({})
  const [translatingIds, setTranslatingIds] = useState<Set<number>>(new Set())

  // Langue active, persistee comme sur le reste de l'appli (cle "gfst-lang").
  const [lang, setLang] = useState<Lang>("fr")
  const [langLoaded, setLangLoaded] = useState(false)
  useEffect(() => {
    const stored = localStorage.getItem("gfst-lang")
    if (stored === "fr" || stored === "en") setLang(stored)
    setLangLoaded(true)
  }, [])
  useEffect(() => {
    if (langLoaded) localStorage.setItem("gfst-lang", lang)
  }, [lang, langLoaded])
  const t = T[lang]

  // Auth + role admin : reutilise gfst_user/gfst_token, comme le reste de l'appli.
  useEffect(() => {
    const token = localStorage.getItem("gfst_token")
    if (!token) { router.push("/login"); return }
    const raw = localStorage.getItem("gfst_user")
    if (raw) setUser(JSON.parse(raw))
    setAuthChecked(true)
  }, [])

  const isAdmin = !!user && String(user.role || "").toLowerCase().includes("admin")

  useEffect(() => {
    if (!authChecked) return
    loadDemandes()
  }, [authChecked])

  // Des que la liste de demandes change ou que la langue change, on traduit
  // (ou re-sert le cache) la description de chaque demande.
  useEffect(() => {
    demandes.forEach(d => {
      if (d.description) translateDescription(d.id, d.description, lang)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demandes, lang])

  async function loadDemandes() {
    setLoading(true)
    try {
      const token = localStorage.getItem("gfst_token")
      const res = await fetch("http://localhost:8000/api/demandes/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      if (res.status === 401) { router.push("/login"); return }
      const data = await res.json()
      const rows: Demande[] = Array.isArray(data.data) ? data.data : []
      setDemandes(rows.filter(d => isValidDemande(d.type_demande)))
    } finally {
      setLoading(false)
    }
  }

  async function translateDescription(id: number, text: string, targetLang: Lang) {
    const cacheKey = `${id}_${targetLang}`
    if (translatedDescriptions[cacheKey] !== undefined) return // deja traduit, pas de nouvel appel

    setTranslatingIds(prev => new Set(prev).add(id))
    try {
      const token = localStorage.getItem("gfst_token")
      const res = await fetch("http://localhost:8000/api/translate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text, target_lang: targetLang }),
      })
      const data = res.ok ? await res.json() : { translated_text: text }
      setTranslatedDescriptions(prev => ({ ...prev, [cacheKey]: data.translated_text }))
    } catch {
      setTranslatedDescriptions(prev => ({ ...prev, [cacheKey]: text }))
    } finally {
      setTranslatingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  // NOTE POUR YOUNES : hypothese PATCH /api/demandes/{id} avec { statut: newStatus },
  // par symetrie avec le GET /api/demandes/. Ajuste ici si ta route reelle differe.
  async function updateStatus(demande: Demande, newStatus: string) {
    const current = normalizeStatus(demande.statut)
    if (newStatus === current || updatingId === demande.id) return

    const token = localStorage.getItem("gfst_token")
    const previous = demande.statut
    setUpdatingId(demande.id)
    setDemandes(prev => prev.map(d => d.id === demande.id ? { ...d, statut: newStatus, updated_at: new Date().toISOString() } : d))

    try {
      const res = await fetch(`http://localhost:8000/api/demandes/${demande.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ statut: newStatus }),
      })
      if (res.status === 401) { router.push("/login"); return }
      if (!res.ok) throw new Error(String(res.status))
    } catch {
      setDemandes(prev => prev.map(d => d.id === demande.id ? { ...d, statut: previous } : d))
      alert(t.updateError)
    } finally {
      setUpdatingId(null)
    }
  }

  const kpiCounts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = demandes.filter(d => normalizeStatus(d.statut) === s).length
    return acc
  }, {} as Record<string, number>)

  const filtered = demandes
    .filter(d => filterStatus === "all" || normalizeStatus(d.statut) === filterStatus)
    .filter(d => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return d.reference.toLowerCase().includes(q)
        || (d.description || "").toLowerCase().includes(q)
        || translateType(d.type_demande, lang).toLowerCase().includes(q)
    })
    .sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""))

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #0D1117; color: #E6EDF3; min-height: 100vh; }
        .page { padding: 24px; max-width: 1400px; margin: 0 auto; }
        .topbar { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .logo { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #9B8CFF, #3D8EF5); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; font-size: 13px; flex-shrink: 0; }
        .title { font-size: 1.2rem; font-weight: 700; color: #E6EDF3; }
        .subtitle { font-size: 0.75rem; color: #7D8590; margin-top: 2px; }
        .back-btn { padding: 7px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: transparent; color: #7D8590; font-size: 0.75rem; cursor: pointer; }
        .back-btn:hover { color: #E6EDF3; border-color: rgba(255,255,255,0.2); }
        .topbar-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
        .lang-switcher { display: flex; border: 1px solid rgba(255,255,255,0.08); border-radius: 7px; overflow: hidden; }
        .lang-btn { padding: 6px 11px; font-size: 0.68rem; font-weight: 700; cursor: pointer; background: transparent; border: none; color: #7D8590; font-family: 'Inter', sans-serif; transition: all .15s; }
        .lang-btn.active-lang { background: #9B8CFF; color: #fff; }
        .lang-btn:hover:not(.active-lang) { background: #1C2333; color: #E6EDF3; }
        .logout-btn { padding: 7px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: transparent; color: #7D8590; font-size: 0.75rem; cursor: pointer; }
        .logout-btn:hover { color: #FF6B6B; border-color: rgba(255,107,107,0.3); }
        .stats-row { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .stat-box { background: #161B22; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px 20px; flex: 1; min-width: 140px; cursor: pointer; transition: border-color .15s; }
        .stat-box:hover { border-color: rgba(255,255,255,0.2); }
        .stat-box.active { border-color: var(--stat-color, #00C6A2); }
        .stat-val { font-size: 1.6rem; font-weight: 700; color: #E6EDF3; }
        .stat-lbl { font-size: 0.65rem; color: #7D8590; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
        .filters { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
        .search-wrap { position: relative; flex: 1; min-width: 220px; }
        .search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #7D8590; }
        .search-input { width: 100%; padding: 8px 10px 8px 34px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: #161B22; color: #E6EDF3; font-size: 0.78rem; outline: none; }
        .search-input:focus { border-color: rgba(0,198,162,0.4); }
        .filter-select { padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: #161B22; color: #E6EDF3; font-size: 0.72rem; cursor: pointer; outline: none; }
        .count { padding: 4px 10px; border-radius: 20px; background: rgba(0,198,162,0.1); color: #00C6A2; font-size: 0.7rem; font-weight: 600; }
        .table-card { background: #161B22; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 10px 14px; text-align: left; color: #7D8590; font-weight: 600; font-size: 0.63rem; text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap; border-bottom: 1px solid rgba(255,255,255,0.06); background: #1C2333; }
        tbody tr { transition: background 0.1s; }
        tbody tr:hover { background: #1C2333; }
        tbody td { padding: 10px 14px; font-size: 0.73rem; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
        tbody tr:last-child td { border-bottom: none; }
        .td-ref { font-family: 'DM Mono', monospace; font-size: 0.68rem; color: #7D8590; white-space: nowrap; }
        .td-desc { max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #E6EDF3; }
        .status-select { appearance: none; -webkit-appearance: none; padding: 4px 26px 4px 10px; border-radius: 20px; font-size: 0.66rem; font-weight: 700; border: 1px solid var(--st-color); background-color: color-mix(in srgb, var(--st-color) 14%, transparent); color: var(--st-color); cursor: pointer; font-family: 'Inter', sans-serif; background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%237D8590' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>"); background-repeat: no-repeat; background-position: right 8px center; background-size: 10px; outline: none; }
        .status-select:disabled { opacity: 0.5; cursor: not-allowed; }
        .spinner { width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.15); border-top-color: #9B8CFF; border-radius: 50%; animation: spin .7s linear infinite; display: inline-block; vertical-align: middle; margin-left: 6px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-top: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap; gap: 8px; }
        .pg-info { font-size: 0.7rem; color: #7D8590; }
        .pg-btns { display: flex; gap: 4px; }
        .pg-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08); background: transparent; color: #7D8590; font-size: 0.7rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .pg-btn:hover:not(:disabled) { background: #1C2333; color: #E6EDF3; }
        .pg-btn.active { background: #9B8CFF; color: #fff; border-color: #9B8CFF; }
        .pg-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .empty { padding: 48px; text-align: center; color: #7D8590; }
        .loading-row td { text-align: center; padding: 48px; color: #7D8590; }
        .denied { padding: 60px 24px; text-align: center; color: #7D8590; }
      `}</style>

      <div className="page">
        <div className="topbar">
          <div className="logo">VD</div>
          <div>
            <div className="title">{t.title}</div>
            <div className="subtitle">{t.subtitle}</div>
          </div>
          <button className="back-btn" onClick={() => router.push("/admin")}>{t.back}</button>
          <div className="topbar-actions">
            <div className="lang-switcher">
              {(["fr", "en"] as Lang[]).map(l => (
                <button
                  key={l}
                  className={`lang-btn${lang === l ? " active-lang" : ""}`}
                  onClick={() => setLang(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="logout-btn" onClick={() => {
              localStorage.clear()
              document.cookie = "gfst_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
              router.push("/login")
            }}>
              {t.logout}
            </button>
          </div>
        </div>

        {!authChecked ? null : !isAdmin ? (
          <div className="denied">{t.deniedAdmin}</div>
        ) : (
          <>
            {/* STATS cliquables = filtre rapide */}
            <div className="stats-row">
              <div className="stat-box" style={{ "--stat-color": "#E6EDF3" } as React.CSSProperties} onClick={() => { setFilterStatus("all"); setPage(1) }}>
                <div className="stat-val">{demandes.length}</div>
                <div className="stat-lbl">{t.totalRequests}</div>
              </div>
              {ALL_STATUSES.map(s => {
                const cfg = STATUS_CONFIG[s]
                return (
                  <div key={s} className={`stat-box${filterStatus === s ? " active" : ""}`} style={{ "--stat-color": cfg.color } as React.CSSProperties} onClick={() => { setFilterStatus(filterStatus === s ? "all" : s); setPage(1) }}>
                    <div className="stat-val" style={{ color: cfg.color }}>{kpiCounts[s]}</div>
                    <div className="stat-lbl">{statusLabel(s, lang)}</div>
                  </div>
                )
              })}
            </div>

            {/* FILTRES */}
            <div className="filters">
              <div className="search-wrap">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  className="search-input"
                  placeholder={t.searchPlaceholder}
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                />
              </div>
              <select className="filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
                <option value="all">{t.allStatuses}</option>
                {ALL_STATUSES.map(s => <option key={s} value={s}>{statusLabel(s, lang)}</option>)}
              </select>
              <span className="count">
                {lang === "fr"
                  ? `${filtered.length} demande${filtered.length > 1 ? "s" : ""}`
                  : `${filtered.length} request${filtered.length > 1 ? "s" : ""}`}
              </span>
            </div>

            {/* TABLEAU */}
            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>{t.colReference}</th>
                    <th>{t.colType}</th>
                    <th>{t.colDescription}</th>
                    <th>{t.colDate}</th>
                    <th>{t.colStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="loading-row"><td colSpan={5}>{t.loading}</td></tr>
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={5} className="empty">{t.noData}</td></tr>
                  ) : paginated.map(d => {
                    const normalized = normalizeStatus(d.statut)
                    const cfg = STATUS_CONFIG[normalized] || DEFAULT_STATUS
                    const descKey = `${d.id}_${lang}`
                    const displayedDescription = d.description
                      ? (translatingIds.has(d.id)
                          ? t.translating
                          : (translatedDescriptions[descKey] ?? d.description))
                      : "—"
                    return (
                      <tr key={d.id}>
                        <td className="td-ref">{d.reference}</td>
                        <td style={{ color: "#7D8590", fontSize: "0.68rem" }}>{translateType(d.type_demande, lang)}</td>
                        <td><div className="td-desc" title={displayedDescription}>{displayedDescription}</div></td>
                        <td style={{ color: "#7D8590", fontSize: "0.68rem" }}>{formatDateOnly(d.created_at)}</td>
                        <td>
                          <select
                            className="status-select"
                            style={{ "--st-color": cfg.color } as React.CSSProperties}
                            value={normalized}
                            disabled={updatingId === d.id}
                            onChange={e => updateStatus(d, e.target.value)}
                          >
                            {ALL_STATUSES.map(s => (
                              <option key={s} value={s}>{statusLabel(s, lang)}</option>
                            ))}
                          </select>
                          {updatingId === d.id && <span className="spinner" />}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="pagination">
                  <span className="pg-info">
                    {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length}
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
                        <button key={p} className={`pg-btn${page === p ? " active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                      )
                    })}
                    <button className="pg-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                    <button className="pg-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}