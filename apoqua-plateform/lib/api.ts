const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// ─── HELPERS ─────────────────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("gfst_token")
}

export function getUser() {
  if (typeof window === "undefined") return null
  const u = localStorage.getItem("gfst_user")
  return u ? JSON.parse(u) : null
}

export function logout() {
  localStorage.removeItem("gfst_token")
  localStorage.removeItem("gfst_user")
  window.location.href = "/login"
}

// ─── AUTH ─────────────────────────────────────────────────────────
export async function login(email: string, password: string) {
  const form = new URLSearchParams()
  form.append("username", email)
  form.append("password", password)

  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString()
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || "Erreur de connexion")

  localStorage.setItem("gfst_token", data.access_token)
  localStorage.setItem("gfst_user", JSON.stringify(data.user))
  return data
}

export async function getMe() {
  const res = await fetch(`${API}/api/auth/me`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail)
  return data
}

// ─── FICHES ──────────────────────────────────────────────────────
export async function getFiches(params?: {
  search?: string
  status?: string
  area?: string
  poro?: string
  pfr?: string
  page?: number
  limit?: number
}) {
  const query = new URLSearchParams()
  if (params?.search) query.append("search", params.search)
  if (params?.status) query.append("status", params.status)
  if (params?.area) query.append("area", params.area)
  if (params?.poro) query.append("poro", params.poro)
  if (params?.pfr) query.append("pfr", params.pfr)
  if (params?.page) query.append("page", String(params.page))
  if (params?.limit) query.append("limit", String(params.limit))

  const res = await fetch(`${API}/api/fiches?${query}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail)
  return data
}

export async function getAllFiches() {
  const res = await fetch(`${API}/api/fiches/all`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail)
  return data
}

export async function createFiche(ficheData: any) {
  const res = await fetch(`${API}/api/fiches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(ficheData)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail)
  return data
}

export async function updateFiche(id: number, ficheData: any) {
  const res = await fetch(`${API}/api/fiches/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(ficheData)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail)
  return data
}

export async function deleteFiche(id: number) {
  const res = await fetch(`${API}/api/fiches/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail)
  return data
}

export async function importExcel(file: File) {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${API}/api/fiches/import-excel`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail)
  return data
}

// ─── DEMANDES ────────────────────────────────────────────────────
export async function getDemandes() {
  const res = await fetch(`${API}/api/demandes`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail)
  return data
}

export async function createDemande(demandeData: {
  reference: string
  type_demande: string
  description?: string
}) {
  const res = await fetch(`${API}/api/demandes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(demandeData)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail)
  return data
}