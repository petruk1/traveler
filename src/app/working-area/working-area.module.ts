import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from './search/search.component';
import {WorkingAreaComponent} from './working-area.component';
import {AsideBarComponent} from './aside-bar/aside-bar.component';
import {MapComponent} from './map/map.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WorkingAreaComponent,
    AsideBarComponent,
    SearchComponent,
    MapComponent
  ],
  exports: [
    MapComponent,
    WorkingAreaComponent,
    AsideBarComponent,
    SearchComponent]
})
export class WorkingAreaModule {
}

