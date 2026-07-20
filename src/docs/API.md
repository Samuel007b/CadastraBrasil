# API do CadastraBrasil — Documentação de Endpoints

    Base URL (produção): `https://cadastra-brasil.vercel.app/`

    ## Convenções

    - Todas as respostas são em JSON
    - Erros seguem o formato `{ "erro": "mensagem descritiva" }`

## Pessoas

  ### GET /api/pessoas

    Lista todos os cidadãos registrados

    - **Body:** Nenhum

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "pessoas": [
        {
          "id": 1,
          "nome": "Maria Silva",
          "cpf": "987.654.321-00"
        },
        {
          "id": 2,
          "nome": "João Ferreira",
          "cpf": "388.023.890-12"
        },
        {
          "id": 3,
          "nome": "Felipe Moreira",
          "cpf": "008.497.690-00"
        }
      ]
    }
    ```

    - **Erros:**
      - `204` — Lista vazia (sem cidadãos registrados)
    

  ### GET /api/pessoas/pesquisa

    Busca cidadão(s) pelo nome ou CPF

    - **Params:** termo
    
    - **Body:** Nenhum

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "mensagem": "Cidadão(s) encontrado(s) com sucesso!",
      "pessoas": [
        {
          "id": 1,
          "nome": "Maria Silva",
          "cpf": "987.654.321-00"
        }
      ]
    }
    ```

    - **Erros:**
      - `400` — Termo ausente (sem nome ou CPF para pesquisar)
      - `404` — Cidadão não encontrado (registro com nome ou CPF pesquisado não existe)


  ### POST /api/pessoas

    Registra um novo cidadão

    - **Body:**

    ```json
    {
      "nome": "Maria Silva",
      "cpf": "987.654.321-00"
    }
    ```

    - **Resposta de sucesso:** `201 Created`

    ```json
    {
      "mensagem": "Cidadão cadastrado com sucesso!",
        "pessoa": {
        "id": 1,
        "nome": "Maria Silva",
        "cpf": "987.654.321-00"
      }
    }
    ```

    - **Erros:**
      - `400` — Credenciais inválidas (CPF inválido e/ou nome e CPF ausentes)
      - `409` — CPF informado já existente em outro registro
    

  ### PUT /api/pessoas/:id

    Atualiza um registro de cidadão pelo ID

    - **Body:**

    ```json
    {
      "nome": "Maria Silva",
      "cpf": "987.654.321-00"
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "mensagem": "Cidadão atualizado com sucesso!",
      "pessoa": {
        "id": 1,
        "nome": "Maria Silva",
        "cpf": "987.654.321-00"
      }
    }
    ```

    - **Erros:**
      - `400` — Credenciais inválidas (CPF inválido e/ou nome e CPF ausentes)
      - `404` — Cidadão não encontrado (registro com ID não existe)
      - `409` — CPF informado já existente em outro registro
    

  ### DELETE /api/pessoas/:id

    Remove um registro de cidadão pelo ID

    - **Body:** Nenhum

    - **Resposta de sucesso:** `204 Deleted`

    - **Erros:**
      - `404` — Cidadão não encontrado (registro com ID não existe)

## CORS

Esta API tem CORS habilitado para qualquer origem. Você pode consumi-la de qualquer domínio (localhost, Vercel, etc.) sem configuração adicional no cliente.