import Canvas from './canvas';
import pasteHandler from './paste';
import type { SelectorValue } from '.';

const modeSelector = <HTMLSelectElement>document.getElementById('mode');

const canvas = new Canvas({
  limitWidth: true,
  maxWidth: window.innerWidth,
});
pasteHandler.callback = canvas.addImage;

modeSelector.addEventListener('change', () => {
  const value = <SelectorValue>modeSelector.value;

  if (value === 'automatic') {
    canvas.maxWidth = 0;
    return;
  }

  // TODO: work on best-fit
  if (value === 'manual' || value === 'best-fit') {
    canvas.limitWidth = true;
    canvas.maxWidth = window.innerWidth;
  }
});
