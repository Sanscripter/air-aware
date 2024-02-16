/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MapsService } from './maps.service';
import { HttpClientModule } from '@angular/common/http';

describe('Service: Maps', () => {
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

  it('should ...', inject([MapsService], (service: MapsService) => {
    expect(service).toBeTruthy();
  }));
});
