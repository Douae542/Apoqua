"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatbotGFST from "@/components/ChatbotGFST";

type Lang = "fr" | "en";

const LABELS = {
  fr: {
    title: "Liste complète des fiches GFST",
    sub: "Base de données GFST",
    back: "← Retour",
    search: "Rechercher...",
    all: "Tous",
    ref: "Référence",
    designation: "Désignation",
    designation_fr: "Désignation (Français)",
    designation_en: "Désignation (Anglais)",
    area: "Zone véhicule",
    dec: "PSA DEC",
    lot: "Lot",
    creation: "Création",
    modification: "Dernière modification",
    status: "Statut",
    total: "fiches",
    no_result: "Aucun résultat trouvé.",
    loading: "Chargement...",
    btn_create: "Créer une fiche",
    btn_update: "Mettre à jour",
  },
  en: {
    title: "Complete GFST File List",
    sub: "GFST Database",
    back: "← Back",
    search: "Search...",
    all: "All",
    ref: "Reference",
    designation: "Designation",
    designation_fr: "Designation (French)",
    designation_en: "Designation (English)",
    area: "Vehicle Area",
    dec: "PSA DEC",
    lot: "Lot",
    creation: "Created",
    modification: "Last modification",
    status: "Status",
    total: "records",
    no_result: "No results found.",
    loading: "Loading...",
    btn_create: "Create a record",
    btn_update: "Update a record",
  },
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  "Approved":       { bg: "rgba(0,198,162,0.12)",  color: "#00C6A2" },
  "Applicable":     { bg: "rgba(61,142,245,0.12)", color: "#3D8EF5" },
  "In Process":     { bg: "rgba(155,140,255,0.12)",color: "#9B8CFF" },
  "Cancelled":      { bg: "rgba(255,107,107,0.12)",color: "#FF6B6B" },
};

const ALL_STATUSES = [
  "Approved",
  "In Process",
  "Cancelled",
  "Applicable"
];

const STATUS_LABELS = {
  fr: {
    Approved: "Approuvé",
    "In Process": "En cours",
    Cancelled: "Annulé",
    Applicable: "Applicable",
  },
  en: {
    Approved: "Approved",
    "In Process": "In Process",
    Cancelled: "Cancelled",
    Applicable: "Applicable",
  },
};

export default function ListeComplete() {
  const router = useRouter();
  
  // 1. État de montage pour garantir l'hydratation
  const [mounted, setMounted] = useState(false);

  // 2. Initialisation avec des valeurs par défaut strictes (identiques au serveur)
  const [lang, setLang] = useState<Lang>("fr");
  const [dark, setDark] = useState<boolean>(true);

  // 3. Lecture du localStorage uniquement APRÈS le premier montage
  useEffect(() => {
    const storedLang = localStorage.getItem("gfst-lang") as Lang;
    if (storedLang) setLang(storedLang);

    const storedTheme = localStorage.getItem("gfst-theme");
    if (storedTheme) setDark(storedTheme === "dark");

    setMounted(true);
  }, []);

  // 4. Sauvegarde dans le localStorage (protégée par le flag mounted)
  useEffect(() => {
    if (mounted) localStorage.setItem("gfst-lang", lang);
  }, [lang, mounted]);

  useEffect(() => {
    if (mounted) localStorage.setItem("gfst-theme", dark ? "dark" : "light");
  }, [dark, mounted]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<string[]>([]);
  const PAGE_SIZE = 25;

  const L = LABELS[lang];

  useEffect(() => {
    async function loadFiches() {
      setLoading(true);
      try {
        const token = localStorage.getItem("gfst_token");
        if (!token) { router.push("/login"); return; }

        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (filterStatus !== "all") query.append("status", filterStatus);
        if (filterArea !== "all") query.append("area", filterArea);
        query.append("page", String(page));
        query.append("limit", String(PAGE_SIZE));

        const res = await fetch(`http://localhost:8000/api/fiches/?${query}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store"
        });

        if (res.status === 401) { router.push("/login"); return; }

        const json = await res.json();
        setData(json.data || []);
        setTotal(json.total || 0);

        if (json.data) {
          const uniqueAreas = [...new Set(
            json.data
              .map((f: any) => f.vehicle_area)
              .filter((a: string) => a && a !== "0" && a !== "")
          )] as string[];
          setAreas(prev => [...new Set([...prev, ...uniqueAreas])].sort());
        }
      } catch (e) {
        console.error("Erreur chargement fiches:", e);
      } finally {
        setLoading(false);
      }
    }
    
    // On attend que le composant soit monté pour faire l'appel API
    // Cela évite les comportements étranges avec le routeur
    if (mounted) {
      loadFiches();
    }
  }, [search, filterStatus, filterArea, page, mounted, router]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  function resetPage() { setPage(1); }

  // 5. Optionnel mais très robuste : Masquer l'interface avant le montage du client
  // Cela empêche tout clignotement visuel (flash) entre la version serveur et client
  if (!mounted) {
    return null; 
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .dark-theme { --bg:#0D1117;--surface:#161B22;--surface2:#1C2333;--border:rgba(255,255,255,0.08);--text:#E6EDF3;--muted:#7D8590;--accent:#00C6A2;--blue:#3D8EF5; }
        .light-theme { --bg:#F5F7FA;--surface:#FFFFFF;--surface2:#EEF1F7;--border:rgba(0,0,0,0.08);--text:#1A2030;--muted:#6B7A99;--accent:#00C6A2;--blue:#3D8EF5; }
        body { font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;font-size:13px; }
        .page { padding:20px;max-width:1600px;margin:0 auto; }

        /* TOPBAR */
        .topbar { display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap; }
        .btn-back { display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--muted);font-size:0.75rem;font-weight:500;cursor:pointer;transition:all 0.15s;font-family:'Inter',sans-serif; }
        .btn-back:hover { color:var(--accent);border-color:rgba(0,198,162,0.3); }
        .page-title { font-size:1.1rem;font-weight:700;color:var(--text);flex:1; }
        .page-sub { font-size:0.72rem;color:var(--muted); }
        .icon-btn { width:30px;height:30px;border-radius:7px;border:1px solid var(--border);background:transparent;color:var(--muted);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s; }
        .icon-btn:hover { color:var(--text);background:var(--surface2); }
        .lang-sw { display:flex;border:1px solid var(--border);border-radius:7px;overflow:hidden; }
        .lang-btn { padding:5px 9px;font-size:0.68rem;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;background:transparent;border:none;color:var(--muted);transition:all 0.15s; }
        .lang-btn.active { background:var(--accent);color:#fff; }

        /* ACTION BUTTONS */
        .btn-create { display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;border:none;background:linear-gradient(135deg,#00C6A2,#00a889);color:#fff;font-size:0.75rem;font-weight:600;cursor:pointer;transition:all 0.18s;font-family:'Inter',sans-serif;box-shadow:0 2px 10px rgba(0,198,162,0.25); }
        .btn-create:hover { transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,198,162,0.38); }
        .btn-update { display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;border:none;background:linear-gradient(135deg,#3D8EF5,#2479e0);color:#fff;font-size:0.75rem;font-weight:600;cursor:pointer;transition:all 0.18s;font-family:'Inter',sans-serif;box-shadow:0 2px 10px rgba(61,142,245,0.25); }
        .btn-update:hover { transform:translateY(-1px);box-shadow:0 4px 16px rgba(61,142,245,0.38); }

        /* FILTERS */
        .filters { display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;align-items:center; }
        .search-wrap { position:relative;flex:1;min-width:220px; }
        .search-wrap svg { position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--muted); }
        .search-input { width:100%;padding:7px 10px 7px 32px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:0.78rem;font-family:'Inter',sans-serif;outline:none;transition:border-color 0.15s; }
        .search-input:focus { border-color:var(--accent); }
        .filter-select { padding:7px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:0.72rem;font-family:'Inter',sans-serif;cursor:pointer;outline:none; }
        .count-badge { padding:4px 10px;border-radius:20px;background:rgba(0,198,162,0.1);color:var(--accent);font-size:0.7rem;font-weight:600;white-space:nowrap; }

        /* TABLE */
        .table-wrap { background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden; }
        table { width:100%;border-collapse:collapse; }
        thead th { font-size:0.6rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);padding:10px 12px;text-align:left;border-bottom:1px solid var(--border);font-weight:600;background:var(--surface2);white-space:nowrap; }
        tbody tr { transition:background 0.1s; }
        tbody tr:hover { background:var(--surface2); }
        tbody td { padding:9px 12px;font-size:0.73rem;border-bottom:1px solid var(--border);vertical-align:middle; }
        tbody tr:last-child td { border-bottom:none; }
        .td-ref { font-family:'DM Mono',monospace;font-size:0.68rem;color:var(--muted);white-space:nowrap; }
        .td-desig { color:var(--text);font-weight:500;max-width:280px; }
        .td-desig-sub { color:var(--muted);font-size:0.65rem;margin-top:2px;font-style:italic; }
        .td-area { color:var(--muted);font-size:0.68rem;max-width:160px; }
        .td-dec { font-family:'DM Mono',monospace;font-size:0.66rem;color:var(--muted); }
        .status-badge { display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:20px;font-size:0.62rem;font-weight:600;white-space:nowrap; }
        .status-dot { width:4px;height:4px;border-radius:50%;flex-shrink:0; }

        /* PAGINATION */
        .pagination { display:flex;align-items:center;gap:6px;padding:14px 16px;border-top:1px solid var(--border);justify-content:space-between;flex-wrap:wrap; }
        .pg-info { font-size:0.7rem;color:var(--muted); }
        .pg-btns { display:flex;gap:4px; }
        .pg-btn { width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:0.7rem;font-family:'Inter',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s; }
        .pg-btn:hover:not(:disabled) { background:var(--surface2);color:var(--text); }
        .pg-btn.active { background:var(--accent);color:#fff;border-color:var(--accent); }
        .pg-btn:disabled { opacity:0.35;cursor:not-allowed; }
        .empty { padding:48px;text-align:center;color:var(--muted);font-size:0.82rem; }
        .loading-wrap { display:flex;align-items:center;justify-content:center;padding:48px;color:var(--muted);font-size:0.82rem;gap:10px; }
        .spinner { width:18px;height:18px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin 0.8s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <div className={`${dark ? "dark-theme" : "light-theme"}`}>
        <div className="page">

          {/* TOPBAR */}
          <div className="topbar">
            <button className="btn-back" onClick={() => router.push("/")}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              {L.back}
            </button>

            <div>
              <div className="page-title">{L.title}</div>
              <div className="page-sub">{total} {L.total}</div>
            </div>

            {/* ── BOUTONS CRÉER / METTRE À JOUR ── */}
            <button className="btn-create" onClick={() => router.push("/ajouter-fiche")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              {L.btn_create}
            </button>

            <button className="btn-update" onClick={() => router.push("/modifie-fiche")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              {L.btn_update}
            </button>

            <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
              <button className="icon-btn" onClick={() => setDark(!dark)}>
                {dark ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </button>
              <div className="lang-sw">
                {(["fr", "en"] as Lang[]).map(l => (
                  <button key={l} className={`lang-btn${lang === l ? " active" : ""}`} onClick={() => setLang(l)}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="filters">
            <div className="search-wrap">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="search-input"
                placeholder={L.search}
                value={search}
                onChange={e => { setSearch(e.target.value); resetPage(); }}
              />
            </div>
            <select className="filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); resetPage(); }}>
              <option value="all">{L.status} — {L.all}</option>
              {ALL_STATUSES.map((s) => (
  <option key={s} value={s}>
    {STATUS_LABELS[lang][s as keyof typeof STATUS_LABELS["fr"]] || s}
  </option>
))}
            </select>
            <select className="filter-select" value={filterArea} onChange={e => { setFilterArea(e.target.value); resetPage(); }}>
              <option value="all">{L.area} — {L.all}</option>
              {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <span className="count-badge">{total} {L.total}</span>
          </div>

          {/* TABLE */}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{L.ref}</th>
                  <th>{L.designation_fr}</th>
                  <th>{L.designation_en}</th>
                  <th>{L.dec}</th>
                  <th>{L.lot}</th>
                  <th>{L.area}</th>
                  <th>{L.modification}</th>
                  <th>{L.status}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="loading-wrap">
                        <div className="spinner" />{L.loading}
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={8} className="empty">{L.no_result}</td></tr>
                ) : data.map((r: any) => {
                  const sc = STATUS_COLORS[r.status] || { bg: "rgba(125,133,144,0.1)", color: "#7D8590" };
                  return (
                    <tr key={r.reference}>
                    <td className="td-ref">
  <span
    style={{ cursor: "pointer", color: "var(--accent)", textDecoration: "underline" }}
    onClick={() => window.open(
      `https://docinfogroupe.stellantis.com/ead/doc/ref.${r.reference}/v.vc/fiche`,
      "_blank"
    )}
  >
    {r.reference}
  </span>
</td>
                      <td className="td-desig">
  {r.designation_fr}
</td>

<td className="td-desig">
  {r.designation_en}
</td>

<td className="td-dec">
  {r.psa_dec}
</td>

<td className="td-dec">
  {r.lot}
</td>

<td className="td-area">
  {r.vehicle_area}
</td>

<td
  style={{
    color: "var(--muted)",
    fontSize: "0.67rem",
    whiteSpace: "nowrap",
  }}
>
  {r.last_modification?.split(" ")[0]}
</td>

<td>
  <span
    className="status-badge"
    style={{
      background: sc.bg,
      color: sc.color,
    }}
  >
    <span
      className="status-dot"
      style={{ background: sc.color }}
    />
    {STATUS_LABELS[lang][r.status as keyof typeof STATUS_LABELS["fr"]] || r.status}
  </span>
</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <span className="pg-info">{(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE,total)} / {total}</span>
                <div className="pg-btns">
                  <button className="pg-btn" disabled={page===1} onClick={()=>setPage(1)}>«</button>
                  <button className="pg-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
                  {Array.from({length:Math.min(7,totalPages)},(_,i)=>{
                    let p: number;
                    if(totalPages<=7) p=i+1;
                    else if(page<=4) p=i+1;
                    else if(page>=totalPages-3) p=totalPages-6+i;
                    else p=page-3+i;
                    return <button key={p} className={`pg-btn${page===p?" active":""}`} onClick={()=>setPage(p)}>{p}</button>;
                  })}
                  <button className="pg-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
                  <button className="pg-btn" disabled={page===totalPages} onClick={()=>setPage(totalPages)}>»</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
       <ChatbotGFST lang={lang} /> 
    </>
  );
}