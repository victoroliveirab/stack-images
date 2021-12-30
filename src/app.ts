import Canvas from './canvas';
import clipboardHandler from './clipboard';
import type { Image, Strategies } from '.';

const modeSelector = <HTMLSelectElement>document.getElementById('mode');
const rightButton = <HTMLButtonElement>document.getElementById('paste-right');
const belowButton = <HTMLButtonElement>document.getElementById('paste-below');

const canvas = new Canvas({
  limitWidth: true,
  maxWidth: window.innerWidth,
});
clipboardHandler.callback = canvas.addImage;

modeSelector.addEventListener('change', () => {
  const value = <Strategies>modeSelector.value;

  if (value === 'below') {
    belowOption();
    return;
  }

  if (value === 'best-fit') {
    bestFitOption();
    return;
  }

  if (value === 'manual') {
    manualOption();
    return;
  }

  if (value === 'right') {
    rightOption();
    return;
  }
});

// TODO: when option change, sort this.pointsOfInterest accordingly

function belowOption() {
  canvas.limitWidth = true;
  canvas.maxWidth = window.innerWidth;
  clipboardHandler.callback = (image: Image) => canvas.addImage(image, 'below');

  hideButtons();
}

function bestFitOption() {
  canvas.limitWidth = true;
  canvas.maxWidth = window.innerWidth;
  clipboardHandler.callback = canvas.addImage;

  hideButtons();
}

function manualOption() {
  canvas.limitWidth = false;
  canvas.maxWidth = 0;

  showButtons();
}

function rightOption() {
  canvas.limitWidth = false;
  canvas.maxWidth = 0;
  clipboardHandler.callback = (image: Image) => canvas.addImage(image, 'right');

  hideButtons();
}

function showButtons() {
  rightButton.style.display = 'block';
  belowButton.style.display = 'block';
}

function hideButtons() {
  rightButton.style.display = 'none';
  belowButton.style.display = 'none';
}

window.onload = function () {
  belowOption();
};
