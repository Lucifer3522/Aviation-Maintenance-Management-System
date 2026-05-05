import { Badge, Button } from "../ui";

function CRSCard({ mptl, onIssueCRS, onViewDetails, onRejectCertificate, status = "awaiting" }) {
    const completedTasks = mptl.completedTasks || 0;
    const totalTasks = mptl.totalTasks || 0;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const allTasksCompleted = totalTasks > 0 && completedTasks === totalTasks;

    return (
        <div className="bg-white/10 backdrop-blur-[20px] rounded-[2rem] p-6 hover:bg-white/15 transition-all border border-white/20 shadow-xl">
            <div className="flex justify-between items-start mb-5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                            {mptl.taskListNumber}
                        </h3>
                        {mptl.crsNumber && (
                            <Badge variant="success">
                                {mptl.crsNumber}
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-white/70">
                        {mptl.aircraftId?.registration || 'N/A'}
                    </p>
                    <p className="text-sm text-white mt-1">{mptl.title}</p>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Task Progress</p>
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-neutral-600 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full ${
                                allTasksCompleted ? 'bg-green-500' : 'bg-blue-500'
                            } transition-all`}
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <span className="text-xs text-white">
                        {completedTasks}/{totalTasks}
                    </span>
                </div>
            </div>

            {mptl.crsIssuedDate && (
                <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">CRS Issued</p>
                    <p className="text-sm text-green-400 font-medium">
                        {new Date(mptl.crsIssuedDate).toLocaleDateString()}
                    </p>
                    {mptl.crsIssuedBy && (
                        <p className="text-xs text-gray-400 mt-1">
                            by {mptl.crsIssuedBy.name}
                        </p>
                    )}
                </div>
            )}

            <div className="flex gap-2">
                {status === "awaiting" ? (
                    <>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onViewDetails(mptl._id)}
                            className="flex-1"
                        >
                            Review
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => onIssueCRS(mptl._id)}
                            className="flex-1"
                        >
                            Issue CRS
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onViewDetails(mptl._id)}
                            className="flex-1"
                        >
                            View Details
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onRejectCertificate(mptl._id)}
                            className="flex-1"
                        >
                            Revoke CRS
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default CRSCard;
