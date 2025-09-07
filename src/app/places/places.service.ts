import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();
  httpClient = inject(HttpClient);
  errorService = inject(ErrorService);

  loadAvailablePlaces() {

    return this.getPlaces("http://localhost:3000/places", "error aali");
  }

  loadUserPlaces() {
    return this.getPlaces("http://localhost:3000/user-places", "error aali").pipe(tap({
      next: (userPlaces) => { this.userPlaces.set(userPlaces.places) }
    }));
  }

  addPlaceToUserPlaces(place: Place) {
    const previousPlaces = this.userPlaces();
    if(!previousPlaces.some(p => p.id === place.id)){
      this.userPlaces.set([...previousPlaces, place]);
    }
    
    
   
    return this.httpClient.put("http://localhost:3000/user-places", { placeId: place.id })
    .pipe(
      catchError(
        
        error =>   {
          this.userPlaces.set(previousPlaces);
          this.errorService.showError('Could not add place. Please try again later.');
          return   throwError(()=>new Error('did not update'))
        }
      ));
 

  }

  removeUserPlace(place: Place) { 


    const previousPlaces = this.userPlaces();
    const newPlaces = previousPlaces.filter(p => p.id !== place.id);
    this.userPlaces.set(newPlaces);
    return this.httpClient.delete("http://localhost:3000/user-places/" + place.id)
    .pipe(catchError(error=>{
      this.userPlaces.set(previousPlaces);
      this.errorService.showError('Could not remove place. Please try again later.');
      return throwError(()=>new Error('did not update'))
    }))
  }

  private getPlaces(url: string, error: string) {
    return this.httpClient.get<{ places: Place[] }>(url)
  }
}
