// Middleware de erro do Express

import { AppError } from '../errors/AppError.js';

export default function errorHandler(erro, req, res, next) {
  console.error('[ERRO]', erro);
  if (erro instanceof AppError) {
    return res.status(erro.statusCode).json({ erro: erro.message });
  }
  return res.status(500).json({ erro: 'Erro interno no servidor.' });
}