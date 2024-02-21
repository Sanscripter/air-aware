import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { TranslateModule } from '@ngx-translate/core';
import { MapsService } from '../services/maps.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LandingComponent,
        HttpClientModule,
        TranslateModule.forRoot()
      ],
      providers: [
        {
          provider: MapsService,
          useValue: {
            initMaps: () => {},
            getPlaceSuggestions: () => {},
            setSelectedLocation: () => {},
            placeSuggestions$: of([])
          }
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleFormOnChange', () => {
    it('should call getPlaceSuggestions', () => {
      const formValue = { location: 'location' };
      const getPlaceSuggestionsSpy = jest.spyOn(component.mapsService, 'getPlaceSuggestions');
      component.handleFormOnChange(formValue);
      expect(getPlaceSuggestionsSpy).toHaveBeenCalledWith(formValue.location);
    });

    it('should not call getPlaceSuggestions if location is not sent', () => {
      const formValue = { location: '' };
      const getPlaceSuggestionsSpy = jest.spyOn(component.mapsService, 'getPlaceSuggestions');
      component.handleFormOnChange(formValue);
      expect(getPlaceSuggestionsSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleFormOnSelected', () => {
    it('should call setSelectedLocation and router navigate', () => {
      const location = { location: 'location' };
      const setSelectedLocationSpy = jest.spyOn(component.mapsService, 'setSelectedLocation');
      const navigateSpy = spyOn(component['router'], 'navigate');
      component.handleFormOnSelected(location);
      expect(setSelectedLocationSpy).toHaveBeenCalledWith(location);
      expect(navigateSpy).toHaveBeenCalledWith(['/quality']);
    });
  });

  describe('ngOnInit', () => {
    it('should call initMaps and subscribe to placeSuggestions$', () => {
      const initMapsSpy = jest.spyOn(component.mapsService, 'initMaps');
      component.ngOnInit();
      expect(initMapsSpy).toHaveBeenCalled();
      expect(component.suggestedLocations).toEqual([]);
    });
  });
});
