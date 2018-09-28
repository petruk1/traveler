import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from './search/search.component';
import {WorkingAreaComponent} from './working-area.component';
import {AsideBarComponent} from './aside-bar/aside-bar.component';
import {MapComponent} from './map/map.component';
import { PointCreationComponent } from './point-creation/point-creation.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WorkingAreaComponent,
    AsideBarComponent,
    SearchComponent,
    MapComponent,
    PointCreationComponent
  ],
  exports: [
    MapComponent,
    WorkingAreaComponent,
    AsideBarComponent,
    SearchComponent]
})
export class WorkingAreaModule {
}

