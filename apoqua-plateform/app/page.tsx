"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatbotGFST from "@/components/ChatbotGFST";
import * as XLSX from "xlsx"; // npm install xlsx  — parsing réel des fichiers Excel côté client

// Base de l'API backend. Idéalement à sortir dans une variable d'env NEXT_PUBLIC_API_BASE.
const API_BASE = "http://localhost:8000";

// Le backend GFST utilise un JWT (Bearer token), pas un cookie de session.
// ⚠️ À VÉRIFIER : adaptez la clé localStorage ci-dessous à celle utilisée
// par votre page de login pour stocker le token reçu de /api/auth/login.
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || localStorage.getItem("gfst_token");
}
function authHeaders(): Record<string,string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const T = {
fr: {
nav: {
statut: "Consultation des demandes",
parametres: "Liste complète des fiches",
gestion: "Accès rapide",
creation: "Demande de création d'un standard",
modification: "Demande de modification d'un standard",
},
home: {
welcome: "Bienvenue sur", platform: "la plateforme GFST",
sub: "Gestion des gammes de fixations — Base de données standard",
chatbot_tip: "Utilisez le chatbot en bas de page pour une aide rapide.",
actions_title: "Actions rapides",
logo_acronym: "Global FaSteners Team",
about_btn: "À propos", team_btn: "GFST Team",
about_title: "À propos de GFST", team_title: "GFST Team", about_close: "Fermer",
acronym_title: "Qu'est-ce que GFST ?",
gfst_desc_title: "Définition & Objectif",
gfst_desc_body: `<strong>GFST</strong> est un référentiel partagé entre les équipes de conception et d'industrialisation.`,
gfst_principe_title: "Principe",
gfst_principe: "Peu importe le modèle de véhicule, la pièce se monte avec les mêmes fixations.",
gfst_pour_qui_title: "Pour qui ?",
gfst_pour_qui_1: "Les opérateurs : même outillage sur tous les postes.",
gfst_pour_qui_2: "Les concepteurs : interfaces définies à l'avance.",
gfst_pour_qui_3: "Les équipes process : meilleure robustesse.",
gfst_pourquoi_title: "Pourquoi ?",
gfst_pourquoi_1: "Moins de défauts, meilleure qualité.",
gfst_pourquoi_2: "Moins de retouches en production.",
gfst_pourquoi_3: "Réduction des coûts.",
gfst_pourquoi_4: "Plus de modèles montables sur une même ligne.",
about_body: `<p><strong>GFST</strong> (Global FaSteners Team) est une solution centralisée pour gérer le cycle de vie des gammes de fixations.</p><ul><li>📋 <strong>Centralisation</strong> — Base unique et versionnée.</li><li>⚡ <strong>Rapidité</strong> — Soumission et validation automatisées.</li><li>🔒 <strong>Sécurité</strong> — Accès par rôles.</li><li>🌐 <strong>Bilingue</strong> — Français et Anglais.</li></ul>`,
team_body: `<p>L'équipe <strong>GFST</strong> est composée d'experts en standardisation des fixations.</p><ul><li>👤 <strong>Naoufal El Housni</strong> — Engagement Manager</li><li>📋 <strong>Zaineb El Bouroumi</strong> — Project Manager</li><li>🔧 <strong>Azzouzi Laila</strong> — Mfg &amp; Process Engineer</li><li>🏭 <strong>Fouzia Tiach</strong> — Manufacturing People Manager</li><li>⚙️ <strong>Choudna Ilham</strong> — Mfg &amp; Process Engineer</li><li>📐 <strong>Lirari Ghita</strong> — Mfg &amp; Process Engineer</li></ul>`,
kpi_title: "KPI — Base de données standard",
kpi_upload: "Importer un fichier Excel KPI", kpi_loading: "Chargement...",
liens_utiles: "Liens utiles", import: "Importer les données", settings: "Paramètres",
statut_desc: "Consulter l'état de vos demandes en cours",
creation_desc: "Soumettre une nouvelle demande de création",
modification_desc: "Soumettre une demande de modification",
maj_desc: "Mettre à jour un standard existant",
slide_welcome: "Accueil", slide_acronym: "GFST", slide_desc: "Objectif",
slide_actions: "Actions", slide_liens: "Liens utiles",
},
},
en: {
nav: {
statut: "Request Consultation", parametres: "Complete Record List",
gestion: "Quick access", creation: "Standard Creation Request",
modification: "Standard Modification Request",
},
home: {
welcome: "Welcome to", platform: "the GFST Platform",
sub: "Fastener range management — Standard database",
chatbot_tip: "Use the chatbot at the bottom for quick help.",
actions_title: "Quick actions",
logo_acronym: "Global FaSteners Team",
about_btn: "About", team_btn: "GFST Team",
about_title: "About GFST", team_title: "GFST Team", about_close: "Close",
acronym_title: "What is GFST?",
gfst_desc_title: "Definition & Objective",
gfst_desc_body: `<strong>GFST</strong> is a shared reference between design and manufacturing teams.`,
gfst_principe_title: "Principle",
gfst_principe: "Whatever the vehicle model, same fasteners at the same workstation.",
gfst_pour_qui_title: "For whom?",
gfst_pour_qui_1: "Operators: same tools at every workstation.",
gfst_pour_qui_2: "Designers: interfaces defined upfront.",
gfst_pour_qui_3: "Process teams: better robustness.",
gfst_pourquoi_title: "Why?",
gfst_pourquoi_1: "Fewer defects, better quality.",
gfst_pourquoi_2: "Fewer reworks in production.",
gfst_pourquoi_3: "Cost reduction.",
gfst_pourquoi_4: "More models on the same line.",
about_body: `<p><strong>GFST</strong> is a centralised solution for fastener lifecycle management.</p><ul><li>📋 <strong>Centralisation</strong> — Single versioned database.</li><li>⚡ <strong>Speed</strong> — Automated submission and validation.</li><li>🔒 <strong>Security</strong> — Role-based access.</li><li>🌐 <strong>Bilingual</strong> — French and English.</li></ul>`,
team_body: `<p>The <strong>GFST</strong> team consists of fastener standardisation experts.</p><ul><li>👤 <strong>Naoufal El Housni</strong> — Engagement Manager</li><li>📋 <strong>Zaineb El Bouroumi</strong> — Project Manager</li><li>🔧 <strong>Azzouzi Laila</strong> — Mfg &amp; Process Engineer</li><li>🏭 <strong>Fouzia Tiach</strong> — Manufacturing People Manager</li><li>⚙️ <strong>Choudna Ilham</strong> — Mfg &amp; Process Engineer</li><li>📐 <strong>Lirari Ghita</strong> — Mfg &amp; Process Engineer</li></ul>`,
kpi_title: "KPI — Standard Joint Database",
kpi_upload: "Import KPI Excel file", kpi_loading: "Loading...",
liens_utiles: "Useful links", import: "Import data", settings: "Settings",
statut_desc: "Check the status of your ongoing requests",
creation_desc: "Submit a new standard creation request",
modification_desc: "Submit a modification request",
maj_desc: "Update an existing standard",
slide_welcome: "Home", slide_acronym: "GFST", slide_desc: "Objective",
slide_actions: "Actions", slide_liens: "Useful links",
},
},
};

type Lang = "fr" | "en";
const SLIDES = ["welcome","acronym","desc","actions","liens"] as const;

interface KpiData {
total: number; published: number; ongoing: number; cancelled: number;
approved_target: {name:string;value:number;color:string}[];
applicable_target: {name:string;value:number;color:string}[];
}
const DEFAULT_KPI: KpiData = {
total:194,published:143,ongoing:44,cancelled:7,
approved_target:[{name:"Approved",value:81,color:"#2E7D32"},{name:"Email sent",value:7,color:"#C8E6C9"},{name:"Email sent to pedro",value:3,color:"#F5A623"},{name:"Searching about validators",value:3,color:"#3D8EF5"},{name:"Red target",value:3,color:"#FF6B6B"},{name:"Canceled",value:2,color:"#9E9E9E"},{name:"In workflow",value:1,color:"#B0BEC5"}],
applicable_target:[{name:"Approved",value:31,color:"#2E7D32"},{name:"Email sent",value:14,color:"#C8E6C9"},{name:"Email sent to pedro",value:6,color:"#F5A623"},{name:"Searching about validators",value:20,color:"#3D8EF5"},{name:"Red target",value:12,color:"#FF6B6B"},{name:"On going",value:6,color:"#9B8CFF"},{name:"Canceled",value:11,color:"#9E9E9E"}],
};

function PieChartSVG({data,title}:{data:{name:string;value:number;color:string}[];title:string}){
const total=data.reduce((s,d)=>s+d.value,0); let cumulative=0;
const cx=90,cy=90,r=70;
const slices=data.map(d=>{
const sa=(cumulative/total)*2*Math.PI-Math.PI/2; cumulative+=d.value;
const ea=(cumulative/total)*2*Math.PI-Math.PI/2;
return{...d,x1:cx+r*Math.cos(sa),y1:cy+r*Math.sin(sa),x2:cx+r*Math.cos(ea),y2:cy+r*Math.sin(ea),largeArc:ea-sa>Math.PI?1:0,sa,ea};
});
return(
<div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:14}}>
<div style={{fontWeight:700,fontSize:"0.68rem",color:"var(--text)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10,textAlign:"center"}}>{title}</div>
<div style={{display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
<svg width="180" height="180" viewBox="0 0 180 180">
{slices.map((s,i)=><path key={i} d={`M ${cx} ${cy} L ${s.x1} ${s.y1} A ${r} ${r} 0 ${s.largeArc} 1 ${s.x2} ${s.y2} Z`} fill={s.color} stroke="var(--surface)" strokeWidth="1.5"/>)}
{slices.filter(s=>s.value>=10).map((s,i)=>{const m=(s.sa+s.ea)/2;return<text key={i} x={cx+(r*0.65)*Math.cos(m)} y={cy+(r*0.65)*Math.sin(m)} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="10" fontWeight="700">{s.value}%</text>;})}
</svg>
<div style={{display:"flex",flexDirection:"column",gap:4,justifyContent:"center",minWidth:140}}>
{data.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.65rem"}}><div style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0}}/><span style={{color:"var(--text)",fontWeight:500}}>{d.name}</span><span style={{color:"var(--muted)",marginLeft:"auto"}}>{d.value}%</span></div>)}
</div>
</div>
</div>
);
}

const LIENS_DATA=[
{label:"Process Fab",url:"https://inetpsa.com"},
{label:"Fichier des connexions génériques",url:"http://docinfogroupe.inetpsa.com/ead/doc/ref.01266_16_00718/v.vc/fiche"},
{label:"Fichier du Pilotage APOQUA",url:"http://docinfogroupe.inetpsa.com/ead/doc/ref.01266_20_00612/v.vc/fiche"},
{label:"Fichier d'indicateur et KPI",url:"http://docinfogroupe.inetpsa.com/ead/doc/ref.01266_19_00118/v.vc/fiche"},
{label:"Liste complète des fiches APOQUA",url:"http://docinfogroupe.inetpsa.com/ead/doc/ref.01266_15_00825/v.vc/fiche"},
{label:"Modèle vierge d'une fiche APOQUA",url:"http://docinfogroupe.inetpsa.com/ead/doc/ref.01266_15_00644/v.vc/fiche"},
{label:"Découpage PSA",url:"http://docinfogroupe.inetpsa.com/ead/doc/ref.GTN_RNPP04_0043/v.vc/fiche"},
{label:"Gestion de la liste avec Triplets et PoRo",url:"http://docinfogroupe.inetpsa.com/ead/doc/ref.01266_19_00373/v.vc/fiche"},
{label:"Fichier des demandes de création ou mise à jour des fiches APOQUA",url:"http://docinfogroupe.inetpsa.com/ead/doc/ref.01266_22_00006/v.vc/fiche"},
{label:"Référents APEN",url:"http://docinfogroupe.inetpsa.com/ead/doc/ref.01266_16_00230/v.vc/fiche"},
{label:"Base PFR",url:"http://docinfogroupe.inetpsa.com/ead/doc/ref.CMON_MEM07_0918/v.vc/fiche"},
];

// ── Team members list (single source of truth) ──
const TEAM_MEMBERS = [
{ emoji: "👤", name: "Alessandro Caggiati ", role: "Fasteners product engineering" },
{ emoji: "🏭", name: "Gaetan Guihard", role: "Responsable Uec metier" },
{ emoji: "🏭", name: "Alexander Deutsch", role: "Senior planning engineer" },
{ emoji: "📋", name: "Zaineb El Bouroumi", role: "Project Manager" },
{ emoji: "📐", name: "Lionel Jouquez", role: "Pilote Fixation projet" },
{ emoji: "🔧", name: "Eric Tassin", role: "Pilote Fixation Projet" },
{ emoji: "📋", name: "Francesco Merlini ", role: "Process Engineering Specialist" },
{ emoji: "🔧", name: "Azzouzi Laila", role: "Mfg & Process Engineer" },
{ emoji: "📐", name: "Lirari Ghita", role: "Mfg & Process Engineer" },
];

export default function GfstHome(){
const router=useRouter();
const [dark,setDark]=useState<boolean>(()=>{
      if(typeof window==="undefined") return true;
const stored=localStorage.getItem("gfst-theme");
      return stored ? stored==="dark" : true;
  });
const [themeLoaded, setThemeLoaded] = useState(true);
const [lang, setLang] = useState<Lang>("fr");
const [langLoaded, setLangLoaded] = useState(false);

useEffect(() => {
  const stored = localStorage.getItem("gfst-lang");
  if (stored === "fr" || stored === "en") setLang(stored as Lang);
  setLangLoaded(true);
}, []);

useEffect(() => {
  if (langLoaded) localStorage.setItem("gfst-lang", lang);
}, [lang, langLoaded]);


useEffect(() => {
  // themeLoaded evite d'ecrire "dark" (valeur initiale par defaut) par-dessus
  // le "light" deja sauvegarde, avant que la lecture ci-dessus n'ait corrige l'etat.
  if (themeLoaded) localStorage.setItem("gfst-theme", dark ? "dark" : "light");
}, [dark, themeLoaded]);

useEffect(() => {
  const stored = localStorage.getItem("gfst-notifications");
  if (stored !== null) setNotificationsEnabled(stored === "1");
}, []);

function toggleNotifications(){
  setNotificationsEnabled(prev=>{
    const next=!prev;
    localStorage.setItem("gfst-notifications", next?"1":"0");
    return next;
  });
}
const [sidebarOpen,setSidebarOpen]=useState(true);
const [showAbout,setShowAbout]=useState(false);
const [showTeam,setShowTeam]=useState(false);
const [showKPI,setShowKPI]=useState(false);
const [showSettings,setShowSettings]=useState(false);
const [showExport,setShowExport]=useState(false);
const [settingsTab,setSettingsTab]=useState<"general"|"apparence"|"notifications"|"support"|"imports">("general");

// Utilisateur courant, via le JWT déjà émis par /api/auth/login.
const [currentUser,setCurrentUser]=useState<{name:string;isAdmin:boolean}|null>(null);
useEffect(()=>{
fetch(`${API_BASE}/api/auth/me`,{headers:authHeaders()})
.then(r=>r.ok?r.json():null)
.then(d=>{
if(!d){setCurrentUser(null);return;}
setCurrentUser({
name:`${d.prenom||""} ${d.nom||""}`.trim(),
isAdmin: d.role==="admin"||d.role==="super_admin",
});
})
.catch(()=>setCurrentUser(null));
},[]);
const isAdmin = !!currentUser?.isAdmin;
const [kpiData,setKpiData]=useState<KpiData>(DEFAULT_KPI);
const [kpiLoading,setKpiLoading]=useState(false);
const [kpiFileName,setKpiFileName]=useState("");
const fileInputRef=useRef<HTMLInputElement>(null);
const [currentSlide,setCurrentSlide]=useState(0);
const [animDir,setAnimDir]=useState<"left"|"right">("right");
const [animating,setAnimating]=useState(false);

// Export/Import state
const [exportFile,setExportFile]=useState<File|null>(null);
const [exportPreview,setExportPreview]=useState<string[][]>([]);
const [exportLoading,setExportLoading]=useState(false);
const [exportComment,setExportComment]=useState("");
const [exportSaving,setExportSaving]=useState(false);
const [exportSaved,setExportSaved]=useState(false);
const [exportError,setExportError]=useState("");
const exportInputRef=useRef<HTMLInputElement>(null);

// Historique des imports (visible côté admin) — champs alignés sur ImportedFileResponse (backend)
type ImportRecord={id:number;file_name:string;uploaded_by_name:string;uploaded_at:string;comment:string|null;size:number};
const [importsHistory,setImportsHistory]=useState<ImportRecord[]>([]);
const [importsLoading,setImportsLoading]=useState(false);
const [importsError,setImportsError]=useState("");
// Cache des traductions : clé = `${id}_${lang}`
const [translatedComments,setTranslatedComments]=useState<Record<string,string>>({});
const [translatingIds,setTranslatingIds]=useState<Set<number>>(new Set());

async function translateComment(id:number, text:string, targetLang:Lang){
const cacheKey=`${id}_${targetLang}`;
if(translatedComments[cacheKey]!==undefined) return; // déjà traduit
setTranslatingIds(prev=>new Set(prev).add(id));
try{
const res=await fetch(`${API_BASE}/api/translate/`,{
method:"POST",
headers:{"Content-Type":"application/json",...authHeaders()},
body:JSON.stringify({text,target_lang:targetLang}),
});
const data=res.ok?await res.json():{translated_text:text};
setTranslatedComments(prev=>({...prev,[cacheKey]:data.translated_text}));
}catch{
setTranslatedComments(prev=>({...prev,[cacheKey]:text}));
}finally{
setTranslatingIds(prev=>{const n=new Set(prev);n.delete(id);return n;});
}
}

// Traduit automatiquement chaque commentaire dès que l'historique ou la langue change
useEffect(()=>{
importsHistory.forEach(rec=>{
if(rec.comment) translateComment(rec.id, rec.comment, lang);
});
// eslint-disable-next-line react-hooks/exhaustive-deps
},[importsHistory, lang]);

function loadImportsHistory(){
setImportsLoading(true); setImportsError("");
fetch(`${API_BASE}/api/imports/`,{headers:authHeaders()})
.then(r=>{if(!r.ok) throw new Error("unauthorized_or_failed"); return r.json();})
.then(d=>setImportsHistory(d))
.catch(()=>setImportsError(lang==="fr"?"Impossible de charger l'historique.":"Unable to load history."))
.finally(()=>setImportsLoading(false));
}

function downloadImport(id:number,fileName:string){
fetch(`${API_BASE}/api/imports/${id}/download`,{headers:authHeaders()})
.then(r=>{if(!r.ok) throw new Error("download_failed"); return r.blob();})
.then(blob=>{
const url=window.URL.createObjectURL(blob);
const a=document.createElement("a");
a.href=url; a.download=fileName; document.body.appendChild(a); a.click();
a.remove(); window.URL.revokeObjectURL(url);
})
.catch(()=>setImportsError(lang==="fr"?"Échec du téléchargement.":"Download failed."));
}

// Settings state
const [notifEmail,setNotifEmail]=useState(true);
const [notifPush,setNotifPush]=useState(true);
const [notifWeekly,setNotifWeekly]=useState(false);
const [notificationsEnabled,setNotificationsEnabled]=useState(true);
const [supportMsg,setSupportMsg]=useState("");
const [supportSent,setSupportSent]=useState(false);

useEffect(()=>{
fetch("http://localhost:8000/api/kpi/default").then(r=>r.json()).then(d=>setKpiData(d)).catch(()=>setKpiData(DEFAULT_KPI));
},[]);

async function handleKpiUpload(e:React.ChangeEvent<HTMLInputElement>){
const file=e.target.files?.[0]; if(!file) return;
setKpiFileName(file.name); setKpiLoading(true);
try{const fd=new FormData();fd.append("file",file);const res=await fetch("http://localhost:8000/api/kpi/upload",{method:"POST",body:fd});if(res.ok){const d=await res.json();setKpiData({...DEFAULT_KPI,...d});}}catch{}finally{setKpiLoading(false);}
}

// Import: parse CSV/TXT/Excel pour aperçu (aperçu réel, plus de placeholder pour les .xlsx)
function handleExportFile(e:React.ChangeEvent<HTMLInputElement>){
const file=e.target.files?.[0]; if(!file) return;
setExportFile(file); setExportLoading(true);
setExportComment(""); setExportSaved(false); setExportError("");

if(file.name.endsWith(".csv")||file.name.endsWith(".txt")){
const reader=new FileReader();
reader.onload=(ev)=>{
const text=ev.target?.result as string;
if(!text){setExportLoading(false);return;}
const lines=text.split("\n").filter(l=>l.trim());
const rows=lines.slice(0,50).map(l=>l.split(/[,; ]/).map(c=>c.trim().replace(/^"|"$/g,"")));
setExportPreview(rows);
setExportLoading(false);
};
reader.onerror=()=>setExportLoading(false);
reader.readAsText(file,"utf-8");
} else {
// .xlsx / .xls : lecture réelle avec SheetJS
const reader=new FileReader();
reader.onload=(ev)=>{
try{
const data=ev.target?.result;
const wb=XLSX.read(data,{type:"array"});
const firstSheet=wb.Sheets[wb.SheetNames[0]];
const rows=XLSX.utils.sheet_to_json(firstSheet,{header:1,raw:false,defval:""}) as string[][];
setExportPreview(rows.slice(0,50));
}catch{
setExportError(lang==="fr"?"Impossible de lire ce fichier Excel.":"Unable to read this Excel file.");
setExportPreview([]);
}finally{
setExportLoading(false);
}
};
reader.onerror=()=>setExportLoading(false);
reader.readAsArrayBuffer(file);
}
}

async function handleSaveImport(){
if(!exportFile) return;
if(!exportComment.trim()){
setExportError(lang==="fr"?"La description / raison de l'import est obligatoire.":"A description / reason for the import is required.");
return;
}
setExportSaving(true); setExportError(""); setExportSaved(false);
try{
const fd=new FormData();
fd.append("file",exportFile);
fd.append("comment",exportComment.trim());
// Le backend identifie l'auteur via le JWT (Authorization header), jamais via le body.
const res=await fetch(`${API_BASE}/api/imports/upload`,{method:"POST",body:fd,headers:authHeaders()});
if(!res.ok) throw new Error("upload_failed");
setExportSaved(true);
}catch{
setExportError(lang==="fr"?"L'enregistrement a échoué. Réessayez.":"Save failed. Please try again.");
}finally{
setExportSaving(false);
}
}

function resetImportModal(){
setShowExport(false);
setExportFile(null);
setExportPreview([]);
setExportComment("");
setExportSaved(false);
setExportError("");
}

function goSlide(idx:number){
if(idx===currentSlide||animating) return;
setAnimDir(idx>currentSlide?"right":"left");
setAnimating(true);
setTimeout(()=>{setCurrentSlide(idx);setAnimating(false);},280);
}
function prevSlide(){if(currentSlide>0) goSlide(currentSlide-1);}
function nextSlide(){if(currentSlide<SLIDES.length-1) goSlide(currentSlide+1);}

useEffect(()=>{
const open=new URLSearchParams(window.location.search).get("open");
if(!open) return;
if(open==="liens") setCurrentSlide(4);
else if(open==="export") setShowExport(true);
else if(open==="settings") setShowSettings(true);
router.replace("/",{scroll:false});
// eslint-disable-next-line react-hooks/exhaustive-deps
},[]);

const t=T[lang];
const slideLabels=[t.home.slide_welcome,t.home.slide_acronym,t.home.slide_desc,t.home.slide_actions,t.home.slide_liens];

const ACRONYM_DATA=[
{letter:"G",word:"Global",rest:"lobal",color:"#00C6A2",
desc:lang==="fr"?"Un référentiel commun à tous les sites":"A shared reference across all sites",
hover:{title:lang==="fr"?"Global — Portée mondiale":"Global — Worldwide Scope",icon:"🌐",
items:lang==="fr"?["Référentiel unique partagé entre tous les sites","Cohérence garantie sur tous les projets","Base de données versionnée et accessible à tous","Mise à jour centralisée en temps réel"]:["Single reference across all sites","Consistency across all projects","Versioned database accessible to all","Centralised real-time updates"]}},
{letter:"F",word:"FasTeners",rest:"eners",color:"#3D8EF5",
desc:lang==="fr"?"Fixations industrielles : vis, boulons, clips":"Industrial fasteners: screws, bolts, clips",
hover:{title:lang==="fr"?"FasTeners — Fixations standardisées":"FasTeners — Standardised Fasteners",icon:"🔩",
items:lang==="fr"?["Vis, boulons, écrous, clips normalisés","Une seule fixation par fonction","Réduction de la diversité des composants","Outillage identique sur tous les postes"]:["Standardised screws, bolts, nuts, clips","One fastener per function","Reduction in component diversity","Identical tooling at all stations"]}},
{letter:"T",word:"Team",rest:"eam",color:"#F5A623",
desc:lang==="fr"?"L'équipe dédiée à la standardisation":"The team dedicated to standardisation",
hover:{
title:lang==="fr"?"Team — L'équipe GFST":"Team — The GFST Team",
icon:"👥",
items:TEAM_MEMBERS.map(m=>`${m.name} — ${m.role}`)
}},
];

const NAV_ACTIONS=[
{id:"creation",label:t.nav.creation,desc:t.home.creation_desc,color:"#00C6A2",route:"/ajouter-fiche",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>},
{id:"modification",label:t.nav.modification,desc:t.home.modification_desc,color:"#9B8CFF",route:"/modifie-fiche",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>},
{id:"statut",label:t.nav.statut,desc:t.home.statut_desc,color:"#F5A623",route:"/statut",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>},
];

const SIDEBAR_NAV=[
{label:t.nav.parametres,route:"/parametres",color:"#00C6A2",action:null,icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>},
{label:t.nav.creation,route:"/ajouter-fiche",color:"#3D8EF5",action:null,icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>},
{label:t.nav.modification,route:"/modifie-fiche",color:"#9B8CFF",action:null,icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>},

{label:t.nav.statut,route:"/statut",color:"#F5A623",action:null,icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>},
{label:t.home.liens_utiles,route:null,color:"#00C6A2",action:"liens",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>},
{label:t.home.import,route:null,color:"#7D8590",action:"import",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>},
{label:t.home.settings,route:null,color:"#7D8590",action:"settings",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>},
];

const chevron=<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

// Settings tabs config
const SETTINGS_TABS=[
{id:"general",label:lang==="fr"?"Général":"General",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>},
{id:"apparence",label:lang==="fr"?"Apparence":"Appearance",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/></svg>},
{id:"notifications",label:"Notifications",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>},
{id:"support",label:"Support",icon:<svg  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4a2 2 0 0 1 1.95-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>},
];

return(
<>
<style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--sidebar-w:260px;--accent:#00C6A2;--blue:#3D8EF5;--amber:#F5A623;--purple:#9B8CFF;--danger:#FF6B6B;--radius:10px;--transition:0.2s ease}
.dark-theme{--bg:#0D1117;--surface:#161B22;--surface2:#1C2333;--border:rgba(255,255,255,0.08);--text:#E6EDF3;--muted:#7D8590}
.light-theme{--bg:#F5F7FA;--surface:#FFFFFF;--surface2:#EEF1F7;--border:rgba(0,0,0,0.08);--text:#1A2030;--muted:#6B7A99}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;transition:background var(--transition),color var(--transition);font-size:14px;line-height:1.5}
.layout{display:flex;min-height:100vh}
/* SIDEBAR */
.sidebar{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:100;transition:transform var(--transition)}
.sidebar.closed{transform:translateX(-100%)}
.sidebar-logo{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.logo-badge{width:32px;height:32px;border-radius:7px;background:linear-gradient(135deg,var(--accent),var(--blue));display:flex;align-items:center;justify-content:center;flex-shrink:0}
.logo-badge-text{font-weight:700;font-size:10px;color:#fff}
.logo-text{font-weight:700;font-size:0.88rem;color:var(--text)}
.logo-sub{font-size:0.58rem;color:var(--muted);line-height:1.4}
.sidebar-nav{flex:1;padding:12px 10px;display:flex;flex-direction:column;gap:2px;overflow-y:auto}
.nav-section-label{font-size:0.57rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);padding:10px 10px 4px;font-weight:600}
.nav-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:all 0.15s;border:1px solid transparent}
.nav-item:hover{background:var(--surface2)}
.nav-icon{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.nav-label{font-weight:500;font-size:0.77rem;color:var(--text);line-height:1.3;flex:1}
/* MAIN */
.main{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;transition:margin-left var(--transition)}
.main.expanded{margin-left:0}
/* TOPBAR */
.topbar{height:54px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0;position:sticky;top:0;z-index:50}
.topbar-left{display:flex;align-items:center;height:100%}
.topbar-toggle-wrap{display:flex;align-items:center;padding:0 14px;height:100%;border-right:1px solid var(--border)}
.toggle-btn{width:30px;height:30px;border-radius:7px;border:1px solid var(--border);background:transparent;color:var(--muted);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s}
.toggle-btn:hover{background:var(--surface2);color:var(--text)}
.breadcrumb{flex:1;display:flex;align-items:center;gap:5px;font-size:0.76rem;padding:0 16px}
.bc-root{color:var(--muted);font-weight:500}.bc-sep{color:var(--muted)}.bc-current{font-weight:500;color:var(--text)}
.topbar-actions{display:flex;align-items:center;gap:5px;padding-right:14px;margin-left:auto}
.icon-btn{width:30px;height:30px;border-radius:7px;border:1px solid var(--border);background:transparent;color:var(--muted);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;position:relative}
.icon-btn:hover{color:var(--text);background:var(--surface2)}
.icon-btn.notif-active{color:var(--accent);border-color:rgba(0,198,162,0.35);background:rgba(0,198,162,0.08)}
.notif-dot{position:absolute;top:5px;right:5px;width:5px;height:5px;background:var(--accent);border-radius:50%}
.topbar-text-btn{display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:7px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:0.7rem;font-family:'Inter',sans-serif;font-weight:500;cursor:pointer;transition:all 0.15s}
.topbar-text-btn:hover{color:var(--text);background:var(--surface2)}
.topbar-text-btn.team-btn:hover{color:var(--blue);border-color:rgba(61,142,245,0.35);background:rgba(61,142,245,0.06)}
.topbar-text-btn.about-btn-style:hover{color:var(--accent);border-color:rgba(0,198,162,0.35);background:rgba(0,198,162,0.06)}
.lang-switcher{display:flex;border:1px solid var(--border);border-radius:7px;overflow:hidden}
.lang-btn{padding:4px 8px;font-size:0.66rem;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;background:transparent;border:none;color:var(--muted);transition:all 0.15s}
.lang-btn.active-lang{background:var(--accent);color:#fff}
.lang-btn:hover:not(.active-lang){background:var(--surface2);color:var(--text)}
/* CONTENT */
.content{padding:20px;flex:1}
/* PRES NAV */
.pres-nav{display:flex;align-items:center;gap:8px;margin-bottom:18px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:10px 14px}
.pres-nav-tabs{display:flex;gap:4px;flex:1;flex-wrap:wrap}
.pres-tab{padding:5px 14px;border-radius:7px;font-size:0.72rem;font-weight:500;cursor:pointer;transition:all 0.15s;border:1px solid transparent;color:var(--muted);background:transparent;font-family:'Inter',sans-serif}
.pres-tab:hover{background:var(--surface2);color:var(--text)}
.pres-tab.active{background:var(--accent);color:#fff}
.pres-arrows{display:flex;gap:6px}
.pres-arrow{width:28px;height:28px;border-radius:7px;border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s}
.pres-arrow:hover:not(:disabled){background:var(--surface2);color:var(--text)}
.pres-arrow:disabled{opacity:0.3;cursor:not-allowed}
.pres-counter{font-size:0.68rem;color:var(--muted);font-weight:500;white-space:nowrap}
/* SLIDE ANIM */
.slide-wrap{overflow:hidden}
.slide-inner{transition:opacity 0.28s ease,transform 0.28s ease}
.slide-inner.exit-left{opacity:0;transform:translateX(-18px)}
.slide-inner.exit-right{opacity:0;transform:translateX(18px)}
.slide-inner.enter{opacity:1;transform:translateX(0)}
/* WELCOME */
.welcome-banner{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:22px 26px;display:flex;align-items:flex-start;justify-content:space-between;gap:20px;position:relative;overflow:hidden}
.welcome-banner::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:linear-gradient(180deg,var(--accent),var(--blue))}
.banner-title{font-size:1.25rem;font-weight:700;color:var(--text);line-height:1.3}
.banner-accent{color:var(--accent)}
.banner-sub{color:var(--muted);font-size:0.8rem;margin-top:4px}
.chatbot-tip{display:flex;align-items:flex-start;gap:8px;background:rgba(0,198,162,0.06);border:1px solid rgba(0,198,162,0.18);border-radius:8px;padding:10px 12px;max-width:260px;font-size:0.7rem;color:var(--muted);line-height:1.55}
.tip-icon{color:var(--accent);flex-shrink:0;margin-top:1px}
/* ACRONYM */
.acronym-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.ac-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;position:relative;overflow:hidden;cursor:default;transition:border-color 0.2s,transform 0.2s,box-shadow 0.2s;min-height:210px}
.ac-card:hover{transform:translateY(-3px);box-shadow:0 8px 30px rgba(0,0,0,0.15)}
.ac-front{transition:opacity 0.25s ease,transform 0.25s ease}
.ac-card:hover .ac-front{opacity:0;transform:translateY(-8px);pointer-events:none}
.ac-back{position:absolute;inset:0;padding:18px 20px;opacity:0;transform:translateY(10px);transition:opacity 0.25s ease,transform 0.25s ease;pointer-events:none;overflow-y:auto}
.ac-card:hover .ac-back{opacity:1;transform:translateY(0);pointer-events:auto}
.ac-letter-block{display:flex;align-items:baseline;margin-bottom:10px;line-height:1}
.ac-normal{font-weight:300;font-size:2.4rem;color:var(--muted);opacity:0.35}
.ac-highlight{font-weight:700;font-size:2.4rem}
.ac-word{font-weight:600;font-size:0.8rem;color:var(--text);margin-bottom:5px}
.ac-desc{font-size:0.7rem;color:var(--muted);line-height:1.55}
.ac-bar{position:absolute;bottom:0;left:0;right:0;height:2px}
.ac-back-header{display:flex;align-items:center;gap:8px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--border)}
.ac-back-emoji{font-size:1.3rem}
.ac-back-title{font-size:0.8rem;font-weight:700;line-height:1.3}
.ac-back-items{display:flex;flex-direction:column;gap:8px}
.ac-back-item{display:flex;align-items:flex-start;gap:7px;font-size:0.7rem;color:var(--muted);line-height:1.5}
.ac-back-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:5px}
.ac-hover-hint{position:absolute;bottom:10px;right:12px;font-size:0.59rem;color:var(--muted);opacity:0.5;font-style:italic;transition:opacity 0.2s}
.ac-card:hover .ac-hover-hint{opacity:0}
/* DESC */
.desc-section{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;position:relative;overflow:hidden}
.desc-section::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:linear-gradient(180deg,var(--blue),var(--purple))}
.desc-title{font-weight:600;font-size:0.86rem;color:var(--text);margin-bottom:8px;display:flex;align-items:center;gap:8px}
.desc-title-dot{width:6px;height:6px;border-radius:50%;background:var(--blue);flex-shrink:0}
.desc-body{font-size:0.78rem;color:var(--muted);line-height:1.7;margin-bottom:16px}
.desc-body strong{color:var(--text);font-weight:600}
.desc-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.desc-col{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px}
.desc-col-header{display:flex;align-items:center;gap:7px;margin-bottom:8px}
.desc-col-icon{width:24px;height:24px;border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.desc-col-title{font-weight:600;font-size:0.74rem;color:var(--text)}
.desc-col-item{display:flex;align-items:flex-start;gap:6px;font-size:0.7rem;color:var(--muted);line-height:1.5;margin-bottom:6px}
.desc-col-dot{width:4px;height:4px;border-radius:50%;flex-shrink:0;margin-top:5px}
/* ACTIONS */
.actions-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.action-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;cursor:pointer;transition:all 0.18s;position:relative;overflow:hidden}
.action-card:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(0,0,0,0.12)}
.action-icon-wrap{width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:12px}
.action-name{font-size:0.8rem;font-weight:600;margin-bottom:5px;color:var(--text);line-height:1.3}
.action-desc{font-size:0.69rem;color:var(--muted);line-height:1.5}
.action-arrow{position:absolute;top:14px;right:14px;color:var(--muted);transition:all 0.15s}
.action-card:hover .action-arrow{color:var(--text);transform:translate(2px,-2px)}
.action-bar{position:absolute;bottom:0;left:0;right:0;height:2px;transition:transform 0.22s;transform-origin:left;transform:scaleX(0)}
.action-card:hover .action-bar{transform:scaleX(1)}
/* LIENS */
.liens-container{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.liens-header{padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;background:linear-gradient(90deg,rgba(0,198,162,0.08),transparent)}
.liens-header-icon{width:30px;height:30px;border-radius:7px;background:linear-gradient(135deg,var(--accent),var(--blue));display:flex;align-items:center;justify-content:center;flex-shrink:0}
.liens-header-title{font-weight:700;font-size:0.88rem;color:var(--text)}
.liens-header-sub{font-size:0.65rem;color:var(--muted);margin-top:1px}
.liens-list{padding:8px 0}
.lien-item{display:flex;align-items:center;gap:12px;padding:10px 20px;transition:background 0.15s;border-bottom:1px solid var(--border);cursor:pointer;text-decoration:none}
.lien-item:last-child{border-bottom:none}
.lien-item:hover{background:var(--surface2)}
.lien-bullet{width:6px;height:6px;border-radius:50%;background:var(--accent);flex-shrink:0}
.lien-text{flex:1}
.lien-label{font-size:0.78rem;font-weight:500;color:var(--text);line-height:1.4}
.lien-url{font-size:0.63rem;color:var(--accent);font-family:'DM Mono',monospace;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:480px}
.lien-ext-icon{color:var(--muted);flex-shrink:0;opacity:0;transition:opacity 0.15s}
.lien-item:hover .lien-ext-icon{opacity:1}
/* MODALS */
.modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.55);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.16s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
.modal-box{background:var(--surface);border:1px solid var(--border);border-radius:12px;max-width:520px;width:100%;padding:26px;animation:slideUp 0.2s ease;box-shadow:0 20px 50px rgba(0,0,0,0.3)}
.modal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.modal-title{font-size:0.92rem;font-weight:700;color:var(--text);display:flex;align-items:center;gap:9px}
.modal-title-badge{width:24px;height:24px;border-radius:5px;background:linear-gradient(135deg,var(--accent),var(--blue));display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff}
.modal-close{width:26px;height:26px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;font-size:0.9rem}
.modal-close:hover{color:var(--text)}
.modal-divider{height:1px;background:var(--border);margin-bottom:16px}
.modal-body{font-size:0.78rem;color:var(--muted);line-height:1.75}
.modal-body strong{color:var(--text);font-weight:600}
.modal-body ul{padding-left:4px;list-style:none;display:flex;flex-direction:column;gap:6px;margin-bottom:10px}
.modal-footer{margin-top:20px;display:flex;justify-content:flex-end}
.modal-cta{padding:7px 16px;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--blue));color:#fff;font-family:'Inter',sans-serif;font-size:0.74rem;font-weight:600;border:none;cursor:pointer;transition:opacity 0.15s}
.modal-cta:hover{opacity:0.88}
/* SETTINGS MODAL */
.settings-box{background:var(--surface);border:1px solid var(--border);border-radius:14px;width:95%;max-width:680px;max-height:88vh;overflow:hidden;display:flex;flex-direction:column;animation:slideUp 0.25s ease;box-shadow:0 24px 60px rgba(0,0,0,0.4)}
.settings-header{padding:18px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.settings-title{font-weight:700;font-size:0.95rem;color:var(--text);display:flex;align-items:center;gap:10px}
.settings-badge{width:28px;height:28px;border-radius:7px;background:linear-gradient(135deg,var(--accent),var(--blue));display:flex;align-items:center;justify-content:center}
.settings-body{display:flex;flex:1;overflow:hidden}
.settings-sidebar{width:180px;border-right:1px solid var(--border);padding:12px 8px;display:flex;flex-direction:column;gap:2px;flex-shrink:0}
.settings-tab{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:8px;cursor:pointer;transition:all 0.15s;font-size:0.76rem;font-weight:500;color:var(--muted);font-family:'Inter',sans-serif;border:none;background:transparent;width:100%;text-align:left}
.settings-tab:hover{background:var(--surface2);color:var(--text)}
.settings-tab.active-tab{background:rgba(0,198,162,0.1);color:var(--accent);font-weight:600}
.settings-content{flex:1;padding:20px 24px;overflow-y:auto}
.settings-section-title{font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:14px}
.settings-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)}
.settings-row:last-child{border-bottom:none}
.settings-row-label{font-size:0.8rem;font-weight:500;color:var(--text)}
.settings-row-sub{font-size:0.68rem;color:var(--muted);margin-top:2px}
/* Toggle switch */
.toggle-sw{width:40px;height:22px;border-radius:11px;position:relative;cursor:pointer;transition:background 0.2s;flex-shrink:0;border:none;outline:none}
.toggle-sw.on{background:var(--accent)}
.toggle-sw.off{background:var(--border)}
.toggle-knob{width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:3px;transition:left 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.3)}
.toggle-sw.on .toggle-knob{left:21px}
.toggle-sw.off .toggle-knob{left:3px}
/* Support */
.support-card{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:14px}
.support-card-header{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.support-card-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.support-card-title{font-size:0.8rem;font-weight:600;color:var(--text)}
.support-card-sub{font-size:0.7rem;color:var(--muted);line-height:1.5}
.support-phone{font-size:0.88rem;font-weight:700;color:var(--accent);letter-spacing:0.03em;margin-top:6px;font-family:'DM Mono',monospace}
.support-textarea{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.76rem;font-family:'Inter',sans-serif;padding:10px 12px;outline:none;resize:none;height:90px;transition:border-color 0.15s;line-height:1.55;margin-top:10px}
.support-textarea:focus{border-color:rgba(0,198,162,0.4)}
.support-send-btn{margin-top:10px;padding:8px 18px;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--blue));color:#fff;font-size:0.74rem;font-weight:600;border:none;cursor:pointer;transition:opacity 0.15s;font-family:'Inter',sans-serif}
.support-send-btn:hover{opacity:0.88}
.support-success{display:flex;align-items:center;gap:8px;padding:10px 14px;background:rgba(0,198,162,0.1);border:1px solid rgba(0,198,162,0.25);border-radius:8px;font-size:0.76rem;color:var(--accent);font-weight:500;margin-top:10px}
/* EXPORT MODAL */
.export-box{background:var(--surface);border:1px solid var(--border);border-radius:14px;width:95%;max-width:820px;max-height:88vh;overflow:hidden;display:flex;flex-direction:column;animation:slideUp 0.25s ease;box-shadow:0 24px 60px rgba(0,0,0,0.4)}
.export-header{padding:18px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:linear-gradient(90deg,rgba(0,198,162,0.06),transparent)}
.export-upload-zone{margin:20px;border:2px dashed var(--border);border-radius:12px;padding:32px 20px;display:flex;flex-direction:column;align-items:center;gap:10px;cursor:pointer;transition:all 0.2s;background:var(--surface2)}
.export-upload-zone:hover{border-color:var(--accent);background:rgba(0,198,162,0.04)}
.export-upload-icon{width:48px;height:48px;border-radius:12px;background:rgba(0,198,162,0.1);display:flex;align-items:center;justify-content:center;color:var(--accent)}
.export-upload-label{font-size:0.82rem;font-weight:600;color:var(--text)}
.export-upload-sub{font-size:0.7rem;color:var(--muted)}
.export-table-wrap{flex:1;overflow:auto;margin:0 20px 20px;border:1px solid var(--border);border-radius:10px}
.export-table{width:100%;border-collapse:collapse;font-size:0.72rem}
.export-table th{background:var(--surface2);color:var(--muted);font-weight:600;padding:8px 14px;text-align:left;border-bottom:1px solid var(--border);font-size:0.65rem;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap}
.export-table td{padding:8px 14px;border-bottom:1px solid var(--border);color:var(--text);white-space:nowrap}
.export-table tr:last-child td{border-bottom:none}
.export-table tr:hover td{background:var(--surface2)}
.export-file-info{display:flex;align-items:center;gap:10px;margin:0 20px 12px;padding:10px 14px;background:rgba(0,198,162,0.07);border:1px solid rgba(0,198,162,0.2);border-radius:8px}
.export-file-name{font-size:0.76rem;font-weight:600;color:var(--accent)}
.export-file-sub{font-size:0.65rem;color:var(--muted);margin-top:1px}
.kpi-upload-btn{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:7px;border:1px dashed var(--accent);background:rgba(0,198,162,0.05);color:var(--accent);font-size:0.7rem;font-weight:600;cursor:pointer;transition:all 0.15s}
.kpi-upload-btn:hover{background:rgba(0,198,162,0.12)}
/* Color picker apparence */
.theme-options{display:flex;gap:10px;flex-wrap:wrap}
.theme-option{display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;padding:10px 14px;border-radius:10px;border:2px solid var(--border);transition:all 0.15s;min-width:80px}
.theme-option:hover{border-color:var(--accent)}
.theme-option.selected{border-color:var(--accent);background:rgba(0,198,162,0.08)}
.theme-preview{width:40px;height:28px;border-radius:6px;border:1px solid var(--border)}
.theme-label{font-size:0.68rem;font-weight:500;color:var(--text)}
@media(max-width:1100px){.desc-cols{grid-template-columns:1fr}.welcome-banner{flex-direction:column}.chatbot-tip{max-width:100%}}
@media(max-width:768px){.actions-grid{grid-template-columns:1fr}.acronym-grid{grid-template-columns:1fr}.content{padding:12px}.settings-body{flex-direction:column}.settings-sidebar{width:100%;flex-direction:row;flex-wrap:wrap;border-right:none;border-bottom:1px solid var(--border)}}
`}</style>

<div className={`layout ${dark?"dark-theme":"light-theme"}`}>

{/* ══ MODALE KPI ══ */}
{showKPI&&(
<div className="modal-overlay" onClick={()=>setShowKPI(false)}>
<div onClick={e=>e.stopPropagation()} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,width:"95%",maxWidth:820,maxHeight:"90vh",overflowY:"auto",padding:24,animation:"slideUp 0.2s ease",boxShadow:"0 20px 50px rgba(0,0,0,0.35)"}}>
<div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18}}>
<div style={{display:"flex",alignItems:"center",gap:10}}>
<div className="modal-title-badge" style={{width:34,height:34,fontSize:10}}>KPI</div>
<div><div style={{fontWeight:700,fontSize:"0.9rem",color:"var(--text)"}}>{t.home.kpi_title}</div><div style={{fontSize:"0.66rem",color:"var(--muted)",marginTop:2}}>JANUARY 2026</div></div>
</div>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<label className="kpi-upload-btn">
<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
{kpiLoading?t.home.kpi_loading:kpiFileName||t.home.kpi_upload}
<input ref={fileInputRef} type="file" accept=".xlsx,.xls" style={{display:"none"}} onChange={handleKpiUpload}/>
</label>
<button className="modal-close" onClick={()=>setShowKPI(false)}>×</button>
</div>
</div>
<div style={{height:1,background:"var(--border)",marginBottom:18}}/>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
{[{label:"Total",value:kpiData.total,color:"#3D8EF5"},{label:"Published",value:kpiData.published,color:"#00C6A2"},{label:"On going",value:kpiData.ongoing,color:"#F5A623"},{label:"Cancelled",value:kpiData.cancelled,color:"#FF6B6B"}].map(s=>(
<div key={s.label} style={{background:"var(--surface2)",border:`1px solid ${s.color}35`,borderRadius:8,padding:"12px",textAlign:"center"}}>
<div style={{fontSize:"0.6rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{s.label}</div>
<div style={{fontSize:"1.7rem",fontWeight:700,color:s.color}}>{s.value}</div>
</div>
))}
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
<PieChartSVG data={kpiData.approved_target} title="PROGRESS ON THE APPROVED TARGET"/>
<PieChartSVG data={kpiData.applicable_target} title="PROGRESS ON THE APPLICABLE TARGET"/>
</div>
</div>
</div>
)}

{/* ══ MODAL ABOUT ══ */}
{showAbout&&(
<div className="modal-overlay" onClick={()=>setShowAbout(false)}>
<div className="modal-box" onClick={e=>e.stopPropagation()}>
<div className="modal-header"><div className="modal-title"><div className="modal-title-badge">GF</div>{t.home.about_title}</div><button className="modal-close" onClick={()=>setShowAbout(false)}>×</button></div>
<div className="modal-divider"/>
<div className="modal-body" dangerouslySetInnerHTML={{__html:t.home.about_body}}/>
<div className="modal-footer"><button className="modal-cta" onClick={()=>setShowAbout(false)}>{t.home.about_close}</button></div>
</div>
</div>
)}

{/* ══ MODAL TEAM ══ */}
{showTeam&&(
<div className="modal-overlay" onClick={()=>setShowTeam(false)}>
<div className="modal-box" onClick={e=>e.stopPropagation()}>
<div className="modal-header">
<div className="modal-title">
<div className="modal-title-badge" style={{background:"linear-gradient(135deg,#3D8EF5,#9B8CFF)"}}>GF</div>
{t.home.team_title}
</div>
<button className="modal-close" onClick={()=>setShowTeam(false)}>×</button>
</div>
<div className="modal-divider"/>
<div className="modal-body">
<p style={{marginBottom:12}}>{lang==="fr"?"L'équipe":"The"} <strong>GFST</strong> {lang==="fr"?"est composée d'experts en standardisation des fixations.":"team consists of fastener standardisation experts."}</p>
<ul style={{gap:8}}>
{TEAM_MEMBERS.map((m,i)=>(
<li key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:"var(--surface2)",borderRadius:8,border:"1px solid var(--border)"}}>
<span style={{fontSize:"1rem"}}>{m.emoji}</span>
<span><strong>{m.name}</strong> — {m.role}</span>
</li>
))}
</ul>
</div>
<div className="modal-footer">
<button className="modal-cta" style={{background:"linear-gradient(135deg,#3D8EF5,#9B8CFF)"}} onClick={()=>setShowTeam(false)}>{t.home.about_close}</button>
</div>
</div>
</div>
)}

{/* ══ MODAL IMPORT ══ */}
{showExport&&(
<div className="modal-overlay" onClick={resetImportModal}>
<div className="export-box" onClick={e=>e.stopPropagation()}>
<div className="export-header">
<div style={{display:"flex",alignItems:"center",gap:10}}>
<div className="modal-title-badge" style={{width:32,height:32}}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
</div>
<div>
<div style={{fontWeight:700,fontSize:"0.9rem",color:"var(--text)"}}>{lang==="fr"?"Importer les données":"Import data"}</div>
<div style={{fontSize:"0.65rem",color:"var(--muted)",marginTop:1}}>{lang==="fr"?"Importez un fichier pour le visualiser":"Import a file to preview it"}</div>
</div>
</div>
<button className="modal-close" onClick={resetImportModal}>×</button>
</div>

{!exportFile?(
<label className="export-upload-zone">
<div className="export-upload-icon">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
</div>
<div className="export-upload-label">{lang==="fr"?"Cliquez pour importer un fichier":"Click to import a file"}</div>
<div className="export-upload-sub">CSV, Excel (.xlsx, .xls), TXT</div>
<input ref={exportInputRef} type="file" accept=".csv,.xlsx,.xls,.txt" style={{display:"none"}} onChange={handleExportFile}/>
</label>
):(
<>
<div className="export-file-info">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
<div>
<div className="export-file-name">{exportFile.name}</div>
<div className="export-file-sub">{(exportFile.size/1024).toFixed(1)} KB — {Math.max(exportPreview.length-1,0)} {lang==="fr"?"lignes":"rows"}</div>
</div>
<label style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:7,border:"1px solid var(--border)",background:"var(--surface2)",fontSize:"0.7rem",color:"var(--muted)",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.86"/></svg>
{lang==="fr"?"Changer":"Change"}
<input type="file" accept=".csv,.xlsx,.xls,.txt" style={{display:"none"}} onChange={handleExportFile}/>
</label>
</div>
{exportLoading?(
<div style={{padding:"30px",textAlign:"center",color:"var(--muted)",fontSize:"0.8rem"}}>{lang==="fr"?"Chargement...":"Loading..."}</div>
):(
<div className="export-table-wrap">
<table className="export-table">
<thead>
<tr>{exportPreview[0]?.map((h,i)=><th key={i}>{h||`Col ${i+1}`}</th>)}</tr>
</thead>
<tbody>
{exportPreview.slice(1).map((row,i)=>(
<tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>
))}
</tbody>
</table>
</div>
)}

{/* Commentaire obligatoire */}
<div style={{margin:"0 20px 14px"}}>
<label style={{fontSize:"0.68rem",fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>
{lang==="fr"?"Description / raison de l'import":"Description / reason for the import"}
{" "}<span style={{color:"var(--danger)"}}>*</span>
</label>
<textarea
value={exportComment}
onChange={e=>{setExportComment(e.target.value); if(exportError) setExportError("");}}
placeholder={lang==="fr"?"Obligatoire : expliquez pourquoi vous importez ce fichier...":"Required: explain why you're importing this file..."}
rows={2}
required
style={{width:"100%",resize:"vertical",background:"var(--surface2)",border:`1px solid ${!exportComment.trim()&&exportError?"var(--danger)":"var(--border)"}`,borderRadius:8,padding:"8px 10px",fontSize:"0.75rem",color:"var(--text)",fontFamily:"Inter,sans-serif"}}
/>
<div style={{fontSize:"0.62rem",color:"var(--muted)",marginTop:4}}>
{lang==="fr"?"Ce champ est obligatoire pour tout import de fichier.":"This field is required for every file import."}
</div>
</div>

{exportError&&(
<div style={{margin:"0 20px 12px",padding:"8px 12px",borderRadius:8,background:"rgba(255,107,107,0.1)",border:"1px solid rgba(255,107,107,0.3)",color:"var(--danger)",fontSize:"0.72rem"}}>
{exportError}
</div>
)}

<div style={{display:"flex",alignItems:"center",gap:10,margin:"0 20px 20px"}}>
{exportSaved?(
<div style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.75rem",color:"var(--accent)",fontWeight:600}}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
{lang==="fr"?"Fichier enregistré avec succès.":"File saved successfully."}
</div>
):(
<button
onClick={handleSaveImport}
disabled={exportSaving||exportLoading||!exportComment.trim()}
style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:8,border:"none",background:(exportSaving||!exportComment.trim())?"var(--muted)":"var(--accent)",color:"#fff",fontSize:"0.8rem",fontWeight:600,cursor:(exportSaving||!exportComment.trim())?"default":"pointer",fontFamily:"Inter,sans-serif"}}
>
{exportSaving?(lang==="fr"?"Enregistrement...":"Saving..."):(lang==="fr"?"Enregistrer":"Save")}
</button>
)}
{exportSaved&&(
<button onClick={resetImportModal} style={{marginLeft:"auto",padding:"9px 18px",borderRadius:8,border:"1px solid var(--border)",background:"transparent",color:"var(--text)",fontSize:"0.8rem",fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
{lang==="fr"?"Terminer":"Finish"}
</button>
)}
</div>
</>
)}
</div>
</div>
)}

{/* ══ MODAL PARAMÈTRES ══ */}
{showSettings&&(
<div className="modal-overlay" onClick={()=>setShowSettings(false)}>
<div className="settings-box" onClick={e=>e.stopPropagation()}>
<div className="settings-header">
<div className="settings-title">
<div className="settings-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
{lang==="fr"?"Paramètres":"Settings"}
</div>
<button className="modal-close" onClick={()=>setShowSettings(false)}>×</button>
</div>

<div className="settings-body">
<div className="settings-sidebar">
{SETTINGS_TABS.map(tab=>(
<button key={tab.id} className={`settings-tab${settingsTab===tab.id?" active-tab":""}`} onClick={()=>{setSettingsTab(tab.id as any); if(tab.id==="imports") loadImportsHistory();}}>
{tab.icon}{tab.label}
</button>
))}
</div>

<div className="settings-content">

{settingsTab==="general"&&(
<div>
<div className="settings-section-title">{lang==="fr"?"Informations générales":"General information"}</div>
<div className="settings-row">
<div><div className="settings-row-label">{lang==="fr"?"Langue de l'interface":"Interface language"}</div><div className="settings-row-sub">{lang==="fr"?"Langue actuellement utilisée":"Currently used language"}</div></div>
<div className="lang-switcher">{(["fr","en"] as Lang[]).map(l=><button key={l} className={`lang-btn${lang===l?" active-lang":""}`} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>)}</div>
</div>
<div className="settings-row">
<div><div className="settings-row-label">{lang==="fr"?"Version de la plateforme":"Platform version"}</div><div className="settings-row-sub">GFST v4.2.1 — Build 2026.05</div></div>
<span style={{fontSize:"0.7rem",background:"rgba(0,198,162,0.1)",color:"var(--accent)",padding:"3px 9px",borderRadius:20,fontWeight:600}}>Stable</span>
</div>
<div className="settings-row">
<div><div className="settings-row-label">{lang==="fr"?"Serveur actif":"Active server"}</div><div className="settings-row-sub">PROD-01 — Région Europe</div></div>
<span style={{fontSize:"0.7rem",color:"#00C6A2",fontWeight:600,display:"flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:"#00C6A2",display:"inline-block"}}/>Online</span>
</div>
<div className="settings-row">
<div><div className="settings-row-label">{lang==="fr"?"Dernière synchronisation":"Last sync"}</div><div className="settings-row-sub">{lang==="fr"?"Il y a 4 minutes":"4 minutes ago"}</div></div>
<button style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:7,border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",fontSize:"0.7rem",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.86"/></svg>
{lang==="fr"?"Sync":"Sync"}
</button>
</div>
</div>
)}

{settingsTab==="apparence"&&(
<div>
<div className="settings-section-title">{lang==="fr"?"Thème":"Theme"}</div>
<div className="theme-options" style={{marginBottom:20}}>
<div className={`theme-option${dark?" selected":""}`} onClick={()=>setDark(true)}>
<div className="theme-preview" style={{background:"#0D1117",border:"1px solid #30363D"}}/>
<span className="theme-label">{lang==="fr"?"Sombre":"Dark"}</span>
{dark&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
</div>
<div className={`theme-option${!dark?" selected":""}`} onClick={()=>setDark(false)}>
<div className="theme-preview" style={{background:"#F5F7FA",border:"1px solid #E1E4E8"}}/>
<span className="theme-label">{lang==="fr"?"Clair":"Light"}</span>
{!dark&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
</div>
</div>
<div className="settings-section-title">{lang==="fr"?"Interface":"Interface"}</div>
<div className="settings-row">
<div><div className="settings-row-label">{lang==="fr"?"Sidebar ouverte par défaut":"Sidebar open by default"}</div></div>
<button className={`toggle-sw ${sidebarOpen?"on":"off"}`} onClick={()=>setSidebarOpen(!sidebarOpen)}>
<div className="toggle-knob"/>
</button>
</div>
</div>
)}

{settingsTab==="notifications"&&(
<div>
<div className="settings-section-title">{lang==="fr"?"Canaux de notification":"Notification channels"}</div>
<div className="settings-row">
<div><div className="settings-row-label">{lang==="fr"?"Notifications par email":"Email notifications"}</div><div className="settings-row-sub">{lang==="fr"?"Recevoir les alertes par email":"Receive alerts by email"}</div></div>
<button className={`toggle-sw ${notifEmail?"on":"off"}`} onClick={()=>setNotifEmail(!notifEmail)}><div className="toggle-knob"/></button>
</div>
<div className="settings-row">
<div><div className="settings-row-label">{lang==="fr"?"Notifications push":"Push notifications"}</div><div className="settings-row-sub">{lang==="fr"?"Alertes en temps réel dans l'interface":"Real-time alerts in the interface"}</div></div>
<button className={`toggle-sw ${notifPush?"on":"off"}`} onClick={()=>setNotifPush(!notifPush)}><div className="toggle-knob"/></button>
</div>
<div className="settings-row">
<div><div className="settings-row-label">{lang==="fr"?"Rapport hebdomadaire":"Weekly report"}</div><div className="settings-row-sub">{lang==="fr"?"Résumé chaque lundi matin":"Summary every Monday morning"}</div></div>
<button className={`toggle-sw ${notifWeekly?"on":"off"}`} onClick={()=>setNotifWeekly(!notifWeekly)}><div className="toggle-knob"/></button>
</div>
<div className="settings-section-title" style={{marginTop:20}}>{lang==="fr"?"Événements":"Events"}</div>
{[
{label:lang==="fr"?"Nouvelle demande créée":"New request created",on:true},
{label:lang==="fr"?"Demande validée / rejetée":"Request validated / rejected",on:true},
{label:lang==="fr"?"Mise à jour d'un standard":"Standard updated",on:false},
{label:lang==="fr"?"Maintenance planifiée":"Planned maintenance",on:true},
].map((ev,i)=>(
<div key={i} className="settings-row">
<div className="settings-row-label">{ev.label}</div>
<button className={`toggle-sw ${ev.on?"on":"off"}`}><div className="toggle-knob"/></button>
</div>
))}
</div>
)}

{settingsTab==="support"&&(
<div>
<div className="settings-section-title">{lang==="fr"?"Contacter le support":"Contact support"}</div>
<div className="support-card">
<div className="support-card-header">
<div className="support-card-icon" style={{background:"rgba(0,198,162,0.12)",color:"#00C6A2"}}>
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4a2 2 0 0 1 1.95-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
</div>
<div className="support-card-title">{lang==="fr"?"Support GFST — Contact 1":"GFST Support — Contact 1"}</div>
</div>
<div className="support-card-sub">{lang==="fr"?"Disponible du lundi au vendredi, 8h–18h":"Available Monday to Friday, 8am–6pm"}</div>
<div className="support-phone">📞 06 97 49 81 08</div>
</div>
<div className="support-card">
<div className="support-card-header">
<div className="support-card-icon" style={{background:"rgba(61,142,245,0.12)",color:"#3D8EF5"}}>
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4a2 2 0 0 1 1.95-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
</div>
<div className="support-card-title">{lang==="fr"?"Support GFST — Contact 2":"GFST Support — Contact 2"}</div>
</div>
<div className="support-card-sub">{lang==="fr"?"Urgences et escalades":"Emergencies and escalations"}</div>
<div className="support-phone">📞 06 75 31 42 22</div>
</div>
<div className="settings-section-title" style={{marginTop:6}}>{lang==="fr"?"Envoyer un message":"Send a message"}</div>
<textarea
className="support-textarea"
placeholder={lang==="fr"?"Décrivez votre problème ou votre question...":"Describe your issue or question..."}
value={supportMsg}
onChange={e=>{setSupportMsg(e.target.value);setSupportSent(false);}}
/>
<button className="support-send-btn" onClick={()=>{if(supportMsg.trim()){setSupportSent(true);setSupportMsg("");}}}>
{lang==="fr"?"Envoyer au support":"Send to support"}
</button>
{supportSent&&(
<div className="support-success">
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
{lang==="fr"?"Message envoyé ! Le support vous répondra sous 24h.":"Message sent! Support will reply within 24h."}
</div>
)}
</div>
)}


</div>
</div>
</div>
</div>
)}

{/* ══════════ SIDEBAR ══════════ */}
<aside className={`sidebar${sidebarOpen?"":" closed"}`}>
<div className="sidebar-logo">
<div className="logo-badge"><span className="logo-badge-text">GF</span></div>
<div>
<div className="logo-text"><span style={{color:"var(--accent)"}}>G</span><span style={{color:"var(--blue)"}}>F</span><span style={{color:"var(--blue)"}}>S</span><span style={{color:"#F5A623"}}>T</span></div>
<div className="logo-sub">{t.home.logo_acronym}</div>
</div>
</div>
<nav className="sidebar-nav">
<div className="nav-section-label">{t.nav.gestion}</div>
{SIDEBAR_NAV.map((item:any)=>(
<div key={item.label} className="nav-item" onClick={()=>{
if(item.action==="settings"){setShowSettings(true);}
else if(item.action==="import"){setShowExport(true);}
else if(item.action==="liens"){goSlide(4);}
else if(item.route){router.push(item.route);}
}}>
<div className="nav-icon" style={{background:`${item.color}15`,color:item.color}}>{item.icon}</div>
<div className="nav-label">{item.label}</div>
{chevron}
</div>
))}
</nav>
</aside>

{/* ══════════ MAIN ══════════ */}
<main className={`main${sidebarOpen?"":" expanded"}`}>
<header className="topbar">
<div className="topbar-left">
{/* Toggle burger */}
<div className="topbar-toggle-wrap">
<button className="toggle-btn" onClick={()=>setSidebarOpen(!sidebarOpen)}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
</button>
</div>
{/* Breadcrumb — no duplicate GFST label */}
<div className="breadcrumb">
<span className="bc-root">GFST</span>
<span className="bc-sep">/</span>
<span className="bc-current">{slideLabels[currentSlide]}</span>
</div>
</div>
<div className="topbar-actions">
<button className="topbar-text-btn about-btn-style" onClick={()=>setShowAbout(true)}>
<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{t.home.about_btn}
</button>
<button className="topbar-text-btn team-btn" onClick={()=>setShowTeam(true)}>
<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>{t.home.team_btn}
</button>
<button
  className={`icon-btn${notifPush?" notif-active":""}`}
  onClick={()=>{setSettingsTab("notifications");setShowSettings(true);}}
  title={lang==="fr"?"Gérer les notifications":"Manage notifications"}
>
  {notifPush&&<div className="notif-dot"/>}
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
</button>
<button className="icon-btn" onClick={()=>setDark(!dark)}>{dark?<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}</button>
<div className="lang-switcher">{(["fr","en"] as Lang[]).map(l=><button key={l} className={`lang-btn${lang===l?" active-lang":""}`} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>)}</div>
</div>
</header>

<div className="content">
{/* Nav slides */}
<div className="pres-nav">
<div className="pres-nav-tabs">{slideLabels.map((label,i)=><button key={i} className={`pres-tab${currentSlide===i?" active":""}`} onClick={()=>goSlide(i)}>{label}</button>)}</div>
<span className="pres-counter">{currentSlide+1} / {SLIDES.length}</span>
<div className="pres-arrows">
<button className="pres-arrow" onClick={prevSlide} disabled={currentSlide===0}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
<button className="pres-arrow" onClick={nextSlide} disabled={currentSlide===SLIDES.length-1}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
</div>
</div>

<div className="slide-wrap">
<div className={`slide-inner ${animating?(animDir==="right"?"exit-left":"exit-right"):"enter"}`}>

{/* SLIDE 0 — WELCOME */}
{currentSlide===0&&(
<div className="welcome-banner">
<div><div className="banner-title">{t.home.welcome} <span className="banner-accent">{t.home.platform}</span></div><div className="banner-sub">{t.home.sub}</div></div>
<div className="chatbot-tip"><span className="tip-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span>{t.home.chatbot_tip}</div>
</div>
)}

{/* SLIDE 1 — ACRONYM */}
{currentSlide===1&&(
<div>
<div style={{fontSize:"0.66rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>{t.home.acronym_title}</div>
<div className="acronym-grid">

{/* ── Carte G — back KPI spécial ── */}
<div className="ac-card" style={{borderColor:"#00C6A235"}}>
<div className="ac-front">
<div className="ac-letter-block">
<span className="ac-highlight" style={{color:"#00C6A2"}}>G</span>
<span className="ac-normal">lobal</span>
</div>
<div className="ac-word">Global</div>
<div className="ac-desc">{lang==="fr"?"Un référentiel commun à tous les sites et équipes":"A shared reference across all sites and teams"}</div>
<div className="ac-hover-hint">{lang==="fr"?"Survolez pour voir les KPI":"Hover to see KPIs"}</div>
</div>
<div className="ac-back">
<div className="ac-back-header">
<span className="ac-back-emoji">📊</span>
<span className="ac-back-title" style={{color:"#00C6A2"}}>
{lang==="fr"?"KPI — Base de données":"KPI — Standard Database"}
</span>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
{[
{label:"Total", value:kpiData.total, color:"#3D8EF5"},
{label:"Published",value:kpiData.published, color:"#00C6A2"},
{label:"On going", value:kpiData.ongoing, color:"#F5A623"},
{label:"Cancelled",value:kpiData.cancelled, color:"#FF6B6B"},
].map(s=>(
<div key={s.label} style={{background:"var(--surface)",borderRadius:7,padding:"7px 8px",textAlign:"center",border:`1px solid ${s.color}30`}}>
<div style={{fontSize:"1.2rem",fontWeight:700,color:s.color,lineHeight:1}}>{s.value}</div>
<div style={{fontSize:"0.55rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.07em",marginTop:3}}>{s.label}</div>
</div>
))}
</div>
<div
onClick={()=>setShowKPI(true)}
style={{fontSize:"0.6rem",color:"var(--muted)",textAlign:"center",fontStyle:"italic",marginTop:4,cursor:"pointer",transition:"color 0.15s"}}
onMouseEnter={e=>(e.currentTarget.style.color="var(--accent)")}
onMouseLeave={e=>(e.currentTarget.style.color="var(--muted)")}
>
{lang==="fr"?"→ Voir le détail complet":"→ View full detail"}
</div>
</div>
<div className="ac-bar" style={{background:"#00C6A2"}}/>
</div>

{/* ── Cartes F et T ── */}
{ACRONYM_DATA.filter((_,i)=>i>0).map((a,i)=>(
<div key={i} className="ac-card" style={{borderColor:`${a.color}35`,minHeight: a.letter==="T"?240:210}}>
<div className="ac-front">
<div className="ac-letter-block">
{a.letter==="F"
?<><span className="ac-highlight" style={{color:a.color}}>F</span><span className="ac-normal">as</span><span className="ac-highlight" style={{color:a.color}}>T</span><span className="ac-normal">eners</span></>
:<><span className="ac-highlight" style={{color:a.color}}>{a.letter}</span><span className="ac-normal">{a.rest}</span></>
}
</div>
<div className="ac-word">{a.word}</div>
<div className="ac-desc">{a.desc}</div>
<div className="ac-hover-hint">{lang==="fr"?"Survolez pour en savoir plus":"Hover to learn more"}</div>
</div>
<div className="ac-back">
<div className="ac-back-header">
<span className="ac-back-emoji">{a.hover.icon}</span>
<span className="ac-back-title" style={{color:a.color}}>{a.hover.title}</span>
</div>
<div className="ac-back-items">
{a.hover.items.map((item,j)=>(
<div key={j} className="ac-back-item">
<span className="ac-back-dot" style={{background:a.color}}/>
<span>{item}</span>
</div>
))}
</div>
</div>
<div className="ac-bar" style={{background:a.color}}/>
</div>
))}

</div>
</div>
)}

{/* SLIDE 2 — DESC */}
{currentSlide===2&&(
<div className="desc-section">
<div className="desc-title"><span className="desc-title-dot"/>{t.home.gfst_desc_title}</div>
<div className="desc-body" dangerouslySetInnerHTML={{__html:t.home.gfst_desc_body}}/>
<div className="desc-cols">
<div className="desc-col">
<div className="desc-col-header"><div className="desc-col-icon" style={{background:"rgba(0,198,162,0.12)",color:"#00C6A2"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div className="desc-col-title">{t.home.gfst_principe_title}</div></div>
<div className="desc-col-item"><span className="desc-col-dot" style={{background:"#00C6A2"}}/><span>{t.home.gfst_principe}</span></div>
</div>
<div className="desc-col">
<div className="desc-col-header"><div className="desc-col-icon" style={{background:"rgba(61,142,245,0.12)",color:"#3D8EF5"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div className="desc-col-title">{t.home.gfst_pour_qui_title}</div></div>
{[t.home.gfst_pour_qui_1,t.home.gfst_pour_qui_2,t.home.gfst_pour_qui_3].map((item,i)=><div className="desc-col-item" key={i}><span className="desc-col-dot" style={{background:"#3D8EF5"}}/><span>{item}</span></div>)}
</div>
<div className="desc-col">
<div className="desc-col-header"><div className="desc-col-icon" style={{background:"rgba(245,166,35,0.12)",color:"#F5A623"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div><div className="desc-col-title">{t.home.gfst_pourquoi_title}</div></div>
{[t.home.gfst_pourquoi_1,t.home.gfst_pourquoi_2,t.home.gfst_pourquoi_3,t.home.gfst_pourquoi_4].map((item,i)=><div className="desc-col-item" key={i}><span className="desc-col-dot" style={{background:"#F5A623"}}/><span>{item}</span></div>)}
</div>
</div>
</div>
)}

{/* SLIDE 3 — ACTIONS */}
{currentSlide===3&&(
<div>
<div style={{fontSize:"0.66rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>{t.home.actions_title}</div>
<div className="actions-grid">
{NAV_ACTIONS.map(item=>(
<div key={item.id} className="action-card" onClick={()=>item.route?router.push(item.route):null}>
<div className="action-icon-wrap" style={{background:`${item.color}15`,color:item.color}}>{item.icon}</div>
<div className="action-bar" style={{background:item.color}}/>
<div className="action-name">{item.label}</div>
<div className="action-desc">{item.desc}</div>
<div className="action-arrow"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></div>
</div>
))}
</div>
</div>
)}

{/* SLIDE 4 — LIENS */}
{currentSlide===4&&(
<div className="liens-container">
<div className="liens-header">
<div className="liens-header-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></div>
<div><div className="liens-header-title">{t.home.liens_utiles}</div><div className="liens-header-sub">{lang==="fr"?`${LIENS_DATA.length} ressources disponibles`:`${LIENS_DATA.length} resources available`}</div></div>
</div>
<div className="liens-list">
{LIENS_DATA.map((lien,i)=>(
<a key={i} href={lien.url} target="_blank" rel="noopener noreferrer" className="lien-item">
<span className="lien-bullet"/>
<div className="lien-text"><div className="lien-label">{lien.label}</div><div className="lien-url">{lien.url}</div></div>
<span className="lien-ext-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
</a>
))}
</div>
</div>
)}
</div>
</div>
</div>
</main>
</div>
<ChatbotGFST lang={lang}/>
</>
);
}