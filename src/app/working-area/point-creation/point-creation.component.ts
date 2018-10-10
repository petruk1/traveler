import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-point-creation',
  templateUrl: './point-creation.component.html',
  styleUrls: ['./point-creation.component.scss']
})
export class PointCreationComponent {
  @Output()
  public captionReady: EventEmitter<string> = new EventEmitter();
  @Output()
  public cancel: EventEmitter<boolean> = new EventEmitter();
  public captionControl = new FormControl();

  public emitCaption(): void {
    this.captionReady.emit(this.captionControl.value);
  }

  public emitCancel(): void {
    this.cancel.emit(false);
  }
}
