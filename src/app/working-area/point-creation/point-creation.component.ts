import {Component, DoCheck, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-point-creation',
  templateUrl: './point-creation.component.html',
  styleUrls: ['./point-creation.component.scss']
})
export class PointCreationComponent implements DoCheck {
  @Output() caption: EventEmitter<string> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  public emitCaption(caption: string): void {
    this.caption.emit(caption);
  }

  public emitCancel() {
    this.cancel.emit(false);
  }
}
