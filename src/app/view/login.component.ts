import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/authService';
import { UserService } from '../services/user.service';
import { user } from '@angular/fire/auth';
@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  id: string = '';
  constructor(
    private auth: AuthService,
    private router: Router,
    private userDetails: UserService
  ) {}

  signInWithGoogle() {
    this.auth
      .googleSignIn()
      .then((res) => {
        console.log('Logged in:', res.user?.displayName);
        this.router.navigateByUrl('/group'); /* navigate(['/login-success']); */
      })
      .catch((err) => console.error('Login error:', err));
  }
  setUser(userId: string) {
    this.userDetails.setUser(userId, this.auth.getDisplayName());
    console.log(
      this.userDetails.getUserId() + ' ' + this.userDetails.getUserName()
    );
    this.router.navigateByUrl('/show-groups');
  }
}
