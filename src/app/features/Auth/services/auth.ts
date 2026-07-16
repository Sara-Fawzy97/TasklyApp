import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
// import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http=inject(HttpClient)

  signUp(data:FormData){
    // console.log(`${environment.supabaseUrl}`)
    return this.http.post('/auth/v1/signup',data)
  }
}
