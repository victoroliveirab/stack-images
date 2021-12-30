export type Coordinates = {
  x: number;
  y: number;
};

export type Image = HTMLImageElement;
export type ImageInfo = {
  image: Image;
} & Coordinates;
export type ImagePlacement = 'below' | 'right';

export type Strategies = 'below' | 'best-fit' | 'manual' | 'right';
