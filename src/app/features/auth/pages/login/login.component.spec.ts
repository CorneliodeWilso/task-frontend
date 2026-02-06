import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';
import { UtilsService } from '../../../../core/services/utils.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ResponseModel } from '../../../../core/models/ResponseModel';
import { RouterTestingModule } from '@angular/router/testing';
const mockResponse: ResponseModel = {
  code: 200,
  data: {
    token: 'token123',
  },
  message: 'success',
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authService: jest.Mocked<AuthService>;
  let utilsService: jest.Mocked<UtilsService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn(),
    };

    const utilsServiceMock = {
      showLoading: jest.fn(),
      hideLoading: jest.fn(),
      openSnackBar: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    utilsService = TestBed.inject(UtilsService) as jest.Mocked<UtilsService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('create login form with email and password controls', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.contains('email')).toBe(true);
    expect(component.loginForm.contains('password')).toBe(true);
  });

  it('mark form as invalid when empty some control', () => {
    component.loginForm.setValue({ email: '', password: '' });

    expect(component.loginForm.invalid).toBe(true);
  });

  it('validate email field', () => {
    const emailControl = component.loginForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.invalid).toBe(true);

    emailControl?.setValue('cornelio@gmail.com');
    expect(emailControl?.valid).toBe(true);
  });

  it('validate password minimum length', () => {
    const passwordControl = component.loginForm.get('password');

    passwordControl?.setValue('123');
    expect(passwordControl?.invalid).toBe(true);

    passwordControl?.setValue('12345678');
    expect(passwordControl?.valid).toBe(true);
  });

  it('call authService login and navigate on success', () => {
    authService.login.mockReturnValue(of(mockResponse));

    component.loginForm.setValue({
      email: 'cornelio@gmail.com',
      password: '12345678',
    });

    component.login();

    expect(utilsService.showLoading).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledWith({
      email: 'cornelio@gmail.com',
      password: '12345678',
    });
    expect(utilsService.hideLoading).toHaveBeenCalled();
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.login();

    expect(navigateSpy).toHaveBeenCalledWith(['/tasks']);
  });

  it('show error snackbar on login error', () => {
    authService.login.mockReturnValue(
      throwError(() => new Error('Login error')),
    );

    component.loginForm.setValue({
      email: 'cornelio@gmail.com',
      password: '12345678',
    });

    component.login();

    expect(utilsService.showLoading).toHaveBeenCalled();
    expect(utilsService.hideLoading).toHaveBeenCalled();
    expect(utilsService.openSnackBar).toHaveBeenCalledWith(
      'Ha ocurrido un error al iniciar sesión',
    );
  });
});
