// Entidade Pessoa, representando um cidadão com nome completo e CPF

import CpfValidator from '../utils/CpfValidator.js';

export default class Pessoa {
  static contId = 0;

  static sincCont(id) {
    if (id > Pessoa.contId) {
      Pessoa.contId = id;
    }
  }

	constructor(nome, cpf) {
    this.id = ++Pessoa.contId;
    this.nome = String(nome).trim().replace(/\s+/g, ' ');
    this.cpf = CpfValidator.formatar(String(cpf).trim());
  }

	toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      cpf: CpfValidator.visualizar(this.cpf)
    };
  }

  toJSONCpfDigits() {
    return {
      id: this.id,
      nome: this.nome,
      cpf: this.cpf,
    };
  }

  getNome() {
    return this.nome;
  }

  getCpf() {
    return this.cpf;
  }

  setNome(nome) {
    this.nome = String(nome).trim().replace(/\s+/g, ' ');
  }

  setCpf(cpf) {
    this.cpf = CpfValidator.formatar(String(cpf).trim());
  }

	static toObject(obj) {
    const pessoa = Object.create(Pessoa.prototype);
    pessoa.id = obj.id;
    pessoa.nome = String(obj.nome);
    pessoa.cpf = CpfValidator.formatar(String(obj.cpf).trim());
    return pessoa;
  }

}