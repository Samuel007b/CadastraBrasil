# CadastraBrasil

Aplicação web para cadastro, consulta e edição de cidadãos brasileiros, com validação automática de CPF. 

Desenvolvida em **Node.js** (com Express) seguindo o paradigma POO e com uma interface web em HTML/CSS/JS puro.

> O projeto usa **ES Modules** nativos (`"type": "module"` no `package.json`)

---

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 16 ou superior
- npm (instalado junto com o Node.js)

### Etapas

```bash
# 1. Entre na pasta do projeto
cd CadastraBrasil

# 2. Instale as dependências
npm install

# 3. Defina as variáveis de desenvolvimento PORT (opcional) e ENCRYPTION_KEY (obrigatória) no .env
PORT=...
ENCRYPTION_KEY=...

# 4. Inicie a aplicação
npm start
```

A aplicação estará disponível em **http://localhost:3000**.

> A porta pode ser alterada definindo a variável de ambiente `PORT`

> A variável de ambiente `ENCRYPTION_KEY` é um hexadecimal de 64 caracteres (utilizada para criptografia), que pode ser gerado pelo comando: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Durante o desenvolvimento, é possível usar `npm run dev` (reinicia o servidor automaticamente a cada alteração, via `nodemon`).

Os dados cadastrados são salvos em `data/pessoas.json`.

---

## Como rodar os testes

O projeto usa [Jest](https://jestjs.io/) para testes unitários e [Supertest](https://github.com/ladjs/supertest) para testes de integração da API.

```bash
npm test
```

Os testes cobrem:

- `tests/cpfValidator.test.js` — regras de validação/formatação de CPF;
- `tests/pessoaService.test.js` — regras de negócio de cadastro e pesquisa;
- `tests/api.test.js` — testes de integração das rotas HTTP (cadastro, edição, exclusão, duplicidade, CPF inválido, pesquisa com e sem resultado).

---

## Funcionalidades

- **Cadastro de cidadão**: formulário com nome completo e CPF (campos obrigatórios). O CPF é validado automaticamente (formato de 11 dígitos e dígitos verificadores) antes de ser salvo.
- **Impede duplicidade**: não é possível cadastrar dois cidadãos com o mesmo CPF.
- **Pesquisa**: é possível buscar registros já cadastrados por nome ou por CPF, retornando a lista de usuários que atendem à pesquisa ou exibindo uma mensagem de não encontrado.
- **Edição**: é possível editar registros já cadastrados, permitindo mudar-se nome e/ou CPF, também validando o novo número de CPF e impedindo duplicidade.
- **Exclusão**: é possível excluir registros do conjunto de cidadãos salvos.