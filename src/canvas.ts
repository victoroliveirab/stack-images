import { minMax } from './utils';
import type { Image, ImagePlacement, ImageStack } from '.';

// TODO:
// Create an algorithm to find best-fit holes to put image
// Add images according to a pre-determined layout (with some guidelines)
// Ask user if it prefers to overflow canvas or scale down image

type CanvasConstructorOpts = {
  limitWidth?: boolean;
  maxWidth?: number;
};

class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imgs: ImageStack[];

  private _limitWidth: boolean;
  private _maxWidth: number;

  constructor({
    limitWidth = false,
    maxWidth = 0,
  }: CanvasConstructorOpts = {}) {
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.imgs = [];
    this._limitWidth = limitWidth;
    this._maxWidth = limitWidth ? maxWidth : 0;

    this.canvas.width = 0;
    this.canvas.height = 0;
    this.ctx.globalCompositeOperation = 'destination-over';

    // public methods
    // note: could also be defined as an arrow function
    this.addImage = this.addImage.bind(this);
  }

  // getters and setters

  get numberOfImgs() {
    return this.imgs.length;
  }

  get maxWidth() {
    return this._maxWidth;
  }

  set maxWidth(size: number) {
    if (size <= 0) {
      this._maxWidth = 0;
      this._limitWidth = false;
      return;
    }

    this._maxWidth = size;
  }

  get limitWidth() {
    return this._limitWidth;
  }

  set limitWidth(limit: boolean) {
    this._limitWidth = limit;
  }

  // public methods

  addImage(image: Image): void;
  addImage(image: Image, placement: ImagePlacement): void;

  addImage(image: Image, placement?: ImagePlacement) {
    if (this.limitWidth) this.addImageWithLimitation(image);
    else if (placement === 'below') this.addImageBelow(image);
    else if (placement === 'right') this.addImageRight(image);
    else throw new Error('Invalid image placement');

    this.paint();
  }

  // private methods

  private addImageWithLimitation(image: Image) {
    if (image.width > this.maxWidth) {
      this.maxWidth = image.width;
      return this.addImageBelow(image);
    }

    if (image.width + this.canvas.width > this.maxWidth)
      return this.addImageBelow(image);

    this.addImageRight(image);
  }

  private addImageBelow(image: Image) {
    const [oldWidth, oldHeight] = this.getCanvasDimensions();

    const newWidth = minMax(oldWidth, image.width);
    const newHeight = minMax(oldHeight + image.height, oldHeight);
    this.resizeCanvas(newWidth, newHeight);

    this.putImageOnCanvas(image, 0, oldHeight);
  }

  private addImageRight(image: Image) {
    const [oldWidth, oldHeight] = this.getCanvasDimensions();

    const newWidth = minMax(oldWidth + image.width, oldWidth);
    const newHeight = minMax(oldHeight, image.height);
    this.resizeCanvas(newWidth, newHeight);

    this.putImageOnCanvas(image, oldWidth, 0);
  }

  private getCanvasDimensions() {
    return [this.canvas.width, this.canvas.height];
  }

  private paint() {
    this.imgs.forEach(({ image, x, y }) => this.ctx.drawImage(image, x, y));
  }

  private putImageOnCanvas(image: Image, x: number, y: number) {
    this.imgs.push({ image, x, y });
  }

  private resizeCanvas(width = this.canvas.width, height = this.canvas.height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}

export default Canvas;
