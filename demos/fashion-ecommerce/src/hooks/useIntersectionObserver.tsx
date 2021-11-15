import React, { RefObject } from "react";

// Per Malcolm Laing's article on Medium
// https://medium.com/frontend-digest/progressively-loading-images-in-react-107cb075417a

type IInteractionObserver = {
  target: RefObject<HTMLElement>,
  onIntersect: IntersectionObserverCallback,
  threshold?: number;
  rootMargin?: string;
}

const useIntersectionObserver = ({
  target,
  onIntersect,
  threshold = 0.1,
  rootMargin = "0px",
}: IInteractionObserver) => {
  React.useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      rootMargin,
      threshold,
    });
    const current = target.current;
    observer.observe(current!);
    return () => {
      observer.unobserve(current!);
    };
  });
};
export default useIntersectionObserver;
