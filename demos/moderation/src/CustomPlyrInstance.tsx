import React, { forwardRef, useEffect } from "react";
import { usePlyr, APITypes, PlyrProps, PlyrInstance } from "plyr-react";
import { useAppContext } from "./AppContext";
import "./CustomPlyrInstance.css";

export const CustomPlyrInstance = forwardRef<APITypes, PlyrProps>(
  (props, ref) => {
    const { setCurrentTime } = useAppContext();
    const { source, options = null } = props;
    const raptorRef = usePlyr(ref, { options, source });
    // Do all api access here, it is guaranteed to be called with the latest plyr instance
    useEffect(() => {
      /**
       * Fool react for using forward ref as normal ref
       * NOTE: in a case you don"t need the forward mechanism and handle everything via props
       * you can create the ref inside the component by yourself
       */
      const { current } = ref as React.MutableRefObject<APITypes>;
      if (current.plyr.source === null)
        return;
      const api = current as { plyr: PlyrInstance; };
      api.plyr.on("timeupdate", () => {
        console.log("timeupdate", api.plyr.currentTime);
        setCurrentTime(api.plyr.currentTime * 1000);
      });
    });

    return (
      <video
        ref={raptorRef as React.MutableRefObject<HTMLVideoElement>}
        className="plyr-react plyr" />
    );
  }
);
