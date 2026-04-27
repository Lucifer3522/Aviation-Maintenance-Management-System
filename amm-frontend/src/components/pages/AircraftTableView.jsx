import { Badge, Button } from "../ui";

function AircraftTableView({ aircraft, onView, onEdit, onDelete }) {
    return (
        <div className="bg-white/10 backdrop-blur-[20px] rounded-[2rem] overflow-hidden border border-white/20 shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/20">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                                Registration
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                Model
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                Serial Number
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                Flight Hours
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                Cycles
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                        {aircraft.map((craft) => (
                            <tr
                                key={craft._id}
                                className="hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => onView(craft._id)}
                            >
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-white">
                                        {craft.registration}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-white">
                                        {craft.aircraftModelId?.manufacturer || 'N/A'}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {craft.aircraftModelId?.model || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-mono text-white">
                                        {craft.serialNumber}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={craft.status === 'Active' ? 'success' : 'warning'}>
                                        {craft.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-white">
                                        {craft.totalFlightHours || 0} hrs
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-white">
                                        {craft.totalCycles || 0}
                                    </div>
                                </td>
                                <td className="flex justify-end px-6 py-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        size="sm"
                                        variant="info"
                                        onClick={() => onView(craft._id)}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => onEdit(craft._id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => onDelete(craft)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AircraftTableView;
