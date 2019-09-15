import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  signupForm: FormGroup;
  private authStatusSub: Subscription;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {validators: [Validators.required]}),
      displayName: new FormControl('', {validators: [Validators.required]})
      });

    this.authStatusSub = this.authService.isAuthenticated
      .subscribe(isAuth => this.isLoading = isAuth);
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }
    this.isLoading = true;
    const { displayName, email, password } = this.signupForm.value;
    this.authService.createUser(displayName, email, password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
