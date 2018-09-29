import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-point-creation',
  templateUrl: './point-creation.component.html',
  styleUrls: ['./point-creation.component.scss']
})
export class PointCreationComponent {
  protected captionControl = new FormControl();
  @Output()
  protected caption: EventEmitter<string> = new EventEmitter();
  @Output()
  protected cancel: EventEmitter<boolean> = new EventEmitter();

  public emitCaption(): void {
    this.caption.emit(this.captionControl.value);
  }

  public emitCancel(): void {
    this.cancel.emit(false);
  }
}
