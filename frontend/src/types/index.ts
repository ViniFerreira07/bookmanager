export interface Book {
  id: string
  title: string
  author: string
  year: number | null
  description: string
  coverUrl: string
  createdAt: string
  updatedAt: string | null
}

export interface AuthResponse {
  token: string
  expiresIn: number
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export type UserRole = 'ADMIN' | 'USER'

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  active: boolean
  createdAt: string
  updatedAt: string | null
}

export interface UserFormData {
  username: string
  email: string
  password: string
  role: UserRole
}

export interface BookFormData {
  title: string
  author: string
  year: string
  description: string
  coverUrl: string
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  errors?: Array<{ field: string; message: string }>
}