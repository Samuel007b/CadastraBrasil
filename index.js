import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ mensagem: 'CadastraBrasil API está no ar!' }));

app.get('/status', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;