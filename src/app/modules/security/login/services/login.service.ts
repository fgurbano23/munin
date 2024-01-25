import { Injectable } from '@angular/core';
import { LoginFormInterface } from '../models/login-form.interface';
import { of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor() {}

  authenticate(changes: any) {
    return of(changes.user === 'admin' && changes.password === 'admin123').pipe(
      shareReplay(),
    );
  }
}
