import { Badge, Button } from '../ui';

function MPDTable({ mpds, aircraftModels, onEdit, onDelete, loading }) {
    const getCheckTypeBadgeClass = (checkType) => {
        const classes = {
            "A-Check": "bg-blue-900/50 text-blue-300",
            "B-Check": "bg-yellow-900/50 text-yellow-300",
            "C-Check": "bg-orange-900/50 text-orange-300",
            "D-Check": "bg-red-900/50 text-red-300",
            "Daily": "bg-green-900/50 text-green-300",
            "Weekly": "bg-indigo-900/50 text-indigo-300",
            "Special": "bg-purple-900/50 text-purple-300"
        };
        return classes[checkType] || "bg-gray-900/50 text-gray-300";
    };

    return (
        <div className="bg-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full">
                <thead className="bg-neutral-700">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Code</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Task</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Aircraft Model</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Maintenance</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Check Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Period</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ATA</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700">
                    {loading ? (
                        <tr>
                            <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                                Loading MPDs...
                            </td>
                        </tr>
                    ) : mpds.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                                No MPDs found. Click "Add New MPD" to create one.
                            </td>
                        </tr>
                    ) : (
                        mpds.map((mpd) => {
                            const model = aircraftModels.find(m => m._id === mpd.aircraftModelId);
                            return (
                                <tr key={mpd._id} className="hover:bg-neutral-700/50 transition">
                                    <td className="px-6 py-4 font-mono text-sm text-white font-medium">
                                        {mpd.code}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-xs">
                                        {mpd.task}
                                    </td>
                                    <td className="px-6 py-4 text-white">
                                        {model ? `${model.manufacturer} ${model.model}` : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {mpd.maintenance}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getCheckTypeBadgeClass(mpd.checkType)}`}>
                                            {mpd.checkType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {mpd.period || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {mpd.ataChapter || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right flex items-center justify-end">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => onEdit(mpd)}
                                            className="mr-2"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => onDelete(mpd._id, mpd.code)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default MPDTable;
