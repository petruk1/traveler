import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../../services/firebase.service';

@Component({
  selector: 'app-aside-bar',
  templateUrl: './aside-bar.component.html',
  styleUrls: ['./aside-bar.component.scss']
})
export class AsideBarComponent implements OnInit {
  protected points;

  constructor(private fireService: FirebaseService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.fireService.points.subscribe((pointsArray: object[]) => {
      this.points = pointsArray;
      this.cd.detectChanges();
    });
  }
}
