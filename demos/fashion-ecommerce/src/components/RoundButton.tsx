import "./RoundButton.css";

type IRoundButton = {
  size?: string;
  hitArea?: string;
  rootClass?: string;
  onClick?: (e: any) => void;
  children?: React.ReactNode;
}

const RoundButton: React.FC<IRoundButton> = ({
  rootClass = "RoundButton",
  onClick = () => {},
  ...props
}) => {
  return (
    <div
      className={rootClass}
      style={{width: props.size, height: props.size}}
      onClick={onClick}
    >
      <div
        className="HitArea"
        style={{width: props.hitArea, height: props.hitArea}}
      >
        {props.children}
      </div>
    </div>
  )
}

export default RoundButton