import { Button } from '../ui';

function AircraftModelsTable({ models, onEdit, onDelete, loading }) {
    return (
        <div className="bg-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full">
                <thead className="bg-neutral-700">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Manufacturer</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Model</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Full Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Max Passengers</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Max Range (km)</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">3D Model</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700">
                    {loading ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                                Loading models...
                            </td>
                        </tr>
                    ) : models.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                                No aircraft models found. Add your first model to get started.
                            </td>
                        </tr>
                    ) : (
                        models.map((model) => (
                            <tr key={model._id} className="hover:bg-neutral-700/50 transition">
                                <td className="px-6 py-4 text-white font-medium">
                                    {model.manufacturer}
                                </td>
                                <td className="px-6 py-4 text-white">
                                    {model.model}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {model.fullName || '-'}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {model.specifications?.maxPassengers || '-'}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {model.specifications?.maxRange ? model.specifications.maxRange.toLocaleString() : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    {model.modelPath ? (
                                        <span className="text-green-400 text-xs">Available</span>
                                    ) : (
                                        <span className="text-gray-500 text-xs">Not Available</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-left flex items-center justify-center">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => onEdit(model)}
                                        className="mr-2"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => onDelete(model._id, `${model.manufacturer} ${model.model}`)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AircraftModelsTable;
