import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog
  ) {}

  openSnackBar(message: string) {
    return this.snackBar.open(message, 'OK', {
      duration: 4000,
      verticalPosition: 'top',
    });
  }
  showLoading() {
    this.loadingSubject.next(true);
  }

  hideLoading() {
    this.loadingSubject.next(false);
  }

  openConfirmDialog(
    message: string,
    title = 'Confirmación'
  ): Observable<boolean> {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title,
        message,
        confirmText: 'Aceptar',
        cancelText: 'Cancelar'
      }
    });

    return dialogRef.afterClosed();
  }
}
