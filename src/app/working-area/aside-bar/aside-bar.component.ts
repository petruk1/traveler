import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Subscription} from 'rxjs/index';
import {FormControl} from '@angular/forms';

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
  protected filteredPoints: Point[];
  protected allPoints: Point[];
  private pointsSubscription: Subscription;
  protected searchControl = new FormControl();

  constructor(private fireService: FirebaseService) {
  }

  public ngOnInit(): void {
    this.pointsSubscription = this.fireService.points.subscribe((pointsArray: Point[]) => {
      this.filteredPoints = pointsArray;
      this.allPoints = pointsArray;
    });
    this.searchControl.valueChanges
      .subscribe(x => {
        this.filteredPoints = this.allPoints.filter((item, index) => item.address && item.address.includes(x));
        this.pointsFiltered.emit(this.filteredPoints);
      });
  }

  public ngOnDestroy(): void {
    this.pointsSubscription.unsubscribe();
  }

  public onPointSelected(point: Point): void {
    this.selectedPoint = point;
    this.pointSelected.emit(this.selectedPoint);
  }

}
