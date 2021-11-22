import React from "react";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { IProduct } from "types";
import useProgressiveImage from "hooks/useProgressiveImage";
import Filters from "generated/filters.json";

const USE_CDN_IMAGES = true;
const FASHION_CDN_URL = process.env.REACT_APP__FASHION_CDN_URL || "https://demos.speechly.com/fashion"

type IImageContainer = {
  key: string;
  element: IProduct;
};

type ILookup = {
  [key: string]: string;
}

const categoryNamesForKey: ILookup = Filters.category.options.reduce((prev, val) => {
   return {...prev, [val[0] as string]: val[1]};
}, {});

const InventoryItem: React.FC<IImageContainer> = (props) => {
  const ref = React.useRef<HTMLLIElement>(null);
  const { loadedImageUrl, setLoadImage } = useProgressiveImage(
    USE_CDN_IMAGES ? `${FASHION_CDN_URL}/${props.element.image_file}` : props.element.image_url
  );

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

  return (
    <li ref={ref}>
      <div
        className="InventoryItemImage"
        style={
          loadedImageUrl
            ? {
                backgroundImage: `url(${loadedImageUrl})`,
              }
            : {}
        }
      ></div>
      <div
        className={`InventoryItemFader ${!loadedImageUrl && "visible"}`}
      ></div>
      <div className="QuickInfo">
        <div className="Categories">{props.element.id}</div>
        <h1>{props.element.name}</h1>
        <div className="Categories">In{" "}
          {props.element.category.map(category => {
            return categoryNamesForKey[category]
            }).filter(name => name).join(", ")
          }
        </div>
        <svg className="ShoppingCartButton" viewBox="0 0 512 512">
          <g>
            <path
              d="M491.8,352.2H151.9l17.1-34.8l283.5-0.5c9.6,0,17.8-6.8,19.5-16.3l39.3-219.8c1-5.8-0.5-11.7-4.3-16.2
              c-3.8-4.5-9.3-7.1-15.2-7.1l-360.7-1.2l-3.1-14.5c-1.9-9.2-10.3-16-19.7-16H20.1C9,25.8,0,34.8,0,45.9c0,11.1,9,20.1,20.1,20.1H92
              l13.5,64l33.2,160.5l-42.7,69.7c-4.5,6.1-5.2,14.2-1.7,21c3.4,6.8,10.3,11.1,18,11.1H148c-7.6,10.1-11.8,22.5-11.8,35.2
              c0,32.3,26.3,58.6,58.6,58.6s58.6-26.3,58.6-58.6c0-12.7-4.2-25.1-11.8-35.2h91.9c-7.6,10.1-11.8,22.5-11.8,35.2
              c0,32.3,26.3,58.6,58.6,58.6c32.3,0,58.6-26.3,58.6-58.6c0-12.7-4.2-25.1-11.8-35.2h64.7c11.1,0,20.1-9,20.1-20.1
              C511.9,361.2,502.9,352.2,491.8,352.2z M139.5,96l328.6,1.1L436,277.3l-258.1,0.5L139.5,96z M194.8,445.7c-9.9,0-18-8.1-18-18
              c0-9.9,8.1-18,18-18c9.9,0,18,8.1,18,18C212.9,437.6,204.8,445.7,194.8,445.7z M380.4,445.7c-9.9,0-18-8.1-18-18
              c0-9.9,8.1-18,18-18c9.9,0,18,8.1,18,18C398.4,437.6,390.4,445.7,380.4,445.7z"
            />
          </g>
        </svg>
      </div>
    </li>
  );
};
export default InventoryItem;
