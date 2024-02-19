import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Loader, google } from 'google-maps';
import { BehaviorSubject, Subject, forkJoin } from 'rxjs';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface AirQuality {
  dateTime: string;
  indexes: {
    displayName: string;
    category: string;
    dominantPollutant: string;
    color: {
      red: number,
      green: number,
      blue: number,
    }
  }[]
}

export interface Pollutants {
  meta: {
    name: string;
    description: string;
  };
  results: {
    measurements: {
      parameter: string;
      value: number;
      unit: string;
      lastUpdated: string;
      sourceName: string;
      averagingPeriod: {
        value: number;
        unit: string;
      }
    }[]
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  _selectedLocation: any = null;
  _locationCoords: Location | null = null;
  _placeSuggestions: any[] = [];
  _localAirquality: any = null;
  _localPollutants: any = null;
  google: google | null = null;
  autocomplete: google.maps.places.AutocompleteService | null = null;

  key = process.env['GOOGLE_MAPS_API_KEY'] || "";
  selectedLocation$ = new BehaviorSubject<any>(this._selectedLocation);
  placeSuggestions$ = new Subject<any[]>();
  locationCoords$ = new BehaviorSubject<Location | null>(this._locationCoords);
  localAirquality$ = new BehaviorSubject<AirQuality | null>(this._localAirquality);
  localPollutants$ = new BehaviorSubject<any | null>(this._localPollutants);

  constructor(private http: HttpClient) { }

  async initMaps() {
    if (this.google?.maps) return;
    const googleMapsLoader = new Loader(this.key, {
      version: "weekly",
      libraries: [
        "places",
      ],
    });
    this.google = await googleMapsLoader.load();
    this.autocomplete = new this.google.maps.places.AutocompleteService()
  }

  setSelectedLocation(location: any) {
    this._selectedLocation = location;
    this.selectedLocation$.next(this._selectedLocation);
    this.getPlaceCoords();
  }

  getPlaceSuggestions(input: string) {
    this.autocomplete?.getPlacePredictions({ input }, (results: any, status: any) => {
      this.placeSuggestions$.next(results);
    });
  }

  getPlaceCoords() {
    const geocoder = new this.google!.maps.Geocoder();
    geocoder.geocode({
      placeId: this._selectedLocation.place_id,
    }, (results: any, status: any) => {
      if (status == this.google?.maps.GeocoderStatus.OK) {
        const latitude = results[0].geometry.location.lat();
        const longitude = results[0].geometry.location.lng();
        this._locationCoords = {
          latitude,
          longitude,
        }
        this.locationCoords$.next(this._locationCoords);
        this.getAirQuality();
      }
    });
  }

  getAirQuality() {
    const AirQualityIndexUrl = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${this.key}`;
    const pollutantsIndexUrl = `https://api.openaq.org/v1/latest?coordinates=${this._locationCoords?.latitude.toFixed(8)},${this._locationCoords?.longitude.toFixed(8)}`;
    forkJoin([
      this.http.post(AirQualityIndexUrl, {
        location: this._locationCoords
      }),
      this.http.get(pollutantsIndexUrl)
    ]).subscribe(([airQualityIndex, pollutantsIndex]: any) => {
      this._localAirquality = airQualityIndex;
      this.localAirquality$.next(this._localAirquality);
      this._localPollutants = pollutantsIndex;
      this.localPollutants$.next(this._localPollutants);
    });
  }
}
