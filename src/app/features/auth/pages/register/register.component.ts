import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { UtilsService } from '../../../../core/services/utils.service';
import { AuthService } from '../../../../core/services/auth.service';
/**
 * Login Component
 * Description: Component responsible to create a new user
 * @date 2026-02-05
 * @author Cornelio Leal
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, SharedModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utils: UtilsService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.registerFormBuilder();
  }

  /**
   * Description: Function to build the reactive form registerForm with her properties and validations
   */
  registerFormBuilder() {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  /**
   * Description: Function that validates that the two entered passwords match
   */
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  /**
   * Description: get the information of the form and send this to the auth service in the method register
   * If the user is register successfully is redirected to task list automatically
   */
  register() {
    if (this.registerForm.invalid) return;

    const { confirmPassword, ...data } = this.registerForm.value;

    this.authService.register(data).subscribe({
      next: () => {
        this.utils.openSnackBar('Usuario registrado correctamente');
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.utils.openSnackBar('Error al registrar usuario');
      },
    });
  }

  /**
   * Description: When the user press the Cancel button this funcion was called, to redirect the user to the login form
   */
  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
