import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MapsService } from '../services/maps.service';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './location-form.component.html',
  styleUrl: './location-form.component.css'
})
export class LocationFormComponent {

  @Output() confirmedLocation = new EventEmitter<any>();

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, public mapsService: MapsService) {
    this.formGroup = this.formBuilder.group({
      location: ['', Validators.required]
    })
    this.formGroup.valueChanges.subscribe((value) => {
      this.mapsService.getPlaceSuggestions(value.location);
    });
   }

   updateLocation() {
      if (this.formGroup.invalid) {
         return;
      }
      this.confirmedLocation.emit(this.formGroup.value);
   }

   setFormValue(location: Record<string, any>) {
      this.formGroup.setValue({ location: location['description'] });
      this.mapsService.placeSuggestions$.next([]);
      this.mapsService.setSelectedLocation(location);
   }

}
