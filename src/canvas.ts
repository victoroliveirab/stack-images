import { imagesIntersect, minMax } from './utils';
import type { Coordinates, Image, ImagePlacement, ImageInfo } from '.';

// TODO:
// Ask user if it prefers to overflow canvas or scale down image (in case of width larger than maxWidth)

type CanvasConstructorOpts = {
  limitWidth?: boolean;
  maxWidth?: number;
};

class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imgs: ImageInfo[];
  private pointsOfInterest: Coordinates[];

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
    this.pointsOfInterest = [];

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
    if (!placement) this.addImageToBestFit(image);
    else if (placement === 'below') this.addImageBelow(image);
    else if (placement === 'right') this.addImageRight(image);
    else throw new Error('Invalid image placement');

    this.paint();
  }

  // private methods

  private addImageToBestFit(newImage: Image) {
    // Naive way to find if a spot is empty or not

    // 1- try to place the image starting as the left upper corner with one of the points on list. if it fits, put it. if not, try next
    // 2- if no points are a fit, open a new "row"
    for (const candidate of this.pointsOfInterest) {
      // TODO: transform this into array method
      let intersection = false;
      const candidateImageInfo: ImageInfo = {
        image: newImage,
        x: candidate.x,
        y: candidate.y,
      };
      for (const existingImage of this.imgs) {
        intersection ||= imagesIntersect(candidateImageInfo, existingImage);
        if (intersection) break;
      }
      if (!intersection && this.imageFitsIntoCanvas(candidateImageInfo))
        return this.putImageOnCanvas(newImage, candidate.x, candidate.y);
    }
    return this.addImageBelow(newImage);
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

  private imageFitsIntoCanvas({ image: { width }, x }: ImageInfo) {
    if (!this._limitWidth) return true;
    return x + width <= this._maxWidth;
  }

  private paint() {
    this.imgs.forEach(({ image, x, y }) => this.ctx.drawImage(image, x, y));
  }

  private putImageOnCanvas(image: Image, x: number, y: number) {
    const newWidth = x + image.width;
    const newHeight = y + image.height;

    const upperRightCorner: Coordinates = {
      x: newWidth,
      y,
    };
    const bottomLeftCorner: Coordinates = {
      x,
      y: newHeight,
    };
    const bottomRightCorner: Coordinates = {
      x: newWidth,
      y: newHeight,
    };

    this.imgs.push({ image, x, y });
    this.pointsOfInterest.push(
      ...[upperRightCorner, bottomLeftCorner, bottomRightCorner]
    ); // TODO: this still adds duplicate points sometimes
    this.resizeCanvasIfNeeded(newWidth, newHeight);
  }

  private resizeCanvas(width = this.canvas.width, height = this.canvas.height) {
    this._maxWidth = Math.max(this._maxWidth, this.canvas.width, width);

    this.canvas.width = width;
    this.canvas.height = height;
  }

  private resizeCanvasIfNeeded(width = 0, height = 0) {
    const newWidth = Math.max(this.canvas.width, width);
    const newHeight = Math.max(this.canvas.height, height);

    this.resizeCanvas(newWidth, newHeight);
  }
}

export default Canvas;
