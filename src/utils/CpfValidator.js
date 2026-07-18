// Classe de métodos de tratamento/verificação de CPF

export default class CpfValidator {
  
  /**
   * @param {string} cpf
   * @returns {string} apenas os dígitos do CPF
   */
  static formatar(cpf) {
    if (typeof cpf !== 'string') return '';
    return cpf.replace(/\D/g, '');
  }

  /**
   * @param {string} cpf
   * @returns {boolean}
   */
  static validar(cpf) {
    const digitos = CpfValidator.formatar(cpf);
    if (digitos.length !== 11) return false;
    let resto;
    let soma = 0;
    if (digitos.split('').every((digito) => digito === digitos[0])) return false;
    for (let i=1; i<=9; i++) soma = soma + parseInt(digitos.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))  resto = 0;
    if (resto != parseInt(digitos.substring(9, 10)) ) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(digitos.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))  resto = 0;
    if (resto != parseInt(digitos.substring(10, 11) ) ) return false;
    return true;
  }

  /**
   * @param {string} cpf
   * @returns {string}
   */
  static visualizar(cpf) {
    const digits = CpfValidator.formatar(cpf);
    if (digits.length !== 11) return cpf;
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

}