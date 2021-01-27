import { Injectable, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  open : EventEmitter<boolean>;
  search : EventEmitter<boolean>;


  constructor(
  ) {
    this.open = new EventEmitter<boolean>()
    this.search = new EventEmitter<boolean>()
  }


  toggle(value){
    this.open.emit(value)
  }

  toggleSearch(value){
    this.search.emit(value)
  }
}
