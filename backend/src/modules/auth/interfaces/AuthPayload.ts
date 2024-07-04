import { Role } from "@/account/structures/enum/Role"

export interface Permission {
  role: Role
  localidade: {
    id: number
    cidadeId: number
  }
}

export interface Account {
  id: number
  nome: string
  email: string
  isSuperAdmin: boolean
  permissions: Permission[]
  createdAt?: Date
  updatedAt?: Date
}

// The payload can change in the future, so we can use an interface to define it
export interface AuthPayload {
  account: Account
}
