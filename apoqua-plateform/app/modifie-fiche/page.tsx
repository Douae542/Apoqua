"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface FicheForm {
  reference: string;
  designationFr: string;
  designationEn: string;
  psaDec: string;
  lot: string;
  vehiculeArea: string;
  lastModification: string;
  status: string;
}

const EMPTY_FORM: FicheForm = {
  reference: "", designationFr: "", designationEn: "",
  psaDec: "", lot: "", vehiculeArea: "",
  lastModification: "", status: "In Process"
};

type Lang = "fr" | "en";

const T = {
  fr: {
    back: "Retour au tableau de bord",
    page_title: "Mise à jour du standard",
    page_badge: "GFST",
    page_sub: "Recherchez une fiche existante et mettez à jour ses informations",
    search_label: "Rechercher une fiche par référence",
    search_placeholder: "Ex: 01266_09_00147",
    search_btn: "Rechercher",
    searching: "Recherche...",
    not_found: "Aucune fiche trouvée pour cette référence.",
    section_id: "Identification",
    section_tech: "Détails Techniques",
    lbl_reference: "Référence",
    lbl_psaDec: "PSA DEC",
    lbl_designation: "Désignation GFST",
    lbl_lot: "Lot",
    lbl_vehiculeArea: "Zone Véhicule",
    lbl_lastModification: "Dernière Modification",
    lbl_status: "Statut",
    btn_reset: "Annuler",
    btn_submit: "Mettre à jour",
    btn_loading: "Mise à jour...",
    success_title: "Fiche mise à jour avec succès !",
    success_sub: "La fiche",
    success_sub2: "a été mise à jour dans la base de données GFST.",
    required_note: "Champs obligatoires",
    lang_fr: "Français",
    lang_en: "English",
    statuses: ["In Process", "Approved", "Applicable", "Cancelled"]
  },
  en: {
    back: "Back to dashboard",
    page_title: "Standard Update",
    page_badge: "GFST",
    page_sub: "Search for an existing record and update its information",
    search_label: "Search a record by reference",
    search_placeholder: "Ex: 01266_09_00147",
    search_btn: "Search",
    searching: "Searching...",
    not_found: "No record found for this reference.",
    section_id: "Identification",
    section_tech: "Technical Details",
    lbl_reference: "Reference",
    lbl_psaDec: "PSA DEC",
    lbl_designation: "GFST Designation",
    lbl_lot: "Lot",
    lbl_vehiculeArea: "Vehicle Area",
    lbl_lastModification: "Last Modification",
    lbl_status: "Status",
    btn_reset: "Cancel",
    btn_submit: "Update",
    btn_loading: "Updating...",
    success_title: "Record updated successfully!",
    success_sub: "The record",
    success_sub2: "has been updated in the GFST database.",
    required_note: "Required fields",
    lang_fr: "Français",
    lang_en: "English",
    statuses: ["In Process", "Approved", "Applicable", "Cancelled"]
  }
};

export default function ModifieFichePage() {
  const router = useRouter();
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gfst-theme");
      return stored ? stored === "dark" : true;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("gfst-theme", dark ? "dark" : "light");
  }, [dark]);

  const [lang, setLang] = useState<Lang>(() => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("gfst-lang");
    return (stored as Lang) || "fr";
  }
  return "fr";
});

useEffect(() => {
  localStorage.setItem("gfst-lang", lang);
}, [lang]);
  const [searchRef, setSearchRef] = useState("");
  const [ficheId, setFicheId] = useState<number | null>(null);
  const [form, setForm] = useState<FicheForm>(EMPTY_FORM);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [ficheFound, setFicheFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = T[lang];

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSearch() {
    if (!searchRef.trim()) return;
    setSearching(true);
    setNotFound(false);
    setFicheFound(false);
    setError("");

    try {
      const token = localStorage.getItem("gfst_token");
      if (!token) { router.push("/login"); return; }

      const res = await fetch(
        `http://localhost:8000/api/fiches?search=${searchRef}&limit=1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();

      if (json.data && json.data.length > 0) {
        const f = json.data[0];
        setFicheId(f.id);
        setForm({
          reference: f.reference || "",
          designationFr: f.designation_fr || "",
          designationEn: f.designation_en || "",
          psaDec: f.psa_dec || "",
          lot: f.lot || "",
          vehiculeArea: f.vehicle_area || "",
          lastModification: new Date().toISOString().split("T")[0],
          status: f.status || "In Process"
        });
        setFicheFound(true);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ficheId) return;
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("gfst_token");
      if (!token) { router.push("/login"); return; }

      // 1 — Mettre à jour la fiche
      const res = await fetch(`http://localhost:8000/api/fiches/${ficheId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          designation_fr: form.designationFr,
          designation_en: form.designationEn,
          psa_dec: form.psaDec,
          lot: form.lot,
          vehicle_area: form.vehiculeArea,
          last_modification: form.lastModification,
          status: form.status
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Erreur mise à jour");

      // 2 — Créer la demande de mise à jour
      // 2 — Créer la demande de mise à jour
      await fetch("http://localhost:8000/api/demandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reference: form.reference,
          type_demande: "modification",
          description: `Mise à jour fiche ${form.reference} — Nouveau statut: ${form.status}`
        })
      });

      // ---> AJOUTE CETTE LIGNE EXACTEMENT ICI <---
      router.refresh(); 

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFicheFound(false);
        setSearchRef("");
        setForm(EMPTY_FORM);
        setFicheId(null);
      }, 3500);

    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --accent:#00C6A2;--blue:#3D8EF5;--danger:#FF6B6B;--transition:0.22s cubic-bezier(.4,0,.2,1); }
        .dark-theme { --bg:#0B0E17;--surface:#121721;--surface2:#1A2030;--border:rgba(255,255,255,0.07);--border-focus:rgba(61,142,245,0.5);--text:#E8EDF5;--muted:#6B7A99;--input-bg:#1A2030;--input-focus-bg:#1e2638;--footer-bg:rgba(0,0,0,0.18); }
        .light-theme { --bg:#F4F6FA;--surface:#FFFFFF;--surface2:#EEF1F7;--border:rgba(0,0,0,0.08);--border-focus:rgba(61,142,245,0.4);--text:#1A2030;--muted:#6B7A99;--input-bg:#F4F6FA;--input-focus-bg:#EBF0FB;--footer-bg:rgba(0,0,0,0.03); }
        body { font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh; }
        .page-wrap { min-height:100vh;background:var(--bg);padding:28px 24px; }
        .top-nav { display:flex;align-items:center;gap:16px;margin-bottom:28px;flex-wrap:wrap; }
        .back-btn { display:flex;align-items:center;gap:8px;padding:9px 16px;border-radius:9px;border:0.5px solid var(--border);background:var(--surface);color:var(--muted);font-family:'DM Sans',sans-serif;font-size:0.8rem;cursor:pointer;transition:all 0.15s;white-space:nowrap; }
        .back-btn:hover { color:var(--text);border-color:var(--border-focus);background:var(--surface2); }
        .page-title-wrap { flex:1;min-width:0; }
        .page-title { font-family:'Syne',sans-serif;font-size:1.45rem;font-weight:800;color:var(--text);display:flex;align-items:center;gap:10px;flex-wrap:wrap; }
        .page-badge { padding:3px 10px;border-radius:20px;background:rgba(0,198,162,0.12);color:var(--accent);font-size:0.68rem;font-weight:700; }
        .page-sub { font-size:0.8rem;color:var(--muted);margin-top:5px; }
        .top-controls { display:flex;align-items:center;gap:8px;flex-shrink:0; }
        .icon-btn { width:34px;height:34px;border-radius:8px;border:0.5px solid var(--border);background:var(--surface);color:var(--muted);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s; }
        .icon-btn:hover { color:var(--text);background:var(--surface2); }
        .lang-switcher { display:flex;border:0.5px solid var(--border);border-radius:8px;overflow:hidden;background:var(--surface); }
        .lang-btn { padding:6px 10px;font-size:0.68rem;font-weight:700;font-family:'Syne',sans-serif;cursor:pointer;background:transparent;border:none;color:var(--muted);transition:all 0.15s; }
        .lang-btn.active-lang { background:var(--accent);color:#fff; }
        .form-card { background:var(--surface);border:0.5px solid var(--border);border-radius:18px;overflow:hidden;max-width:920px;margin:0 auto; }
        .form-card-header { padding:20px 28px;border-bottom:0.5px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px; }
        .form-card-title { font-family:'Syne',sans-serif;font-weight:800;font-size:0.95rem;color:var(--text);display:flex;align-items:center;gap:10px; }
        .search-zone { padding:24px 28px;border-bottom:0.5px solid var(--border);background:var(--surface2); }
        .search-label { font-size:0.68rem;font-weight:700;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;display:block; }
        .search-row { display:flex;gap:10px; }
        .search-input { flex:1;padding:11px 14px;background:var(--input-bg);border:0.5px solid var(--border);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.84rem;outline:none;transition:all 0.18s; }
        .search-input:focus { border-color:var(--blue);box-shadow:0 0 0 3px rgba(61,142,245,0.13); }
        .search-input::placeholder { color:var(--muted);opacity:0.6; }
        .search-btn { padding:11px 20px;border-radius:10px;border:none;background:linear-gradient(135deg,#3D8EF5,#2479e0);color:#fff;font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.2s; }
        .search-btn:hover { transform:translateY(-1px); }
        .search-btn:disabled { opacity:0.65;cursor:not-allowed; }
        .not-found { margin-top:12px;padding:12px 16px;background:rgba(255,107,107,0.08);border:0.5px solid rgba(255,107,107,0.3);border-radius:8px;color:#FF6B6B;font-size:0.8rem; }
        .form-grid { padding:28px;display:grid;grid-template-columns:1fr 1fr;gap:20px; }
        .field { display:flex;flex-direction:column;gap:7px; }
        .field.span2 { grid-column:1/-1; }
        .field-label { font-size:0.68rem;font-weight:700;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase; }
        .req { color:var(--danger);margin-left:2px; }
        .field-input,.field-select { padding:11px 14px;background:var(--input-bg);border:0.5px solid var(--border);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.84rem;outline:none;transition:all 0.18s;width:100%; }
        .field-input:focus,.field-select:focus { border-color:var(--blue);box-shadow:0 0 0 3px rgba(61,142,245,0.13); }
        .field-input.disabled { opacity:0.6;cursor:not-allowed;background:var(--surface2); }
        .field-select { appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7A99' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:38px;cursor:pointer; }
        .field-select option { background:var(--surface2);color:var(--text); }
        .desig-wrap { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
        .lang-tag { display:inline-flex;align-items:center;gap:6px;font-size:0.66rem;color:var(--muted);margin-bottom:6px; }
        .lang-chip { display:inline-flex;align-items:center;justify-content:center;width:22px;height:15px;border-radius:3px;font-size:0.58rem;font-weight:800;color:#fff;flex-shrink:0; }
        .form-divider { grid-column:1/-1;height:0.5px;background:var(--border); }
        .section-label { grid-column:1/-1;font-family:'Syne',sans-serif;font-size:0.65rem;font-weight:700;letter-spacing:0.13em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:10px; }
        .section-label::after { content:'';flex:1;height:0.5px;background:var(--border); }
        .success-banner { grid-column:1/-1;display:flex;align-items:flex-start;gap:14px;padding:16px 20px;background:rgba(0,198,162,0.08);border:0.5px solid rgba(0,198,162,0.3);border-radius:11px; }
        .success-icon { width:38px;height:38px;border-radius:50%;background:rgba(0,198,162,0.15);display:flex;align-items:center;justify-content:center;color:var(--accent);flex-shrink:0; }
        .success-title { font-family:'Syne',sans-serif;font-weight:700;font-size:0.88rem;color:var(--accent); }
        .success-sub { font-size:0.74rem;color:var(--muted);margin-top:3px;line-height:1.5; }
        .error-banner { grid-column:1/-1;padding:12px 16px;background:rgba(255,107,107,0.08);border:0.5px solid rgba(255,107,107,0.3);border-radius:8px;color:#FF6B6B;font-size:0.8rem; }
        .form-footer { padding:18px 28px;border-top:0.5px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:16px;background:var(--footer-bg);flex-wrap:wrap; }
        .footer-left { font-size:0.73rem;color:var(--muted); }
        .btn-wrap { display:flex;gap:10px; }
        .btn-reset { padding:10px 22px;border-radius:9px;border:0.5px solid var(--border);background:transparent;color:var(--muted);font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-reset:hover { background:var(--surface2);color:var(--text); }
        .btn-submit { padding:10px 26px;border-radius:9px;border:none;background:linear-gradient(135deg,#00C6A2,#0F6E56);color:#fff;font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:700;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(0,198,162,0.28); }
        .btn-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 6px 22px rgba(0,198,162,0.42); }
        .btn-submit:disabled { opacity:0.65;cursor:not-allowed; }
        .spinner { width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @media(max-width:768px) { .form-grid{grid-template-columns:1fr;padding:18px}.field.span2{grid-column:1}.desig-wrap{grid-template-columns:1fr}.search-row{flex-direction:column}.page-wrap{padding:16px 14px} }
      `}</style>

      <div className={`page-wrap ${dark ? "dark-theme" : "light-theme"}`}>
        <div className="top-nav">
          <button className="back-btn" onClick={() => router.push("/")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            {t.back}
          </button>
          <div className="page-title-wrap">
            <div className="page-title">
              {t.page_title}
              <span className="page-badge">{t.page_badge}</span>
            </div>
            <div className="page-sub">{t.page_sub}</div>
          </div>
          <div className="top-controls">
            <button className="icon-btn" onClick={() => setDark(!dark)}>
              {dark ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <div className="lang-switcher">
              {(["fr", "en"] as Lang[]).map(l => (
                <button key={l} className={`lang-btn${lang === l ? " active-lang" : ""}`} onClick={() => setLang(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-title">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#00C6A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              {t.page_title}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
              <span style={{ color: "var(--danger)" }}>*</span> {t.required_note}
            </div>
          </div>

          {/* ZONE RECHERCHE */}
          <div className="search-zone">
            <label className="search-label">{t.search_label}</label>
            <div className="search-row">
              <input
                className="search-input"
                placeholder={t.search_placeholder}
                value={searchRef}
                onChange={e => setSearchRef(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
              <button className="search-btn" onClick={handleSearch} disabled={searching}>
                {searching ? t.searching : t.search_btn}
              </button>
            </div>
            {notFound && <div className="not-found">⚠️ {t.not_found}</div>}
          </div>

          {/* FORMULAIRE */}
          {ficheFound && (
            <form onSubmit={handleSubmit}>
              <div className="form-grid">

                {submitted && (
                  <div className="success-banner">
                    <div className="success-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div>
                      <div className="success-title">✅ {t.success_title}</div>
                      <div className="success-sub">
                        {t.success_sub} <strong style={{ color: "var(--text)" }}>{form.reference}</strong> {t.success_sub2}
                      </div>
                    </div>
                  </div>
                )}

                {error && <div className="error-banner">⚠️ {error}</div>}

                <div className="section-label">{t.section_id}</div>

                <div className="field">
                  <label className="field-label">{t.lbl_reference}</label>
                  <input className="field-input disabled" value={form.reference} disabled />
                </div>

                <div className="field">
                  <label className="field-label">{t.lbl_status} <span className="req">*</span></label>
                  <select className="field-select" name="status" value={form.status} onChange={handleChange} required>
                    {t.statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="field span2">
                  <label className="field-label">{t.lbl_designation} <span className="req">*</span></label>
                  <div className="desig-wrap">
                    <div>
                      <div className="lang-tag">
                        <span className="lang-chip" style={{ background: "#003189" }}>FR</span>
                        {t.lang_fr}
                      </div>
                      <input className="field-input" name="designationFr" value={form.designationFr} onChange={handleChange} required />
                    </div>
                    <div>
                      <div className="lang-tag">
                        <span className="lang-chip" style={{ background: "#012169" }}>EN</span>
                        {t.lang_en}
                      </div>
                      <input className="field-input" name="designationEn" value={form.designationEn} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="form-divider" />
                <div className="section-label">{t.section_tech}</div>

                <div className="field">
                  <label className="field-label">{t.lbl_psaDec}</label>
                  <input className="field-input" name="psaDec" value={form.psaDec} onChange={handleChange} />
                </div>

                <div className="field">
                  <label className="field-label">{t.lbl_lot}</label>
                  <input className="field-input" name="lot" value={form.lot} onChange={handleChange} />
                </div>

                <div className="field">
                  <label className="field-label">{t.lbl_vehiculeArea}</label>
                  <input className="field-input" name="vehiculeArea" value={form.vehiculeArea} onChange={handleChange} />
                </div>

                <div className="field">
                  <label className="field-label">{t.lbl_lastModification}</label>
                  <input className="field-input" type="date" name="lastModification" value={form.lastModification} onChange={handleChange} />
                </div>

              </div>

              <div className="form-footer">
                <div className="footer-left">
                  <span style={{ color: "var(--danger)" }}>*</span> {t.required_note}
                </div>
                <div className="btn-wrap">
                  <button type="button" className="btn-reset" onClick={() => { setFicheFound(false); setSearchRef(""); setForm(EMPTY_FORM); setFicheId(null); }}>
                    {t.btn_reset}
                  </button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? (
                      <><div className="spinner" />{t.btn_loading}</>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {t.btn_submit}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}