# Simulador de Financiamento

Aplicação web desenvolvida em Angular para simulação de financiamentos com cálculo de:

- Valor total financiado
- IOF (fixo + variável)
- TAC (tarifa de abertura de crédito)
- Parcelas no sistema PRICE
- Parcelas no sistema SAC

O projeto permite alternar entre Pessoa Física (PF) e Pessoa Jurídica (PJ), aplicando automaticamente as regras vigentes de IOF.

## Tecnologias Utilizadas

- Angular 17+
- TypeScript
- HTML5
- CSS3
- Angular Forms (ngModel)
- Intl API (formatação monetária)

## Funcionalidades

✔ Simulação de financiamento  
✔ Cálculo automático de IOF (fixo + variável até 365 dias)  
✔ Cálculo de parcelas no sistema PRICE  
✔ Cálculo de parcelas no sistema SAC  
✔ Alternância entre PF e PJ  
✔ Formatação automática de valores monetários (R$)  
✔ Modal de validação de campos

## Regras de IOF Utilizadas (2026)

### Pessoa Física (PF)

- 0,38% fixo
- 0,0082% ao dia (limitado a 365 dias)

### Pessoa Jurídica (PJ)

- 0,95% fixo
- 0,0082% ao dia (limitado a 365 dias)

## Futuros Updates

- Implementar a opção de carência nos cálculos
- Adicionar página de conversão de taxas (mensal ↔ anual)
- Adicionar página de cálculo de juros compostos

## Demostração do Projeto

- https://angular-calculos-financeiros.vercel.app/

## Como Executar o Projeto

```bash
# instalar dependências
npm install

# rodar aplicação
ng serve

```

### Autor

- Desenvolvido por Luiz Ricardo Dias.
