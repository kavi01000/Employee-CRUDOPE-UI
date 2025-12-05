import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogOverlayContainer extends OverlayContainer {

  protected override _createContainer(): void {
    const container = this._document.createElement('div');
    container.classList.add('cdk-overlay-container');

    // Attach inside dialog instead of body
    const dialog = this._document.querySelector('.mat-dialog-container') as HTMLElement | null;

    const parent = dialog ?? this._document.body;
    parent.appendChild(container);

    this._containerElement = container;
  }
}
