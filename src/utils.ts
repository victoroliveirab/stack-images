import type { Image } from '.';

export const loadImage = (path = '.'): Promise<Image> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = path;
    image.onload = () => resolve(image);
    image.onerror = () => reject(`Image ${path} not found`);
  });

export const minMax = (value: number, min = 0, max = value) => {
  if (value <= min) return min;
  if (value >= max) return max;

  return value;
};
