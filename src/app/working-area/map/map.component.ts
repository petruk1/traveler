import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild
} from '@angular/core';
import {Point} from '../classes';
import LatLngLiteral = google.maps.LatLngLiteral;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer')
  private container: ElementRef;

  @Input()
  public set points(pointsArray: Point[]) {
    this.setMarkersOnMap(pointsArray);
  }

  @Output()
  private pointReady: EventEmitter<Point> = new EventEmitter();

  public isPointFormVisible = false;
  public pointFormPositionTop = 0;
  public pointFormPositionLeft = 0;
  private map: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private newPoint: Point;
  private geocoder = new google.maps.Geocoder();
  private configs: google.maps.MapOptions = {
    zoom: 8,
    center: {lat: 52, lng: 30}
  };

  constructor(private cd: ChangeDetectorRef,
              private zone: NgZone) {
  }

  public ngAfterViewInit(): void {
    this.map = new google.maps.Map(this.container.nativeElement, this.configs);
    this.map.addListener('dragstart', () => {
      this.isPointFormVisible = false;
      this.zone.run(() => this.cd.detectChanges());
    });
    this.map.addListener('rightclick', (event: any) => {
      const nativeJSEvent = Object.values(event).find((elem: any) => elem instanceof MouseEvent) as MouseEvent;
      this.isPointFormVisible = true;
      this.pointFormPositionTop = nativeJSEvent.offsetY;
      this.pointFormPositionTop = nativeJSEvent.offsetY;
      this.pointFormPositionLeft = nativeJSEvent.offsetX;
      this.newPoint = new Point( event.latLng.lat(), event.latLng.lng());

      this.geocoder.geocode({location: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())},
        (results, status) => {
          if (status && results) {
            this.newPoint.setAddress(results[0].formatted_address);
            for (let i = 0; i < results[0].address_components.length; i++) {
              if (results[0].address_components[i].types.indexOf('country') !== -1) {
                this.newPoint.setCountry(results[0].address_components[i]);
              }
            }
          }
        });
      this.zone.run(() => this.cd.detectChanges());
    });
  }

  public createPoint(caption: string): void {
    this.newPoint.setName(caption);
    this.pointReady.emit(this.newPoint);
    this.isPointFormVisible = false;
  }

  public setCenter(centerLocation: Point): void {
    this.map.setCenter(centerLocation);
  }

  public setMarkersOnMap(points: Point[] = []): void {
    this.markers.forEach((marker: google.maps.Marker) => marker.setMap(null));
    points.forEach((point: Point) => this.markers.push(new google.maps.Marker({position: point, map: this.map})));
  }
}
