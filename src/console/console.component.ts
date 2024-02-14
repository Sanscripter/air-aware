import { Component, OnInit } from '@angular/core';
import { InteractiveViewComponent } from '../InteractiveView/InteractiveView.component';
import { MenuComponent } from '../menu/menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { LocationFormComponent } from '../location-form/location-form.component';
import { MapsService } from '../services/maps.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-console',
  standalone: true,
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css'],
  imports: [
    CommonModule,
    InteractiveViewComponent,
    MenuComponent,
    LocationFormComponent,
    TranslateModule
  ]
})
export class ConsoleComponent implements OnInit {

  location: any = null;

  constructor(public mapsService: MapsService) { }

  ngOnInit() {
    this.mapsService.selectedLocation$.subscribe(location => {
      console.log('Location changed:', location);
      this.location = location;
      this.mapsService.getPlaceCoords();
    });

  }


  handleLocationChange(location: any) {
    console.log('Location changed:', location);
    this.mapsService.setSelectedLocation(location);
  }

}
