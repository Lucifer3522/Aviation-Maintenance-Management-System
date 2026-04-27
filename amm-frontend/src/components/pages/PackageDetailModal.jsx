import { Modal, Badge } from "../ui";

export default function PackageDetailModal({ package: pkg, isOpen, onClose }) {
    if (!pkg) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed": return "bg-green-900/50 text-green-300";
            case "In Progress": return "bg-blue-900/50 text-blue-300";
            case "Pending": return "bg-yellow-900/50 text-yellow-300";
            case "Deferred": return "bg-orange-900/50 text-orange-300";
            case "N/A": return "bg-gray-900/50 text-gray-300";
            default: return "bg-gray-900/50 text-gray-300";
        }
    };

    const getPackageStatusColor = (status) => {
        switch (status) {
            case "Completed": return "text-green-400";
            case "In Progress": return "text-blue-400";
            case "Scheduled": return "text-yellow-400";
            case "Cancelled": return "text-red-400";
            default: return "text-gray-400";
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div>
                    <h2 className="text-2xl font-bold text-white">{pkg.name || pkg.checkType}</h2>
                    <p className={`text-lg font-semibold ${getPackageStatusColor(pkg.status)}`}>
                        {pkg.status} - {pkg.completionPercentage || 0}% Complete
                    </p>
                </div>
            }
            size="xlarge"
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-700">
                            <th className="py-3 px-3 text-gray-400 font-medium text-sm">Code</th>
                            <th className="py-3 px-3 text-gray-400 font-medium text-sm">Task</th>
                            <th className="py-3 px-3 text-gray-400 font-medium text-sm">Maintenance</th>
                            <th className="py-3 px-3 text-gray-400 font-medium text-sm">Status</th>
                            <th className="py-3 px-3 text-gray-400 font-medium text-sm">Last Done</th>
                            <th className="py-3 px-3 text-gray-400 font-medium text-sm">Next Due</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pkg.mpdItems?.length > 0 ? (
                            pkg.mpdItems.map((item) => (
                                <tr 
                                    key={item._id} 
                                    className="border-b border-neutral-700 hover:bg-neutral-700/50 transition"
                                >
                                    <td className="py-3 px-3 font-mono text-sm text-white">
                                        {item.code}
                                    </td>
                                    <td className="py-3 px-3 text-xs text-gray-400">
                                        {item.task}
                                    </td>
                                    <td className="py-3 px-3 text-sm text-gray-300">
                                        {item.maintenance}
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-sm text-gray-300">
                                        {item.lastDone ? new Date(item.lastDone).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="py-3 px-3 text-sm text-gray-300">
                                        {item.nextDue ? new Date(item.nextDue).toLocaleDateString() : '-'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-400">
                                    No MPD items found in this package
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Modal>
    );
}
