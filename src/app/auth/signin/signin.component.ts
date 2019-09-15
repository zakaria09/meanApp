import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;
  loginForm: FormGroup;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {validators: [Validators.required]})
    });

    this.authStatusSub = this.authService.isAuthenticated
      .subscribe(isAuth => this.isLoading = isAuth);
  }

  openModal() {
    console.log('open modal');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    this.authService.loginUser(email, password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
