import {Component, OnDestroy, OnInit} from '@angular/core';
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
}
