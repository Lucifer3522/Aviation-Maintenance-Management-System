import { Badge, Button } from "../ui";

function AircraftGrid({ aircraft, onView, onEdit, onDelete }) {
    const getModelPath = (craft) => {
        if (craft.aircraftModelId?.modelPath) {
            return craft.aircraftModelId.modelPath;
        }

        const manufacturer = craft.aircraftModelId?.manufacturer || craft.manufacturer;
        const model = craft.aircraftModelId?.model || craft.model;

        if (!manufacturer || !model) return null;

        return `/src/assets/models/${manufacturer}/${manufacturer}_${model}.glb`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {aircraft.map((craft) => (
                <div
                    key={craft._id}
                    className="bg-white/10 backdrop-blur-[20px] overflow-hidden rounded-[2rem] p-0 hover:bg-white/15 transition-all cursor-pointer border border-white/20 shadow-xl hover:shadow-2xl"
                >
                    
                    {getModelPath(craft) && (
                        <div className="mb-4 h-48 bg-neutral-900 rounded-lg overflow-hidden position-relative">
                            <model-viewer
                                src={getModelPath(craft)}
                                alt={`${craft.aircraftModelId?.manufacturer || ''} ${craft.aircraftModelId?.model || ''} 3D model`}
                                auto-rotate
                                camera-controls
                                camera-orbit="90deg 90deg 3m"
                                field-of-view="30deg"
                                style={{ width: '100%', height: '100%' }}>
                                    <Badge className="z-50 top-3 end-3 absolute" variant={craft.status === 'Active' ? 'success' : 'warning'}>
                                        {craft.status}
                                    </Badge>
                            </model-viewer>
                        </div>
                    )}

                    <div className="flex justify-between items-start mb-4 px-4">
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                {craft.registration}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {craft.aircraftModelId?.manufacturer || 'N/A'} •{' '}
                                {craft.aircraftModelId?.model || 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 mb-4 px-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Serial Number</span>
                            <span className="text-white font-mono">{craft.serialNumber}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Total Hours</span>
                            <span className="text-white">{craft.flightHours || 0} hrs</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Total Cycles</span>
                            <span className="text-white">{craft.cycles || 0}</span>
                        </div>
                        {craft.yearOfManufacture && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Year</span>
                                <span className="text-white">{craft.yearOfManufacture}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 px-4 pb-4" onClick={(e) => e.stopPropagation()}>
                        <Button
                            size="sm"
                            variant="info"
                            onClick={() => onView(craft._id)}
                            className="flex-1"
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
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AircraftGrid;
