// Entidade Pessoa, representando um cidadão com nome completo e CPF

export default class Pessoa {
  static contId = 0;

	constructor(nomeCompleto, cpf) {
    this.id = ++Pessoa.contId;
    this.nomeCompleto = nomeCompleto;
    this.cpf = cpf;
  }

	toJSON() {
    return {
      id: this.id,
      nomeCompleto: this.nomeCompleto,
      cpf: this.cpf
    };
  }

  getNome() {
    return this.nomeCompleto;
  }

  getCpf() {
    return this.cpf;
  }

  setNome(nomeCompleto) {
    this.nomeCompleto = nomeCompleto;
  }

  setCpf(cpf) {
    this.cpf = cpf;
  }

	static toObject(obj) {
    const pessoa = Object.create(Pessoa.prototype);
    pessoa.id = obj.id;
    pessoa.nomeCompleto = obj.nomeCompleto;
    pessoa.cpf = obj.cpf;
    return pessoa;
  }

}