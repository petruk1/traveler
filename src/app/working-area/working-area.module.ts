import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from './search/search.component';
import {WorkingAreaComponent} from './working-area.component';
import {AsideBarComponent} from './aside-bar/aside-bar.component';
import {MapComponent} from './map/map.component';
import {PointCreationComponent} from './point-creation/point-creation.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ComboBoxComponent } from './aside-bar/combo-box/combo-box.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  declarations: [
    WorkingAreaComponent,
    AsideBarComponent,
    SearchComponent,
    MapComponent,
    PointCreationComponent,
    ComboBoxComponent
  ],
  exports: [
    MapComponent,
    WorkingAreaComponent,
    AsideBarComponent,
    SearchComponent]
})
export class WorkingAreaModule {
}

