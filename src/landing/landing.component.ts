import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LocationFormComponent } from '../location-form/location-form.component';
import { VideoContainerComponent } from '../video-container/video-container.component';
import { Router, RouterModule } from '@angular/router';
import { MapsService } from '../services/maps.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    LocationFormComponent,
    VideoContainerComponent,
    RouterModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  constructor(private router: Router, public mapsService: MapsService) {}

   async ngOnInit() {
    await this.mapsService.initMaps();
   }


  handleFormAction() {
    this.router.navigate(['/check-quality']);
  }

}
