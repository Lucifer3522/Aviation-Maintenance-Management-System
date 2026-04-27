import { Button } from "../ui";

export default function PackageCard({ package: pkg, onClick }) {
    const getPackageStatusColor = (status) => {
        switch (status) {
            case "Completed": return "text-green-400";
            case "In Progress": return "text-blue-400";
            case "Scheduled": return "text-yellow-400";
            case "Cancelled": return "text-red-400";
            default: return "text-gray-400";
        }
    };

    const completedCount = pkg.mpdItems?.filter(item => item.status === "Completed").length || 0;
    const inProgressCount = pkg.mpdItems?.filter(item => item.status === "In Progress").length || 0;
    const pendingCount = pkg.mpdItems?.filter(item => item.status === "Pending").length || 0;
    const totalCount = pkg.mpdItems?.length || 0;

    return (
        <div
            className="bg-neutral-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-neutral-700/50"
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-semibold mb-2 text-white">{pkg.checkType || pkg.name}</h2>
                    <p className={`font-semibold ${getPackageStatusColor(pkg.status)}`}>
                        {pkg.status}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-blue-400">
                        {pkg.completionPercentage || 0}%
                    </div>
                    <div className="text-xs text-gray-400">Complete</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-700 rounded-full h-2 mb-4">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${pkg.completionPercentage || 0}%` }}
                ></div>
            </div>

            {/* Stats */}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">Total Tasks:</span>
                    <span className="text-white font-semibold">{totalCount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Completed:</span>
                    <span className="text-green-400 font-semibold">{completedCount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">In Progress:</span>
                    <span className="text-blue-400 font-semibold">{inProgressCount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Pending:</span>
                    <span className="text-yellow-400 font-semibold">{pendingCount}</span>
                </div>
                {pkg.totalEstimatedHours && (
                    <div className="flex justify-between">
                        <span className="text-gray-400">Est. Hours:</span>
                        <span className="text-white font-semibold">{pkg.totalEstimatedHours}h</span>
                    </div>
                )}
            </div>

            <Button 
                variant="primary"
                className="w-full mt-4"
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
            >
                View Details
            </Button>
        </div>
    );
}
