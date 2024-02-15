/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimulationViewComponent } from './simulationView.component';
import { TranslateModule } from '@ngx-translate/core';
import { MapsService } from '../services/maps.service';
import { CommonModule } from '@angular/common';
import { MapWrapperComponent } from '../map-wrapper/mapWrapper.component';
import { SearchFormComponent } from '../search-form/searchForm.component';


describe('SimulationViewComponent', () => {
  let component: SimulationViewComponent;
  let fixture: ComponentFixture<SimulationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SimulationViewComponent,
        CommonModule,
        SearchFormComponent,
        MapWrapperComponent,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();

    // fixture = TestBed.createComponent(SimulationViewComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
