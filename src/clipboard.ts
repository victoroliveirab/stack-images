import { loadImage } from './utils';
import type { Image } from '.';

type ClipboardHandlerCallback = (image: Image) => void;

class ClipboardHandler {
  private _callback?: ClipboardHandlerCallback;

  constructor() {
    document.onpaste = this.clipboardEventListener.bind(this);
  }

  set callback(callback: ClipboardHandlerCallback) {
    this._callback = callback;
  }

  private clipboardEventListener(event: ClipboardEvent) {
    const file = this.getFileFromClipboard(event.clipboardData?.items);

    if (!file) return;
    if (!this._callback)
      console.warn('No ClipboardHandler callback registered');

    loadImage(URL.createObjectURL(file)).then(this._callback);
  }

  private getFileFromClipboard(items?: DataTransferItemList) {
    return Array.from(items || [])
      .find(({ kind }) => kind === 'file')
      ?.getAsFile();
  }
}

export default new ClipboardHandler();
