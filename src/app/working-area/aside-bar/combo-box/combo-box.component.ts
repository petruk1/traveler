import {Component, EventEmitter, Input, Output} from '@angular/core';
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';
import {Point} from '../../classes';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.scss']
})
export class ComboBoxComponent {
  @Input()
  public title = '';
  @Input()
  public items: Point[] = [];
  @Output()
  public itemClick: EventEmitter<Point> = new EventEmitter();
  public angleIcon = faAngleDown;
  public isListOpen = false;
  @Input()
  public selectedItem: Point;

  public onItemClick(point: Point): void {
    this.selectedItem = point;
    this.itemClick.emit(this.selectedItem);
  }

  public toggleListOpenness(): void {
    if (this.isListOpen) {
      this.angleIcon = faAngleDown;
    } else {
      this.angleIcon = faAngleUp;
    }
    this.isListOpen = !this.isListOpen;
  }
}
