import { Role } from "@/account/structures/enum/Role"

export interface Account {
  id: number
  nome: string
  email: string
  role?: Role
  createdAt?: Date
  updatedAt?: Date
}

// The payload can change in the future, so we can use an interface to define it
export interface AuthPayload {
  account: Account
}
