import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRef: jest.Mocked<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(async () => {
    const dialogRefMock = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ConfirmDialogComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Confirmación',
            message: '¿Estás seguro de realizar la operacion?',
            confirmText: 'Aceptar',
            cancelText: 'Cancelar',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<
      MatDialogRef<ConfirmDialogComponent>
    >;

    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('receive dialog data correctly', () => {
    expect(component.data.title).toBe('Confirmación');
    expect(component.data.message).toBe('¿Estás seguro de realizar la operacion?');
    expect(component.data.confirmText).toBe('Aceptar');
    expect(component.data.cancelText).toBe('Cancelar');
  });

  test('close dialog with true when confirm is called', () => {
    component.confirm();

    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  test('close dialog with false when cancel is called', () => {
    component.cancel();

    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
