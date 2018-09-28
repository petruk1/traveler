import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer') container: ElementRef;
  @Output() rightClick: EventEmitter<Point> = new EventEmitter();
  private map: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private configs: google.maps.MapOptions = {
    zoom: 8,
    center: {lat: 52, lng: 30}
  };
  public isPointFormVisible = false;
  public pointFormPositionTop = 0;
  public pointFormPositionLeft = 0;
  private newPoint: Point;

  constructor(private cd: ChangeDetectorRef) {
  }

  @Input()
  public set points(pointsArray: Point[]) {
    this.setMarkersOnMap(pointsArray);
  }

  public ngAfterViewInit(): void {
    this.map = new google.maps.Map(this.container.nativeElement, this.configs);
    this.map.addListener('rightclick', (event: any) => {
      this.isPointFormVisible = true;
      this.pointFormPositionTop = event.wa.offsetY;
      this.pointFormPositionLeft = event.wa.offsetX;
      this.newPoint = {lng: event.latLng.lng(), lat: event.latLng.lat()};
      this.cd.detectChanges();


    });
  }

  public createPoint(caption: string) {
    this.newPoint.name = caption;
    this.rightClick.emit(this.newPoint);
    this.isPointFormVisible = false;
  }

  public setCenter(centerLocation: Point): void {
    this.map.setCenter(centerLocation);
  }

  private setMarkersOnMap(points: Point[] = []): void {
    this.markers.forEach((marker: google.maps.Marker) => marker.setMap(null));
    points.forEach((point: Point) => this.markers.push(new google.maps.Marker({position: point, map: this.map})));
  }
}
