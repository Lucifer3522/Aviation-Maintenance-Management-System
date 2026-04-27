import { useNavigate } from "react-router-dom";
import { Badge, Button } from "../ui";

function ServiceBulletinTable({ serviceBulletins }) {
    const navigate = useNavigate();

    if (serviceBulletins.length === 0) {
        return <p className="text-gray-400 text-center py-8">No service bulletins</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-white/5 border-b border-white/20">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">SB Number</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Title</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Priority</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Issued Date</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-white/80">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                    {serviceBulletins.map((sb) => (
                        <tr key={sb._id} className="hover:bg-white/5 transition">
                            <td className="px-4 py-3 font-mono text-sm">{sb.sbNumber}</td>
                            <td className="px-4 py-3">{sb.title}</td>
                            <td className="px-4 py-3">
                                <Badge 
                                    size="sm"
                                    variant={
                                        sb.category === 'Mandatory' ? 'danger' :
                                        sb.category === 'Recommended' ? 'warning' :
                                        'default'
                                    }
                                >
                                    {sb.category}
                                </Badge>
                            </td>
                            <td className="px-4 py-3">
                                <Badge 
                                    size="sm"
                                    variant={
                                        sb.priority === 'Critical' ? 'danger' :
                                        sb.priority === 'High' ? 'warning' :
                                        sb.priority === 'Medium' ? 'warning' :
                                        'default'
                                    }
                                >
                                    {sb.priority}
                                </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">{sb.status}</td>
                            <td className="px-4 py-3 text-sm">
                                {new Date(sb.issuedDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <Button
                                    size="sm"
                                    variant="info"
                                    onClick={() => navigate(`/camo/service-bulletins/${sb._id}`)}
                                >
                                    View
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ServiceBulletinTable;
