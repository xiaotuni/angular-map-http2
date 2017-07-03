import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {

  Login(obj: any): void {
    console.log(obj);
  }
}