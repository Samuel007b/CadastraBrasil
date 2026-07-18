// Serviço para gerenciar operações da entidade Pessoa

import Pessoa from '../models/Pessoa.js';

export default class PessoaService {
  
  constructor(pessoaRepository) {
    this.pessoaRepository = pessoaRepository;
  }
  
  /**
   * @param {{ nomeCompleto: string, cpf: string }} dados
   * @returns {Promise<Pessoa>}
   */
  async cadastrar({ nomeCompleto, cpf }) {
    const pessoa = new Pessoa(nomeCompleto, cpf);
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

  async editar(id, { nomeCompleto, cpf }) {
    const pessoas = await this.pessoaRepository.findAll();
    const pessoa = pessoas.find((p) => p.id === parseInt(id));
    if (!pessoa) {
      throw new Error('Pessoa não encontrada.');
    }
    pessoa.setNome(nomeCompleto);
    pessoa.setCpf(cpf);
    await this.pessoaRepository.update(pessoa);
    return pessoa;
  }

  async deletar(id) {
    const pessoas = await this.pessoaRepository.findAll();
    const pessoa = pessoas.find((p) => p.id === parseInt(id));
    if (!pessoa) {
      throw new Error('Pessoa não encontrada.');
    }
    await this.pessoaRepository.delete(pessoa.id);
  }
  
}