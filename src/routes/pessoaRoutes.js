// Rotas das operações da entidade Pessoa

import { Router } from 'express';
import PessoaController from '../controllers/PessoaController.js';

/**
 * @param {import('../controllers/PessoaController').default} pessoaController
 */
export default function pessoaRoutes(pessoaController) {
  const router = Router();

  router.post('/', pessoaController.cadastrar);
  router.get('/', pessoaController.listar);
  router.get('/pesquisa', pessoaController.pesquisar);
  router.put('/:id', pessoaController.editar);
  router.delete('/:id', pessoaController.deletar);

  return router;
}
