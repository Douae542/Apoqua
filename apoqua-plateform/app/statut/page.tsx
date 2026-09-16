"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Lang = "fr" | "en";

// Modele aligne sur la table "demandes" du backend (routes/demandes.py, models/demande.py) :
// une demande de creation ou de modification soumise par un utilisateur.
// Ce n'est PLUS le miroir de l'Excel importe (table "fiches") : cette page ne doit
// afficher que les demandes utilisateur, pas les 662 fiches historiques.
interface Demande {
  id: number;
  reference: string;
  type_demande: string;
  statut: string;
  description: string;
  created_by: number;
  created_at: string;
  updated_at: string | null;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label_fr: string; label_en: string }> = {
  "Applicable":    { color:"#3D8EF5", bg:"rgba(61,142,245,0.12)", label_fr:"Applicable",    label_en:"Applicable" },
  "In Process":    { color:"#9B8CFF", bg:"rgba(155,140,255,0.12)",label_fr:"En cours",      label_en:"In Process" },
  "Approved":      { color:"#00C6A2", bg:"rgba(0,198,162,0.12)",  label_fr:"Approuvé",      label_en:"Approved" },
  "Cancelled":     { color:"#FF6B6B", bg:"rgba(255,107,107,0.12)",label_fr:"Annulé",        label_en:"Cancelled" },
};
const DEFAULT_STATUS_CFG = { color:"#7D8590", bg:"rgba(125,133,144,0.12)", label_fr:"", label_en:"" };

// statut est un champ texte libre cote backend (DemandeUpdate.statut n'est pas un enum) :
// cette liste sert aux cartes KPI cliquables et au parcours visuel.
// Plus d'etat "En attente" : une demande fraichement creee demarre directement a "Applicable".
const ALL_STATUSES = ["Applicable","In Process","Approved","Cancelled"];

// cle utilisee pour regrouper dans une carte KPI "Autres" tous les statuts presents
// dans les donnees mais non repertories ci-dessus (evite un total qui ne colle pas
// a la somme des cartes)
const OTHER_STATUS_KEY = "__OTHER__";

interface Translations {
  title: string;
  sub: string;
  show: string;
  entries: string;
  search: string;
  all: string;
  columns: {
    reference: string;
    type_demande: string;
    description: string;
    created_at: string;
    updated_at: string;
    status: string;
    progress: string;
  };
  type_creation: string;
  type_modification: string;
  showing: string;
  to: string;
  of: string;
  entries_label: string;
  previous: string;
  next: string;
  no_data: string;
  export_csv: string;
  total: string;
  other: string;
}

const T: Record<Lang, Translations> = {
  fr: {
    title:"Consultation des demandes", sub:"",
    show:"Afficher", entries:"entrées", search:"Rechercher...", all:"Tous",
    columns:{
      reference:"Reference", type_demande:"Type de demande", description:"Description",
      created_at:"Date de la demande", updated_at:"Dernière mise à jour", status:"Statut", progress:"Progression",
    },
    type_creation:"Création", type_modification:"Modification",
    showing:"Affichage", to:"à", of:"sur", entries_label:"entrées", previous:"Précédent", next:"Suivant",
    no_data:"Aucune demande disponible", export_csv:"Exporter CSV", total:"Total demandes", other:"Autres",
  },
  en: {
    title:"Request Consultation", sub:"",
    show:"Show", entries:"entries", search:"Search...", all:"All",
    columns:{
      reference:"Reference", type_demande:"Request type", description:"Description",
      created_at:"Request date", updated_at:"Last update", status:"Status", progress:"Progress",
    },
    type_creation:"Creation", type_modification:"Modification",
    showing:"Showing", to:"to", of:"of", entries_label:"entries", previous:"Previous", next:"Next",
    no_data:"No requests available", export_csv:"Export CSV", total:"Total requests", other:"Other",
  },
};

const DESCRIPTION_TRANSLATIONS = {
  fr: {
    "Demande de création de la fiche": "Demande de création de la fiche",
    "Mise à jour fiche": "Mise à jour fiche",
    "création": "création",
    "modification": "modification",
    "Nouveau statut":"New status"
  },
  en: {
    "Demande de création de la fiche": "Creation request for record",
    "Mise à jour fiche": "Update record",
    "création": "creation",
    "modification": "modification",
     "Nouveau statut":"New status",
  }
};
// Normalise un statut brut (espaces superflus, casse differente, ou meme ecrit en
// francais cote backend comme "Approuvé"/"En cours") vers sa forme canonique connue,
// en comparant a la fois a la cle interne et aux deux libelles traduits.
function normalizeStatus(raw: string): string {
  const s = (raw || "").trim();
  const low = s.toLowerCase();
  // Plus d'etat "En attente" separe : on le traite comme "Applicable" (etat de depart unique).
  if (low === "en attente" || low === "pending") return "Applicable";
  const match = ALL_STATUSES.find(c => {
    const cfg = STATUS_CONFIG[c] || DEFAULT_STATUS_CFG;
    return c.toLowerCase() === low || cfg.label_fr.toLowerCase() === low || cfg.label_en.toLowerCase() === low;
  });
  return match || s;
}

// Traduit le type_demande brut ("création" / "modification") envoye par les
// formulaires ajouter-fiche / modifie-fiche.
function translateTypeDemande(raw: string, lang: Lang, t: Translations): string {
  const low = (raw || "").trim().toLowerCase();
  if (low.startsWith("créat") || low.startsWith("creat")) return t.type_creation;
  if (low.startsWith("modif")) return t.type_modification;
  return raw || "—";
}

// Traduit la description brute d'une demande (toujours generee en francais pour
// les anciens enregistrements, ou dans la langue de creation pour les nouveaux)
// selon la langue active de l'interface, en s'appuyant sur DESCRIPTION_TRANSLATIONS.
function translateDescription(raw: string, lang: Lang): string {
  if (!raw) return raw;
  if (lang === "fr") return raw;
  let result = raw;
  const dict = DESCRIPTION_TRANSLATIONS.en;
  Object.keys(dict).forEach(key => {
    if (result.includes(key)) {
      result = result.split(key).join(dict[key as keyof typeof dict]);
    }
  });
  return result;
}

// Une "vraie" demande vient forcement des formulaires ajouter-fiche / modifie-fiche,
// qui envoient toujours type_demande = "création" ou "modification". Tout le reste
// (ex: lignes "APOQUA" issues d'un import Excel tombe par erreur dans cette table)
// est ecarte de l'affichage ici, SANS toucher a la base de donnees.
function isValidDemande(raw: string): boolean {
  const low = (raw || "").trim().toLowerCase();
  return low.startsWith("créat") || low.startsWith("creat") || low.startsWith("modif");
}

function StatusBadge({ status, lang }: { status: string; lang: Lang }) {
  const normalized = normalizeStatus(status);
  const cfg = STATUS_CONFIG[normalized] || DEFAULT_STATUS_CFG;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:20, background:cfg.bg, color:cfg.color, fontSize:"0.68rem", fontWeight:700, border:`1px solid ${cfg.color}35`, whiteSpace:"nowrap" }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:cfg.color, flexShrink:0 }}/>
      {lang==="fr" ? (cfg.label_fr || normalized) : (cfg.label_en || normalized)}
    </span>
  );
}

// Retire l'heure d'un horodatage type "2026-07-20T10:15:30.123456" -> "2026-07-20"
function formatDateOnly(value: string | null): string {
  if (!value) return "";
  return value.split(" ")[0].split("T")[0];
}

// Etapes du "parcours" d'une demande : Applicable -> En cours -> resultat final
// (Approuve ou Annule). Le resultat final change de couleur/label selon l'issue.
// (une demande demarre toujours au statut "Applicable", il n'y a plus d'etat "En attente")
const JOURNEY_STEPS = ["Applicable", "In Process"] as const;

function StatusJourney({ status, lang }: { status: string; lang: Lang }) {
  const normalized = normalizeStatus(status);
  const isCancelled = normalized === "Cancelled";
  const isApproved = normalized === "Approved";
  const currentIndex = JOURNEY_STEPS.indexOf(normalized as typeof JOURNEY_STEPS[number]);

  // Index de la derniere etape "de base" atteinte (0=Applicable,1=En cours)
  // Si Annule/Approuve, on considere les 2 premieres etapes comme franchies.
  const baseReached = isCancelled || isApproved ? JOURNEY_STEPS.length - 1 : currentIndex;

  const finalCfg = isCancelled ? STATUS_CONFIG["Cancelled"] : STATUS_CONFIG["Approved"];
  const finalLabel = isCancelled
    ? (lang === "fr" ? "Annulé" : "Cancelled")
    : (lang === "fr" ? "Approuvé" : "Approved");
  const finalReached = isCancelled || isApproved;

  const nodes = [
    ...JOURNEY_STEPS.map((step, i) => {
      const cfg = STATUS_CONFIG[step] || DEFAULT_STATUS_CFG;
      return {
        key: step,
        label: lang === "fr" ? cfg.label_fr : cfg.label_en,
        color: cfg.color,
        reached: i <= baseReached,
      };
    }),
    { key: "final", label: finalLabel, color: finalCfg.color, reached: finalReached },
  ];

  return (
    <div className="journey-row">
      {nodes.map((n, i) => (
        <div className="journey-step-wrap" key={n.key}>
          <div className={`journey-step${n.reached ? " journey-step-reached" : ""}`} style={{"--step-color": n.color} as React.CSSProperties}>
            <span className="journey-dot"/>
            <span className="journey-label">{n.label}</span>
          </div>
          {i < nodes.length - 1 && <span className={`journey-arrow${nodes[i+1].reached ? " journey-arrow-reached" : ""}`}>→</span>}
        </div>
      ))}
    </div>
  );
}

// Petite locomotive SVG, posee au centre de chaque troncon de rail entre 2 gares.
function TrainIcon() {
  return (
    <svg className="train-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="13" height="9" rx="2"/>
      <path d="M16 9h3l2 2.5V15h-5"/>
      <circle cx="7" cy="17.5" r="1.4"/>
      <circle cx="13" cy="17.5" r="1.4"/>
      <circle cx="19" cy="17.5" r="1.4"/>
      <line x1="6" y1="9.5" x2="13" y2="9.5"/>
    </svg>
  );
}

// Bandeau global au-dessus du tableau : une seule "voie ferree" montrant les
// etapes possibles du parcours d'une demande (remplace la colonne Progression,
// qui repetait la meme info sur chaque ligne).
function TrainLegend({ lang, activeStatus, kpiCounts }: { lang: Lang; activeStatus: string | "ALL"; kpiCounts: Record<string, number> }) {
  const stations = [
    { key: "Applicable", color: STATUS_CONFIG["Applicable"].color, label: lang === "fr" ? STATUS_CONFIG["Applicable"].label_fr : STATUS_CONFIG["Applicable"].label_en },
    { key: "In Process", color: STATUS_CONFIG["In Process"].color, label: lang === "fr" ? STATUS_CONFIG["In Process"].label_fr : STATUS_CONFIG["In Process"].label_en },
    { key: "Approved", color: STATUS_CONFIG["Approved"].color, label: lang === "fr" ? STATUS_CONFIG["Approved"].label_fr : STATUS_CONFIG["Approved"].label_en },
    { key: "Cancelled", color: STATUS_CONFIG["Cancelled"].color, label: lang === "fr" ? STATUS_CONFIG["Cancelled"].label_fr : STATUS_CONFIG["Cancelled"].label_en },
  ];
  const GREY = "var(--muted)";
  return (
    <div className="train-legend">
      <div className="train-track">
        {stations.map((s, i) => {
          // Sans filtre actif : on colore les etats reellement presents dans les donnees.
          // Avec un filtre actif (carte KPI cliquee) : seul cet etat precis est colore.
          const isActive = activeStatus === "ALL" ? (kpiCounts[s.key] || 0) > 0 : s.key === activeStatus;
          const stepColor = isActive ? s.color : GREY;
          return (
            <div className="train-station-wrap" key={s.key}>
              <div className={`train-station${isActive ? " train-station-active" : ""}`} style={{"--step-color": stepColor} as React.CSSProperties}>
                <span className="train-station-dot"/>
                <span className="train-station-label">{s.label}</span>
              </div>
              {i < stations.length - 1 && (
                <span className="train-rail"><TrainIcon/></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ConsultationDemandes() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("fr");
  const [langLoaded, setLangLoaded] = useState(false);

  // Lu apres le montage cote client uniquement -> evite le mismatch serveur/client (hydratation)
  useEffect(() => {
    const stored = localStorage.getItem("gfst-lang");
    if (stored === "fr" || stored === "en") setLang(stored);
    setLangLoaded(true);
  }, []);

  useEffect(() => {
    if (langLoaded) localStorage.setItem("gfst-lang", lang);
  }, [lang, langLoaded]);

  const [dark, setDark] = useState(true);
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Lu apres le montage cote client uniquement -> evite le mismatch serveur/client (hydratation)
  useEffect(() => {
    const stored = localStorage.getItem("gfst-theme");
    if (stored === "dark" || stored === "light") setDark(stored === "dark");
    setThemeLoaded(true);
  }, []);

  useEffect(() => {
    // themeLoaded evite d'ecrire "dark" (valeur par defaut) par-dessus "light"
    // avant que la lecture ci-dessus n'ait corrige l'etat.
    if (themeLoaded) localStorage.setItem("gfst-theme", dark ? "dark" : "light");
  }, [dark, themeLoaded]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState<keyof Demande>("created_at");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc");
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Demande | null>(null);
  const t = T[lang];

useEffect(() => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("gfst_token") : null;
    
    fetch("http://localhost:8000/api/demandes/", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store" // ---> AJOUTE CETTE LIGNE ICI <---
    })
      .then(r => {
        if (r.status === 401) { router.push("/login"); return null; }
        return r.json();
      })
      .then(json => { if (json) setDemandes(Array.isArray(json.data) ? json.data.filter((d: Demande) => isValidDemande(d.type_demande)) : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpiCounts = ALL_STATUSES.reduce((acc, s) => { acc[s] = demandes.filter(d => normalizeStatus(d.statut) === s).length; return acc; }, {} as Record<string, number>);
  kpiCounts[OTHER_STATUS_KEY] = demandes.filter(d => !ALL_STATUSES.includes(normalizeStatus(d.statut))).length;

  const filtered = demandes
    .filter(d => activeStatus === "ALL" || (activeStatus === OTHER_STATUS_KEY ? !ALL_STATUSES.includes(normalizeStatus(d.statut)) : normalizeStatus(d.statut) === activeStatus))
    .filter(d => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return d.reference.toLowerCase().includes(q)
        || (d.description || "").toLowerCase().includes(q)
        || (d.type_demande || "").toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const va = String(a[sortCol] ?? ""), vb = String(b[sortCol] ?? "");
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(col: keyof Demande) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  }

  function exportCSV() {
    const headers = [t.columns.reference, t.columns.type_demande, t.columns.description, t.columns.created_at, t.columns.status].join(",");
    const rows = filtered.map(d => [
      d.reference,
      translateTypeDemande(d.type_demande, lang, t),
      `"${translateDescription(d.description, lang).replace(/"/g,'""')}"`,
      d.created_at ? formatDateOnly(d.created_at) : "",
      d.statut,
    ].join(","));
    const blob = new Blob([[headers, ...rows].join("\n")], { type:"text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `demandes_gfst_${new Date().toISOString().slice(0,10)}.csv`; a.click();
  }

  const SortIcon = ({ col }: { col: keyof Demande }) => (
    <svg width="8" height="10" viewBox="0 0 8 10" fill="none" style={{ opacity:sortCol===col?1:0.3, marginLeft:3, flexShrink:0 }}>
      <path d="M4 0L7 3.5H1L4 0Z" fill={sortCol===col && sortDir==="asc" ? "var(--accent)" : "var(--muted)"}/>
      <path d="M4 10L1 6.5H7L4 10Z" fill={sortCol===col && sortDir==="desc" ? "var(--accent)" : "var(--muted)"}/>
    </svg>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--sidebar-w:260px;--accent:#00C6A2;--blue:#3D8EF5;--amber:#F5A623;--purple:#9B8CFF;--danger:#FF6B6B;--radius:10px}
        .dark-theme{--bg:#0D1117;--surface:#161B22;--surface2:#1C2333;--border:rgba(255,255,255,0.08);--text:#E6EDF3;--muted:#7D8590}
        .light-theme{--bg:#F5F7FA;--surface:#FFFFFF;--surface2:#EEF1F7;--border:rgba(0,0,0,0.08);--text:#1A2030;--muted:#6B7A99}
        body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;font-size:14px;line-height:1.5}
        .layout{display:flex;min-height:100vh}
        .sidebar{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:100;transition:transform .2s ease}
        .sidebar.closed{transform:translateX(-100%)}
        .sidebar-logo{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
        .logo-badge{width:32px;height:32px;border-radius:7px;background:linear-gradient(135deg,var(--accent),var(--blue));display:flex;align-items:center;justify-content:center}
        .main{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;transition:margin-left .2s ease;min-height:100vh}
        .main.expanded{margin-left:0}
        .topbar{height:54px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0;position:sticky;top:0;z-index:50}
        .topbar-left{display:flex;align-items:center;height:100%}
        .topbar-toggle-wrap{display:flex;align-items:center;padding:0 14px;height:100%;border-right:1px solid var(--border)}
        .toggle-btn{width:30px;height:30px;border-radius:7px;border:1px solid var(--border);background:transparent;color:var(--muted);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s}
        .toggle-btn:hover{background:var(--surface2);color:var(--text)}
        .gfst-label{display:flex;align-items:center;gap:8px;padding:0 16px;height:100%;border-right:1px solid var(--border)}
        .gfst-icon-wrap{width:26px;height:26px;border-radius:6px;background:linear-gradient(135deg,var(--accent),var(--blue));display:flex;align-items:center;justify-content:center}
        .breadcrumb{flex:1;display:flex;align-items:center;gap:5px;font-size:.76rem;padding:0 16px}
        .bc-root{color:var(--muted);font-weight:500;cursor:pointer;transition:color .15s}.bc-root:hover{color:var(--accent)}
        .bc-sep{color:var(--muted)}.bc-current{font-weight:500;color:var(--text)}
        .topbar-actions{display:flex;align-items:center;gap:5px;padding-right:14px;margin-left:auto}
        .icon-btn{width:30px;height:30px;border-radius:7px;border:1px solid var(--border);background:transparent;color:var(--muted);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s}
        .icon-btn:hover{color:var(--text);background:var(--surface2)}
        .lang-switcher{display:flex;border:1px solid var(--border);border-radius:7px;overflow:hidden}
        .lang-btn{padding:4px 8px;font-size:.66rem;font-weight:600;cursor:pointer;background:transparent;border:none;color:var(--muted);transition:all .15s;font-family:'Inter',sans-serif}
        .lang-btn.active-lang{background:var(--accent);color:#fff}
        .lang-btn:hover:not(.active-lang){background:var(--surface2);color:var(--text)}
        .content{padding:20px;flex:1}
        .page-header{margin-bottom:20px}
        .page-title{font-size:1.1rem;font-weight:700;color:var(--text);display:flex;align-items:center;gap:10px;margin-bottom:4px}
        .page-title-icon{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--amber),#E8912F);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .page-sub{font-size:.75rem;color:var(--muted)}
        .kpi-row{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:20px}
        .kpi-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px;cursor:pointer;transition:all .15s;position:relative;overflow:hidden}
        .kpi-card:hover{transform:translateY(-2px)}
        .kpi-card.active-kpi{transform:translateY(-2px);box-shadow:0 4px 20px rgba(0,0,0,.15)}
        .kpi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--kpi-color,var(--accent));opacity:.5;transition:opacity .15s}
        .kpi-card.active-kpi::before{opacity:1}
        .kpi-value{font-size:1.6rem;font-weight:700;line-height:1;margin-bottom:4px}
        .kpi-label{font-size:.62rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;font-weight:600}
        .controls{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap}
        .controls-left{display:flex;align-items:center;gap:8px;flex:1;flex-wrap:wrap}
        .select-sm{background:var(--surface);border:1px solid var(--border);color:var(--text);font-size:.73rem;padding:5px 8px;border-radius:7px;font-family:'Inter',sans-serif;cursor:pointer;outline:none}
        .search-wrap{position:relative;flex:1;max-width:320px}
        .search-input{width:100%;background:var(--surface);border:1px solid var(--border);color:var(--text);font-size:.76rem;padding:6px 10px 6px 32px;border-radius:8px;font-family:'Inter',sans-serif;outline:none;transition:border-color .15s}
        .search-input:focus{border-color:rgba(0,198,162,.4)}
        .search-input::placeholder{color:var(--muted)}
        .search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--muted)}
        .btn-export{display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:8px;background:rgba(0,198,162,.08);border:1px solid rgba(0,198,162,.25);color:var(--accent);font-size:.72rem;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;white-space:nowrap}
        .btn-export:hover{background:rgba(0,198,162,.15)}
        .table-wrap{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
        .table-scroll{overflow-x:auto}
        table{width:100%;border-collapse:collapse;font-size:.74rem}
        thead{background:var(--surface2)}
        th{padding:10px 14px;text-align:left;color:var(--muted);font-weight:600;font-size:.63rem;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;border-bottom:1px solid var(--border);cursor:pointer;user-select:none;transition:color .15s}
        th:hover{color:var(--text)}
        .th-inner{display:flex;align-items:center}
        td{padding:10px 14px;border-bottom:1px solid var(--border);color:var(--text);vertical-align:middle;white-space:nowrap}
        tr:last-child td{border-bottom:none}
        tr:hover td{background:var(--surface2)}
        .tr-clickable{cursor:pointer}
        .td-mono{font-family:'DM Mono',monospace;font-size:.66rem;color:var(--accent)}
        .td-muted{color:var(--muted);font-size:.71rem}
        .td-title{max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .empty-state{padding:40px;text-align:center;color:var(--muted);font-size:.8rem}
        .pagination{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-top:1px solid var(--border);flex-wrap:wrap;gap:8px}
        .pag-info{font-size:.72rem;color:var(--muted)}
        .pag-btns{display:flex;align-items:center;gap:4px}
        .pag-btn{min-width:28px;height:28px;padding:0 6px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:.72rem;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;display:flex;align-items:center;justify-content:center}
        .pag-btn:hover:not(:disabled){background:var(--surface2);color:var(--text)}
        .pag-btn.active-page{background:var(--accent);color:#fff;border-color:var(--accent);font-weight:700}
        .pag-btn:disabled{opacity:.3;cursor:not-allowed}
        .loading-row td{text-align:center;padding:30px;color:var(--muted)}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spinner{width:16px;height:16px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;display:inline-block;vertical-align:middle;margin-right:6px}
        .sidebar-nav{flex:1;padding:12px 10px;display:flex;flex-direction:column;gap:2px;overflow-y:auto}
        .nav-section-label{font-size:.57rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);padding:10px 10px 4px;font-weight:600}
        .nav-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:all .15s;border:1px solid transparent}
        .nav-item:hover{background:var(--surface2)}
        .nav-item.active-nav{background:rgba(0,198,162,.1);border-color:rgba(0,198,162,.2)}
        .nav-icon{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .nav-label{font-weight:500;font-size:.77rem;color:var(--text);line-height:1.3;flex:1}
        .modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.55);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .16s ease}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
        .detail-box{background:var(--surface);border:1px solid var(--border);border-radius:14px;width:95%;max-width:600px;max-height:90vh;overflow-y:auto;animation:slideUp .2s ease;box-shadow:0 24px 60px rgba(0,0,0,.4)}
        .detail-header{padding:20px 22px 16px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;background:linear-gradient(90deg,rgba(245,166,35,.06),transparent)}
        .detail-close{width:26px;height:26px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0}
        .detail-close:hover{color:var(--text)}
        .detail-body{padding:20px 22px}
        .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .detail-field{display:flex;flex-direction:column;gap:3px}
        .detail-field.full{grid-column:1/-1}
        .detail-field-label{font-size:.62rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:600}
        .detail-field-value{font-size:.8rem;color:var(--text);font-weight:500}
        .detail-sep{height:1px;background:var(--border);margin:4px 0;grid-column:1/-1}
        @media(max-width:768px){.kpi-row{grid-template-columns:repeat(3,1fr)}.controls{flex-direction:column;align-items:stretch}}
        @media(max-width:480px){.kpi-row{grid-template-columns:repeat(2,1fr)}}

        /* --- Parcours de la demande (Applicable -> En cours -> Approuve/Annule) --- */
        .journey-row{display:flex;align-items:center;flex-wrap:wrap;gap:4px}
        .journey-step-wrap{display:flex;align-items:center;gap:4px}
        .journey-step{display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:20px;border:1px solid var(--border);background:var(--surface2);opacity:.45;transition:all .15s}
        .journey-step-reached{opacity:1;border-color:var(--step-color);background:color-mix(in srgb, var(--step-color) 12%, transparent)}
        .journey-dot{width:6px;height:6px;border-radius:50%;background:var(--muted);flex-shrink:0}
        .journey-step-reached .journey-dot{background:var(--step-color)}
        .journey-label{font-size:.68rem;font-weight:600;color:var(--muted);white-space:nowrap}
        .journey-step-reached .journey-label{color:var(--step-color)}
        .journey-arrow{color:var(--border);font-size:.8rem;line-height:1}
        .journey-arrow-reached{color:var(--muted)}
        .train-legend{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 20px;margin-bottom:14px;overflow-x:auto}
        .train-track{display:flex;align-items:center;gap:0;min-width:max-content}
        .train-station-wrap{display:flex;align-items:center}
        .train-station{display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;border:1px solid var(--step-color);background:color-mix(in srgb, var(--step-color) 12%, transparent);flex-shrink:0}
        .train-station-dot{width:6px;height:6px;border-radius:50%;background:var(--step-color);flex-shrink:0}
        .train-station-label{font-size:.68rem;font-weight:700;color:var(--step-color);white-space:nowrap}
        .train-rail{position:relative;width:64px;height:2px;background:var(--border);margin:0 8px;border-radius:2px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .train-icon{position:absolute;background:var(--surface);border-radius:50%;padding:2px}
        .train-station-active{box-shadow:0 0 0 3px color-mix(in srgb, var(--step-color) 18%, transparent)}
      `}</style>

      <div className={`layout ${dark ? "dark-theme" : "light-theme"}`}>

        {/* SIDEBAR */}
        <aside className={`sidebar${sidebarOpen ? "" : " closed"}`}>
          <div className="sidebar-logo">
            <div className="logo-badge"><span style={{fontWeight:700,fontSize:10,color:"#fff"}}>GF</span></div>
            <div>
              <div style={{fontWeight:700,fontSize:"0.88rem"}}>
                <span style={{color:"var(--accent)"}}>G</span><span style={{color:"var(--blue)"}}>F</span><span style={{color:"var(--blue)"}}>S</span><span style={{color:"#F5A623"}}>T</span>
              </div>
              <div style={{fontSize:"0.58rem",color:"var(--muted)"}}>Global FaSteners Team</div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">{lang==="fr"?"Accès rapide":"Quick access"}</div>
            {[
              { label:lang==="fr"?"Accueil":"Home", route:"/", color:"#00C6A2", active:false,
                icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
              { label:lang==="fr"?"Liste complète des fiches":"Complete Record List", route:"/parametres", color:"#00C6A2", active:false,
                icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> },
              { label:lang==="fr"?"Demande de création d'un standard":"Standard Creation Request", route:"/ajouter-fiche", color:"#3D8EF5", active:false,
                icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
              { label:lang==="fr"?"Demande de modification d'un standard":"Standard Modification Request", route:"/modifie-fiche", color:"#9B8CFF", active:false,
                icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
              { label:lang==="fr"?"Consultation des demandes":"Request Consultation", route:"/statut", color:"#F5A623", active:true,
                icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
                { label:lang==="fr"?"Liens utiles":"Useful links", route:"/?open=liens", color:"#00C6A2", active:false,
                icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
              { label:lang==="fr"?"Importer les données":"Import data", route:"/?open=export", color:"#7D8590", active:false,
                icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
              { label:lang==="fr"?"Paramètres":"Settings", route:"/?open=settings", color:"#7D8590", active:false,
                icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
            ].map(item => (
              <div key={item.label} className={`nav-item${item.active?" active-nav":""}`} onClick={() => router.push(item.route)}>
                <div className="nav-icon" style={{background:`${item.color}15`,color:item.color}}>{item.icon}</div>
                <div className="nav-label">{item.label}</div>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className={`main${sidebarOpen ? "" : " expanded"}`}>

          {/* Topbar */}
          <header className="topbar">
            <div className="topbar-left">
              <div className="topbar-toggle-wrap">
                <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </button>
              </div>
              <div className="gfst-label">
                <div className="gfst-icon-wrap">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <div>
                  <div style={{fontSize:"0.8rem",fontWeight:700,color:"var(--text)"}}>GFST</div>
                  <div style={{fontSize:"0.57rem",color:"var(--muted)"}}>Global FaSteners Team</div>
                </div>
              </div>
              <div className="breadcrumb">
                <span className="bc-root" onClick={() => router.push("/")}>GFST</span>
                <span className="bc-sep">/</span>
                <span className="bc-current">{t.title}</span>
              </div>
            </div>
            <div className="topbar-actions">
              <button className="icon-btn" onClick={() => setDark(!dark)}>
                {dark
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                }
              </button>
              <div className="lang-switcher">
                {(["fr","en"] as Lang[]).map(l =>
                  <button key={l} className={`lang-btn${lang===l?" active-lang":""}`} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="content">

            {/* Page header */}
            <div className="page-header">
              <div className="page-title">
                <div className="page-title-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                {t.title}
              </div>
            </div>

            {/* KPI cards — cliquer pour filtrer */}
            <div className="kpi-row">
              <div className={`kpi-card${activeStatus==="ALL"?" active-kpi":""}`} style={{"--kpi-color":"var(--text)"} as React.CSSProperties} onClick={() => { setActiveStatus("ALL"); setPage(1); }}>
                <div className="kpi-value" style={{color:"var(--text)"}}>{demandes.length}</div>
                <div className="kpi-label">{t.total}</div>
              </div>
              {ALL_STATUSES.map(s => {
                const cfg = STATUS_CONFIG[s] || DEFAULT_STATUS_CFG;
                return (
                  <div key={s} className={`kpi-card${activeStatus===s?" active-kpi":""}`} style={{"--kpi-color":cfg.color} as React.CSSProperties} onClick={() => { setActiveStatus(activeStatus===s?"ALL":s); setPage(1); }}>
                    <div className="kpi-value" style={{color:cfg.color}}>{kpiCounts[s]}</div>
                    <div className="kpi-label">{lang==="fr" ? cfg.label_fr : cfg.label_en}</div>
                  </div>
                );
              })}
              {kpiCounts[OTHER_STATUS_KEY] > 0 && (
                <div className={`kpi-card${activeStatus===OTHER_STATUS_KEY?" active-kpi":""}`} style={{"--kpi-color":DEFAULT_STATUS_CFG.color} as React.CSSProperties} onClick={() => { setActiveStatus(activeStatus===OTHER_STATUS_KEY?"ALL":OTHER_STATUS_KEY); setPage(1); }}>
                  <div className="kpi-value" style={{color:DEFAULT_STATUS_CFG.color}}>{kpiCounts[OTHER_STATUS_KEY]}</div>
                  <div className="kpi-label">{t.other}</div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="controls">
              <div className="controls-left">
                <div style={{display:"flex",alignItems:"center",gap:6,fontSize:".73rem",color:"var(--muted)"}}>
                  {t.show}
                  <select className="select-sm" value={pageSize} onChange={e => { setPageSize(+e.target.value); setPage(1); }}>
                    {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  {t.entries}
                </div>
                <div className="search-wrap">
                  <span className="search-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                  <input className="search-input" placeholder={t.search} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
                </div>
              </div>
              <button className="btn-export" onClick={exportCSV}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {t.export_csv}
              </button>
            </div>

            {/* Bandeau "voie ferree" : parcours global (remplace la colonne Progression) */}
            <TrainLegend lang={lang} activeStatus={activeStatus} kpiCounts={kpiCounts}/>

            {/* Table — donnees issues de la table "demandes" (creation/modification soumises par les utilisateurs) */}
            <div className="table-wrap">
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      {([
                        ["reference", t.columns.reference],
                        ["type_demande", t.columns.type_demande],
                        ["description", t.columns.description],
                        ["created_at", t.columns.created_at],
                        ["statut", t.columns.status],
                      ] as [keyof Demande, string][]).map(([col, label]) => (
                        <th key={col} onClick={() => toggleSort(col)}>
                          <div className="th-inner">{label}<SortIcon col={col}/></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr className="loading-row"><td colSpan={5}><span className="spinner"/>Chargement...</td></tr>
                    ) : paginated.length === 0 ? (
                      <tr><td colSpan={5} className="empty-state">{t.no_data}</td></tr>
                    ) : paginated.map(d => (
                      <tr key={d.id ?? d.reference} className="tr-clickable" onClick={() => setSelected(d)}>
                        <td><span className="td-mono">{d.reference}</span></td>
                        <td className="td-muted">{translateTypeDemande(d.type_demande, lang, t)}</td>
                        <td><div className="td-title" title={translateDescription(d.description, lang)}>{translateDescription(d.description, lang) || "—"}</div></td>
                        <td className="td-muted">{formatDateOnly(d.created_at) || "—"}</td>
                        <td><StatusBadge status={d.statut} lang={lang}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination">
                <div className="pag-info">
                  {t.showing} {filtered.length===0 ? 0 : (page-1)*pageSize+1} {t.to} {Math.min(page*pageSize, filtered.length)} {t.of} {filtered.length} {t.entries_label}
                </div>
                <div className="pag-btns">
                  <button className="pag-btn" disabled={page===1} onClick={() => setPage(1)}>«</button>
                  <button className="pag-btn" disabled={page===1} onClick={() => setPage(p => p-1)}>{t.previous}</button>
                  {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                    const start = Math.max(1, Math.min(page-2, totalPages-4));
                    const p = start + i;
                    return p <= totalPages ? <button key={p} className={`pag-btn${page===p?" active-page":""}`} onClick={() => setPage(p)}>{p}</button> : null;
                  })}
                  <button className="pag-btn" disabled={page===totalPages} onClick={() => setPage(p => p+1)}>{t.next}</button>
                  <button className="pag-btn" disabled={page===totalPages} onClick={() => setPage(totalPages)}>»</button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* DETAIL MODAL — clic sur une ligne */}
        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <div className="detail-box" onClick={e => e.stopPropagation()}>
              <div className="detail-header">
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:".72rem",color:"var(--accent)",fontWeight:600}}>{selected.reference}</span>
                    <StatusBadge status={selected.statut} lang={lang}/>
                  </div>
                  <div style={{fontWeight:700,fontSize:".92rem",color:"var(--text)",lineHeight:1.35,maxWidth:480}}>
                    {translateTypeDemande(selected.type_demande, lang, t)}
                  </div>
                </div>
                <button className="detail-close" onClick={() => setSelected(null)}>×</button>
              </div>
              <div className="detail-body">
                <div className="detail-grid">
                  <div className="detail-field"><div className="detail-field-label">{t.columns.type_demande}</div><div className="detail-field-value">{translateTypeDemande(selected.type_demande, lang, t)}</div></div>
                  <div className="detail-field"><div className="detail-field-label">{t.columns.created_at}</div><div className="detail-field-value">{formatDateOnly(selected.created_at) || "—"}</div></div>
                  <div className="detail-field"><div className="detail-field-label">{t.columns.updated_at}</div><div className="detail-field-value">{formatDateOnly(selected.updated_at) || "—"}</div></div>
                  <div className="detail-sep"/>
                  <div className="detail-field full"><div className="detail-field-label">{t.columns.status}</div><div style={{marginTop:4}}><StatusBadge status={selected.statut} lang={lang}/></div></div>
                  <div className="detail-field full"><div className="detail-field-label">{lang==="fr"?"Parcours de la demande":"Request journey"}</div><div style={{marginTop:6}}><StatusJourney status={selected.statut} lang={lang}/></div></div>
                  <div className="detail-field full"><div className="detail-field-label">{t.columns.description}</div><div className="detail-field-value" style={{whiteSpace:"normal",lineHeight:1.5}}>{translateDescription(selected.description, lang) || "—"}</div></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}