// Arquivo de gerenciamento dos dados de pessoas

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Pessoa from '../models/Pessoa.js';
import { NotFoundError } from '../errors/AppError.js';
import CryptoUtils from "../utils/Crypto.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PATH = process.env.VERCEL ? path.join('/tmp', 'pessoas.json') : path.join(__dirname, '..', '..', 'data', 'pessoas.json');

export default class PessoaRepository {
  
  constructor(filePath = PATH) {
    this.filePath = filePath;
    this.pessoas = [];
    this.carregado = false;
  }
  
  async inicializar() {
    await this.#pronto();
  }

  async #pronto() {
    if (this.carregado) return;

    try {
      const conteudo = await fs.readFile(this.filePath, 'utf-8');
      const registros = JSON.parse(conteudo || '[]');
      this.pessoas = registros.map((registro) =>
        Pessoa.toObject({ ...registro, cpf: CryptoUtils.decrypt(registro.cpf) })
      );
      const maiorId = this.pessoas.reduce((max, pessoa) => Math.max(max, pessoa.id), 0);
      Pessoa.sincCont(maiorId);
    } catch (erro) {
      if (erro.code === 'ENOENT') {
        await this.#continuar();
      } else {
        throw erro;
      }
    }
    this.carregado = true;
  }

  async #continuar() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const dados = this.pessoas.map((pessoa) => {
      const registro = pessoa.toJSONCpfDigits();
      return { ...registro, cpf: CryptoUtils.encrypt(registro.cpf) };
    });
    await fs.writeFile(this.filePath, JSON.stringify(dados, null, 2), 'utf-8');
  }

  async findAll() {
    await this.#pronto();
    return [...this.pessoas];
  }

  async findByCpf(cpf) {
    await this.#pronto();
    return this.pessoas.find((pessoa) => pessoa.cpf === cpf) || null;
  }

  /**
   * @param {string} termo
   * @returns {Promise<Pessoa[]>}
   */
  async search(termo) {
    await this.#pronto();
    const termoDigitos = termo.replace(/\D/g, '');
    const termoNome = termo.trim().toLowerCase();

    return this.pessoas.filter((pessoa) => {
      const cpf = String(pessoa.cpf);
      const nome = String(pessoa.nome);
      const combinaPorCpf = termoDigitos.length > 0 && cpf.includes(termoDigitos);
      const combinaPorNome = termoNome.length > 0 && nome.toLowerCase().includes(termoNome);
      return combinaPorCpf || combinaPorNome;
    });
  }

  async save(pessoa) {
    await this.#pronto();
    this.pessoas.push(pessoa);
    await this.#continuar();
    return pessoa;
  }

  async update(pessoa) {
    await this.#pronto();
    const index = this.pessoas.findIndex((p) => p.id === pessoa.id);
    if (index === -1) {
      throw new NotFoundError('Cidadão não encontrado.');
    }
    this.pessoas[index] = pessoa;
    await this.#continuar();
    return pessoa;
  }

  async delete(id) {
    await this.#pronto();
    const index = this.pessoas.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundError('Cidadão não encontrado.');
    }
    this.pessoas.splice(index, 1);
    await this.#continuar();
  }

}