import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  DocumentRef,
  GoogleMapAPILoader,
  GoogleMapAPILoaderConfig,
  MapAPILoader,
  MapModule,
  WindowRef
} from 'angular-maps';
import {SearchComponent} from './search/search.component';
import {WorkingAreaComponent} from './working-area.component';
import {AsideBarComponent} from './aside-bar/aside-bar.component';

@NgModule({
  imports: [
    CommonModule,
    MapModule.forRootGoogle()
  ],
  providers: [{
    provide: MapAPILoader, deps: [], useFactory: GoogleMapServiceProviderFactory
  }],
  declarations: [
    WorkingAreaComponent,
    AsideBarComponent,
    SearchComponent
  ],
  exports: [MapModule,
    WorkingAreaComponent,
    AsideBarComponent,
    SearchComponent]
})
export class WorkingAreaModule {
}

function GoogleMapServiceProviderFactory() {
  const gc: GoogleMapAPILoaderConfig = new GoogleMapAPILoaderConfig();
  gc.apiKey = 'AIzaSyDe2QqXrbtaORvL-I0WHpiI72HxtfTz5Zo';
  gc.enableClustering = true;
  return new GoogleMapAPILoader(gc, new WindowRef(), new DocumentRef());
}
