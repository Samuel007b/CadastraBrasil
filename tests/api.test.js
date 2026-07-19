// Conjunto de testes de rotas da API

import request from 'supertest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { criarApp } from '../index.js';
import PessoaRepository from '../src/repositories/PessoaRepository.js';

const CPF_VALIDO = '111.444.777-35';

describe('API /api/pessoas', () => {
  let app;
  let arquivoTeste;

  beforeEach(async () => {
    arquivoTeste = path.join(
      os.tmpdir(),
      `pessoas-api-teste-${Date.now()}-${Math.random().toString(16).slice(2)}.json`
    );
    const repositorio = new PessoaRepository(arquivoTeste);
    await repositorio.inicializar();
    app = criarApp(repositorio);
  });

  afterEach(async () => {
    await fs.rm(arquivoTeste, { force: true });
  });

  test('POST /api/pessoas cadastra um cidadão e retorna 201', async () => {
    const resposta = await request(app)
      .post('/api/pessoas')
      .send({ nome: 'Maria da Silva', cpf: CPF_VALIDO });
    expect(resposta.status).toBe(201);
    expect(resposta.body.mensagem).toMatch(/sucesso/i);
    expect(resposta.body.pessoa.cpf).toBe('111.444.777-35');
  });

  test('POST /api/pessoas sem nome ou CPF retorna 400', async () => {
    const resposta = await request(app)
      .post('/api/pessoas')
      .send({ nome: 'Maria da Silva' });
    expect(resposta.status).toBe(400);
  });

  test('POST /api/pessoas com CPF inválido retorna 400', async () => {
    const resposta = await request(app)
      .post('/api/pessoas')
      .send({ nome: 'Maria da Silva', cpf: '123.456.789-00' });
    expect(resposta.status).toBe(400);
  });

  test('POST /api/pessoas com CPF duplicado retorna 409', async () => {
    await request(app).post('/api/pessoas').send({ nome: 'Maria da Silva', cpf: CPF_VALIDO });
    const resposta = await request(app)
      .post('/api/pessoas')
      .send({ nome: 'Outra Pessoa', cpf: CPF_VALIDO });
    expect(resposta.status).toBe(409);
  });

  test('GET /api/pessoas lista todos os cidadãos cadastrados', async () => {
    await request(app).post('/api/pessoas').send({ nome: 'Maria da Silva', cpf: CPF_VALIDO });
    const resposta = await request(app).get('/api/pessoas');
    expect(resposta.status).toBe(200);
    expect(resposta.body.pessoas).toHaveLength(1);
  });

  test('GET /api/pessoas retorna 204 quando não há cidadãos cadastrados', async () => {
    const resposta = await request(app).get('/api/pessoas');
    expect(resposta.status).toBe(204);
  });

  test('GET /api/pessoas/pesquisa encontra cidadão cadastrado', async () => {
    await request(app).post('/api/pessoas').send({ nome: 'Maria da Silva', cpf: CPF_VALIDO });
    const resposta = await request(app).get('/api/pessoas/pesquisa').query({ termo: 'Maria' });
    expect(resposta.status).toBe(200);
    expect(resposta.body.pessoas).toHaveLength(1);
    expect(resposta.body.pessoas[0].nome).toBe('Maria da Silva');
  });

  test('GET /api/pessoas/pesquisa retorna 404 e mensagem quando não encontra', async () => {
    const resposta = await request(app).get('/api/pessoas/pesquisa').query({ termo: '999.999.999-99' });
    expect(resposta.status).toBe(404);
    expect(resposta.body.mensagem).toBe('Cidadão não encontrado.');
  });

  test('PUT /api/pessoas/:id atualiza um cidadão existente', async () => {
    const cadastro = await request(app)
      .post('/api/pessoas')
      .send({ nome: 'Maria da Silva', cpf: CPF_VALIDO });
    const { id } = cadastro.body.pessoa;
    const resposta = await request(app)
      .put(`/api/pessoas/${id}`)
      .send({ nome: 'Maria Souza', cpf: CPF_VALIDO });
    expect(resposta.status).toBe(200);
    expect(resposta.body.pessoa.nome).toBe('Maria Souza');
  });

  test('PUT /api/pessoas/:id com id inexistente retorna 404', async () => {
    const resposta = await request(app)
      .put('/api/pessoas/999999')
      .send({ nome: 'Alguém', cpf: CPF_VALIDO });
    expect(resposta.status).toBe(404);
  });

  test('DELETE /api/pessoas/:id remove um cidadão existente', async () => {
    const cadastro = await request(app)
      .post('/api/pessoas')
      .send({ nome: 'Maria da Silva', cpf: CPF_VALIDO });
    const { id } = cadastro.body.pessoa;
    const resposta = await request(app).delete(`/api/pessoas/${id}`);
    expect(resposta.status).toBe(204);
  });

  test('DELETE /api/pessoas/:id com id inexistente retorna 404', async () => {
    const resposta = await request(app).delete('/api/pessoas/999999');
    expect(resposta.status).toBe(404);
  });
});