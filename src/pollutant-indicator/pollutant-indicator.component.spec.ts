import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutantIndicatorComponent } from './pollutant-indicator.component';
import * as PollutantLevels from '../assets/data/pollutant-levels.json';



describe('PollutantIndicatorComponent', () => {
  let component: PollutantIndicatorComponent;
  let fixture: ComponentFixture<PollutantIndicatorComponent>;
  const mockPollutant = {
    parameter: "pm25",
    value: 10,
    unit: "µg/m³",
    lastUpdated: "2021-09-01T14:00:00Z",
    sourceName: "EEA",
    averagingPeriod: {
      value: 1,
      unit: "hours"
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PollutantIndicatorComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutantIndicatorComponent);
    component = fixture.componentInstance;
    component.pollutant = mockPollutant;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
