import { Routes } from '@angular/router';


export const routes: Routes = [
    // Rotas públicas
    {   
        path: "", 
        loadComponent: () => import('./features/home/home')
            .then(m=>m.Home)
    },
    // {   
    //     path: "simulacao-emprestimos-bancarios", 
    //     loadComponent: () => import('./shared/components/fees-calculator/fees-calculator')
    //         .then(m=>m.FeesCalculator)
    // },
    // {   
    //     path: "conversao-taxas", 
    //     loadComponent: () => import('./features/taxes-conversion/taxes-conversion')
    //         .then(m=>m.TaxesConversion)
    // },
    // {   
    //     path: "juros-compostos", 
    //     loadComponent: () => import('./features/compound-interest/compound-interest')
    //         .then(m=>m.CompoundInterest)
    // },
    {   
        path: "contato", 
        loadComponent: () => import('./features/contact/contact')
            .then(m=>m.Contact)
    },

];
