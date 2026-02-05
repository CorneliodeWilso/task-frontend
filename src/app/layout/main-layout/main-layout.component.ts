import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
/**
 * Main Layout Component
 * Description: Component responsible for displaying the main page title and the logout button
 * @date 2026-02-05
 * @author Cornelio Leal
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  constructor(private router: Router) {}

  /**
   * Description: responsible to remove the jwt from local storage and redirect the user to login form
   */
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}
