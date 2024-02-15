import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, debounceTime } from 'rxjs';

export interface FormValue {
  location: string;
}

@Component({
  selector: 'search-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './searchForm.component.html',
  styleUrl: './searchForm.component.css'
})
export class SearchFormComponent implements OnDestroy {

  @Input() suggestionsList: any[] = [];//TODO: retype

  @Output() onSelected = new EventEmitter<any>();//TODO: retype
  @Output() onChange = new EventEmitter<FormValue>();


  formGroup: FormGroup;
  subscriptions: Subscription[] = [];
  selectedLocation: any = null;
  isValueSelected: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      location: ['', Validators.required]
    })
    this.subscriptions.push(this.formGroup.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((value: FormValue) => {
      if (this.isValueSelected) {
        this.isValueSelected = false;
        return;
      }
      this.onChange.emit(value);
    }))
  }

  ngOnInit() {
    this.suggestionsList = [];
  }

  setFormValue(location: Record<string, any>) {
    this.formGroup.setValue({ location: location['description'] });
    this.selectedLocation = location;
    this.suggestionsList = [];
    this.isValueSelected = true;
  }

  select() {
    if (this.formGroup.invalid) {
      return;
    }
    this.onSelected.emit(this.selectedLocation);
    this.selectedLocation = null;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
