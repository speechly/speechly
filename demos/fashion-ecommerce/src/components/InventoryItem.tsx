import React from "react";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { IProduct } from "types";
import useProgressiveImage from "hooks/useProgressiveImage";
import "./InventoryItem.css";

const USE_CDN_IMAGES = true;
const FASHION_CDN_URL = process.env.REACT_APP__FASHION_CDN_URL || "https://demos.speechly.com/fashion"

type IImageContainer = {
  key: string;
  element: IProduct;
};

const InventoryItem: React.FC<IImageContainer> = (props) => {
  const ref = React.useRef<HTMLLIElement>(null);
  const { loadedImageUrl, setLoadImage } = useProgressiveImage(
    USE_CDN_IMAGES ? `${FASHION_CDN_URL}/${props.element.image_file}` : props.element.image_url
  );

  const formatSize = (size: string) => {
    const num = Number(size)
    if (isNaN(num)) return size
    return `EU ${num}`
  }

  useIntersectionObserver({
    target: ref,
    onIntersect: ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        setLoadImage(true);
        if (ref.current) {
          observerElement.unobserve(ref.current);
        }
      }
    },
  });

  const { sizes, brand, name, price } = props.element

  return (
    <li className="InventoryItem" ref={ref}>
      <div className="InventoryItem__aspectRatio">
        <div className="InventoryItem__imageContainer">
          {loadedImageUrl && <img className="InventoryItem__image" src={loadedImageUrl} alt="product" />}
        </div>
        {sizes.length > 0 && (
          <div className="HoverInfo">
            <div className="HoverInfo__detailSizes">
              {sizes.map(size =>
                <div key={size} className="HoverInfo__detailSize">{formatSize(size)}</div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="InventoryItem__details">
        <span className="InventoryItem__brandName">{brand.name}</span>
        <span className="InventoryItem__productName">{name}</span>
        <span className="InventoryItem__productPrice">$&thinsp;{price.toFixed(2)}</span>
      </div>
    </li>
  );
};
export default InventoryItem;
