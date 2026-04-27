import { Link } from "react-router-dom";

function AircraftCard({ aircraft, onDelete }) {
    const manufacturer = aircraft.aircraftModelId?.manufacturer || aircraft.manufacturer || 'Unknown';
    const model = aircraft.aircraftModelId?.model || aircraft.model || 'Unknown';
    const modelPath = aircraft.aircraftModelId?.modelPath || aircraft.modelPath;

    return (
        <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 backdrop-blur-[20px]">
            <div className="w-full h-48 bg-gradient-to-br from-slate-900 to-slate-800 relative">
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
                    <div className="flex items-center justify-center h-full text-white/40">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-[15px] border border-white/30 ${
                        aircraft.status === 'Active' ? 'bg-green-500/40 text-green-100' :
                        aircraft.status === 'Maintenance' ? 'bg-yellow-500/40 text-yellow-100' :
                        'bg-white/20 text-white'
                    }`}>
                        {aircraft.status}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h2 className="text-lg font-semibold mb-4 text-white">
                    {manufacturer} {model}
                </h2>
                
                <div className="space-y-3 mb-5">
                    <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Registration:</span>
                        <span className="text-white font-medium">{aircraft.registration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Station:</span>
                        <span className="text-white/80">{aircraft.station}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Flight Hours:</span>
                        <span className="text-white/80">{aircraft.flightHours?.toLocaleString()} hrs</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Cycles:</span>
                        <span className="text-white/80">{aircraft.cycles?.toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link to={`/aircraft/${aircraft._id}`} className="flex-1">
                        <button className="w-full bg-gradient-to-r from-blue-500/60 to-blue-600/60 text-white px-4 py-2.5 rounded-[1.5rem] hover:from-blue-500/80 hover:to-blue-600/80 transition-all duration-300 font-medium border border-white/20">
                            View Details
                        </button>
                    </Link>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete(aircraft);
                        }}
                        className="bg-gradient-to-r from-red-500/60 to-red-600/60 hover:from-red-500/80 hover:to-red-600/80 text-white px-4 py-2.5 rounded-[1.5rem] transition-all duration-300 border border-white/20"
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