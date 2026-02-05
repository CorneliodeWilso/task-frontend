import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { UtilsService } from '../../../../core/services/utils.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, SharedModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup
  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utils: UtilsService,
    private router: Router
  ) {}


  ngOnInit(){
    this.registerFormBuilder();
  }

  registerFormBuilder(){
    this.registerForm = this.fb.group(
    {
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: this.passwordMatchValidator }
  );
  }
  passwordMatchValidator(form: any) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordMismatch: true };
  }

  register() {
    if (this.registerForm.invalid) return;

    const { confirmPassword, ...data } = this.registerForm.value;

    this.authService.register(data).subscribe({
      next: () => {
        this.utils.openSnackBar('Usuario registrado correctamente');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.utils.openSnackBar('Error al registrar usuario');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}