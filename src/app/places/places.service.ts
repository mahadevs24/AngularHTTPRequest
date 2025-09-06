import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();
  httpClient = inject(HttpClient);

  loadAvailablePlaces() {

    return this.getPlaces("http://localhost:3000/places", "error aali");
  }

  loadUserPlaces() {
    return this.getPlaces("http://localhost:3000/user-places", "error aali").pipe(tap({
      next: (userPlaces) => { this.userPlaces.set(userPlaces.places) }
    }));
  }

  addPlaceToUserPlaces(place: Place) {
    this.userPlaces.update((places) => [...places, place])
    return this.httpClient.put("http://localhost:3000/user-places", { placeId: place.id });

  }

  removeUserPlace(place: Place) { }

  private getPlaces(url: string, error: string) {
    return this.httpClient.get<{ places: Place[] }>(url)
  }
}
