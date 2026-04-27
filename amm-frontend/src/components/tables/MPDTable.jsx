import { useNavigate } from "react-router-dom";
import { Badge, Button } from "../ui";

function MPDTable({ mpds, limit }) {
    const navigate = useNavigate();
    const displayMpds = limit ? mpds.slice(0, limit) : mpds;

    if (mpds.length === 0) {
        return <p className="text-gray-400 text-center py-8">No MPDs available</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-neutral-700">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Code</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Task</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Manufacturer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Engine Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Check Type</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700">
                    {displayMpds.map((mpd) => (
                        <tr key={mpd._id} className="hover:bg-neutral-700/50 transition">
                            <td className="px-4 py-3 font-mono text-sm">{mpd.code}</td>
                            <td className="px-4 py-3 text-sm">{mpd.task}</td>
                            <td className="px-4 py-3">{mpd.manufacturer || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm">{mpd.engineType || 'All'}</td>
                            <td className="px-4 py-3">
                                <Badge 
                                    size="sm"
                                    variant={
                                        mpd.checkType === 'A-Check' ? 'primary' :
                                        mpd.checkType === 'B-Check' ? 'warning' :
                                        mpd.checkType === 'C-Check' ? 'info' :
                                        'danger'
                                    }
                                >
                                    {mpd.checkType}
                                </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => navigate('/camo/mpl/create', { state: { mpd } })}
                                >
                                    Create MPL
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MPDTable;
