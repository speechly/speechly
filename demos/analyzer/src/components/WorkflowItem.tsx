import { ReactComponent as CloseIcon } from '../assets/close.svg';
import { Action } from '../utils/types';
import './WorkflowItem.css';

interface Props {
  onDelete: React.MouseEventHandler;
  count: number;
  label: string;
  threshold: number;
  action: Action;
}

export const WorkflowItem: React.FC<Props> = ({ count, label, threshold, action, onDelete }) => {
  return (
    <div className="WorkflowItem">
      <span>
        {count} &times; {label} &gt; {threshold * 100}% &rarr; {action}
      </span>
      <CloseIcon
        onClick={onDelete}
        width={18}
        height={18}
      />
    </div>
  );
};
