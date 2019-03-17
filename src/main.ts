import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// require('ajaxhook.js');

if (environment.production) {
  console.log('-----enableProdMode----');
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
