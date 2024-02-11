import { Routes } from '@angular/router';
import { LandingComponent } from '../landing/landing.component';
import { ConsoleComponent } from '../console/console.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'check-quality', component: ConsoleComponent }
];
