import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { TranslateModule } from '@ngx-translate/core';
import { MapsService } from '../services/maps.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
          useValue: MapsService
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
});
