import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleMap, MapMarker } from '@angular/google-maps';

import * as environment from '../environment.json';

import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GoogleMap, MapMarker, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: google.maps.Map | undefined;
  title = 'mihai-sitaru-maps-library';
  center: google.maps.LatLngLiteral | google.maps.LatLng = { lat: 24, lng: 12 };
  zoom = 10;
  display: google.maps.LatLngLiteral | google.maps.LatLng | undefined;
  showGoogleMaps = false;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    icon: {
      url: '',
    },
    cursor: 'unset',
    map: null,
    position: { lat: 0, lng: 0 },
  };

  private environment = environment;

  ngOnInit(): void {
    this.loadGoogleMapsScript();
    this.getCurrentPosition().then(
      (position: { latitude: number; longitude: number }) => {
        this.center = { lat: position.latitude, lng: position.longitude };
        this.markerOptions = {
          draggable: false,
          cursor: 'unset',
          map: this.map,
          position: this.center,
        };
      }
    );
  }

  loadGoogleMapsScript(): Promise<boolean | void> {
    const mapApiKey = environment.maps.apiKey;
    const language = environment.maps.language;

    return this.loadGoogleMaps$(mapApiKey, language).then(
      (value: google.maps.MapsLibrary) => {
        if (value) {
          this.showGoogleMaps = true;
        }
      }
    );
  }

  moveMap(event: google.maps.MapMouseEvent) {
    this.center = event?.latLng?.toJSON() ?? { lat: 0, lng: 0 };
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event?.latLng?.toJSON() ?? undefined;
  }

  private getCurrentPosition(): Promise<{
    latitude: number;
    longitude: number;
  }> {
    const result = new Promise<{
      latitude: number;
      longitude: number;
    }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) =>
          resolve({
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
          }),
        () => reject()
      );
    });

    return result;
  }

  private loadGoogleMaps$(
    apiKey: string,
    language = 'en'
  ): Promise<google.maps.MapsLibrary> {
    const loader = new Loader({
      apiKey,
      language,
      version: 'weekly',
    });

    return loader.importLibrary('maps');
  }
}
