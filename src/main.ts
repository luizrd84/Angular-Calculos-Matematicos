import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { MathfieldElement } from 'mathlive';

registerLocaleData(localePt);
MathfieldElement.fontsDirectory = '/mathlive/fonts';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
