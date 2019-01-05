import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  Output,
  ViewChild
} from '@angular/core';
import {Point} from '../classes';
import {getPageHeight, getPageWidth} from '../../utils';
import {
  Geocoder,
  LatLng,
  Map,
  MapControlPosition,
  MapIconSize,
  MapMarker,
  MapOptions,
  MapPoint,
  MapSearchBox
} from '../google-types';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
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
  public isSearchBoxVisible = false;
  private map: Map;
  private markers: MapMarker[] = [];
  private searchedPlaceMarkers: MapMarker[] = [];
  private newPoint: Point;
  private geocoder = new Geocoder();
  private configs: MapOptions = {
    zoom: 2,
    center: {lat: 20, lng: 0}
  };
  private searchBox: MapSearchBox;
  private newPointMarker: MapMarker;
  private zoom = 12;

  constructor(private cd: ChangeDetectorRef,
              private zone: NgZone,
              @Inject(DOCUMENT) private document: any) {
  }

  public ngAfterViewInit(): void {
    this.map = new Map(this.container.nativeElement, this.configs);
    const htmlInput = this.searchBoxInputElement.nativeElement;
    this.searchBox = new MapSearchBox(htmlInput);
    this.map.controls[MapControlPosition.TOP_CENTER].push(htmlInput);
    this.searchBox.addListener('places_changed', this.onSearchBoxPlaceChanged.bind(this));
    this.map.addListener('rightclick', this.onRightClickByMap.bind(this));
    this.map.addListener('tilesloaded', () => this.isSearchBoxVisible = true);
    this.map.addListener('dragstart', () => {
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

  public cancelPointCreation(event: any): void {
    this.isPointFormVisible = event;
    this.newPointMarker.setMap(null);
  }

  public setCenter(centerLocation: LatLng): void {
    this.map.setCenter(centerLocation);
    this.map.setZoom(this.zoom);
  }

  public setMarkersOnMap(points: Point[] = []): void {
    this.markers.forEach((marker: MapMarker) => marker.setMap(null));
    points.forEach((point: Point) =>
      this.markers.push(new MapMarker({
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

  private onRightClickByMap(event: any): void {
    this.geocoder.geocode({location: new LatLng(event.latLng.lat(), event.latLng.lng())},
      (results: any, status: any) => {
        if (status && results.length) {
          this.setMarkerOnMap(new LatLng(event.latLng.lat(), event.latLng.lng()));
          this.newPoint = new Point(event.latLng.lat(), event.latLng.lng());
          const fullAddress = results[0];
          this.isPointFormVisible = true;
          this.newPoint.setAddress(fullAddress.formatted_address);
          this.setupCountry(fullAddress);
        }
      });
    this.zone.run(() => this.cd.detectChanges());
  }

  private onSearchBoxPlaceChanged(): void {
    this.searchedPlaceMarkers.forEach((marker: MapMarker) => marker.setMap(null));
    const place = this.searchBox.getPlaces()[0];
    this.map.setCenter(place.geometry.location);
    const icon = {
      url: place.icon,
      size: new MapIconSize(71, 71),
      origin: new MapPoint(0, 0),
      anchor: new MapPoint(17, 34),
      scaledSize: new MapIconSize(25, 25)
    };
    const newMarker = new MapMarker({
      map: this.map,
      icon: icon,
      title: place.name,
      position: place.geometry.location
    });
    newMarker.addListener('rightclick', this.onRightClickBySearchedPlaceMarker.bind(this, place));
    this.searchedPlaceMarkers.push(newMarker);
  }

  private onRightClickBySearchedPlaceMarker(place: any, event: any): void {
    this.isPointFormVisible = true;
    this.newPoint = new Point(event.latLng.lat(), event.latLng.lng());
    this.setupCountry(place);
  }

  private setMarkerOnMap(coordinates: LatLng): void {
    if (this.newPointMarker) {
      this.newPointMarker.setMap(null);
    }
    this.newPointMarker = new MapMarker({
      map: this.map,
      title: 'New Point',
      position: coordinates,
      icon: {
        url: '../../assets/images/markers/marker-blue-dot.png'
      }
    });
  }

}
