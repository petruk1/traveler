import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-point-creation',
  templateUrl: './point-creation.component.html',
  styleUrls: ['./point-creation.component.scss']
})
export class PointCreationComponent {
  @Output()
  protected captionReady: EventEmitter<string> = new EventEmitter();
  @Output()
  protected cancel: EventEmitter<boolean> = new EventEmitter();
  protected captionControl = new FormControl();

  public emitCaption(): void {
    this.captionReady.emit(this.captionControl.value);
  }

  public emitCancel(): void {
    this.cancel.emit(false);
  }
}
