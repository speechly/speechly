import { useEffect, useState } from "react";

// Per Naoise Golden's and Jesper N's snippet on
// https://stackoverflow.com/questions/51607043/how-to-lazy-load-the-background-image-inside-the-inline-style-property-react

const useProgressiveImage = (src: string) => {
  const [loadedImageUrl, setSourceLoaded] = useState<string | null>(null);
  const [loadImage, setLoadImage] = useState(false);

  useEffect(() => {
    if (!loadImage) return;
    const img = new Image();
    img.src = src;
    img.onload = () => setSourceLoaded(src);
  }, [src, loadImage]);

  return {loadedImageUrl, setLoadImage};
};

export default useProgressiveImage;
