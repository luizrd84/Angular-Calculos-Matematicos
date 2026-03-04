import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { LOCALE_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),        
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]

  
};
