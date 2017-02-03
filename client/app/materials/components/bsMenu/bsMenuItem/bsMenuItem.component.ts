import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'bs-menu-item',
  encapsulation: ViewEncapsulation.None,
  styles: ['./bsMenuItem.css'],
  template: './bsMenuItem.html'
})
export class BsMenuItem {

  @Input() menuItem: any;
  @Input() child: boolean = false;

  @Output() itemHover = new EventEmitter<any>();
  @Output() toggleSubMenu = new EventEmitter<any>();

  public onHoverItem($event: any): void {
    this.itemHover.emit($event);
  }

  public onToggleSubMenu($event: any, item: any): boolean {
    $event.item = item;
    this.toggleSubMenu.emit($event);
    return false;
  }
}
