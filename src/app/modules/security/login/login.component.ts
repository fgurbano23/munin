import { Component } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { LoginFormInterface } from './models/login-form.interface';
import { LoginService } from './services/login.service';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { MatCard } from '@angular/material/card';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInput,
    MatFormField,
    MatLabel,
    MatButton,
    ReactiveFormsModule,
    JsonPipe,
    AsyncPipe,
    MatCard,
    RouterLink,
    MatToolbarRow,
    MatToolbar,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup<LoginFormInterface> =
    this.formBuilder.group<LoginFormInterface>({
      user: new FormControl<string>(''),
      password: new FormControl<string>(''),
    });

  authentication = new BehaviorSubject<boolean>(false);
  authenticationFailed$ = this.authentication.asObservable();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
  ) {}

  login() {
    const value = this.form.value;
    this.loginService
      .authenticate(value)
      .pipe(
        tap((status) => {
          const failed = !status;
          if (failed) this.authentication.next(failed);
        }),
      )
      .subscribe(async (status) => {
        if (status) this.router.navigate(['home']);
      });
  }
}
