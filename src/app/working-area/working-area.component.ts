import {Component, OnInit, ViewChild} from '@angular/core';
import {IBox, IMapOptions} from 'angular-maps';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-working-area',
  templateUrl: './working-area.component.html',
  styleUrls: ['./working-area.component.scss']
})
export class WorkingAreaComponent implements OnInit {
  protected points;
  @ViewChild('map') map;
  public options: IMapOptions = {
    disableBirdseye: false,
    disableStreetside: false,
    navigationBarMode: 2,
    center: {longitude: 40, latitude: 30},
    centerOffset: {x: 60, y: 60},
    zoom: 6
  };
  private _box: IBox = {
    maxLatitude: 32,
    maxLongitude: -92,
    minLatitude: 29,
    minLongitude: -98
  };

  constructor(private fireService: FirebaseService) {
  }

  ngOnInit() {
    this.fireService.login({email: 'test@gmail.com', password: 'test@gmail.com'});
    this.fireService.points.subscribe((pointsArray: object[]) => {
      this.points = pointsArray;
    });
  }

  public createPoint(e: any): void {
    this.fireService.createPoint({lat: e.latLng.lat(), lng: e.latLng.lng()});
  }

}
