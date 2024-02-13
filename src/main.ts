import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as Cesium from 'cesium';


//@ts-ignore
window['CESIUM_BASE_URL'] = '/assets/cesium/';
//@ts-ignore
window['Cesium'] = Cesium

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
