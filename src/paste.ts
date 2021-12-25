import { loadImage } from './utils';
import type { Image } from '.';

type PasteHandlerCallback = (image: Image) => void;

class PasteHandler {
  private V_KEY = 'KeyV';
  private _callback?: PasteHandlerCallback;

  constructor() {
    document.addEventListener('keyup', ({ code, ctrlKey }) => {
      if (code === this.V_KEY && ctrlKey) {
        this.handlePaste();
      }
    });
  }

  set callback(callback: PasteHandlerCallback) {
    this._callback = callback;
  }

  private async handlePaste() {
    if (!this._callback)
      throw new Error('A callback must be set prior to pasting');

    const [item] = await navigator.clipboard.read();
    const [type] = item.types;

    const blob = await item.getType(type);
    const img = await loadImage(URL.createObjectURL(blob));

    this._callback(img);
  }
}

export default new PasteHandler();
