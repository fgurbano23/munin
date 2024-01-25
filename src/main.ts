import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { enableProdMode } from '@angular/core';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);

defineCustomElements(window)
  .then(() => {})
  .catch((e) => {
    console.log('[]ERROR');
  });
