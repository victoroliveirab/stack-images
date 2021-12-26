export type Coordinates = {
  x: number;
  y: number;
};

export type Image = HTMLImageElement;
export type ImagePlacement = 'below' | 'right';
export type ImageStack = {
  image: Image;
} & Coordinates;

export type Strategies = 'below' | 'best-fit' | 'manual' | 'right';
