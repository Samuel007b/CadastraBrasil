// Controller para gerenciar operações da entidade Pessoa

export default class PessoaController {
	
  constructor(pessoaService) {
    this.pessoaService = pessoaService;
    this.cadastrar = this.cadastrar.bind(this);
    this.pesquisar = this.pesquisar.bind(this);
    this.listar = this.listar.bind(this);
    this.editar = this.editar.bind(this);
    this.deletar = this.deletar.bind(this);
  }

  async cadastrar(req, res, next) {
    try {
      const { nome, cpf } = req.body;
      if (!nome || !cpf) {
        return res.status(400).json({ erro: 'Nome e CPF são obrigatórios.' });
      }
      const pessoa = await this.pessoaService.cadastrar({ nome, cpf });
      return res.status(201).json({
        mensagem: 'Cidadão cadastrado com sucesso!',
        pessoa: pessoa.toJSON(),
      });
    } catch (erro) {
      next(erro);
    }
  }

  async pesquisar(req, res, next) {
    try {
      const termo = req.query.termo || '';
      const pessoas = await this.pessoaService.pesquisar(termo);
      if (pessoas.length === 0) {
        return res.status(404).json({ erro: 'Cidadão não encontrado.' });
      }
      return res.status(200).json({
        mensagem: 'Cidadão(s) encontrado(s) com sucesso!',
        pessoas: pessoas.map((pessoa) => pessoa.toJSON()),
      });
    } catch (erro) {
      next(erro);
    }
  }

  async listar(req, res, next) {
    try {
      const pessoas = await this.pessoaService.listarTodos();
      return res.status(200).json({
        pessoas: pessoas.map((pessoa) => pessoa.toJSON()),
      });
    } catch (erro) {
      next(erro);
    }
  }

  async editar(req, res, next) {
    try {
      const { id } = req.params;
      const { nome, cpf } = req.body;
      if (!nome || !cpf) {
        return res.status(400).json({ erro: 'Nome e CPF são obrigatórios.' });
      }
      const pessoaAtualizada = await this.pessoaService.editar(id, { nome, cpf });
      return res.status(200).json({
        mensagem: 'Cidadão atualizado com sucesso!',
        pessoa: pessoaAtualizada.toJSON(),
      });
    }
    catch (erro) {
      next(erro);
    }
  }

  async deletar(req, res, next) {
    try {
      const { id } = req.params;
      await this.pessoaService.deletar(id);
      return res.status(204).end();
    }
    catch (erro) {
      next(erro);
    }
  }

}