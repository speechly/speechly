import { ReactComponent as DeleteIcon } from '../assets/delete.svg';
import { Action } from '../utils/types';
import './WorkflowItem.css';

interface Props {
  onDelete: React.MouseEventHandler;
  count: number;
  action: Action;
  label: string;
}

export const WorkflowItem: React.FC<Props> = ({ count, action, label, onDelete }) => {
  return (
    <div className="WorkflowItem">
      <span>
        {count} &times; {label} &rarr; {action}
      </span>
      <DeleteIcon onClick={onDelete} />
    </div>
  );
};
