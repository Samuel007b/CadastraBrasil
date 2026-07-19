// Conjunto de testes para verificador de CPF

import CpfValidator from '../src/utils/CpfValidator.js';

describe('CpfValidator', () => {
  describe('validar', () => {
    test('aceita um CPF válido sem formatação', () => {
      expect(CpfValidator.validar('11144477735')).toBe(true);
    });

    test('aceita um CPF válido formatado', () => {
      expect(CpfValidator.validar('111.444.777-35')).toBe(true);
    });

    test('rejeita CPF com dígito verificador incorreto', () => {
      expect(CpfValidator.validar('111.444.777-36')).toBe(false);
    });

    test('rejeita CPF com quantidade de dígitos diferente de 11', () => {
      expect(CpfValidator.validar('111.444.777')).toBe(false);
      expect(CpfValidator.validar('111.444.777-355')).toBe(false);
    });

    test('rejeita sequências de dígitos repetidos', () => {
      expect(CpfValidator.validar('000.000.000-00')).toBe(false);
      expect(CpfValidator.validar('111.111.111-11')).toBe(false);
      expect(CpfValidator.validar('99999999999')).toBe(false);
    });

    test('rejeita valores vazios, nulos ou não numéricos', () => {
      expect(CpfValidator.validar('')).toBe(false);
      expect(CpfValidator.validar(null)).toBe(false);
      expect(CpfValidator.validar(undefined)).toBe(false);
      expect(CpfValidator.validar('abc.def.ghi-jk')).toBe(false);
    });
  });

  describe('formatar', () => {
    test('remove pontuação, mantendo apenas dígitos', () => {
      expect(CpfValidator.formatar('111.444.777-35')).toBe('11144477735');
    });

    test('retorna string vazia quando o valor não é uma string', () => {
      expect(CpfValidator.formatar(null)).toBe('');
      expect(CpfValidator.formatar(undefined)).toBe('');
    });
  });

  describe('visualizar', () => {
    test('formata 11 dígitos no padrão 000.000.000-00', () => {
      expect(CpfValidator.visualizar('11144477735')).toBe('111.444.777-35');
    });

    test('retorna o valor original quando não possui 11 dígitos', () => {
      expect(CpfValidator.visualizar('123')).toBe('123');
    });
  });
});