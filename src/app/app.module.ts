import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthModule} from './auth/auth.module';
import { WorkingAreaComponent } from './working-area/working-area.component';
import { AsideBarComponent } from './working-area/aside-bar/aside-bar.component';
import {WorkingAreaModule} from './working-area/working-area.module';
import {AngularFireDatabaseModule} from 'angularfire2/database';

const APP_ROUTES: Routes = [
  {
    path: '', redirectTo: 'auth', pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    AuthModule,
    WorkingAreaModule,
   // RouterModule.forRoot(APP_ROUTES)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
