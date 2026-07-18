// Entidade Pessoa, representando um cidadão com nome completo e CPF

export default class Pessoa {
  static contId = 0;

  static sincCont(id) {
    if (id > Pessoa.contId) {
      Pessoa.contId = id;
    }
  }

	constructor(nome, cpf) {
    this.id = ++Pessoa.contId;
    this.nome = nome;
    this.cpf = cpf;
  }

	toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      cpf: this.cpf
    };
  }

  getNome() {
    return this.nome;
  }

  getCpf() {
    return this.cpf;
  }

  setNome(nome) {
    this.nome = nome;
  }

  setCpf(cpf) {
    this.cpf = cpf;
  }

	static toObject(obj) {
    const pessoa = Object.create(Pessoa.prototype);
    pessoa.id = obj.id;
    pessoa.nome = obj.nome;
    pessoa.cpf = obj.cpf;
    return pessoa;
  }

}