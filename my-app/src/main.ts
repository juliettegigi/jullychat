// el archivo main es el punto de entrada de la aplicación Angular

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

//bootstrapApplication es la función que arranca la aplicación Angular
//appConfig es la configuración de la aplicación, que incluye rutas y otros metadatos
// AppComponent es el componente raíz de la aplicación
// En Angular moderno, se usa bootstrapApplication para iniciar la aplicación sin necesidad de un módulo raíz

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
