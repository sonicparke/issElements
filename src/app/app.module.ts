import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { TemperatureGaugeComponent } from './temperature-gauge/temperature-gauge.component';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [
    AppComponent,
    TemperatureGaugeComponent
  ],
  entryComponents: [
    TemperatureGaugeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [
    AngularFirestore
  ]
})
export class AppModule {
  constructor(private injector: Injector) {}
  ngDoBootstrap() {
    const el = createCustomElement(TemperatureGaugeComponent, { injector: this.injector });
    customElements.define('iss-temperature-gauge', el);
  }
}
