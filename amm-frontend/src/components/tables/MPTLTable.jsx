import { useNavigate } from "react-router-dom";
import { Badge, Button } from "../ui";

function MPTLTable({ mptls, onDelete }) {
    const navigate = useNavigate();

    if (mptls.length === 0) {
        return <p className="text-gray-400 text-center py-8">No MPTLs created yet</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-neutral-700">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Task List #</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Aircraft</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Station</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Tasks</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700">
                    {mptls.map((mptl) => (
                        <tr key={mptl._id} className="hover:bg-neutral-700/50 transition">
                            <td className="px-4 py-3 font-mono text-sm">{mptl.taskListNumber}</td>
                            <td className="px-4 py-3">{mptl.aircraftId?.registration || 'N/A'}</td>
                            <td className="px-4 py-3">{mptl.station || 'N/A'}</td>
                            <td className="px-4 py-3">{mptl.tasks?.length || 0}</td>
                            <td className="px-4 py-3">
                                <Badge 
                                    size="sm"
                                    variant={
                                        mptl.overallStatus === 'Completed' ? 'success' :
                                        mptl.overallStatus === 'In Progress' ? 'warning' :
                                        mptl.overallStatus === 'Awaiting CRS' ? 'info' :
                                        'default'
                                    }
                                >
                                    {mptl.overallStatus}
                                </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {new Date(mptl.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right space-x-2 flex justify-end">
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => navigate(`/mro/mptl/edit/${mptl._id}`)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => onDelete(mptl._id, mptl.taskListNumber)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MPTLTable;
