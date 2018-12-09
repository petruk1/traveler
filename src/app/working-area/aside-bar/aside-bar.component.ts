import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Subscription} from 'rxjs/index';
import {FormControl} from '@angular/forms';
import {Point} from '../classes';

@Component({
  selector: 'app-aside-bar',
  templateUrl: './aside-bar.component.html',
  styleUrls: ['./aside-bar.component.scss']
})
export class AsideBarComponent implements OnInit, OnDestroy {
  @Output()
  public pointSelected: EventEmitter<Point> = new EventEmitter();
  @Output()
  public pointsFiltered: EventEmitter<Point[]> = new EventEmitter();
  public selectedPoint: Point;
  public filteredPoints: Point[];
  public allPoints: Point[];
  public searchControl = new FormControl();
  public pointsMappedByCountry: Map<string, Point[]> = new Map();
  public pointsMapKeys = null;
  public activePoint: Point;
  private pointsSubscription: Subscription;
  private searchSubscription: Subscription;

  constructor(private fireService: FirebaseService) {
  }

  public onPointSelected(point: Point): void {
    this.activePoint = point;
    this.pointSelected.emit(point);
  }

  public ngOnInit(): void {
    this.pointsSubscription = this.fireService.points$
      .subscribe((pointsArray: Point[]) => {
        this.filteredPoints = pointsArray;
        this.allPoints = pointsArray;
        this.sortPointsByCountries(pointsArray);
      });
    this.searchSubscription = this.searchControl.valueChanges
      .subscribe((value: string) => {
        this.filteredPoints = this.allPoints
          .filter((point: Point, index: number) => point.address
            && point.address.toLowerCase().includes(value.trim().toLowerCase())
            || point.name.toLowerCase().includes(value.trim().toLowerCase()));
        this.sortPointsByCountries(this.filteredPoints);
        this.pointsFiltered.emit(this.filteredPoints);
      });
  }

  private sortPointsByCountries(points: Point[]): void {
    this.pointsMappedByCountry.clear();
    points.forEach((point: Point) => {
      const keyword = point.country && point.country.long_name || 'others';
      if (this.pointsMappedByCountry.has(keyword)) {
        this.pointsMappedByCountry.set(keyword, [...this.pointsMappedByCountry.get(keyword), point]);
      } else {
        this.pointsMappedByCountry.set(keyword, [point]);
      }
    });
    this.activePoint = points[points.length - 1];
    this.pointsMapKeys = Array.from(this.pointsMappedByCountry.keys());
  }

  public ngOnDestroy(): void {
    this.pointsSubscription.unsubscribe();
    this.searchSubscription.unsubscribe();
  }
}
