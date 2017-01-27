import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <h1>Hello {{name}}</h1>
    <main>
      <h1>Happy Chinese New Year!</h1>
      <h2>Value: {{ value }}</h2>
      <button class="increment" (click)="onIncrementClick()">+</button>
      <button class="decrement" (click)="onDecrementClick()">-</button>
    </main>
  `
})
export class AppComponent {
  name = 'BurgerStack';
  value = 0;

  onIncrementClick() {
    this.value = Math.min(100, ++this.value);
  }

  onDecrementClick() {
    this.value = Math.max(-100, --this.value);
  }
}
