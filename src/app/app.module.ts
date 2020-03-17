import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAnalyticsModule , CONFIG, ScreenTrackingService } from '@angular/fire/analytics';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ShareModule } from '@ngx-share/core';
import { Platform } from '@angular/cdk/platform';
// import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCoffee, fas } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,       // (Required) For share counts
    HttpClientJsonpModule,  // (Optional) Add if you want tumblr share counts
    ShareModule,
    ShareButtonsModule.withConfig({
      debug: true
    }),
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAnalyticsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ {
    provide: CONFIG, useValue: {
      send_page_view: true,
      allow_ad_personalization_signals: false
    }
  } , ScreenTrackingService, Platform],
  bootstrap: [AppComponent],
})
export class AppModule {

 }
