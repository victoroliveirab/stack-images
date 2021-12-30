import type { Coordinates, Image, ImageInfo } from '.';

export const imagesIntersect = (img1: ImageInfo, img2: ImageInfo) => {
  const upperLeftCornerImage1: Coordinates = { x: img1.x, y: img1.y };
  const bottomRightCornerImage1: Coordinates = {
    x: img1.x + img1.image.width,
    y: img1.y + img1.image.height,
  };
  const upperLeftCornerImage2: Coordinates = { x: img2.x, y: img2.y };
  const bottomRightCornerImage2: Coordinates = {
    x: img2.x + img2.image.width,
    y: img2.y + img2.image.height,
  };

  if (
    upperLeftCornerImage1.x === upperLeftCornerImage2.x &&
    upperLeftCornerImage1.y === upperLeftCornerImage2.y
  )
    return true;

  if (
    upperLeftCornerImage1.x > bottomRightCornerImage2.x ||
    upperLeftCornerImage2.x > bottomRightCornerImage1.x
  ) {
    return false;
  }

  if (
    bottomRightCornerImage1.y > upperLeftCornerImage2.y ||
    bottomRightCornerImage2.y > upperLeftCornerImage1.y
  ) {
    return false;
  }

  return true;
};

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
