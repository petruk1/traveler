import {Component, EventEmitter, OnInit} from '@angular/core';
import {map} from 'rxjs/internal/operators';
import {FirebaseService} from '../../../services/firebase.service';

const places = [
  'angers', 'atlanta', 'athens', 'arlington', 'alexandria'
];


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  protected result: any[];
  protected search: EventEmitter<any> = new EventEmitter();

  constructor(private fireService: FirebaseService) {

  }

  ngOnInit() {
   // this.result = this.fireService.getPoints();
    this.search
      .pipe(
        map(x => {
          return places.filter(item => item.startsWith(x));
        })
      )
      .subscribe(res => {
       // this.result = Object.values(this.fireService.getPoints());
       // console.log(this.result)
      });
  }

}
