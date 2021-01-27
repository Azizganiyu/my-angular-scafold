import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { fromEvent, Observable,Subscription } from "rxjs";
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper/helper.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  toggleNavStatus : boolean = false
  resizeObservable$: Observable<Event>
  resizeSubscription$: Subscription

  notificationCount: number = 0

  vendorImage = this._helper.getVendorLogo()

  constructor(
    public auth: AuthService,
    private navigation: NavigationService,
    private router: Router,
    public _helper: HelperService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.resizeObservable$ = fromEvent(window, 'resize')
      this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.closeToggles()
      })
    }
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    this.closeToggles()
  }

  toggleNav(){
    this.toggleNavStatus = !this.toggleNavStatus
    this.navigation.toggle(this.toggleNavStatus)
  }

  confirmLogout(){
    let confirm = this._helper.confirm('Are you sure you want to logout?')
    confirm.afterClosed().subscribe(result => {
      if(result){
        this.auth.logout(this._helper.getSession().id)
      }
    });
  }


  closeToggles(){
    this.toggleNavStatus = false
    this.navigation.toggle(false)
  }

}
