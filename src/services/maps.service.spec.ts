/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MapsService } from './maps.service';
import { HttpClientModule } from '@angular/common/http';

describe.only('Service: Maps', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        MapsService,
      ]
    });
  });

  it('should start', inject([MapsService], (service: MapsService) => {
    expect(service).toBeTruthy();
  }));

  describe('setSelectedLocation', () => {
    it('should set selected location and call get placeCoords', inject([MapsService], (service: MapsService) => {
      const location = { lat: 1, lng: 1 };
      const spy = jest.spyOn(service, 'getPlaceCoords');
      service.setSelectedLocation(location);
      expect(service._selectedLocation).toEqual(location);
      expect(service.selectedLocation$.value).toEqual(location);
      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('updateLocation', () => {
    it('should set locationCoords', inject([MapsService], (service: MapsService) => {
      const location = { lat: jest.fn(() => 1), lng: jest.fn(() => 1) };
      service.updateLocation(location);
      expect(service._locationCoords).toEqual({ latitude: 1, longitude: 1 });
      expect(service.locationCoords$.value).toEqual({ latitude: 1, longitude: 1 });
    }));
  });
});
