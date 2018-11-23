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
  private newPoint: Point = new Point();
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
      this.newPoint = new Point();
      const NativeEvent = Object.values(event).find((elem: any) => elem instanceof MouseEvent) as MouseEvent;
      this.pointFormPositionTop = NativeEvent.offsetY;
      this.pointFormPositionLeft = NativeEvent.offsetX;
      this.newPoint.lat = event.latLng.lat();
      this.newPoint.lng = event.latLng.lng();
      this.geocoder.geocode({location: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())},
        (results: any[], status) => {
          console.log(results);
          if (status && results.length) {
            this.isPointFormVisible = true;
            this.zone.run(() => this.cd.detectChanges());
            this.newPoint.address = results[0].formatted_address;
            this.newPoint.keywords = results[0].formatted_address.split(', ');
          }
        });
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
