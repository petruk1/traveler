import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FirebaseService} from '../../../services/firebase.service';
import {Subscription} from 'rxjs/index';

@Component({
  selector: 'app-aside-bar',
  templateUrl: './aside-bar.component.html',
  styleUrls: ['./aside-bar.component.scss']
})
export class AsideBarComponent implements OnInit, OnDestroy {
  protected points: Point[];
  private pointsSubscription: Subscription;
  @Output()
  public pointSelected: EventEmitter<Point> = new EventEmitter();
  public selectedPoint: Point;

  constructor(private fireService: FirebaseService) {
  }

  public ngOnInit(): void {
    this.pointsSubscription = this.fireService.points.subscribe((pointsArray: Point[]) => {
      this.points = pointsArray;
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
