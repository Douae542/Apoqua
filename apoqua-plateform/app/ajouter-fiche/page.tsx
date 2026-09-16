"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Les 4 seuls statuts autorisés pour une fiche GFST (doit rester synchronisé
// avec ALL_STATUSES / STATUS_COLORS dans la page de consultation, et avec
// STATUS_ALIASES côté backend routes/fiches.py)
const OFFICIAL_STATUSES = ["Approved", "In Process", "Cancelled", "Applicable"] as const;

interface FicheForm {
  reference: string;
  designationFr: string;
  designationEn: string;
  psaDec: string;
  lot: string;
  vehiculeArea: string;
  creationDate: string;
  lastModification: string;
}

const EMPTY_FORM: FicheForm = {
  reference: "", designationFr: "", designationEn: "",
  psaDec: "", lot: "", vehiculeArea: "",
  creationDate: "", lastModification: "",
};
type Lang = "fr" | "en";

const T = {
  fr: {
    dir: "ltr" as const
,
    back: "Retour au tableau de bord",
    page_title: "Ajouter une gamme",
    page_badge: "GFST",
    page_sub: "Remplissez les informations pour enregistrer une nouvelle fiche dans la base de données",
    card_title: "Nouvelle Gamme GFST",
    required_note: "Champs obligatoires",
    section_id: "Identification",
    section_tech: "Détails Techniques",
    section_dates: "Dates",
    lbl_reference: "Référence",
    lbl_psaDec: "PSA DEC",
    lbl_designation: "Désignation GFST",
    lbl_lot: "Lot",
    lbl_vehiculeArea: "Zone Véhicule",
    lbl_creationDate: "Date de Création",
    ph_reference: "01266_XX_XXXXX",
    ph_psaDec: "ex : R1A",
    ph_designFr: "Désignation en français...",
    ph_designEn: "Désignation en anglais...",
    ph_lot: "ex : EXT",
    select_area: "-- Sélectionner --",
    area_front: "Face avant et capot",
    area_rear: "Face arrière et hayon",
    area_lateral: "Façade latérale et portes",
    area_interior: "Garnitures intérieures",
    area_dashboard: "Tableau de bord et console",
    area_engine: "Moteur et boîte de vitesses",
    area_chassis: "Liaison au sol",
    area_seats: "Sièges et ceintures de sécurité",
    area_harness: "Faisceau et calculateurs",
    area_battery: "Batterie sous le châssis",
    area_roof: "Toiture et garniture de toit",
    area_underbody: "Sous le corps",
    footer_note: "Tous les champs marqués",
    footer_note2: "sont obligatoires",
    btn_reset: "Réinitialiser",
    btn_submit: "Enregistrer la fiche",
    btn_loading: "Inscription...",
    success_title: "Fiche enregistrée avec succès !",
    success_sub: "La fiche",
    success_sub2: "a été ajouté à la base de données GFST.",
    error_exists: "Cette référence existe déjà dans la base.",
    lang_fr: "Français",
    lang_en: "Anglais",
  },
  en: {
    dir: "ltr" as const,
    back: "Back to dashboard",
    page_title: "Add a Record",
    page_badge: "GFST",
    page_sub: "Fill in the information to register a new entry in the database",
    card_title: "New GFST Record",
    required_note: "Required fields",
    section_id: "Identification",
    section_tech: "Technical Details",
    section_dates: "Dates",
    lbl_reference: "Reference",
    lbl_psaDec: "PSA DEC",
    lbl_designation: "GFST Designation",
    lbl_lot: "Lot",
    lbl_vehiculeArea: "Vehicle Area",
    lbl_creationDate: "Creation Date",
    ph_reference: "01266_XX_XXXXX",
    ph_psaDec: "e.g. R1A",
    ph_designFr: "Designation in French...",
    ph_designEn: "Designation in English...",
    ph_lot: "e.g. EXT",
    select_area: "-- Select --",
    area_front: "Front face and hood",
    area_rear: "Rear face and tailgate",
    area_lateral: "Side facade and doors",
    area_interior: "Interior trims",
    area_dashboard: "Dashboard and console",
    area_engine: "Engine and gearbox",
    area_chassis: "Chassis link",
    area_seats: "Seats and seatbelts",
    area_harness: "Harness and ECUs",
    area_battery: "Battery under chassis",
    area_roof: "Roof and headliner",
    area_underbody: "Under body",
    footer_note: "All fields marked",
    footer_note2: "are required",
    btn_reset: "Reset",
    btn_submit: "Save Record",
    btn_loading: "Saving...",
    success_title: "Record saved successfully!",
    success_sub: "The record",
    success_sub2: "has been added to the GFST database.",
    error_exists: "This reference already exists in the database.",
    lang_fr: "French",
    lang_en: "English",
  },
};

export default function AjouterFichePage() {
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
  const [form, setForm] = useState<FicheForm>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = T[lang];

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("gfst_token");
      if (!token) { router.push("/login"); return; }

      const ficheRes = await fetch("http://localhost:8000/api/fiches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reference: form.reference,
          designation_fr: form.designationFr,
          designation_en: form.designationEn,
          psa_dec: form.psaDec,
          lot: form.lot,
          vehicle_area: form.vehiculeArea,
          creation_date: form.creationDate,
          status: "Applicable",
          in_poro: "NO",
          in_pfr: "NO"
        })
      });

      const ficheData = await ficheRes.json();
      if (!ficheRes.ok) throw new Error(ficheData.detail || "Erreur création");

      await fetch("http://localhost:8000/api/demandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reference: form.reference,
          type_demande: "création",
          description: lang === "fr"
            ? `Demande de création de la fiche ${form.reference} — ${form.designationFr}`
            : `Creation request for record ${form.reference} — ${form.designationEn || form.designationFr}`
        })
      });

      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setForm(EMPTY_FORM); }, 3500);

    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  }

  const fields = Object.values(form);
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);

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
        .back-btn { display:flex;align-items:center;gap:8px;padding:9px 16px;border-radius:9px;border:0.5px solid var(--border);background:var(--surface);color:var(--muted);font-family:'DM Sans',sans-serif;font-size:0.8rem;cursor:pointer;transition:all 0.15s;white-space:nowrap;flex-shrink:0; }
        .back-btn:hover { color:var(--text);border-color:var(--border-focus);background:var(--surface2); }
        .page-title-wrap { flex:1;min-width:0; }
        .page-title { font-family:'Syne',sans-serif;font-size:1.45rem;font-weight:800;color:var(--text);display:flex;align-items:center;gap:10px;flex-wrap:wrap; }
        .page-badge { padding:3px 10px;border-radius:20px;background:rgba(61,142,245,0.12);color:var(--blue);font-size:0.68rem;font-weight:700;letter-spacing:0.06em; }
        .page-sub { font-size:0.8rem;color:var(--muted);margin-top:5px; }
        .top-controls { display:flex;align-items:center;gap:8px;flex-shrink:0; }
        .icon-btn { width:34px;height:34px;border-radius:8px;border:0.5px solid var(--border);background:var(--surface);color:var(--muted);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s; }
        .icon-btn:hover { color:var(--text);background:var(--surface2); }
        .lang-switcher { display:flex;border:0.5px solid var(--border);border-radius:8px;overflow:hidden;background:var(--surface); }
        .lang-btn { padding:6px 10px;font-size:0.68rem;font-weight:700;font-family:'Syne',sans-serif;cursor:pointer;background:transparent;border:none;color:var(--muted);transition:all 0.15s; }
        .lang-btn.active-lang { background:var(--accent);color:#fff; }
        .lang-btn:hover:not(.active-lang) { background:var(--surface2);color:var(--text); }
        .form-card { background:var(--surface);border:0.5px solid var(--border);border-radius:18px;overflow:hidden;max-width:920px;margin:0 auto; }
        .form-card-header { padding:20px 28px;border-bottom:0.5px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px; }
        .form-card-title { font-family:'Syne',sans-serif;font-weight:800;font-size:0.95rem;color:var(--text);display:flex;align-items:center;gap:10px; }
        .required-note { font-size:0.7rem;color:var(--muted);white-space:nowrap; }
        .progress-wrap { padding:12px 28px 0;display:flex;align-items:center;gap:12px; }
        .progress-track { flex:1;height:3px;background:var(--surface2);border-radius:2px;overflow:hidden; }
        .progress-fill { height:100%;border-radius:2px;background:linear-gradient(90deg,var(--accent),var(--blue));transition:width 0.4s ease; }
        .progress-label { font-size:0.68rem;color:var(--muted);white-space:nowrap; }
        .form-grid { padding:28px;display:grid;grid-template-columns:1fr 1fr;gap:20px; }
        .field { display:flex;flex-direction:column;gap:7px; }
        .field.span2 { grid-column:1/-1; }
        .field-label { font-size:0.68rem;font-weight:700;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase; }
        .req { color:var(--danger);margin-left:2px; }
        .field-input,.field-select { padding:11px 14px;background:var(--input-bg);border:0.5px solid var(--border);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.84rem;outline:none;transition:all 0.18s;width:100%; }
        .field-input::placeholder { color:var(--muted);opacity:0.6; }
        .field-input:focus,.field-select:focus { border-color:var(--blue);box-shadow:0 0 0 3px rgba(61,142,245,0.13);background:var(--input-focus-bg); }
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
        .btn-submit { padding:10px 26px;border-radius:9px;border:none;background:linear-gradient(135deg,#3D8EF5,#2479e0);color:#fff;font-family:'Syne',sans-serif;font-size:0.8rem;font-weight:700;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(61,142,245,0.28); }
        .btn-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 6px 22px rgba(61,142,245,0.42); }
        .btn-submit:disabled { opacity:0.65;cursor:not-allowed; }
        .spinner { width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @media(max-width:768px) { .form-grid{grid-template-columns:1fr;padding:18px}.field.span2{grid-column:1}.desig-wrap{grid-template-columns:1fr}.form-footer{flex-direction:column;align-items:flex-end}.page-wrap{padding:16px 14px} }
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
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3D8EF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              {t.card_title}
            </div>
            <div className="required-note">
              <span style={{ color: "var(--danger)" }}>*</span> {t.required_note}
            </div>
          </div>

          <div className="progress-wrap">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="progress-label">{pct}%</span>
          </div>

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

              {error && (
                <div className="error-banner">⚠️ {error}</div>
              )}

              <div className="section-label">{t.section_id}</div>

              {/* ✅ Référence — plus obligatoire */}
              <div className="field">
                <label className="field-label">{t.lbl_reference}</label>
                <input className="field-input" name="reference" value={form.reference} onChange={handleChange} placeholder={t.ph_reference} />
              </div>

              <div className="field">
                <label className="field-label">{t.lbl_psaDec} <span className="req">*</span></label>
                <input className="field-input" name="psaDec" value={form.psaDec} onChange={handleChange} placeholder={t.ph_psaDec} required />
              </div>

              <div className="field span2">
                <label className="field-label">{t.lbl_designation} <span className="req">*</span></label>
                <div className="desig-wrap">
                  <div>
                    <div className="lang-tag">
                      <span className="lang-chip" style={{ background: "#003189" }}>FR</span>
                      {t.lang_fr}
                    </div>
                    <input className="field-input" name="designationFr" value={form.designationFr} onChange={handleChange} placeholder={t.ph_designFr} required />
                  </div>
                  <div>
                    <div className="lang-tag">
                      <span className="lang-chip" style={{ background: "#012169" }}>EN</span>
                      {t.lang_en}
                    </div>
                    <input className="field-input" name="designationEn" value={form.designationEn} onChange={handleChange} placeholder={t.ph_designEn} />
                  </div>
                </div>
              </div>

              <div className="form-divider" />
              <div className="section-label">{t.section_tech}</div>

              <div className="field">
                <label className="field-label">{t.lbl_lot}</label>
                <input className="field-input" name="lot" value={form.lot} onChange={handleChange} placeholder={t.ph_lot} />
              </div>

              <div className="field">
                <label className="field-label">{t.lbl_vehiculeArea} <span className="req">*</span></label>
                <select className="field-select" name="vehiculeArea" value={form.vehiculeArea} onChange={handleChange} required>
                  <option value="">{t.select_area}</option>
                  <option value="Face avant et capot">{t.area_front}</option>
                  <option value="Face arrière et hayon">{t.area_rear}</option>
                  <option value="Façade latérale et portes">{t.area_lateral}</option>
                  <option value="Garnitures intérieures">{t.area_interior}</option>
                  <option value="Tableau de bord et console">{t.area_dashboard}</option>
                  <option value="Moteur et boîte de vitesses">{t.area_engine}</option>
                  <option value="Liaison au sol">{t.area_chassis}</option>
                  <option value="Sièges et ceintures de sécurité">{t.area_seats}</option>
                  <option value="Faisceau et calculateurs">{t.area_harness}</option>
                  <option value="Batterie sous le corps">{t.area_battery}</option>
                  <option value="Toiture et garniture de toit">{t.area_roof}</option>
                  <option value="Sous le corps">{t.area_underbody}</option>
                </select>
              </div>

              <div className="form-divider" />
              <div className="section-label">{t.section_dates}</div>

              <div className="field">
                <label className="field-label">{t.lbl_creationDate} <span className="req">*</span></label>
                <input className="field-input" type="date" name="creationDate" value={form.creationDate} onChange={handleChange} required />
              </div>

            </div>

            <div className="form-footer">
              <div className="footer-left">
                {t.footer_note} <span style={{ color: "var(--danger)" }}>*</span> {t.footer_note2}
              </div>
              <div className="btn-wrap">
                <button type="button" className="btn-reset" onClick={() => { setForm(EMPTY_FORM); setError(""); }}>
                  {t.btn_reset}
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? (
                    <><div className="spinner" />{t.btn_loading}</>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                      </svg>
                      {t.btn_submit}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}