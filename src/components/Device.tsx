
import React, { useCallback, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";

const Device: React.FC<{ device: string, state: boolean, tentativeState: boolean, isTentativelySelected: boolean }> = props => {
    const [springProps, setSpringProps] = useSpring(() => ({
      backgroundColor: "lightgray",
      config: { tension: 500 },
    }));
  
    const [changeEffect, setChangeEffect] = useSpring(() => ({
      changeEffect: 0,
      to: {changeEffect: 0}
    }));
  
    useEffect(() => {
      setSpringProps({
        from: {backgroundColor: "#ffffff"},
        backgroundColor: props.isTentativelySelected
          ? "cyan"
          : props.state ? "green" : "red",
        config: { tension: 200 }
      })
    }, [props.isTentativelySelected, props.state]);
  
    useEffect(() => {
      const changed = props.state !== props.tentativeState;
      if (changed) {
        setChangeEffect({
          to: [{changeEffect: 1, config: { tension: 0 }}, {changeEffect: 0, config: { duration: 650 }}],
        });
      }
    }, [props.state, props.tentativeState]);
  
    return (
      <animated.div
        key={props.device}
        style={{
          fontSize: "85%",
          borderRadius: "1rem",
          padding: "0rem 0.5rem",
          margin: "0.1rem 0",
          minWidth: "4rem",
          transform: changeEffect.changeEffect.interpolate(
            x => `translate3d(0, ${Math.sin((x as number) * Math.PI) * -10}px, 0)`,
          ),
          boxShadow: changeEffect.changeEffect.interpolate(
            x => `0 0 ${(x as number) * 50}px cyan`,
          ),
          ...springProps
        }}
      >
        {props.device}
        {props.state ? (
          props.tentativeState ? (
            <span style={{ color: "green" }}>On</span>
          ) : (
            <span style={{ color: "red" }}>Turning off...</span>
          )
        ) : !props.tentativeState ? (
          <span style={{ color: "red" }}>Off</span>
        ) : (
          <span style={{ color: "green" }}>Turning on...</span>
        )}
      </animated.div>
    )
  }
  
  export default Device;