
export type Expressao = Fracao | Operacao;

export class Operacao {
  constructor(
    public operador: '+' | '-' | '*' | '/',
    public esquerda: Expressao,
    public direita: Expressao
  ) {}
}

export class Fracao {
  constructor(
    public numerador: number,
    public denominador: number
  ) {}
}

