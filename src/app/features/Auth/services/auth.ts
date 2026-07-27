import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../../shared/models/IUser';
import { loginInfo } from '../Models/loginInfo';
import { ISignUp } from '../Models/signupInfo';
@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http=inject(HttpClient)

  signUp(data:FormData){
    return this.http.post<ISignUp>('/auth/v1/signup',data)
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

  getRefreshToken(){
  return  localStorage.getItem('refreshToken')
  }
// const refreshToken=localStorage.getItem('refreshToken')

//   generateNewToken(){
//    const refreshToken=this.generateNewToken
// return this.http.post('/token?grant_type=refresh_token',refreshToken).pipe((
//   tap((res:any)=>{
//           localStorage.setItem('accessToken',res.access_token)
//           localStorage.setItem('refreshToken',res.refresh_token)
// })))
//   }

  forgotPassword(data:FormData){
    return this.http.post('/auth/v1/recover',data)
  }

  updatePassword(data:string){
    return this.http.put('/auth/v1/user',data)
  }
}
