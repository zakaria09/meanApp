import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

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
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }
    const { displayName, email, password } = this.signupForm.value;
    this.authService.createUser(displayName, email, password);
    this.signupForm.reset();
  }

}
