import { Badge, Button } from "../ui";

function TaskCard({ task, onUpdateStatus, onViewDetails }) {
    const getStatusVariant = (status) => {
        switch (status) {
            case 'Completed': return 'success';
            case 'In Progress': return 'warning';
            case 'Pending': return 'default';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical': return 'text-red-500';
            case 'High': return 'text-orange-500';
            case 'Medium': return 'text-yellow-500';
            case 'Low': return 'text-green-500';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-[20px] rounded-[2rem] p-6 hover:bg-white/15 transition-all border border-white/20 shadow-xl">
            <div className="flex justify-between items-start mb-5">
                <div>
                    <h3 className="text-lg font-semibold text-white">
                        {task.description || task.taskDescription}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                        Task: {task.taskNumber} • {task.taskType || 'Task'}
                    </p>
                    <p className="text-sm text-gray-400">
                        MPTL: {task.mptlNumber} • Aircraft: {task.aircraft || 'N/A'}
                    </p>
                </div>
                <Badge variant={getStatusVariant(task.status)}>
                    {task.status}
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Required Role</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {task.assignedRole || task.priority || 'N/A'}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Estimated Hours</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                        {task.manhours?.estimated || task.estimatedHours || task.estimatedTime || 'N/A'}h
                    </p>
                </div>
                {task.startedAt && (
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Started</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                            {new Date(task.startedAt).toLocaleDateString()}
                        </p>
                    </div>
                )}
                {task.completedAt && (
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                            {new Date(task.completedAt).toLocaleDateString()}
                        </p>
                    </div>
                )}
            </div>

            {task.workPerformed && (
                <div className="mb-4 p-3 bg-gray-100 dark:bg-neutral-900/50 rounded-lg\">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Work Performed</p>
                    <p className="text-sm text-gray-900 dark:text-white">{task.workPerformed}</p>
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                {(task.status === 'Pending' || task.status === 'Not Started') && onUpdateStatus && (
                    <Button
                        size="sm"
                        variant="warning"
                        onClick={() => onUpdateStatus(task.mptlId, task._id, 'In Progress')}
                    >
                        Start Task
                    </Button>
                )}
                {task.status === 'In Progress' && onUpdateStatus && (
                    <Button
                        size="sm"
                        variant="success"
                        onClick={() => onUpdateStatus(task.mptlId, task._id, 'Completed')}
                    >
                        Complete Task
                    </Button>
                )}
                {onViewDetails && (
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onViewDetails(task.mptlId)}
                    >
                        View MPTL
                    </Button>
                )}
            </div>
        </div>
    );
}

export default TaskCard;
