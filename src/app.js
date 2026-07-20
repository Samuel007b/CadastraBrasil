import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import PessoaService from './services/PessoaService.js';
import PessoaController from './controllers/PessoaController.js';
import pessoaRoutes from './routes/pessoaRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @param {import('./repositories/PessoaRepository').default} pessoaRepository
 */
export function criarApp(pessoaRepository) {
  const pessoaService = new PessoaService(pessoaRepository);
  const pessoaController = new PessoaController(pessoaService);

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(logger);

  app.get('/api', (req, res) => res.json({ mensagem: 'CadastraBrasil API está no ar!' }));

  app.get('/api/status', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

  app.use('/api/pessoas', pessoaRoutes(pessoaController));

  app.use(errorHandler);

  return app;
}