// Serviço para gerenciar operações da entidade Pessoa

import Pessoa from '../models/Pessoa.js';

export default class PessoaService {
  
  constructor(pessoaRepository) {
    this.pessoaRepository = pessoaRepository;
  }
  
  /**
   * @param {{ nome: string, cpf: string }} dados
   * @returns {Promise<Pessoa>}
   */
  async cadastrar({ nome, cpf }) {
    if (!nome || !String(nome).trim()) {
      throw new Error('O nome é obrigatório.');
    }
    if (!cpf || !String(cpf).trim()) {
      throw new Error('O CPF é obrigatório.');
    }
    const pessoa = new Pessoa(nome, cpf);
    await this.pessoaRepository.save(pessoa);
    return pessoa;
  }

  /**
   * @param {string} termo
   * @returns {Promise<Pessoa[]>}
   */
  async pesquisar(termo) {
    if (!termo || !termo.trim()) {
      throw new Error('Informe um nome ou CPF para pesquisar.');
    }
    return this.pessoaRepository.search(termo.trim());
  }

  async listarTodos() {
    return this.pessoaRepository.findAll();
  }

  async editar(id, { nome, cpf }) {
    const pessoas = await this.pessoaRepository.findAll();
    const pessoa = pessoas.find((p) => p.id === parseInt(id));
    if (!pessoa) {
      throw new Error('Cidadão não encontrado.');
    }
    pessoa.setNome(nome);
    pessoa.setCpf(cpf);
    await this.pessoaRepository.update(pessoa);
    return pessoa;
  }

  async deletar(id) {
    const pessoas = await this.pessoaRepository.findAll();
    const pessoa = pessoas.find((p) => p.id === parseInt(id));
    if (!pessoa) {
      throw new Error('Cidadão não encontrado.');
    }
    await this.pessoaRepository.delete(pessoa.id);
  }
  
}