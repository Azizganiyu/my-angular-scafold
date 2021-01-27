import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '../helper/helper.service';
import { Router } from '@angular/router';

export interface login{
  success: any,
  error: any
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any = null
  redirectLink = ''

  constructor(
    private helper: HelperService,
    private http: HttpClient,
    private router: Router
  ) { }

  loggedIn(){
    if(this.helper.getToken() && this.helper.getUser()){
      return  true
    }
    else{
      return false
    }
  }

  login(data){
    return (
      this.http
        .post<login>(
          this.helper.getApiUrl() + "auth/vlogin",
          data,
          {headers: this.helper.header()}
        )
    );
  }

  logout(id, redirect = null){
    return this.http.get(
      this.helper.getApiUrl()+"auth/logout/"+id,
      {headers: this.helper.header()}
    ).subscribe((data) => {
      this.helper.showSuccess(``, 'Successfully Logged out!')
      this.helper.clearStorage()
      if(!redirect){
        this.redirectLink = ''
      }
      else{
        this.redirectLink = '/'+redirect
      }
      this.router.navigate(['auth'])
    })
  }
}
