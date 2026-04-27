import { Card } from '../ui';

function AircraftInfoCard({ aircraft, manufacturer, model }) {
    return (
        <div className="bg-white/10 backdrop-blur-[20px] rounded-[2rem] p-6 border border-white/20 shadow-xl">
            <div>
                <p className="text-white/70">Station: {aircraft.station}</p>
                <p className="text-white/70">Flight Hours: {aircraft.flightHours?.toLocaleString()}</p>
                <p className="text-white/70">Cycles: {aircraft.cycles?.toLocaleString()}</p>
            </div>
        </div>
    );
}

export default AircraftInfoCard;
