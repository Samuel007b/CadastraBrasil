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
      const { nomeCompleto, cpf } = req.body;
      const pessoa = await this.pessoaService.cadastrar({ nomeCompleto, cpf });
      return res.status(201).json({
        mensagem: 'Pessoa cadastrada com sucesso!',
        pessoa: pessoa.toJSON(),
      });
    } catch (erro) {
      return res.status(500).json({ erro: "Não foi possível cadastrar a pessoa." });
    }
  }

  async pesquisar(req, res, next) {
    try {
      const termo = req.query.termo || '';
      const pessoas = await this.pessoaService.pesquisar(termo);
      if (pessoas.length === 0) {
        return res.status(404).json({ mensagem: 'Pessoa não encontrada.' });
      }
      return res.status(200).json({
        mensagem: 'Pessoa(s) encontrada(s) com sucesso!',
        pessoas: pessoas.map((pessoa) => pessoa.toJSON()),
      });
    } catch (erro) {
      return res.status(500).json({ erro: "Não foi possível executar a pesquisa." });
    }
  }

  async listar(req, res, next) {
    try {
      const pessoas = await this.pessoaService.listarTodos();
      if (pessoas.length === 0) {
        return res.status(204).json({ mensagem: 'Nenhuma pessoa cadastrada.' });
      }
      return res.status(200).json({
        pessoas: pessoas.map((pessoa) => pessoa.toJSON()),
      });
    } catch (erro) {
      return res.status(500).json({ erro: "Não foi possível listar as pessoas cadastradas." });
    }
  }

  async editar(req, res, next) {
    try {
      const { id } = req.params;
      const { nomeCompleto, cpf } = req.body;
      const pessoaAtualizada = await this.pessoaService.editar(id, { nomeCompleto, cpf });
      return res.status(200).json({
        mensagem: 'Pessoa atualizada com sucesso!',
        pessoa: pessoaAtualizada.toJSON(),
      });
    }
    catch (erro) {
      return res.status(500).json({ erro: "Não foi possível editar a pessoa." });
    }
  }

  async deletar(req, res, next) {
    try {
      const { id } = req.params;
      await this.pessoaService.deletar(id);
      return res.status(204).json({ mensagem: 'Pessoa deletada com sucesso!' });
    }
    catch (erro) {
      return res.status(500).json({ erro: "Não foi possível deletar a pessoa." });
    }
  }

}