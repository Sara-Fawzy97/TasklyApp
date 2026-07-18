import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../../shared/models/IUser';
import { loginInfo } from '../Models/loginInfo';
@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http=inject(HttpClient)

  signUp(data:FormData){
    return this.http.post('/auth/v1/signup',data)
  }

  logIn(data:loginInfo){
    return this.http.post<User>('/auth/v1/token?grant_type=password',data)
  }

  getProfile (){
    return this.http.get<User>('/auth/v1/user')
  }

  logOut(){
    return this.http.post("/auth/v1/logout","")
  }

  refreshToken(reToken:string){
// const refreshToken=localStorage.get()
return this.http.post('/token?grant_type=refresh_token',reToken)
  }
}
