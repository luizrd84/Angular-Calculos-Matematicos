import { Injectable } from '@angular/core';
import { Expressao, Operacao, Fracao} from '../../shared/models/math-model';


@Injectable({
  providedIn: 'root',
})
export class MathService {

  constructor() {

  }

  
  somar(a: Fracao, b: Fracao): Fracao {
    const num = a.numerador * b.denominador + b.numerador * a.denominador;
    const den = a.denominador * b.denominador;
    return this.simplificar(new Fracao(num, den));
  }


  multiplicar(a: Fracao, b: Fracao): Fracao {
    return this.simplificar(
      new Fracao(
        a.numerador * b.numerador,
        a.denominador * b.denominador
      )
    );
  }

  subtrair(a: Fracao, b: Fracao): Fracao {
    const num = a.numerador * b.denominador - b.numerador * a.denominador;
    const den = a.denominador * b.denominador;
    return this.simplificar(new Fracao(num, den));
  }


  mdc(a: number, b: number): number {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return Math.abs(a);
  }


  simplificar(f: Fracao): Fracao {
    const divisor = this.mdc(f.numerador, f.denominador);
    return new Fracao(
      f.numerador / divisor,
      f.denominador / divisor
    );
  }


  aplicarOperacao(op: Operacao): Fracao {
    const a = op.esquerda as Fracao;
    const b = op.direita as Fracao;

    switch (op.operador) {
      case '+': return this.somar(a, b);
      case '*': return this.multiplicar(a, b);
      case '-': return this.subtrair(a,b);
      default: throw new Error("Operador não suportado");
    }
  }


  resolverPasso(expr: Expressao): Expressao {

    if (expr instanceof Fracao) return expr;

    // Se ambos já são frações → resolve
    if (expr.esquerda instanceof Fracao &&
        expr.direita instanceof Fracao) {

      return this.aplicarOperacao(expr);
    }

    // Caso contrário resolve primeiro os filhos
    return new Operacao(
      expr.operador,
      this.resolverPasso(expr.esquerda),
      this.resolverPasso(expr.direita)
    );
  }


  gerarEtapas(expr: Expressao): Expressao[] {
    const etapas: Expressao[] = [];
    let atual = expr;

    while (!(atual instanceof Fracao)) {
      atual = this.resolverPasso(atual);
      etapas.push(atual);
    }

    return etapas;
  }


  toLatex(expr: Expressao): string {

    if (expr instanceof Fracao) {
      return `\\frac{${expr.numerador}}{${expr.denominador}}`;
    }

    const esquerda = this.toLatex(expr.esquerda);
    const direita = this.toLatex(expr.direita);

    return `(${esquerda} ${expr.operador} ${direita})`;
  }

  
}
