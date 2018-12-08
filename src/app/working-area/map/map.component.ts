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
import {getPageHeight, getPageWidth} from '../../utils';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer')
  private container: ElementRef;
  @ViewChild('searchBox')
  private searchBoxInputElement: ElementRef;

  @Input()
  public set points(pointsArray: Point[]) {
    this.setMarkersOnMap(pointsArray);
  }

  @Output()
  private pointReady: EventEmitter<Point> = new EventEmitter();

  public isPointFormVisible = false;
  public pointFormPositionTop = 0;
  public pointFormPositionLeft = 0;
  public pointFormWidth = 300;
  public pointFormHeight = 60;
  public pointFormPaddingTopBottom = 20;
  public pointFormPaddingLeftRight = 20;
  public isSearchBoxVisible = false;
  private map: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private searchedPlaceMarkers: google.maps.Marker[] = [];
  private newPoint: Point;
  private geocoder = new google.maps.Geocoder();
  private configs: google.maps.MapOptions = {
    zoom: 8,
    center: {lat: 52, lng: 30}
  };
  private searchBox: google.maps.places.SearchBox;
  private newPointMarker: google.map.Marker;

  constructor(private cd: ChangeDetectorRef,
              private zone: NgZone) {
  }

  public ngAfterViewInit(): void {
    this.map = new google.maps.Map(this.container.nativeElement, this.configs);
    const htmlInput = this.searchBoxInputElement.nativeElement;
    this.searchBox = new google.maps.places.SearchBox(htmlInput);
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(htmlInput);
    this.searchBox.addListener('places_changed', this.onSearchBoxPlaceChanged.bind(this));
    this.map.addListener('rightclick', this.onRightClickByMap.bind(this));
    this.map.addListener('tilesloaded', () => this.isSearchBoxVisible = true);
    this.map.addListener('dragstart', () => {
      this.isPointFormVisible = false;
      this.zone.run(() => this.cd.detectChanges());
    });
  }

  public createPoint(caption: string): void {
    this.newPoint.setName(caption);
    this.pointReady.emit(this.newPoint);
    this.isPointFormVisible = false;
    if (this.searchedPlaceMarkers.length) {
      this.searchedPlaceMarkers.pop();
      this.searchBoxInputElement.nativeElement.value = '';
    }
  }

  public setCenter(centerLocation: Point): void {
    this.map.setCenter(centerLocation);
  }

  public setMarkersOnMap(points: Point[] = []): void {
    this.markers.forEach((marker: google.maps.Marker) => marker.setMap(null));
    points.forEach((point: Point) =>
      this.markers.push(new google.maps.Marker({
        map: this.map,
        title: point.name,
        position: point,
      })));
  }

  private setupCountry(place: any): void {
    place.address_components.forEach(address => {
      if (address.types.includes('country')) {
        this.newPoint.setCountry(address);
      }
    });

  }

  private onRightClickByMap(event: any) {
    this.setupPointCreationFormCoordinates(event);
    this.setMarkerOnMap({lat: event.latLng.lat(), lng: event.latLng.lng()});
    this.newPoint = new Point(event.latLng.lat(), event.latLng.lng());
    this.geocoder.geocode({location: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())},
      (results, status) => {
        if (status && results.length) {
          const fullAddress = results[0];
          this.isPointFormVisible = true;
          this.newPoint.setAddress(fullAddress.formatted_address);
          this.setupCountry(fullAddress);
        }
      });
    this.zone.run(() => this.cd.detectChanges());
  }

  private onSearchBoxPlaceChanged() {
    this.searchedPlaceMarkers.forEach((marker: google.maps.Marker) => marker.setMap(null));
    const place = this.searchBox.getPlaces()[0];
    this.map.setCenter(place.geometry.location);
    const icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    const newMarker = new google.maps.Marker({
      map: this.map,
      icon: icon,
      title: place.name,
      position: place.geometry.location
    });
    newMarker.addListener('rightclick', this.onRightClickBySearchedPlaceMarker.bind(this, place));
    this.searchedPlaceMarkers.push(newMarker);
  }

  private onRightClickBySearchedPlaceMarker(place: any, event: any) {
    this.isPointFormVisible = true;
    this.setupPointCreationFormCoordinates(event);
    this.newPoint = new Point(event.latLng.lat(), event.latLng.lng());
    this.setupCountry(place);
  }

  private setMarkerOnMap(point: Point): void {
    if (this.newPointMarker) {
      this.newPointMarker.setMap(null);
    }
    this.newPointMarker = new google.maps.Marker({
      map: this.map,
      title: 'New Point',
      position: point,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      }
    });
  }

  private setupPointCreationFormCoordinates(event: any): void {
    const nativeJSEvent = Object.values(event).find((elem: any) => elem instanceof MouseEvent) as MouseEvent;
    if (nativeJSEvent.pageY + this.pointFormHeight >= getPageHeight()) {
      this.pointFormPositionTop = getPageHeight() - this.pointFormHeight - this.pointFormPaddingTopBottom * 2;
      this.setCenter({lat: event.latLng.lat(), lng: event.latLng.lng()});
    } else {
      this.pointFormPositionTop = nativeJSEvent.pageY;
    }
    if (nativeJSEvent.pageX + this.pointFormWidth >= getPageWidth()) {
      this.pointFormPositionLeft = getPageWidth() - this.pointFormWidth - this.pointFormPaddingLeftRight * 2;
      this.setCenter({lat: event.latLng.lat(), lng: event.latLng.lng()});
    } else {
      this.pointFormPositionLeft = nativeJSEvent.pageX;
    }
  }
}
