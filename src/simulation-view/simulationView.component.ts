import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MapWrapperComponent } from '../map-wrapper/mapWrapper.component';
import { FormValue, SearchFormComponent } from '../search-form/searchForm.component';
import { FooterComponent } from '../footer/footer.component';
import { AirQuality, MapsService, Pollutants } from '../services/maps.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PollutantInfoPipe } from '../pipes/pollutant-info.pipe';
@Component({
  selector: 'simulation-view',
  standalone: true,
  templateUrl: './simulationView.component.html',
  styleUrls: ['./simulationView.component.css'],
  imports: [
    CommonModule,
    MapWrapperComponent,
    SearchFormComponent,
    FooterComponent,
    TranslateModule,
    PollutantInfoPipe
  ]
})
export class SimulationViewComponent implements OnDestroy, AfterViewInit{

  suggestedLocations: any[] = [];
  placeCoords: Location | null = null;
  localAirQuality: AirQuality | null = null;
  localPollutants: Pollutants | null = null;
  subscriptions: Subscription[] = [];
  apiKey: string = process.env['GOOGLE_MAPS_API_KEY'] || '';
  location: any = null;


  constructor(private mapsService: MapsService) { }

  async ngAfterViewInit() {
    await this.mapsService.initMaps();
    this.subscriptions = [
      this.mapsService.placeSuggestions$.subscribe((suggestions: any) => {
        this.suggestedLocations = suggestions;
      }),
      this.mapsService.locationCoords$.subscribe((coords: any) => {
        this.placeCoords = coords;
      }),
      this.mapsService.selectedLocation$.subscribe((location: Location) => {
        this.location = location;
      }),
      this.mapsService.localAirquality$.subscribe((airQuality: AirQuality | null) => {
        this.localAirQuality = airQuality;
      }),
      this.mapsService.localPollutants$.subscribe((pollutants: Pollutants) => {
        this.localPollutants = pollutants;
        this.localPollutants?.results[0]?.measurements.sort((a, b) => {
          return b.value - a.value;
        })
        this.localPollutants!.results[0].measurements = this.localPollutants.results[0].measurements.filter((measurement) => measurement.value > 0);
      })
    ];
    this.apiKey = this.mapsService.key;
  }

  get qualityColorHex() {
    return `rgb(${Object.values(this.localAirQuality!.indexes[0].color).map((v)=> Math.floor(v*255)).join(',')})`
  }

  handleFormOnChange(formValue: FormValue) {
    this.mapsService.getPlaceSuggestions(formValue.location);
  }

  handleFormOnSelected(location: any) {
    this.mapsService.setSelectedLocation(location);
  }


  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
