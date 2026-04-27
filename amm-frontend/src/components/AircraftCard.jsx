import { Link } from "react-router-dom";

function AircraftCard({ aircraft, onDelete }) {
    const manufacturer = aircraft.aircraftModelId?.manufacturer || aircraft.manufacturer || 'Unknown';
    const model = aircraft.aircraftModelId?.model || aircraft.model || 'Unknown';
    const modelPath = aircraft.aircraftModelId?.modelPath || aircraft.modelPath;

    return (
        <div className="bg-neutral-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-neutral-700">
            <div className="w-full h-48 bg-neutral-900 relative">
                {modelPath ? (
                    <model-viewer
                        src={modelPath}
                        alt={`${manufacturer} ${model}`}
                        auto-rotate
                        camera-controls
                        style={{ width: '100%', height: '100%' }}
                        camera-orbit="90deg 90deg 3m"
                        field-of-view="30deg"
                    ></model-viewer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                        aircraft.status === 'Active' ? 'bg-green-500/80 text-white' :
                        aircraft.status === 'Maintenance' ? 'bg-yellow-500/80 text-white' :
                        'bg-gray-500/80 text-white'
                    }`}>
                        {aircraft.status}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {manufacturer} {model}
                </h2>
                
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Registration:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{aircraft.registration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Station:</span>
                        <span className="text-gray-700 dark:text-gray-300">{aircraft.station}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Flight Hours:</span>
                        <span className="text-gray-700 dark:text-gray-300">{aircraft.flightHours?.toLocaleString()} hrs</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Cycles:</span>
                        <span className="text-gray-700 dark:text-gray-300">{aircraft.cycles?.toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link to={`/aircraft/${aircraft._id}`} className="flex-1">
                        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
                            View Details
                        </button>
                    </Link>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete(aircraft);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                        title="Delete Aircraft"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AircraftCard;