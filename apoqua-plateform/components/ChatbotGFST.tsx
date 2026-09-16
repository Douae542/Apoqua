"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
role: "user" | "assistant";
content: string;
time: string;
}

const RobotSVG = ({ size = 70 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
{/* Antennes */}
<line x1="42" y1="16" x2="36" y2="4" stroke="#1A9FD4" strokeWidth="3" strokeLinecap="round"/>
<circle cx="34" cy="3" r="4" fill="#00C6D4"/>
<line x1="78" y1="16" x2="84" y2="4" stroke="#1A9FD4" strokeWidth="3" strokeLinecap="round"/>
<circle cx="86" cy="3" r="4" fill="#00C6D4"/>
{/* Oreillettes */}
<ellipse cx="17" cy="46" rx="7" ry="11" fill="#1A9FD4" stroke="#0D2137" strokeWidth="2.5"/>
<ellipse cx="103" cy="46" rx="7" ry="11" fill="#1A9FD4" stroke="#0D2137" strokeWidth="2.5"/>
{/* Tête */}
<rect x="24" y="14" width="72" height="58" rx="18" fill="#D8EEF7" stroke="#0D2137" strokeWidth="3"/>
{/* Visière */}
<rect x="32" y="26" width="56" height="28" rx="9" fill="#0D2137"/>
{/* Yeux */}
<circle cx="48" cy="40" r="7" fill="#00C6D4"/>
<circle cx="72" cy="40" r="7" fill="#00C6D4"/>
<circle cx="50" cy="38" r="2.5" fill="white"/>
<circle cx="74" cy="38" r="2.5" fill="white"/>
{/* Sourire */}
<path d="M50 50 Q60 57 70 50" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
{/* Micro */}
<path d="M24 54 Q14 60 16 66" stroke="#0D2137" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
<circle cx="15" cy="68" r="3.5" fill="#1A9FD4" stroke="#0D2137" strokeWidth="1.5"/>
{/* Corps */}
<rect x="30" y="76" width="60" height="36" rx="10" fill="#D8EEF7" stroke="#0D2137" strokeWidth="3"/>
{/* Boutons corps */}
<circle cx="46" cy="90" r="5" fill="#1A9FD4" stroke="#0D2137" strokeWidth="1.5"/>
<circle cx="60" cy="90" r="5" fill="#0D2137"/>
<circle cx="74" cy="90" r="5" fill="#1A9FD4" stroke="#0D2137" strokeWidth="1.5"/>
{/* Laptop */}
<rect x="14" y="104" width="92" height="13" rx="4" fill="#1A9FD4" stroke="#0D2137" strokeWidth="2.5"/>
<circle cx="60" cy="110.5" r="2.5" fill="#0D2137"/>
</svg>
);

const RobotIconSmall = () => (
<svg width="16" height="16" viewBox="0 0 120 120" fill="none">
<rect x="24" y="14" width="72" height="58" rx="18" fill="#D8EEF7" stroke="#0D2137" strokeWidth="4"/>
<rect x="32" y="26" width="56" height="28" rx="9" fill="#0D2137"/>
<circle cx="48" cy="40" r="7" fill="#00C6D4"/>
<circle cx="72" cy="40" r="7" fill="#00C6D4"/>
<circle cx="50" cy="38" r="2.5" fill="white"/>
<circle cx="74" cy="38" r="2.5" fill="white"/>
<path d="M50 50 Q60 57 70 50" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
</svg>
);

const UserIcon = () => (
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
<circle cx="12" cy="7" r="4"/>
</svg>
);

export default function ChatbotGFST({ lang = "fr" }: { lang?: "fr" | "en" }) {
const [open, setOpen] = useState(false);
const [messages, setMessages] = useState<Message[]>([{
role: "assistant",
content: lang === "fr"
? "Bonjour ! Je suis l'assistant GFST propulsé par  openAI. Comment puis-je vous aider ?"
: "Hello! I am the GFST assistant powered by openAI. How can I help you?",
time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
}]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [sessionExpired, setSessionExpired] = useState(false);
const [sessionId, setSessionId] = useState("");
const bottomRef = useRef<HTMLDivElement>(null);
const textareaRef = useRef<HTMLTextAreaElement>(null);

useEffect(() => {
  setSessionId("sess_" + Math.random().toString(36).substring(2, 11));
}, []);

useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

useEffect(() => {
if (textareaRef.current) {
textareaRef.current.style.height = "auto";
textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 80) + "px";
}
}, [input]);

async function sendMessage() {
if (!input.trim() || loading) return;
const userMsg: Message = { role: "user", content: input.trim(), time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) };
setMessages(prev => [...prev, userMsg]);
setInput("");
setLoading(true);
try {
const token = localStorage.getItem("gfst_token");
if (!token) {
setMessages(prev => [...prev, { role: "assistant", content: "Vous devez être connecté pour utiliser l'assistant.", time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }]);
setLoading(false); return;
}
const historique = messages.map(m => ({ role: m.role, content: m.content }));
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 20000);
const res = await fetch("http://localhost:8000/api/chatbot/", {
method: "POST",
headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
body: JSON.stringify({ 
  message: userMsg.content, 
  historique,
  session_id: sessionId 
}),
signal: controller.signal
});
clearTimeout(timeoutId);
if (res.status === 401) {
setMessages(prev => [...prev, { role: "assistant", content: "Session expirée. Veuillez vous reconnecter.", time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }]);
setLoading(false); return;
}
const data = await res.json();
setMessages(prev => [...prev, { role: "assistant", content: data.reponse || "Désolé, erreur de réponse.", time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }]);
} catch (err: any) {
setMessages(prev => [...prev, { role: "assistant", content: err.name === "AbortError" ? "La réponse a pris trop de temps. Réessayez." : "Erreur de connexion au serveur.", time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }]);
} finally { setLoading(false); }
}

async function clearChat() {
  if (sessionId) {
    try {
      await fetch(`http://localhost:8000/api/session/close-session/${sessionId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Erreur lors du nettoyage de la session côté serveur:", error);
    }
  }

  setMessages([{ 
    role: "assistant", 
    content: lang === "fr" ? "Bonjour ! Je suis l'assistant GFST. Comment puis-je vous aider ?" : "Hello! I am the GFST assistant. How can I help you?", 
    time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) 
  }]);
  setSessionExpired(false);

  setSessionId("sess_" + Math.random().toString(36).substring(2, 11));
}

const suggestions = lang === "fr"
? ["Combien de fiches sont approved ?", "Comment créer une nouvelle fiche ?", "Expliquer les rôles"]
: ["How many records are approved?", "How to create a new record?", "Explain roles"];

return (
<>
<style>{`
.chat-fab {
position: fixed; bottom: 16px; right: 20px;
background: transparent; border: none; cursor: pointer;
z-index: 9999; display: flex; flex-direction: column;
align-items: center; padding: 0;
transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
filter: drop-shadow(0 8px 20px rgba(0,198,212,0.5));
}
.chat-fab:hover { transform: translateY(-4px) scale(1.05); filter: drop-shadow(0 14px 30px rgba(0,198,212,0.7)); }
.chat-robot-wrap { animation: robotFloat 3s ease-in-out infinite; position: relative; }
@keyframes robotFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
.chat-fab-notif {
position: absolute; top: -2px; right: -4px;
width: 18px; height: 18px; background: #FF6B6B;
border-radius: 50%; font-size: 9px; color: #fff;
display: flex; align-items: center; justify-content: center;
font-weight: 700; font-family: 'Inter',sans-serif;
animation: fabPulse 2s infinite; z-index: 1;
}
@keyframes fabPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.25)} }
.chat-bubble-tip {
background: #161B22; border: 1px solid rgba(0,198,212,0.35);
border-radius: 10px 10px 2px 10px; padding: 5px 10px;
font-size: 0.68rem; color: #00C6D4; font-family: 'Inter',sans-serif;
font-weight: 600; white-space: nowrap; margin-bottom: 6px;
box-shadow: 0 4px 14px rgba(0,0,0,0.35);
animation: bubbleIn 0.4s ease;
}
@keyframes bubbleIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
.chat-window {
position: fixed; bottom: 106px; right: 20px;
width: 390px; height: 540px; background: #161B22;
border: 1px solid rgba(255,255,255,0.08); border-radius: 18px;
display: flex; flex-direction: column; z-index: 9999;
box-shadow: 0 24px 64px rgba(0,0,0,0.6);
animation: chatIn 0.3s cubic-bezier(0.34,1.56,0.64,1); overflow: hidden;
font-family: 'Inter',sans-serif;
}
@keyframes chatIn { from{opacity:0;transform:translateY(20px) scale(0.93)}to{opacity:1;transform:translateY(0) scale(1)} }
.chat-header {
padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.06);
display: flex; align-items: center; justify-content: space-between;
background: linear-gradient(135deg,rgba(0,198,212,0.12),rgba(61,142,245,0.08)); flex-shrink: 0;
}
.chat-header-left { display:flex;align-items:center;gap:10px; }
.chat-avatar-sm-wrap { width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#00C6D4,#3D8EF5);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.chat-name { font-size:0.84rem;font-weight:700;color:#E6EDF3; }
.chat-status { font-size:0.63rem;color:#00C6D4;display:flex;align-items:center;gap:5px;margin-top:2px; }
.chat-status-dot { width:5px;height:5px;background:#00C6D4;border-radius:50%;animation:pulse 2s infinite; }
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
.chat-header-actions { display:flex;gap:6px;align-items:center; }
.chat-action-btn { width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,0.06);border:none;color:#7D8590;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;font-size:15px; }
.chat-action-btn:hover { background:rgba(255,255,255,0.1);color:#E6EDF3; }
.chat-action-btn.close:hover { background:rgba(255,107,107,0.15);color:#FF6B6B; }
.chat-messages { flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:12px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.08) transparent; }
.chat-messages::-webkit-scrollbar{width:4px}
.chat-messages::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px}
.msg-row{display:flex;gap:8px;align-items:flex-end;animation:msgIn 0.2s ease}
@keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.msg-row.user{flex-direction:row-reverse}
.msg-avatar-sm{width:26px;height:26px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.msg-avatar-sm.assistant{background:linear-gradient(135deg,#00C6D4,#3D8EF5)}
.msg-avatar-sm.user{background:linear-gradient(135deg,#3D8EF5,#9B8CFF)}
.msg-content{max-width:80%}
.msg-bubble{padding:10px 13px;border-radius:14px;font-size:0.78rem;line-height:1.6;white-space:pre-wrap;word-break:break-word}
.msg-bubble.assistant{background:#1C2333;color:#E6EDF3;border-radius:4px 14px 14px 14px;border:1px solid rgba(255,255,255,0.05)}
.msg-bubble.user{background:linear-gradient(135deg,#00C6A2,#0F6E56);color:#fff;border-radius:14px 4px 14px 14px}
.msg-time{font-size:0.58rem;color:#7D8590;margin-top:4px}
.msg-time.right{text-align:right}
.typing-indicator{display:flex;gap:4px;padding:12px 14px;background:#1C2333;border-radius:4px 14px 14px 14px;width:fit-content}
.typing-dot{width:6px;height:6px;background:#7D8590;border-radius:50%;animation:typingBounce 1.2s infinite}
.typing-dot:nth-child(2){animation-delay:0.2s}.typing-dot:nth-child(3){animation-delay:0.4s}
@keyframes typingBounce{0%,80%,100%{transform:translateY(0);opacity:0.5}40%{transform:translateY(-6px);opacity:1}}
.chat-suggestions{padding:8px 12px;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid rgba(255,255,255,0.05);flex-shrink:0}
.suggestion-chip{padding:5px 11px;background:rgba(0,198,212,0.07);border:1px solid rgba(0,198,212,0.18);border-radius:20px;font-size:0.66rem;color:#00C6D4;cursor:pointer;transition:all 0.15s;font-family:'Inter',sans-serif}
.suggestion-chip:hover{background:rgba(0,198,212,0.16);border-color:rgba(0,198,212,0.4);transform:translateY(-1px)}
.chat-input-area{padding:12px 14px;border-top:1px solid rgba(255,255,255,0.06);display:flex;gap:8px;align-items:flex-end;flex-shrink:0;background:rgba(0,0,0,0.12)}
.chat-textarea{flex:1;background:#1C2333;border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#E6EDF3;font-size:0.78rem;font-family:'Inter',sans-serif;padding:9px 12px;outline:none;resize:none;max-height:80px;transition:border-color 0.15s;line-height:1.5;min-height:38px}
.chat-textarea:focus{border-color:rgba(0,198,212,0.4);box-shadow:0 0 0 3px rgba(0,198,212,0.08)}
.chat-textarea::placeholder{color:#7D8590;opacity:0.8}
.chat-send{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#00C6D4,#3D8EF5);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s}
.chat-send:hover:not(:disabled){transform:scale(1.1);box-shadow:0 4px 16px rgba(0,198,212,0.4)}
.chat-send:disabled{opacity:0.35;cursor:not-allowed}
.chat-powered{text-align:center;font-size:0.6rem;color:rgba(125,133,144,0.6);padding:4px 0 8px;flex-shrink:0}
@media(max-width:480px){.chat-window{width:calc(100vw - 32px);right:16px;bottom:100px;height:70vh}}
`}</style>

{/* ── ROBOT FLOTTANT ── */}
{!open && (
<button className="chat-fab" onClick={() => setOpen(true)} title="Assistant GFST">
<div className="chat-bubble-tip">{lang === "fr" ? "Besoin d'aide ?" : "Need help?"}</div>
<div className="chat-robot-wrap">
<span className="chat-fab-notif">1</span>
<RobotSVG size={72} />
</div>
</button>
)}

{/* ── FENÊTRE CHAT ── */}
{open && (
<div className="chat-window">
<div className="chat-header">
<div className="chat-header-left">
<div className="chat-avatar-sm-wrap"><RobotIconSmall /></div>
<div>
<div className="chat-name">Assistant GFST</div>
<div className="chat-status"><span className="chat-status-dot"/>{lang === "fr" ? "En ligne" : "Online"}</div>
</div>
</div>
<div className="chat-header-actions">
<button className="chat-action-btn" onClick={clearChat}>
<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.86"/></svg>
</button>
<button className="chat-action-btn close" onClick={() => { clearChat(); setOpen(false); }}>×</button>
</div>
</div>

<div className="chat-messages">
{messages.map((msg, i) => (
<div key={i} className={`msg-row ${msg.role}`}>
<div className={`msg-avatar-sm ${msg.role}`}>{msg.role === "assistant" ? <RobotIconSmall /> : <UserIcon />}</div>
<div className="msg-content">
<div className={`msg-bubble ${msg.role}`}>{msg.content}</div>
<div className={`msg-time ${msg.role === "user" ? "right" : ""}`}>{msg.time}</div>
</div>
</div>
))}
{loading && (
<div className="msg-row">
<div className="msg-avatar-sm assistant"><RobotIconSmall /></div>
<div className="typing-indicator"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div>
</div>
)}
<div ref={bottomRef}/>
</div>

{sessionExpired && (
<div style={{margin:"0 14px",padding:"10px 14px",background:"rgba(255,107,107,0.08)",border:"1px solid rgba(255,107,107,0.25)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexShrink:0}}>
<span style={{fontSize:"0.72rem",color:"#FF6B6B"}}>{lang === "fr" ? "Session expirée" : "Session expired"}</span>
<button onClick={() => window.location.href="/login"} style={{padding:"5px 12px",borderRadius:6,background:"#FF6B6B",color:"#fff",border:"none",fontSize:"0.72rem",fontWeight:600,cursor:"pointer"}}>{lang === "fr" ? "Se reconnecter" : "Log in again"}</button>
</div>
)}

{messages.length <= 2 && !sessionExpired && (
<div className="chat-suggestions">
{suggestions.map((s,i) => <span key={i} className="suggestion-chip" onClick={() => setInput(s)}>{s}</span>)}
</div>
)}

<div className="chat-input-area">
<textarea ref={textareaRef} className="chat-textarea" placeholder={lang === "fr" ? "Posez votre question..." : "Ask your question..."}
value={input} onChange={e => setInput(e.target.value)}
onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} rows={1}/>
<button className="chat-send" onClick={sendMessage} disabled={loading || !input.trim()}>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
</button>
</div>
<div className="chat-powered">Propulsé par  openAI · GPT-4o</div>
</div>
)}
</>
);
}