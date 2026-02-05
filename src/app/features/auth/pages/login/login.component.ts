import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UtilsService } from '../../../../core/services/utils.service';
/**
 * Login Component
 * Description: Component responsible for operations related to user login
 * @date 2026-02-05
 * @author Cornelio Leal
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private utils: UtilsService,
  ) {}

  ngOnInit() {
    this.loginFormBuilder();
  }

  /**
   * Description: Function to build the reactive form loginForm with her properties and validations
   */
  loginFormBuilder() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]],
    });
  }

  /**
   * Description: Function that call the AuthService and use the login method
   * if the loggin return successfull then the user has redirect to the task list
   */
  login() {
    this.utils.showLoading();
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.utils.hideLoading();
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.utils.hideLoading();
        this.utils.openSnackBar('Ha ocurrido un error al iniciar sesión');
      },
    });
  }
}
