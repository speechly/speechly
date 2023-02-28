import { ReactComponent as DeleteIcon } from '../assets/delete.svg';
import { Workflow } from '../utils/types';
import './WorkflowItem.css';

interface Props {
  rule: Workflow;
  onDelete: React.MouseEventHandler;
}

export const WorkflowItem: React.FC<Props> = ({ rule, onDelete }) => {
  return (
    <div className="WorkflowItem">
      <span>
        {rule.count} &times; {rule.event.label} &rarr; {rule.action}
      </span>
      <DeleteIcon onClick={onDelete} />
    </div>
  );
};
