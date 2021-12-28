import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loaderSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  triggerLoader(display: boolean, screen: string) {
    this.loaderSubject.next(display);
  }

  getLoaderState(): Observable<boolean> {
    return this.loaderSubject.asObservable();
  }

}
