import "./RoundButton.css";

type IRoundButton = {
  size?: string;
  rootClass?: string;
  onClick?: (e: any) => void;
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
      {props.children}
    </div>
  )
}

export default RoundButton