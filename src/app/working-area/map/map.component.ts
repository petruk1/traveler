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
    this.map.addListener('rightclick', (event: any) => {
      this.isPointFormVisible = true;
      this.pointFormPositionTop = event.wa.offsetY;
      this.pointFormPositionLeft = event.wa.offsetX;
      this.newPoint = {lng: event.latLng.lng(), lat: event.latLng.lat()};
      this.geocoder.geocode({location: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())},
        (results, status) => {
          if (status) {
            this.newPoint.address = results[0].formatted_address;
          }
        });
      this.zone.run(() => this.cd.detectChanges());
    });
  }

  public createPoint(caption: string): void {
    this.newPoint.name = caption;
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
