export function esTextoValido(texto: string): boolean {
    return texto.trim().length > 0;
  }

export function validarNumero(valor: string): boolean {
    return /^[0-9]+(\.[0-9]+)?$/.test(valor);
  }
  
