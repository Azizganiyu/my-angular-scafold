import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '../helper/helper.service';
import { Router } from '@angular/router';

export interface location{
  status: any
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private url = 'https://locationsng-api.herokuapp.com/api/v1/'

  constructor(
    private helper: HelperService,
    private http: HttpClient,
    private router: Router
  ) { }

  getStates(){
    return (
      this.http
        .get<location>(
          this.url + "states",
          {headers: this.helper.header()}
        )
    );
  }

  getLGAS(state){
    return (
      this.http
        .get<location>(
          this.url + "states/"+state+"/lgas",
          {headers: this.helper.header()}
        )
    );
  }

  getCities(state){
    return (
      this.http
        .get<location>(
          this.url + "states/"+state+"/cities",
          {headers: this.helper.header()}
        )
    );
  }
}
