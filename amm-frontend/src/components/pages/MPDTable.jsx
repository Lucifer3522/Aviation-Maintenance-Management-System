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
        <div className="bg-white/10 backdrop-blur-[20px] rounded-[2rem] overflow-hidden border border-white/20 shadow-xl">
            <table className="w-full">
                <thead className="bg-white/5 border-b border-white/20">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Code</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Task</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Aircraft Model</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Maintenance</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Check Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Period</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">ATA</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-white/80">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                    {loading ? (
                        <tr>
                            <td colSpan="8" className="px-6 py-12 text-center text-white/60">
                                Loading MPDs...
                            </td>
                        </tr>
                    ) : mpds.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="px-6 py-12 text-center text-white/60">
                                No MPDs found. Click "Add New MPD" to create one.
                            </td>
                        </tr>
                    ) : (
                        mpds.map((mpd) => {
                            const model = aircraftModels.find(m => m._id === mpd.aircraftModelId);
                            return (
                                <tr key={mpd._id} className="hover:bg-white/5 transition">
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
