import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';

import { PositionConstants } from '../../constants/app.constants';

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

  showSnackbar(snackBar: MatSnackBar, message: string) {
    const snackbarConfig: MatSnackBarConfig = {
      politeness: 'assertive',
      duration: 4000,
      horizontalPosition: PositionConstants.TOASTER_POSITION_HORIZONTAL,
      verticalPosition: PositionConstants.TOASTER_POSITION_VERTICAL
    };
    snackBar.open(message, 'x', snackbarConfig);
  }

}
