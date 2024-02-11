import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as Cesium from 'cesium';


// Cesium.Ion.defaultAccessToken = environment.accessToken;
/* If you need to use Ion Features, you will need to add your personal token, add it at environment and import it at your main.ts for usage. Like above or do it as you wish*/

//@ts-ignore
window['CESIUM_BASE_URL'] = '/assets/cesium/';
//@ts-ignore
window['Cesium'] = Cesium

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
