const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export async function getProducts() {
  const res = await fetch(`${API_BASE}/api/products`)
  return res.json()
}

export async function createOrder(items, token) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ items })
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function createCheckoutSession(items, token) {
  const res = await fetch(`${API_BASE}/api/payments/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ items })
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function getCourses() {
  const res = await fetch(`${API_BASE}/api/courses`)
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function getProfile(token) {
  const res = await fetch(`${API_BASE}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data.user || data
}

export async function createCourse(course, token) {
  const res = await fetch(`${API_BASE}/api/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(course)
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function enrollCourse(courseId, token) {
  const res = await fetch(`${API_BASE}/api/courses/${courseId}/enroll`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function getMyEnrollments(token) {
  const res = await fetch(`${API_BASE}/api/courses/my/enrollments`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function getMyCourses(token) {
  const res = await fetch(`${API_BASE}/api/courses/my/courses`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function exportOrders(token) {
  const res = await fetch(`${API_BASE}/api/orders/export`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw data
  }
  return res.blob()
}

export async function getOrders(token) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function getOrder(orderId, token) {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export default {
  getProducts,
  createOrder,
  createCheckoutSession,
  getOrders,
  getOrder,
  exportOrders,
  getCourses,
  createCourse,
  enrollCourse,
  getMyEnrollments,
  getMyCourses
}
