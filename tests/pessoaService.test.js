// Conjunto de testes de operações da classe Pessoa

import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import PessoaService from '../src/services/PessoaService.js';
import PessoaRepository from '../src/repositories/PessoaRepository.js';
import { ValidationError, ConflictError } from '../src/errors/AppError.js';

const CPF_VALIDO_1 = '111.444.777-35';
const CPF_VALIDO_2 = '529.982.247-25';

describe('PessoaService', () => {
  let repositorio;
  let service;
  let arquivoTeste;

  beforeEach(() => {
    arquivoTeste = path.join(
      os.tmpdir(),
      `pessoas-service-teste-${Date.now()}-${Math.random().toString(16).slice(2)}.json`
    );
    repositorio = new PessoaRepository(arquivoTeste);
    service = new PessoaService(repositorio);
  });

  afterEach(async () => {
    await fs.rm(arquivoTeste, { force: true });
  });

  describe('cadastrar', () => {
    test('cadastra um cidadão com nome e CPF válidos', async () => {
      const cidadao = await service.cadastrar({
        nome: 'Maria da Silva',
        cpf: CPF_VALIDO_1,
      });
      expect(cidadao.nome).toBe('Maria da Silva');
      expect(cidadao.cpf).toBe('11144477735');
      const todos = await service.listarTodos();
      expect(todos).toHaveLength(1);
    });

    test('rejeita cadastro sem nome', async () => {
      await expect(
        service.cadastrar({ nome: '', cpf: CPF_VALIDO_1 })
      ).rejects.toThrow(ValidationError);
    });

    test('rejeita cadastro sem CPF', async () => {
      await expect(
        service.cadastrar({ nome: 'Maria da Silva', cpf: '' })
      ).rejects.toThrow(ValidationError);
    });

    test('rejeita CPF com dígitos verificadores inválidos', async () => {
      await expect(
        service.cadastrar({ nome: 'Maria da Silva', cpf: '111.444.777-99' })
      ).rejects.toThrow(ValidationError);
    });

    test('rejeita cadastro de CPF duplicado', async () => {
      await service.cadastrar({ nome: 'Maria da Silva', cpf: CPF_VALIDO_1 });
      await expect(
        service.cadastrar({ nome: 'Maria da Silva Souza', cpf: CPF_VALIDO_1 })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('editar', () => {
    test('atualiza nome e CPF de um cidadão existente', async () => {
      const cidadao = await service.cadastrar({ nome: 'Maria da Silva', cpf: CPF_VALIDO_1 });
      const atualizado = await service.editar(cidadao.id, {
        nome: 'Maria Souza',
        cpf: CPF_VALIDO_2,
      });
      expect(atualizado.nome).toBe('Maria Souza');
      expect(atualizado.cpf).toBe('52998224725');
    });

    test('rejeita edição para um CPF já usado por outro cidadão', async () => {
      const cidadao1 = await service.cadastrar({ nome: 'Maria da Silva', cpf: CPF_VALIDO_1 });
      await service.cadastrar({ nome: 'João Pereira', cpf: CPF_VALIDO_2 });
      await expect(
        service.editar(cidadao1.id, { nome: 'Maria da Silva', cpf: CPF_VALIDO_2 })
      ).rejects.toThrow(ConflictError);
    });

    test('rejeita edição de cidadão inexistente', async () => {
      await expect(
        service.editar(9999, { nome: 'Alguém', cpf: CPF_VALIDO_1 })
      ).rejects.toThrow('Cidadão não encontrado.');
    });
  });

  describe('deletar', () => {
    test('remove um cidadão existente', async () => {
      const cidadao = await service.cadastrar({ nome: 'Maria da Silva', cpf: CPF_VALIDO_1 });
      await service.deletar(cidadao.id);
      const todos = await service.listarTodos();
      expect(todos).toHaveLength(0);
    });

    test('rejeita exclusão de cidadão inexistente', async () => {
      await expect(service.deletar(9999)).rejects.toThrow('Cidadão não encontrado.');
    });
  });

  describe('pesquisar', () => {
    beforeEach(async () => {
      await service.cadastrar({ nome: 'Maria da Silva', cpf: CPF_VALIDO_1 });
      await service.cadastrar({ nome: 'João Pereira', cpf: CPF_VALIDO_2 });
    });

    test('encontra cidadão pesquisando pelo CPF', async () => {
      const resultados = await service.pesquisar('111.444.777-35');
      expect(resultados).toHaveLength(1);
      expect(resultados[0].nome).toBe('Maria da Silva');
    });

    test('encontra cidadão pesquisando por parte do nome, ignorando maiúsculas', async () => {
      const resultados = await service.pesquisar('joão');
      expect(resultados).toHaveLength(1);
      expect(resultados[0].nome).toBe('João Pereira');
    });

    test('retorna lista vazia quando não encontra ninguém', async () => {
      const resultados = await service.pesquisar('000.000.000-00');
      expect(resultados).toHaveLength(0);
    });

    test('rejeita pesquisa sem termo informado', async () => {
      await expect(service.pesquisar('')).rejects.toThrow(ValidationError);
    });
  });
});