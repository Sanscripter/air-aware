import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { VideoContainerComponent } from '../video-container/video-container.component';
import { Router, RouterModule } from '@angular/router';
import { MapsService } from '../services/maps.service';
import { FormValue, SearchFormComponent } from '../search-form/searchForm.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SearchFormComponent,
    VideoContainerComponent,
    RouterModule,
    FooterComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  suggestedLocations: any[] = [];

  constructor(private router: Router, public mapsService: MapsService) {}

   async ngOnInit() {
    await this.mapsService.initMaps();
    this.mapsService.placeSuggestions$.subscribe((suggestions: any) => {
      this.suggestedLocations = suggestions;
    });
   }


  handleFormOnChange(formValue: FormValue) {
    this.mapsService.getPlaceSuggestions(formValue.location);
  }

  handleFormOnSelected(location: any) {
    this.mapsService.setSelectedLocation(location);
    this.router.navigate(['/quality']);
  }
}
