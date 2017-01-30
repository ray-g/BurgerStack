import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Import our app staffs:
import { AppComponent } from './app.component';
import { GlobalState } from './global.state';

// Application Wide Providers
const APP_PROVIDERS = [
  GlobalState
];

// Declare Ng2 Module
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    APP_PROVIDERS
  ]
})

export class AppModule { }
