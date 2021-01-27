import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private toastrService: ToastrService,
    @Inject(PLATFORM_ID) private platformId: any,
    private matDialog: MatDialog,
  ) {
    console.log(this.getVendor())
  }

  header() {

    let headers = new HttpHeaders();
    // //headers.set('content-type', 'application/json');
    // headers.set('Accept', 'application/json');
    // let token = this.getToken();
    // if (token) {
    //   alert('there is token')
    //   headers.set('Authorization', 'Bearer ' + token);
    // }
    return headers
  }

  getToken(){
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.hasOwnProperty("token")? window.localStorage.getItem('token'): '';
    }
    else{
      return ''
    }
  }

  setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem('token', token);
    }
  }

  getUser(){
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.hasOwnProperty("user")? JSON.parse(window.localStorage.getItem('user')) : [];
    }
    else{
      return ''
    }
  }

  setUser(user): void {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.setItem('user', JSON.stringify(user));
    }
  }

  setVendor(vendor): void {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.setItem('vendor', JSON.stringify(vendor));
    }
  }

  getVendor(){
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.hasOwnProperty("vendor")? JSON.parse(window.localStorage.getItem('vendor')) : [];
    }
    else{
      return null
    }
  }

  getVendorLogo(){
    if(this.getVendor()){
      return this.getApiImageLink() + this.getVendor().logo
    }
  }

  setSession(session): void {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.setItem('session', JSON.stringify(session));
    }
  }

  getSession(){
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.hasOwnProperty("session")? JSON.parse(window.localStorage.getItem('session')) : [];
    }
    else{
      return null
    }
  }

  setBranch(branch): void {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.setItem('branch', JSON.stringify(branch));
    }
  }

  getBranch(){
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.hasOwnProperty("branch")? JSON.parse(window.localStorage.getItem('branch')) : [];
    }
    else{
      return null
    }
  }

  clearStorage(){
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('vendor');
      window.localStorage.removeItem('session');
      window.localStorage.removeItem('branch');
    }
  }

  getApiUrl(){
    return environment.api.url
  }

  getApiImageLink(){
    return environment.api.imageUrl
  }

  formatAdsDetailPostData(value){

    // Months array
    let months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // Convert timestamp to milliseconds
    let date = new Date(value);

    // Year
    let year = date.getFullYear();

    // Month
    let month = months_arr[date.getMonth()];

    // Day
    let day = date.getDate();

    // Hours
    let hours = date.getHours();

    // Minutes
    let minutes = "0" + date.getMinutes();

    // Seconds
    let seconds = "0" + date.getSeconds();

    // Display date time in MM-dd-yyyy h:m:s format
    let convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return convdataTime

  }

  formatDate(value){

    // Months array
    let months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // Convert timestamp to milliseconds
    let date = new Date(value);

    // Year
    let year = date.getFullYear();

    // Month
    let month = months_arr[date.getMonth()];

    // Day
    let day = date.getDate();

    // Display date time in MM-dd-yyyy h:m:s format
    let convdataTime = day+' '+month+', '+year;

    return convdataTime

  }

  formatTime(value){
    // Convert timestamp to milliseconds
    let now = new Date()
    let date = new Date(value);

    let day = date.getDate();
    let year = date.getFullYear().toString().substr(-2);
    let month = date.getMonth();
    let hours = date.getHours();
    let mins = date.getMinutes();

    return day+ '/' +month+ '/' +year+ ' ' +hours+':'+mins+(hours > 11? 'PM':'AM')
  }

  cutText(name, chars){
    return (name.length > chars)? name.substr(0, chars)+'...': name
  }

  public showSuccess(message, title) {
    this.toastrService.success(message, title);
  }

  public showError(message, title) {
    this.toastrService.error(message, title);
  }

  public showInfo(message, title) {
    this.toastrService.info(message, title);
  }

  public showWarning(message, title) {
    this.toastrService.warning(message, title);
  }

  confirm(title){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: title,
    };
    dialogConfig.autoFocus = false;
    let dialogRef = this.matDialog.open(ConfirmComponent, dialogConfig);
    return dialogRef

  }

}
