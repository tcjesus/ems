import { Localidade } from "@/locality/structures/Localidade"

export const LOCALIDADE_HEADER = 'x-localidade'

export class LocalidadeHeader {
  static parse(header): Localidade {
    const parsed = JSON.parse(header)

    return parsed as Localidade
  }

  static getFromRequest(req): Localidade {
    const header = req.headers[LOCALIDADE_HEADER]

    return LocalidadeHeader.parse(header)
  }
}
