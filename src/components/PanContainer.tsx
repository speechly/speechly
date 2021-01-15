import React from "react";
import MapInteraction from "../react-map-interaction";

/*
  This component provides a map like interaction to any content that you place in it. It will let
  the user zoom and pan the children by scaling and translating props.children using css.
*/

type IPanContainer = {
  minScale: number;
  maxScale: number;
  disableZoom: boolean;
  disablePan: boolean;
  defaultValue: ITranslation;
};

type ITranslation = {
  translation: {
    x: number;
    y: number;
  };
  scale: number;
};

const PanContainer: React.FC<IPanContainer> = (props) => {
  return (
    <MapInteraction {...props}>
      {({ translation, scale }: ITranslation) => {
        // Translate first and then scale.  Otherwise, the scale would affect the translation.
        const transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`;
        return (
          <div
            style={{
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              position: "absolute", // for absolutely positioned children
              overflow: "hidden",
              touchAction: "none", // Not supported in Safari :(
              msTouchAction: "none",
              cursor: "all-scroll",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
          >
            <div
              style={{
                boxSizing: "border-box",
                left: "50%",
                top: "50%",
                position: "absolute", // for absolutely positioned children
                transform: transform,
                transformOrigin: "0 0 ",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  display: "inline-block", // size to content
                  transform: "translate(-50%, -50%)",
                }}
              >
                {props.children}
              </div>
            </div>
          </div>
        );
      }}
    </MapInteraction>
  );
};

export default PanContainer;
