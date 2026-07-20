import 'dotenv/config';
import { fileURLToPath } from 'url';
import { criarApp } from './src/app.js';
import PessoaRepository from './src/repositories/PessoaRepository.js';

const __filename = fileURLToPath(import.meta.url);

const pessoaRepository = new PessoaRepository();
await pessoaRepository.inicializar();
const app = criarApp(pessoaRepository);

const ehModuloPrincipal = process.argv[1] === __filename;
if (ehModuloPrincipal) {
  const PORT = process.env.PORT || 3000;
  if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  }
}

export default app;