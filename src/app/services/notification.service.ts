import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  showError(msg) {
    this.snackBar.open(msg, 'Close', {
      duration: 6000,
      panelClass: 'error'
    })
  }
}
