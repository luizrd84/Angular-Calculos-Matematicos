import { Expressao, Fracao, Operacao } from '../models/math-model';

type Token =
  | { type: 'NUMBER'; value: number }
  | { type: 'OP'; value: '+' | '-' | '*' | '/' }
  | { type: 'LPAREN' }
  | { type: 'RPAREN' };

export class Parser {
  
    private pos = 0;
  
    constructor(private tokens: Token[]) {
      
    }
  
    parse(): Expressao {
      return this.parseExpression();
    }
  
    private peek(): Token | null {
      return this.tokens[this.pos] ?? null;
    }
  
    private consume(): Token {
      return this.tokens[this.pos++];
    }
   
  
    static tokenize(input: string): Token[] {
      const tokens: Token[] = [];
      const regex = /\d+|[()+\-*/]/g;
  
      const matches = input.match(regex);
      if (!matches) return [];
  
      for (const m of matches) {
        if (/^\d+$/.test(m)) {
          tokens.push({ type: 'NUMBER', value: Number(m) });
        } else if (m === '(') {
          tokens.push({ type: 'LPAREN' });
        } else if (m === ')') {
          tokens.push({ type: 'RPAREN' });
        } else {
          tokens.push({ type: 'OP', value: m as any });
        }
      }
  
      return tokens;
    }

    
    private isOpToken(token: Token | null): token is Extract<Token, { type: 'OP' }> {
        return token !== null && token.type === 'OP';
    }
  

    private parseExpression(): Expressao {
        let node = this.parseTerm();
        
        while (true) {
            const token = this.peek();
            if (!this.isOpToken(token) || (token.value !== '+' && token.value !== '-')) 
                break;
            
            const opToken = this.consume();
            if (!this.isOpToken(opToken)) {
              throw new Error('Token inesperado');
            }
            const op = opToken.value as '+' | '-';

            const right = this.parseTerm();
            node = new Operacao(op, node, right);
        }
    
        return node;
    }
      

    private parseTerm(): Expressao {
      let node = this.parseFactor();
  
     while (true) {
        const token = this.peek();
        if (!this.isOpToken(token) || (token.value !== '*' && token.value !== '/')) 
            break;

        const opToken = this.consume();
        if (!this.isOpToken(opToken)) {
          throw new Error('Token inesperado');
        }        
        const op = opToken.value as '*' | '/';

        const right = this.parseFactor();
        node = new Operacao(op, node, right);
      }  
      return node;
    }

  
    private parseFactor(): Expressao {

      let token = this.peek();

      if (!token) throw new Error('Expressão inválida');

      // 🔥 TRATAR OPERADORES UNÁRIOS (+ e -)
      if (this.isOpToken(token) && (token.value === '+' || token.value === '-')) {
        
        const opToken = this.consume();

        if (!this.isOpToken(opToken)) {
          throw new Error("Operador esperado");
        }

        const op = opToken.value;
    
        const fator = this.parseFactor(); // recursivo!

        if (op === '+') {
          return fator; // + não muda nada
        }

        // se for número/fração simples
        if (fator instanceof Fracao) {
          return new Fracao(-fator.numerador, fator.denominador);
        }

        // se for expressão (ex: -(3+2))
        return new Operacao('*', new Fracao(-1, 1), fator);
      }

      // 🔹 NÚMERO
      if (token.type === 'NUMBER') {
        this.consume();

        const next = this.peek();

        if (this.isOpToken(next) && next.value === '/') {
          this.consume();
          const denom = this.consume();

          if (denom.type !== 'NUMBER') {
            throw new Error('Denominador inválido');
          }

          return new Fracao(token.value, denom.value);
        }

        return new Fracao(token.value, 1);
      }

      // 🔹 PARÊNTESES
      if (token.type === 'LPAREN') {
        this.consume();
        const node = this.parseExpression();

        if (this.peek()?.type !== 'RPAREN') {
          throw new Error('Parêntese não fechado');
        }

        this.consume();
        return node;
      }

      throw new Error('Token inesperado');
    }   

}
  