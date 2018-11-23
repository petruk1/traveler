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
  private pointsSubscription: Subscription;
  private searchSubscription: Subscription;

  constructor(private fireService: FirebaseService) {
  }

  public ngOnInit(): void {
    this.pointsSubscription = this.fireService.points$
      .subscribe((pointsArray: Point[]) => {
        this.filteredPoints = pointsArray;
        this.allPoints = pointsArray;
      });
    this.searchSubscription = this.searchControl.valueChanges
      .subscribe((value: string) => {
        this.filteredPoints = this.allPoints
          .filter((point: Point) => {
            const lowercaseValue = value.toLowerCase();
            return point.address
              && point.address.toLowerCase().includes(lowercaseValue)
              || point.name.toLowerCase().includes(lowercaseValue);
          });
        this.pointsFiltered.emit(this.filteredPoints);
      });
  }

  public ngOnDestroy(): void {
    this.pointsSubscription.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  public onPointSelected(point: Point): void {
    this.selectedPoint = point;
    this.pointSelected.emit(this.selectedPoint);
  }

}
