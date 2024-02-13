import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LocationFormComponent } from '../location-form/location-form.component';
import { VideoContainerComponent } from '../video-container/video-container.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    LocationFormComponent,
    VideoContainerComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {


  handleLocationChange(location: any) {
    console.log(location);
  }

}
