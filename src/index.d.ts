export type Image = HTMLImageElement;
export type ImagePlacement = 'below' | 'right';
export type ImageStack = {
  image: Image;
  x: number;
  y: number;
};

export type SelectorValue = 'automatic' | 'best-fit' | 'manual';
