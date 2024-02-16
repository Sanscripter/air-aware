import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MapWrapperComponent } from '../map-wrapper/mapWrapper.component';
import { FormValue, SearchFormComponent } from '../search-form/searchForm.component';
import { MapsService } from '../services/maps.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'simulation-view',
  standalone: true,
  templateUrl: './simulationView.component.html',
  styleUrls: ['./simulationView.component.css'],
  imports: [
    CommonModule,
    MapWrapperComponent,
    SearchFormComponent,
    TranslateModule
  ]
})
export class SimulationViewComponent implements OnDestroy {

  suggestedLocations: any[] = [];
  placeCoords: any = null;
  subscriptions: Subscription[] = [];
  apiKey: string = '';
  location: any = null;

  constructor(private mapsService: MapsService) { }

  async ngOnInit() {
    await this.mapsService.initMaps();
    this.subscriptions.push(this.mapsService.placeSuggestions$.subscribe((suggestions: any) => {
      this.suggestedLocations = suggestions;
    }));
    this.subscriptions.push(this.mapsService.locationCoords$.subscribe((coords: any) => {
      this.placeCoords = coords;
    }));
    this.subscriptions.push(this.mapsService.selectedLocation$.subscribe((location: any) => {
      this.location = location;
    }));
    this.subscriptions.push(this.mapsService.localAirquality$.subscribe((airQuality: any) => {
      console.log("localAirquality", airQuality);
    }));

    this.apiKey = this.mapsService.key;

  }


  handleFormOnChange(formValue: FormValue) {
    this.mapsService.getPlaceSuggestions(formValue.location);
  }

  handleFormOnSelected(location: any) {
    this.mapsService.setSelectedLocation(location);
    //update simulation
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
