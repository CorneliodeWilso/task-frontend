import { Component } from '@angular/core';
import {SharedModule } from '../../../../shared/shared.module';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UtilsService } from '../../../../core/services/utils.service';
RouterLink

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup

  constructor(private fb: FormBuilder, 
              private authService: AuthService,
              private router: Router,
              private utils: UtilsService) {

  }

  ngOnInit() {
    this.loginFormBuilder();
  }

  loginFormBuilder(){
    this.loginForm = this.fb.group({
      email: ["", [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required]],
      password: ["", [Validators.minLength(8),Validators.required]]
    })
  }

  login(){
    this.utils.showLoading();
   console.log(this.loginForm.value) 
   this.authService.login(this.loginForm.value).subscribe({
    next: (response) => {
      this.utils.hideLoading();
      this.router.navigate(['/tasks']);
    }, error: (err)=> {
      this.utils.hideLoading();
      this.utils.openSnackBar("Ha ocurrido un error al iniciar sesión")
    }
   })
  }

}