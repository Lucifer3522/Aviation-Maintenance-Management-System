import { useNavigate, useLocation } from "react-router-dom";
import { Badge, Button } from "../ui";

function MPLTable({ mpls, onSendToMRO, onDelete, hideActions = false, customActions }) {
    const navigate = useNavigate();
    const location = useLocation();

    const getViewRoute = (mpl) => {
        // If on CAMO page, use CAMO view route
        if (location.pathname.includes('/camo')) {
            return `/camo/mpl/view/${mpl._id}`;
        }
        // Otherwise use MRO view route
        return `/mro/mpl/${mpl._id}`;
    };

    if (mpls.length === 0) {
        return <p className="text-gray-400 text-center py-8">No MPLs created yet</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-white/5 border-b border-white/20">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">MP Number</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Aircraft</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Title</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Scheduling</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Sent to MRO</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-white/80">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                    {mpls.map((mpl) => (
                        <tr key={mpl._id} className="hover:bg-white/5 transition">
                            <td className="px-4 py-3 font-mono text-sm text-white">{mpl.mpNumber}</td>
                            <td className="px-4 py-3 text-white">{mpl.aircraftId?.registration || 'N/A'}</td>
                            <td className="px-4 py-3 text-white">{mpl.title}</td>
                            <td className="px-4 py-3">
                                <Badge size="sm" variant="default">{mpl.schedulingType}</Badge>
                            </td>
                            <td className="px-4 py-3">
                                <Badge 
                                    size="sm"
                                    variant={
                                        mpl.status === 'Active' ? 'success' :
                                        mpl.status === 'Completed' ? 'primary' :
                                        'default'
                                    }
                                >
                                    {mpl.status}
                                </Badge>
                            </td>
                            <td className="px-4 py-3">
                                {mpl.sentToMRO ? (
                                    <span className="text-green-400 text-sm">✓ {mpl.mroOrganization}</span>
                                ) : (
                                    <span className="text-gray-500 text-sm">Not sent</span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-right space-x-2 flex justify-end">
                                {customActions ? (
                                    customActions(mpl)
                                ) : !hideActions ? (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="info"
                                            onClick={() => navigate(getViewRoute(mpl))}
                                        >
                                            View
                                        </Button>
                                        {!mpl.sentToMRO && onSendToMRO && (
                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={() => onSendToMRO(mpl._id)}
                                            >
                                                Send to MRO
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="info"
                                            onClick={() => navigate(`/camo/mpl/edit/${mpl._id}`)}
                                        >
                                            Edit
                                        </Button>
                                        {onDelete && (
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => onDelete(mpl._id, mpl.mpNumber)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </>
                                ) : null}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MPLTable;
