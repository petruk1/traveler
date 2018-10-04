import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {Subscription} from 'rxjs/index';
import {MapComponent} from './map/map.component';

@Component({
  selector: 'app-working-area',
  templateUrl: './working-area.component.html',
  styleUrls: ['./working-area.component.scss']
})
export class WorkingAreaComponent implements OnInit, OnDestroy {
  @ViewChild('map') map: MapComponent;
  protected points: Point[];
  private pointsSubscription: Subscription;

  constructor(private fireService: FirebaseService) {
  }

  public ngOnInit(): void {
    this.fireService.login({email: 'test@gmail.com', password: 'test@gmail.com'});
    this.pointsSubscription = this.fireService.points
      .subscribe((pointsArray: Point[]) => {
        this.points = pointsArray;
      });
  }

  public createPoint(point: Point): void {
    this.fireService.createPoint(point);
  }

  public ngOnDestroy(): void {
    this.pointsSubscription.unsubscribe();
  }
}
