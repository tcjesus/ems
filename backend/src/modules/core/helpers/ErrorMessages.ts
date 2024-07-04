export class ErrorMessages {
  static get generic() { return 'Tivemos um problema e não foi possível processar sua solicitação. Por favor tente novamente.' }

  static account = class {
    static get notFound() { return 'Usuário não encontrado.' }
    static get wrongPassword() { return 'Usuário não encontrado.' }
  }

  static emergency = class {
    static grandeza = class {
      static get notFound() { return 'Grandeza não encontrada.' }
      static alreadyExists(nome: string) { return `Grandeza '${nome}' já cadastrada.` }
    }

    static tipoEmergencia = class {
      static get notFound() { return 'Tipo de Emergência não encontrado.' }
      static alreadyExists(nome: string) { return `Tipo de Emergência '${nome}' já cadastrada.` }
    }

    static sensor = class {
      static get notFound() { return 'Sensor não encontrado.' }
      static alreadyExists(nome: string) { return `Sensor '${nome}' já cadastrado.` }
    }

    static zona = class {
      static get notFound() { return 'Zona não encontrada.' }
      static alreadyExists(nome: string) { return `Zona '${nome}' já cadastrada.` }
    }

    static ude = class {
      static get notFound() { return 'UDE não encontrada.' }
      static alreadyExists(nome: string) { return `UDE '${nome}' já cadastrada.` }
    }

    static localidade = class {
      static get notAllowed() { return 'Usuário não tem permissão para acessar os recursos desta localidade.' }
    }
  }
}