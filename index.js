import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './src/middlewares/logger.js';
import errorHandler from './src/middlewares/errorHandler.js';
import PessoaRepository from './src/repositories/PessoaRepository.js';
import PessoaService from './src/services/PessoaService.js';
import PessoaController from './src/controllers/PessoaController.js';
import pessoaRoutes from './src/routes/pessoaRoutes.js';

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger);

const pessoaRepository = new PessoaRepository();
await pessoaRepository.inicializar();
const pessoaService = new PessoaService(pessoaRepository);
const pessoaController = new PessoaController(pessoaService);

app.get('/api', (req, res) => res.json({ mensagem: 'CadastraBrasil API está no ar!' }));

app.get('/api/status', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.use('/api/pessoas', pessoaRoutes(pessoaController));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;