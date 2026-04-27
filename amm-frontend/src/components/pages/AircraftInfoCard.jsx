import { Card } from '../ui';

function AircraftInfoCard({ aircraft, manufacturer, model }) {
    return (
        <Card>
            <div>
                <p className="text-gray-400">Station: {aircraft.station}</p>
                <p className="text-gray-400">Flight Hours: {aircraft.flightHours?.toLocaleString()}</p>
                <p className="text-gray-400">Cycles: {aircraft.cycles?.toLocaleString()}</p>
            </div>
        </Card>
    );
}

export default AircraftInfoCard;
