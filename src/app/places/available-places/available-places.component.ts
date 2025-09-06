import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  private placeService = inject(PlacesService)
  private destroyRef = inject(DestroyRef)
  isFetching = signal(false);
  places = signal<Place[] | undefined>(undefined);
  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.placeService.loadAvailablePlaces().subscribe(
      {
        next: (resData) => {
          console.log(resData)
          this.places.set(resData.places)

        },
        complete: () => {
          this.isFetching.set(false);
        },
      }
    )
    this.destroyRef.onDestroy(() => { subscription.unsubscribe() })
  }

  navigateToPage(selectedPlace: Place) {
    const subscription = this.placeService.addPlaceToUserPlaces(selectedPlace)
      .subscribe({
        next: (resdata) => {
          console.log(resdata);
        }
      })
    this.destroyRef.onDestroy(() => { subscription.unsubscribe() })
  }

}
