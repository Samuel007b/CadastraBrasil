// Serviço para gerenciar operações da entidade Pessoa

import Pessoa from '../models/Pessoa.js';
import CpfValidator from '../utils/CpfValidator.js';
import { ValidationError, ConflictError, NotFoundError } from '../errors/AppError.js';

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
      throw new ValidationError('O nome é obrigatório.');
    }
    if (!cpf || !String(cpf).trim()) {
      throw new ValidationError('O CPF é obrigatório.');
    }
    if (!CpfValidator.validar(cpf)) {
      throw new ValidationError('CPF inválido. Verifique os dígitos informados.');
    }
    const digitos = CpfValidator.formatar(cpf);
    const cidadaoExistente = await this.pessoaRepository.findByCpf(digitos);
    if (cidadaoExistente) {
      throw new ConflictError('Já existe um cidadão cadastrado com este CPF.');
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
      throw new ValidationError('Informe um nome ou CPF para pesquisar.');
    }
    return this.pessoaRepository.search(termo.trim());
  }

  async listarTodos() {
    return this.pessoaRepository.findAll();
  }

  async editar(id, { nome, cpf }) {
    if (!nome || !String(nome).trim()) {
      throw new ValidationError('O nome é obrigatório.');
    }
    if (!cpf || !String(cpf).trim()) {
      throw new ValidationError('O CPF é obrigatório.');
    }
    const pessoas = await this.pessoaRepository.findAll();
    const pessoa = pessoas.find((p) => p.id === parseInt(id));
    if (!pessoa) {
      throw new NotFoundError('Cidadão não encontrado.');
    }
    if (!CpfValidator.validar(cpf)) {
      throw new ValidationError('CPF inválido. Verifique os dígitos informados.');
    }
    const digitos = CpfValidator.formatar(cpf);
    const cidadaoExistente = await this.pessoaRepository.findByCpf(digitos);
    if (cidadaoExistente && cidadaoExistente.id !== pessoa.id) {
      throw new ConflictError('Já existe um cidadão cadastrado com este CPF.');
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
      throw new NotFoundError('Cidadão não encontrado.');
    }
    await this.pessoaRepository.delete(pessoa.id);
  }
  
}