import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '../helper/helper.service';
import { Router } from '@angular/router';

export interface response{
  success: any,
  message: any,
  errors: any,
  total: any,
  data: any
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(
    private helper: HelperService,
    private http: HttpClient,
    private router: Router
    ) { }

  uploadCoopMembers(data)
  	{
      return (
        this.http
          .post<response>(
            this.helper.getApiUrl() + 'agrobox/member/upload/' + this.helper.getVendor().id,
            data,
            {headers: this.helper.header()}
          )
      );
    }


    getMembers(){
      return (
        this.http
          .get<response>(
            this.helper.getApiUrl() + "agrobox/member",
            {headers: this.helper.header()}
          )
      );
     }

    getMembersByBranch(id){
      return (
        this.http
          .get<response>(
            this.helper.getApiUrl() + "agrobox/member/branch/"+id,
            {headers: this.helper.header()}
          )
      );
     }


    create(data){
      return (
        this.http
          .post<response>(
            this.helper.getApiUrl() + "agrobox/member/create",
            data,
            {headers: this.helper.header()}
          )
      );
    }

    update(data, id){
      return (
        this.http
          .post<response>(
            this.helper.getApiUrl() + "agrobox/member/update/"+id,
            data,
            {headers: this.helper.header()}
          )
      );
    }

    delete(id, ids){
      if(id){
        return this.http.post<response>(
          this.helper.getApiUrl() + "agrobox/member/delete/"+id,
          {ids: ids},
           {headers: this.helper.header()}
        )
      }
      else{
        return this.http.post<response>(
          this.helper.getApiUrl() + "agrobox/member/delete",
          {ids: ids},
           {headers: this.helper.header()}
          )
      }
    }

}
