import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HelperService } from 'src/app/services/helper/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submit:boolean = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  constructor(
    private fb: FormBuilder,
    private router : Router,
    private auth: AuthService,
    private helper: HelperService,
    private device: DeviceDetectorService
  ) { }

  ngOnInit(): void {
  }

  // login(){
  //   this.submit = true;
  //   this.auth.login(this.loginForm.value).subscribe((data) => {
  //     this.helper.setToken(data.access_token);
  //     this.getUser()
  //   }, (error => {
  //     this.submit = false
  //   }));
  // }

  login(){
    this.submit = true;
    this.auth.login({
      ...this.loginForm.value,
      device_info: this.device.getDeviceInfo()
    }).subscribe(response => {
     if(response.success){
       this.submit = false;
       this.helper.showSuccess('Login Successful', 'Operation Successfull')
       this.storeData(response)
     } else{
       this.submit = false;
       this.helper.showError(response.error, "Invalid Login Credentials");
     }
     }, (error)=> {
       this.submit = false;
       this.helper.showError(error, "Invalid Login Credentials");
     })
   }
 
   storeData(response){
     this.helper.setToken(response.token);
     this.helper.setUser(response.user);
     this.helper.setVendor(response.vendor);
     this.helper.setSession(response.session_data);
     this.helper.setBranch(response.branch);
     this.router.navigate([this.auth.redirectLink])
   }


}
