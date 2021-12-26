import { loadImage } from './utils';
import type { Image } from '.';

type ClipboardHandlerCallback = (image: Image) => void;

class ClipboardHandler {
  private V_KEY = 'KeyV';
  private _callback?: ClipboardHandlerCallback;

  constructor() {
    document.addEventListener('keyup', ({ code, ctrlKey }) => {
      if (code === this.V_KEY && ctrlKey) {
        this.handleClipboard();
      }
    });
  }

  set callback(callback: ClipboardHandlerCallback) {
    this._callback = callback;
  }

  private async handleClipboard() {
    if (!this._callback)
      throw new Error('A callback must be set prior to pasting');

    const [item] = await navigator.clipboard.read();
    const [type] = item.types;

    const blob = await item.getType(type);
    const img = await loadImage(URL.createObjectURL(blob));

    this._callback(img);
  }
}

export default new ClipboardHandler();
