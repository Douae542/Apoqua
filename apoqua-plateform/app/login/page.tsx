"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError("")
    try {
      const form = new URLSearchParams()
      form.append("username", email)
      form.append("password", password)

      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString()
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Erreur de connexion")

      localStorage.setItem("gfst_token", data.access_token)
      localStorage.setItem("gfst_user", JSON.stringify(data.user))
      document.cookie = `gfst_token=${data.access_token}; path=/`

      // ✅ Redirection selon rôle
      const isAdmin = data.user.email === "admin@gfst.com" ||
        ["super_admin", "admin"].includes(data.user.role)

      if (isAdmin) {
        router.push("/admin")
      } else {
        // Vérifier si profil complété
        if (!data.user.profil_complete) {
          router.push("/identite")
        } else {
          router.push("/")
        }
      }

    } catch (e: any) {
      setError(e.message || "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#0D1117", fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        background: "#161B22",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: 40, width: 380
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: "linear-gradient(135deg,#00C6A2,#3D8EF5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px", fontSize: 17, fontWeight: 700, color: "#fff"
          }}>GF</div>
          <div style={{ color: "#E6EDF3", fontWeight: 700, fontSize: 20 }}>GFST</div>
          <div style={{ color: "#7D8590", fontSize: 12, marginTop: 5 }}>
            Global FaSteners Team
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#7D8590", fontSize: 12, display: "block", marginBottom: 6 }}>Email</label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre@email.com"
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#1C2333", color: "#E6EDF3",
              fontSize: 14, outline: "none", boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ color: "#7D8590", fontSize: 12, display: "block", marginBottom: 6 }}>Mot de passe</label>
          <input
            type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#1C2333", color: "#E6EDF3",
              fontSize: 14, outline: "none", boxSizing: "border-box"
            }}
          />
        </div>

        {error && (
          <div style={{
            background: "rgba(255,107,107,0.1)",
            border: "1px solid rgba(255,107,107,0.3)",
            color: "#FF6B6B", borderRadius: 8,
            padding: "10px 12px", fontSize: 13, marginBottom: 14
          }}>⚠️ {error}</div>
        )}

        <button
          onClick={handleLogin} disabled={loading}
          style={{
            width: "100%", padding: "12px", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg,#00C6A2,#3D8EF5)",
            color: "#fff", fontSize: 14, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </div>
    </div>
  )
}