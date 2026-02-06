import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../../core/services/auth.service';
import { UtilsService } from '../../../../core/services/utils.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ResponseModel } from '../../../../core/models/ResponseModel';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let authService: jest.Mocked<AuthService>;
  let utilsService: jest.Mocked<UtilsService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceMock = {
      register: jest.fn(),
    };

    const utilsServiceMock = {
      showLoading: jest.fn(),
      hideLoading: jest.fn(),
      openSnackBar: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    utilsService = TestBed.inject(UtilsService) as jest.Mocked<UtilsService>;
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate');

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('create register form with required controls', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.contains('username')).toBe(true);
    expect(component.registerForm.contains('email')).toBe(true);
    expect(component.registerForm.contains('password')).toBe(true);
    expect(component.registerForm.contains('confirmPassword')).toBe(true);
  });

  it('mark form as invalid when empty some field', () => {
    component.registerForm.setValue({
      username: 'cornelio',
      email: '',
      password: '123',
      confirmPassword: '',
    });

    expect(component.registerForm.invalid).toBe(true);
  });

  it('invalid form when passwords do not match', () => {
    component.registerForm.setValue({
      username: 'cornelio',
      email: 'cornelio@gmail.com',
      password: '12345678',
      confirmPassword: '87654321',
    });

    expect(component.registerForm.errors).toEqual(
      expect.objectContaining({ passwordMismatch: true })
    );
  });

  it('valid form when two passwords match', () => {
    component.registerForm.setValue({
      username: 'cornelio',
      email: 'cornelio@gmail.com',
      password: '12345678',
      confirmPassword: '12345678',
    });

    expect(component.registerForm.valid).toBe(true);
  });

 

  it('register success and navigate to task list', () => {
    const mockResponse: ResponseModel = {
      code: 200,
      data: {},
      message: 'Success',
    };

    authService.register.mockReturnValue(of(mockResponse));

    component.registerForm.setValue({
      username: 'cornelio',
      email: 'cornelio@gmail.com',
      password: '12345678',
      confirmPassword: '12345678',
    });

    component.register();

    expect(utilsService.showLoading).toHaveBeenCalled();
    expect(authService.register).toHaveBeenCalledWith({
      username: 'cornelio',
      email: 'cornelio@gmail.com',
      password: '12345678',
    });
    expect(utilsService.hideLoading).toHaveBeenCalled();
    expect(utilsService.openSnackBar).toHaveBeenCalledWith(
      'Usuario registrado correctamente'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });


  it('show an error in snackbar when register fail', () => {
    authService.register.mockReturnValue(
      throwError(() => new Error('Register error'))
    );

    component.registerForm.setValue({
      username: 'cornelio',
      email: 'cornelio@gmail.com',
      password: '12345678',
      confirmPassword: '12345678',
    });

    component.register();

    expect(utilsService.showLoading).toHaveBeenCalled();
    expect(utilsService.hideLoading).toHaveBeenCalled();
    expect(utilsService.openSnackBar).toHaveBeenCalledWith(
      'Error al registrar usuario'
    );
  });


  it(' navigate to login when Cancel button is pressed', () => {
    component.goToLogin();

    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
