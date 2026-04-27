import { Badge } from '../ui';

function MPDTaskTable({ mpdList }) {
    const getCheckTypeBadgeClass = (checkType) => {
        const classes = {
            "A-Check": "bg-blue-900/50 text-blue-300",
            "B-Check": "bg-yellow-900/50 text-yellow-300",
            "C-Check": "bg-orange-900/50 text-orange-300",
            "D-Check": "bg-red-900/50 text-red-300"
        };
        return classes[checkType] || "bg-gray-900/50 text-gray-300";
    };

    const getStatusColor = (status) => {
        const colors = {
            "Completed": "text-green-400",
            "Pending": "text-yellow-400",
            "In Progress": "text-blue-400"
        };
        return colors[status] || "text-gray-400";
    };

    if (mpdList.length === 0) {
        return <p className="text-gray-400">No maintenance tasks available.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-neutral-700">
                        <th className="py-2 px-3 text-gray-400 font-medium">Code</th>
                        <th className="py-2 px-3 text-gray-400 font-medium">Task</th>
                        <th className="py-2 px-3 text-gray-400 font-medium">Maintenance</th>
                        <th className="py-2 px-3 text-gray-400 font-medium">Check Type</th>
                        <th className="py-2 px-3 text-gray-400 font-medium">Period</th>
                        <th className="py-2 px-3 text-gray-400 font-medium">Cal FC</th>
                        <th className="py-2 px-3 text-gray-400 font-medium">Cal FH</th>
                        <th className="py-2 px-3 text-gray-400 font-medium">Last Done</th>
                        <th className="py-2 px-3 text-gray-400 font-medium">Next Due</th>
                        <th className="py-2 px-3 text-gray-400 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {mpdList.map((mpd) => (
                        <tr key={mpd._id} className="border-b border-neutral-700 hover:bg-neutral-700/50 transition">
                            <td className="py-3 px-3 font-mono text-sm">{mpd.code}</td>
                            <td className="py-3 px-3 font-mono text-xs text-gray-400">{mpd.task}</td>
                            <td className="py-3 px-3 text-gray-300">{mpd.maintenance}</td>
                            <td className="py-3 px-3">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getCheckTypeBadgeClass(mpd.checkType)}`}>
                                    {mpd.checkType || '-'}
                                </span>
                            </td>
                            <td className="py-3 px-3">{mpd.period}</td>
                            <td className="py-3 px-3 text-center">{mpd.cal_fc}</td>
                            <td className="py-3 px-3 text-center">{mpd.cal_fh}</td>
                            <td className="py-3 px-3">
                                {mpd.lastDone ? new Date(mpd.lastDone).toLocaleDateString() : '-'}
                            </td>
                            <td className="py-3 px-3">
                                {mpd.nextDue ? new Date(mpd.nextDue).toLocaleDateString() : '-'}
                            </td>
                            <td className={`py-3 px-3 font-medium ${getStatusColor(mpd.status)}`}>
                                {mpd.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MPDTaskTable;
