import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '../helper/helper.service';
import { Router } from '@angular/router';

export interface branch{
  message: any,
  data: any
}

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(
    private helper: HelperService,
    private http: HttpClient,
    private router: Router
  ) {
   }

   getBranches(){
    return (
      this.http
        .get<branch>(
          this.helper.getApiUrl() + "agrobox/branch",
          {headers: this.helper.header()}
        )
    );
   }


  create(data){
    return (
      this.http
        .post<branch>(
          this.helper.getApiUrl() + "agrobox/branch/create",
          data,
          {headers: this.helper.header()}
        )
    );
  }

  update(data, id){
    return (
      this.http
        .post<branch>(
          this.helper.getApiUrl() + "agrobox/branch/update/"+id,
          data,
          {headers: this.helper.header()}
        )
    );
  }

  delete(id, ids){
    if(id){
      return this.http.post<branch>(
        this.helper.getApiUrl() + "agrobox/branch/delete/"+id,
        {ids: ids},
         {headers: this.helper.header()}
      )
    }
    else{
      return this.http.post<branch>(
        this.helper.getApiUrl() + "agrobox/branch/delete",
        {ids: ids},
         {headers: this.helper.header()}
        )
    }
  }

}
