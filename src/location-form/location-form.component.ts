import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './location-form.component.html',
  styleUrl: './location-form.component.css'
})
export class LocationFormComponent {

  @Output() locationString = new EventEmitter<string>();

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder ) {
    this.formGroup = this.formBuilder.group({
      location: ['', Validators.required]
    });
   }

   emitLocationString() {
      if (this.formGroup.invalid) {
         return;
      }
      this.locationString.emit(this.formGroup.value.location);
   }

}
