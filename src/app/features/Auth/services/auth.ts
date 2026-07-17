import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../Models/User';
@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http=inject(HttpClient)

  signUp(data:FormData){
    return this.http.post('/auth/v1/signup',data)
  }

  logIn(data:User){
    return this.http.post('/auth/v1/token?grant_type=password',data)
  }
}
