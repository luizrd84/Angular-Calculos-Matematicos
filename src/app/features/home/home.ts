import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import 'mathlive';
import { ViewChild } from '@angular/core';
import { ViewChildren } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MathService } from '../../core/services/math-service';
import { Expressao, Operacao, Fracao } from '../../shared/models/math-model';
import { Parser } from '../../shared/parser/parser';
import { MessageModal } from '../../shared/components/message-modal/message-modal';
import { QueryList } from '@angular/core';
import { convertLatexToMarkup } from 'mathlive';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

type ElementosEquacao = Fracao | "+" | "-" | "(" | ")";

@Component({
  selector: 'app-home',
  imports: [FormsModule, MessageModal],
  templateUrl: './home.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './home.css',
})
export class Home {

  textoExibicaoEquacao:string = "Exemplo";  

  //Controles de entrada  
  paineisDemonstracao: { id: number; expressao: string }[] = []; //vai receber as etapas
  exibirPaineisDemonstracao:boolean = false;
  parentesesEmAberto:number= 0;
  elementos: ElementosEquacao[] = [];
  
  //criar um botão de limpar depois... zerando tudo acima. 

  //Controle exibição paineis
  mostrarContainerInclusaoElementos = true;
  mostrarContainerValoresFracao = false;

  //variaveis para guardar os inputs:
  inputNumerador:number | null = null; //[(ngModel)] usar
  inputDenominador:number | null = null; 

  //Mensagens para o Modal
  modalTitle:string ="";
  modalMessage:string = "";

  //Ícones dos botões
  botaoSimboloFracaoPositiva!: SafeHtml;
  botaoSimboloFracaoNegativa!: SafeHtml;

  constructor(private el: ElementRef, private mathService: MathService, private sanitizer: DomSanitizer) {

  }


  async ngAfterViewInit() {
    const mf = this.mathfieldPrincipal.nativeElement;

    await mf.updateComplete; 

    mf.smartFence = false;
    mf.smartMode = false;
    mf.defaultMode = 'text';
    mf.multiline = false;

    mf.setValue('Exemplo = \\frac{55}{15} + \\left(\\frac{25}{3} + \\frac{1}{4} \\right)');
    
    //VALORES QUE AINDA NÃO USEI DO MATHLIVE
    //'\\cdot' + '\\times' + '\\div'

  }

 
  async adicionarElemento(elemento:string) {  
    
    if(elemento === "fracaoPositiva" || elemento === "fracaoNegativa" ) {
      
      //Verifica se o ultimo elemento não é um ")" ou outra fração.      
      if(this.elementos[this.elementos.length-1] !== ")" && 
        !(this.elementos[this.elementos.length-1] instanceof Fracao)) {
        
        //pedir para informar valores
        const { numerador, denominador } = await this.abrirFormularioValoresFracao();
        
        const sinal = elemento === "fracaoNegativa" ? -1 : 1;

        this.elementos.push(
          new Fracao(numerador * sinal, denominador)
        );  
          
        if(this.textoExibicaoEquacao === "Exemplo") {
          this.textoExibicaoEquacao = "\\text{Equação = }";          
        }
        this.textoExibicaoEquacao += `\\frac{${numerador * sinal}}{${denominador}}   `;
                
        if(this.parentesesEmAberto > 0) {
          let equacaotemporaria = this.textoExibicaoEquacao;
          for(let i = 0; i< this.parentesesEmAberto; i++) {
            //equacaotemporaria += "\\placeholder{} \\right.";
            equacaotemporaria += "\\phantom{0} \\right.";
            
          }          
          this.mathfieldPrincipal.nativeElement.setValue(equacaotemporaria);
        }
        else {          
          this.mathfieldPrincipal.nativeElement.setValue(this.textoExibicaoEquacao);        
        }
        
      }
      else {
        //Exibir alguma mensagem modal
        this.modalTitle = "Elemento Inválido";
        this.modalMessage = "Não é possível incluir esse elemento no momento.";
        this.openModal();        
      }
    }
    else if (elemento === "+" || elemento === "-") {
      if(this.elementos.length !== 0) {
        if (this.elementos[this.elementos.length -1] === ")" || 
          this.elementos[this.elementos.length-1] instanceof Fracao ) {
            
            this.elementos.push(elemento);    
             
            this.textoExibicaoEquacao += ` ${elemento} `;

            if(this.parentesesEmAberto > 0) {
              let equacaotemporaria = this.textoExibicaoEquacao;
              for(let i = 0; i< this.parentesesEmAberto; i++) {
                equacaotemporaria += "\\phantom{0} \\right.";                
              }              
              this.mathfieldPrincipal.nativeElement.setValue(equacaotemporaria);
            }
            else {              
              this.mathfieldPrincipal.nativeElement.setValue(this.textoExibicaoEquacao);        
            }
   
        }
        if (this.elementos[this.elementos.length -1] === "(") {
          //Exibir alguma mensagem modal
          this.modalTitle = "Elemento Inválido";
          this.modalMessage = "Não é possível incluir esse operador no momento.";
          this.openModal(); 
        }
      }
      else {
        //Exibir alguma mensagem modal
        this.modalTitle = "Elemento Inválido";
        this.modalMessage = "Não é possível incluir esse operador no momento.";
        this.openModal();        
      }      
    }
    else if (elemento === "(" || elemento === ")") {
      
      if(elemento === "(") {
        if(this.elementos.length === 0 || this.elementos[this.elementos.length-1] === "+" ||
          this.elementos[this.elementos.length-1] === "-" ) {
                
          this.parentesesEmAberto++;
        }
        else {
            //Exibir alguma mensagem modal
            this.modalTitle = "Elemento Inválido";
            this.modalMessage = "Não é possível incluir ( no momento";
            this.openModal(); 
            return;          
        }
        
      }
      if( elemento === ")") {
        if (this.elementos.length === 0 || this.parentesesEmAberto < 1) {
          //Exibir alguma mensagem modal
          this.modalTitle = "Elemento Inválido";
          this.modalMessage = "Não é possível incluir ) sem ter um ( aberto.";
          this.openModal();       
          return;
        }
        if(!(this.elementos[this.elementos.length-1] instanceof Fracao)) {

          if((this.elementos[this.elementos.length-1] !== ")")) {
            //Exibir alguma mensagem modal
            this.modalTitle = "Elemento Inválido";
            this.modalMessage = "Só é possível incluir ) depois de uma fração.";
            this.openModal();       
            return;
          }          
        }        
        if (this.elementos[this.elementos.length-1] === "(") {
          //Exibir alguma mensagem modal
          this.modalTitle = "Elemento Inválido";
          this.modalMessage = "Só é possível incluir ) após (";
          this.openModal();       
          return;
        }
      }
      this.elementos.push(elemento);

      if(this.textoExibicaoEquacao === "Exemplo") {
          this.textoExibicaoEquacao = "\\text{Equação = }";          
      }

      if(elemento === "(") {
        this.textoExibicaoEquacao += "\\left(";        
      }
      else {
        this.parentesesEmAberto--;
        this.textoExibicaoEquacao += "\\right)";  
      }
  
      if(this.parentesesEmAberto > 0) {
        let equacaotemporaria = this.textoExibicaoEquacao;
        for(let i = 0; i< this.parentesesEmAberto; i++) {
          // equacaotemporaria += "\\placeholder{} \\right.";
          equacaotemporaria += "\\phantom{0} \\right.";
        }
        this.mathfieldPrincipal.nativeElement.setValue(equacaotemporaria);
      }
      else {
        this.mathfieldPrincipal.nativeElement.setValue(this.textoExibicaoEquacao);        
      }
    }
    else {
      console.log("Elemento inválido")
    }
  }

  
  calcularResultado() {     

    if(this.parentesesEmAberto === 0 ){
      if(this.elementos.length >= 3) {

        let quantidadeFracoes = 0;
        let quantidadeOperadores = 0;
        
        this.elementos.forEach((elemento) => {
          
          if(elemento instanceof Fracao) {
            quantidadeFracoes++;
          }
          if(elemento === "+" || elemento === "-") {
            quantidadeOperadores++
          }
        });

        //Testa valores mínimos para dar continuidade no calculo.
        if(quantidadeFracoes >= 2 && quantidadeOperadores >= 1) {

          let equacao = "";
          this.elementos.forEach((elemento) => {
            if(elemento instanceof Fracao) {
              equacao+= elemento.numerador + "/" + elemento.denominador;
            }
            else {  
              equacao+= elemento;
            }
          });

          const tokens = Parser.tokenize(equacao);
          const parser = new Parser(tokens);
          const expression = parser.parse();

          const etapas = this.mathService.gerarEtapas(expression);

          //isso vou ter que gerar componentes mathlive
          etapas.forEach((e, i) => {
            if(i === etapas.length - 1) {              
              this.paineisDemonstracao.push({
                id: i+1,
                expressao: "Resultado = " + this.mathService.toLatex(e)
              });
            }
            else {
              this.paineisDemonstracao.push({
                id: i+1,
                expressao: `Etapa\\,` +  `${i+1} = `  + this.mathService.toLatex(e)
              });
            }
          });

          this.exibirPaineisDemonstracao = true;    

        }
      }
      else {
        //Exibir alguma mensagem modal
        this.modalTitle = "Erro ao calcular";
        this.modalMessage = "Quantidade de elementos menor que o necessário.";
        this.openModal();     
      }
    }
    else {
      //Exibir alguma mensagem modal
      this.modalTitle = "Erro ao calcular";
      this.modalMessage = "Existe pelo menos um parenteses em aberto.";
      this.openModal();               
    }      
  }
 

  abrirFormularioValoresFracao(): Promise<{ numerador: number, denominador: number }> {

    this.mostrarContainerValoresFracao = true;
    this.mostrarContainerInclusaoElementos = false;
    this.inputDenominador = null;
    this.inputNumerador = null;

    return new Promise(resolve => {
      this.onConfirmarDigitacaoValores = resolve;
    });
  }


  confirmarDigitacaoValoresFracao() {

    if (Number(this.inputDenominador) !== 0) {
      this.onConfirmarDigitacaoValores({
        numerador: this.inputNumerador!,
        denominador: this.inputDenominador!
      });

      this.mostrarContainerValoresFracao = false;
      this.mostrarContainerInclusaoElementos = true;
    }
    else {
      //Exibir alguma mensagem modal
      this.modalTitle = "Denominador inválido";
      this.modalMessage = "Denominador não pode ser zero.";
      this.openModal();   
    }    
       
  }

  
  // Bloqueia teclas inválidas: só permite números (0-9) 
  apenasNumeros(event: KeyboardEvent) {
    const allowedKeys = ['0','1','2','3','4','5','6','7','8','9', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  //Corrige valores colados ou digitados
  corrigirValor(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  private onConfirmarDigitacaoValores!: (valor: {
    numerador: number;
    denominador: number;
  }) => void;

  limparEquacao() {
    //Zera todas as variaves de controle e arrays.
    this.parentesesEmAberto = 0;
    this.exibirPaineisDemonstracao = false;
    this.textoExibicaoEquacao = "Exemplo";

    this.mathfieldPrincipal.nativeElement.setValue('Exemplo = \\frac{55}{15} + \\left(\\frac{25}{3} + \\frac{1}{4} \\right)');

    this.paineisDemonstracao = [];
    this.elementos = [];
  }

  ngOnInit() {
    const rawSvg =convertLatexToMarkup('\\frac{x}{y}');   
    this.botaoSimboloFracaoPositiva = this.sanitizer.bypassSecurityTrustHtml(rawSvg);
    const rawSvg2 =convertLatexToMarkup('\\frac{-x}{y}');   
    this.botaoSimboloFracaoNegativa = this.sanitizer.bypassSecurityTrustHtml(rawSvg2);
  }

  //Utilização do Modal
  showModal = false;
  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

  //Elementos do mathlive
  @ViewChild('mfPrincipal') mathfieldPrincipal!: ElementRef; 
  @ViewChildren('mfPassos') mathfieldsPassos!: QueryList<ElementRef>;

}
