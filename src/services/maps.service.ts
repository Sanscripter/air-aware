import { Injectable } from '@angular/core';
import { Loader, google } from 'google-maps';
import { BehaviorSubject } from 'rxjs';

interface Location {
  latitude: number;
  longitude: number;

}

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  _selectedLocation: any = null;
  _locationCoords: Location | null = null;
  google: google | null = null;
  _placeSuggestions: any[] = [];
  autocomplete: google.maps.places.AutocompleteService | null = null;
  key = process.env['GOOGLE_MAPS_API_KEY'] || "";
  selectedLocation$ = new BehaviorSubject<any>(this._selectedLocation);
  placeSuggestions$ = new BehaviorSubject<any[]>(this._placeSuggestions);
  locationCoords$ = new BehaviorSubject<Location | null>(this._locationCoords);

  constructor() { }

  async initMaps() {
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
    console.log('Location changed:', location);
    this._selectedLocation = location;
    this.selectedLocation$.next(this._selectedLocation);
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
        console.log('Location coords:', this._locationCoords);
        this.locationCoords$.next(this._locationCoords);
      }
    });
  }


}
