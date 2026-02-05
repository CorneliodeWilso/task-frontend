import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
  /**
   * Utils Service
   * Description: Service that contains necessary utility in the web application
   * @date 2026-02-05
   * @author Cornelio Leal
   * @service
   */
@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog
  ) {}

   /**
   * Description: Show the mat snack bar notification for all the operations in the system
   * @param {string} message 
   * @returns A notification popup
   */
  openSnackBar(message: string) {
    return this.snackBar.open(message, 'OK', {
      duration: 4000,
      verticalPosition: 'top',
    });
  }

  /**
   * Description: Show the loader component when a process is doing
   */
  showLoading() {
    this.loadingSubject.next(true);
  }

  /**
   * Description: Hide the loader component when a process is done
   */
  hideLoading() {
    this.loadingSubject.next(false);
  }

   /**
   * Description: Show a warning modal to confirm an operation
   * @param {string} message 
   * @param {string} title 
   * @returns true if the user Press Confirm Button or false if the user press Cancel button
   */
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
