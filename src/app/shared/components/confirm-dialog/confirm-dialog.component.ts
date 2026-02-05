import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../shared.module';
/**
 * Confirm Dialog Component
 * Description: Component responsible to show a popup when the user is ready to save an operation
 * @date 2026-02-05
 * @author Cornelio Leal
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title?: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
    },
  ) {}

  /**
   * Description: Close the popup window sending a true value to confirm the operation
   */
  confirm() {
    this.dialogRef.close(true);
  }

  /**
   * Description: Close the popup window sending a false value to decline the operation
   */
  cancel() {
    this.dialogRef.close(false);
  }
}
