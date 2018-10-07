import {Component, EventEmitter, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';

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

  public ngOnInit(): void {

  }
}
