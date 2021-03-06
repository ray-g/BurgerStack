import { Component, ViewEncapsulation } from '@angular/core';

import { GlobalState } from '../../../global.state';

@Component({
  selector: 'bs-page-top',
  styles: ['./bsPageTop.css'],
  template: './bsPageTop.html',
  encapsulation: ViewEncapsulation.None
})
export class BsPageTop {

  public isScrolled = false;
  public isMenuCollapsed = false;

  constructor(private _state: GlobalState) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed: boolean) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled: boolean) {
    this.isScrolled = isScrolled;
  }
}
