import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Loader, google } from 'google-maps';
import { BehaviorSubject } from 'rxjs';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface AirQuality {
  indexes: {
    color: {
      red: number,
      green: number,
      blue: number,
    }
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
  google: google | null = null;
  autocomplete: google.maps.places.AutocompleteService | null = null;

  key = process.env['GOOGLE_MAPS_API_KEY'] || "";
  selectedLocation$ = new BehaviorSubject<any>(this._selectedLocation);
  placeSuggestions$ = new BehaviorSubject<any[]>(this._placeSuggestions);
  locationCoords$ = new BehaviorSubject<Location | null>(this._locationCoords);
  localAirquality$ = new BehaviorSubject<AirQuality | null>(this._localAirquality);

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
    const url = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${this.key}`;
    this.http.post(url,{
      location: this._locationCoords
    })
    .subscribe((response) => {
      console.log("OPENQA", response);
      this._localAirquality = response;
      this.localAirquality$.next(response as AirQuality);
    });
  }


}
