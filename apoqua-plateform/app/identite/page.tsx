"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function IdentitePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [token, setToken] = useState("")
  const [user, setUser] = useState<any>({})

  const [form, setForm] = useState({
    login: "",
    telephone: "",
    service: "",
    site_geo: "",
    company: "",
    langue: "French",
    organisation: ""
  })

  // ✅ Récupérer token et user au montage
  useEffect(() => {
    const t = localStorage.getItem("gfst_token")
    const u = localStorage.getItem("gfst_user")

    if (!t) {
      router.push("/login")
      return
    }

    setToken(t)

    if (u) {
      const parsed = JSON.parse(u)
      setUser(parsed)
      setForm(prev => ({
        ...prev,
        login: parsed.login || "",
        telephone: parsed.telephone || "",
        service: parsed.service || "",
        site_geo: parsed.site_geo || "",
        company: parsed.company || "",
        langue: parsed.langue || "French",
        organisation: parsed.organisation || ""
      }))
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      // ✅ Utiliser le token du state
      const currentToken = localStorage.getItem("gfst_token")

      if (!currentToken) {
        router.push("/login")
        return
      }

      const res = await fetch("http://localhost:8000/api/auth/profil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentToken}`
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("gfst_token")
          localStorage.removeItem("gfst_user")
          router.push("/login")
          return
        }
        throw new Error(data.detail || "Erreur")
      }

      // ✅ Mettre à jour le user en localStorage
      localStorage.setItem("gfst_user", JSON.stringify(data))
      router.push("/")

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; background: #f0f0f0; }
        .page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .card { background: #fff; border-radius: 4px; overflow: hidden; width: 100%; max-width: 600px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .card-header { background: #d0d0d0; padding: 14px 20px; }
        .card-header h2 { font-size: 18px; font-weight: normal; color: #333; }
        .card-body { padding: 30px 40px; }
        .field-row { display: flex; align-items: center; margin-bottom: 18px; }
        .field-label { width: 160px; text-align: right; padding-right: 20px; font-size: 14px; color: #555; flex-shrink: 0; }
        .field-input { flex: 1; padding: 8px 12px; border: 1px solid #ccc; border-radius: 3px; font-size: 14px; color: #333; outline: none; }
        .field-input:focus { border-color: #00A99D; }
        .field-input.readonly { background: #f5f5f5; color: #777; }
        .submit-btn { padding: 10px 28px; background: #00A99D; color: #fff; border: none; border-radius: 4px; font-size: 15px; cursor: pointer; transition: background 0.2s; }
        .submit-btn:hover { background: #008f84; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .error-msg { color: #e44; font-size: 13px; margin-bottom: 14px; padding: 8px 12px; background: #fff0f0; border: 1px solid #fcc; border-radius: 4px; }
        .btn-row { display: flex; justify-content: center; margin-top: 10px; }
      `}</style>

      <div className="page">
        <div className="card">
          <div className="card-header">
            <h2>Identity</h2>
          </div>
          <div className="card-body">
            {error && <div className="error-msg">⚠️ {error}</div>}
            <form onSubmit={handleSubmit}>

              <div className="field-row">
                <label className="field-label">Login :</label>
                <input
                  className="field-input"
                  name="login"
                  value={form.login}
                  onChange={handleChange}
                  placeholder="ex: SF78850"
                />
              </div>

              <div className="field-row">
                <label className="field-label">Name :</label>
                <input
                  className="field-input readonly"
                  value={user.nom || ""}
                  readOnly
                />
              </div>

              <div className="field-row">
                <label className="field-label">Forename :</label>
                <input
                  className="field-input readonly"
                  value={user.prenom || ""}
                  readOnly
                />
              </div>

              <div className="field-row">
                <label className="field-label">Email :</label>
                <input
                  className="field-input readonly"
                  value={user.email || ""}
                  readOnly
                />
              </div>

              <div className="field-row">
                <label className="field-label">Phone :</label>
                <input
                  className="field-input"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder=""
                />
              </div>

              <div className="field-row">
                <label className="field-label">Service :</label>
                <input
                  className="field-input"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  placeholder="ex: EXE/EE/MFGE/VPEE"
                />
              </div>

              <div className="field-row">
                <label className="field-label">Geographical site :</label>
                <input
                  className="field-input"
                  name="site_geo"
                  value={form.site_geo}
                  onChange={handleChange}
                  placeholder="ex: Site Hors Groupe"
                />
              </div>

              <div className="field-row">
                <label className="field-label">Company :</label>
                <input
                  className="field-input"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="ex: CAPGEMINI TECHNOLOGY SERVICES"
                />
              </div>

              <div className="field-row">
                <label className="field-label">Language :</label>
                <select
                  className="field-input"
                  name="langue"
                  value={form.langue}
                  onChange={handleChange}
                >
                  <option value="French">French</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div className="field-row">
                <label className="field-label">Organisation :</label>
                <input
                  className="field-input"
                  name="organisation"
                  value={form.organisation}
                  onChange={handleChange}
                  placeholder="ex: VEHICULE"
                />
              </div>

              <div className="btn-row">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Saving..." : "Submit"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}