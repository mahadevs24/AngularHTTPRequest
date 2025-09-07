import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  private placeService = inject(PlacesService)
  private destroyRef = inject(DestroyRef)
  isFetching = signal(false);
  // places = signal<Place[] | undefined>(undefined);
  places = this.placeService.loadedUserPlaces;
  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.placeService.
      loadUserPlaces()
      .subscribe({

        // next: (resData) => {
        //   console.log(resData)
        //   this.places.set(resData.places)

        // },
        
        complete: () => {
          this.isFetching.set(false);
        },
      }
      )
    this.destroyRef.onDestroy(() => { subscription.unsubscribe() })
    
  }
  onSelectPlace(place:Place) {
      console.log(place.id); 
       const subscription = this.placeService.removeUserPlace(place).subscribe();

       this.destroyRef.onDestroy(()=>{ subscription.unsubscribe()})
    }
}

