import { Badge } from '../ui';

function MPTLStatusCard({ mptlList }) {
    const getStatusColor = (status) => {
        const colors = {
            "Not Started": "bg-gray-900/50 text-gray-300",
            "In Progress": "bg-blue-900/50 text-blue-300",
            "Completed": "bg-green-900/50 text-green-300",
            "On Hold": "bg-yellow-900/50 text-yellow-300",
            "Cancelled": "bg-red-900/50 text-red-300"
        };
        return colors[status] || "bg-gray-900/50 text-gray-300";
    };

    const getOverallStatus = (tasks) => {
        if (!tasks || tasks.length === 0) return "Not Started";
        
        const completed = tasks.filter(t => t.status === "Completed").length;
        const inProgress = tasks.filter(t => t.status === "In Progress").length;
        const total = tasks.length;

        if (completed === total) return "Completed";
        if (inProgress > 0 || completed > 0) return "In Progress";
        return "Not Started";
    };

    const calculateProgress = (tasks) => {
        if (!tasks || tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.status === "Completed").length;
        return Math.round((completed / tasks.length) * 100);
    };

    if (!mptlList || mptlList.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-400">No active maintenance task lists</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {mptlList.map((mptl) => {
                const overallStatus = getOverallStatus(mptl.tasks);
                const progress = calculateProgress(mptl.tasks);

                return (
                    <div key={mptl._id} className="bg-white/10 backdrop-blur-[20px] rounded-[2rem] p-5 hover:bg-white/15 transition border border-white/20 shadow-xl">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-lg text-white">{mptl.title}</h3>
                                    <Badge className={getStatusColor(overallStatus)}>
                                        {overallStatus}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-400 mb-1">
                                    Task List: <span className="font-mono">{mptl.taskListNumber}</span>
                                    {mptl.workOrderNumber && (
                                        <> | WO: <span className="font-mono">{mptl.workOrderNumber}</span></>
                                    )}
                                </p>
                                {mptl.description && (
                                    <p className="text-sm text-gray-400">{mptl.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-neutral-700 rounded-full h-2">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Task Summary */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                            <div className="text-center p-2 bg-neutral-700 rounded">
                                <div className="text-2xl font-bold text-white">{mptl.tasks?.length || 0}</div>
                                <div className="text-xs text-gray-400">Total Tasks</div>
                            </div>
                            <div className="text-center p-2 bg-green-900/20 rounded">
                                <div className="text-2xl font-bold text-green-400">
                                    {mptl.tasks?.filter(t => t.status === "Completed").length || 0}
                                </div>
                                <div className="text-xs text-gray-400">Completed</div>
                            </div>
                            <div className="text-center p-2 bg-blue-900/20 rounded">
                                <div className="text-2xl font-bold text-blue-400">
                                    {mptl.tasks?.filter(t => t.status === "In Progress").length || 0}
                                </div>
                                <div className="text-xs text-gray-400">In Progress</div>
                            </div>
                            <div className="text-center p-2 bg-gray-900/20 rounded">
                                <div className="text-2xl font-bold text-gray-400">
                                    {mptl.tasks?.filter(t => t.status === "Not Started").length || 0}
                                </div>
                                <div className="text-xs text-gray-400">Not Started</div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-400">Scheduled: </span>
                                <span className="text-white">
                                    {new Date(mptl.scheduledStartDate).toLocaleDateString()} - {new Date(mptl.scheduledEndDate).toLocaleDateString()}
                                </span>
                            </div>
                            {(mptl.actualStartDate || mptl.actualEndDate) && (
                                <div>
                                    <span className="text-gray-400">Actual: </span>
                                    <span className="text-white">
                                        {mptl.actualStartDate ? new Date(mptl.actualStartDate).toLocaleDateString() : '-'} - {mptl.actualEndDate ? new Date(mptl.actualEndDate).toLocaleDateString() : '-'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* MRO Organization */}
                        <div className="mt-3 text-sm">
                            <span className="text-gray-400">MRO: </span>
                            <span className="text-white">{mptl.mroOrganization}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default MPTLStatusCard;
