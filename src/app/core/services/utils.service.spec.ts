import { TestBed } from '@angular/core/testing';
import { UtilsService } from './utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { skip } from 'rxjs/operators';

describe('UtilsService', () => {
  let service: UtilsService;
  let snackBar: jest.Mocked<MatSnackBar>;
  let dialog: jest.Mocked<MatDialog>;

  beforeEach(() => {
    const snackBarMock = {
      open: jest.fn(),
    };

    const dialogMock = {
      open: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        UtilsService,
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    });

    service = TestBed.inject(UtilsService);
    snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    dialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('open snack bar with correct configuration', () => {
    service.openSnackBar('Estas seguro de realizar la operacion?');

    expect(snackBar.open).toHaveBeenCalledWith(
      'Estas seguro de realizar la operacion?',
      'OK',
      {
        duration: 4000,
        verticalPosition: 'top',
      }
    );
  });


  it('emit true when showLoading is called', done => {
    service.loading$.subscribe(value => {
      expect(value).toBe(true);
      done();
    });

    service.showLoading();
  });

  it('should emit false when hideLoading is called', done => {
  service.loading$
    .pipe(skip(1))
    .subscribe(value => {
      expect(value).toBe(false);
      done();
    });

  service.hideLoading();
});

  it('open confirm dialog and return true when confirmed button has pressed', () => {
    const afterClosedMock = of(true);

    dialog.open.mockReturnValue({
      afterClosed: () => afterClosedMock,
    } as any);

    service.openConfirmDialog('Realmente desea eliminar la tarea?', 'Confirm').subscribe(result => {
      expect(result).toBe(true);
    });

    expect(dialog.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      expect.objectContaining({
        width: '400px',
        disableClose: true,
        data: {
          title: 'Confirm',
          message: 'Realmente desea eliminar la tarea?',
          confirmText: 'Aceptar',
          cancelText: 'Cancelar',
        },
      })
    );
  });

  it('return false when dialog is cancelled by the user', () => {
    const afterClosedMock = of(false);

    dialog.open.mockReturnValue({
      afterClosed: () => afterClosedMock,
    } as any);

    service.openConfirmDialog('Cancelar').subscribe(result => {
      expect(result).toBe(false);
    });
  });
});