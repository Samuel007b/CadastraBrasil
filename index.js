import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import PessoaRepository from './src/repositories/PessoaRepository.js';
import PessoaService from './src/services/PessoaService.js';
import PessoaController from './src/controllers/PessoaController.js';
import pessoaRoutes from './src/routes/pessoaRoutes.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

const pessoaRepository = new PessoaRepository();
const pessoaService = new PessoaService(pessoaRepository);
const pessoaController = new PessoaController(pessoaService);

app.use('/api/pessoas', pessoaRoutes(pessoaController));

app.get('/', (req, res) => res.json({ mensagem: 'CadastraBrasil API está no ar!' }));

app.get('/status', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;