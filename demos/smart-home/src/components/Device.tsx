
import React, { useCallback, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";

const Device: React.FC<{ device: string, state: boolean, tentativeState: boolean, isTentativelySelected: boolean }> = props => {
    const [springProps, setSpringProps] = useSpring(() => ({
      backgroundColor: props.state ? "green" : "red",
      active: props.state ? 36 : 12,
      config: { tension: 500 },
    }));

    const [selectionProps, setSelectionProps] = useSpring(() => ({
      selection: props.isTentativelySelected ? 1 : 0,
      config: { tension: 500 },
    }));

    const [changeEffect, setChangeEffect] = useSpring(() => ({
      changeEffect: 0,
      to: {changeEffect: 0}
    }));
  
    useEffect(() => {
      setSpringProps({
        from: {backgroundColor: "#ffffff"},
        backgroundColor: props.state ? "green" : "red",
        active: props.state ? 36 : 12,
        config: { tension: 200 }
      })
    }, [props.state]);

    useEffect(() => {
      setSelectionProps({
        selection: props.isTentativelySelected ? 1 : 0,
        config: { tension: 200 }
      })
    }, [props.isTentativelySelected]);

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
          padding: "0rem 0.5rem 0 0.2rem",
          margin: "0.1rem 0",
          minWidth: "4rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
          color: "#000000",
          transform: changeEffect.changeEffect.interpolate(
            x => `translate3d(0, ${Math.sin((x as number) * Math.PI) * -10}px, 0)`,
          ),
          boxShadow: selectionProps.selection.interpolate(
            x => `0 0 ${(x as number) * 10}px ${(x as number) * 4}px cyan`,
          ),
          ...springProps
        }}
      >
        <Knob cx={springProps.active.interpolate(x => x as number)}/>

        {props.device}
        {props.state ? (
          props.tentativeState ? (
            <span style={{ color: "cyan" }}></span>
          ) : (
            <span style={{ color: "cyan" }}>&nbsp;Turning off...</span>
          )
        ) : !props.tentativeState ? (
          <span style={{ color: "cyan" }}></span>
        ) : (
          <span style={{ color: "cyan" }}>&nbsp;Turning on...</span>
        )}
      </animated.div>
    )
  }
  
  const Knob: React.FC<{cx: number}> = (props) => (
    <svg style={{paddingRight: "0.2rem"}}
      width="20" height="10"
      viewBox="0 0 48 24"
      xmlns="http://www.w3.org/2000/svg">

      <rect x="0" width="48" height="24" rx="12" fill="#00000080"/>
      <animated.circle cx={props.cx} cy="12" r="12" fill="#ffffffff" />
    </svg>
  );

  export default Device;