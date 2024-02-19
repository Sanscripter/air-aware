import { Routes } from '@angular/router';
import { LandingComponent } from '../landing/landing.component';
import { SimulationViewComponent } from '../simulation-view/simulationView.component';

export const routes: Routes = [
  { path: '', component: LandingComponent},
  { path: 'quality', component: SimulationViewComponent},
  { path: '**', redirectTo: '' }
];
