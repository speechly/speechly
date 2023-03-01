import { ReactComponent as DeleteIcon } from '../assets/delete.svg';
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
      <DeleteIcon onClick={onDelete} />
    </div>
  );
};
