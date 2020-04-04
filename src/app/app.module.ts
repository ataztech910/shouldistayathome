import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAnalyticsModule , CONFIG, ScreenTrackingService } from '@angular/fire/analytics';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ShareModule } from '@ngx-share/core';
import { Platform } from '@angular/cdk/platform';
import { DrawcanvasComponent } from './drawcanvas/drawcanvas.component';
import { ChoosecolorComponent } from './drawcanvas/choosecolor/choosecolor.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@NgModule({
  declarations: [
    AppComponent,
    DrawcanvasComponent,
    ChoosecolorComponent,
  ],
  imports: [
    FontAwesomeModule,
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
    AngularFirestoreModule,
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
