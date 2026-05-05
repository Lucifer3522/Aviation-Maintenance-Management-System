import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Model3DViewer from "../components/pages/Model3DViewer";
import { mplService, aircraftService, authService } from "../services";
import Loading from "../components/Loading";
import { Button, Card, Badge } from "../components/ui";
import { GlassmorphismDashboard, GlassmorphismCard } from "../components/GlassmorphismCard";
import "../styles/glassmorphism.css";

const getModelPath = (aircraft) => {
    if (aircraft?.aircraftModelId?.modelPath) {
        return aircraft.aircraftModelId.modelPath;
    }

    const manufacturer = aircraft?.aircraftModelId?.manufacturer || aircraft?.manufacturer;
    const model = aircraft?.aircraftModelId?.model || aircraft?.model;

    if (!manufacturer || !model) {
        console.log("Missing Data:", aircraft);
        return null;
    }

    const modelFileName = `${manufacturer}_${model}.glb`;
    const path = `/src/assets/models/${manufacturer}/${modelFileName}`;

    return path;
};

function ViewMPL() {
    const navigate = useNavigate();
    const { mplId } = useParams();
    const [mpl, setMpl] = useState(null);
    const [aircraft, setAircraft] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = authService.getUser() || {};

    useEffect(() => {
        fetchMPLData();
    }, [mplId]);

    const fetchMPLData = async () => {
        try {
            const mplData = await mplService.getMPL(mplId);
            
            setMpl(mplData);

            if (mplData.aircraftId) {
                const aircraftId = mplData.aircraftId._id || mplData.aircraftId;
                const aircraftData = await aircraftService.getAircraft(aircraftId);
                setAircraft(aircraftData);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching MPL:", error);
            alert("Failed to load MPL data");
            navigate(-1);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'success';
            case 'Inactive':
                return 'default';
            case 'Suspended':
                return 'warning';
            case 'Completed':
                return 'success';
            default:
                return 'default';
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'Critical':
                return 'danger';
            case 'High':
                return 'warning';
            case 'Medium':
                return 'info';
            case 'Low':
                return 'default';
            default:
                return 'default';
        }
    };

    const getSchedulingTypeDisplay = (type) => {
        const typeMap = {
            'FH': 'Flight Hours',
            'FC': 'Flight Cycles',
            'Calendar': 'Calendar Days',
            'FH_FC': 'Flight Hours & Cycles',
            'FH_Calendar': 'Flight Hours & Calendar',
            'FC_Calendar': 'Flight Cycles & Calendar',
            'All': 'All Types'
        };
        return typeMap[type] || type;
    };

    if (loading || !mpl) return <Loading message="Loading MPL Details..." />;

    const modelPath = aircraft ? getModelPath(aircraft) : null;
    const manufacturer = aircraft?.aircraftModelId?.manufacturer || aircraft?.manufacturer || 'Unknown';
    const model = aircraft?.aircraftModelId?.model || aircraft?.model || 'Unknown';
    const registration = aircraft?.registration || mpl.aircraftId?.registration || 'N/A';

    return (
        <GlassmorphismDashboard>
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h1 className="text-2xl font-semibold text-white">{mpl.title}</h1>
                            <Badge variant={getStatusColor(mpl.status)}>
                                {mpl.status}
                            </Badge>
                            <Badge variant={getPriorityBadge(mpl.priority)}>
                                {mpl.priority} Priority
                            </Badge>
                        </div>
                        <p className="text-gray-300">MP Number: {mpl.mpNumber}</p>
                        <p className="text-gray-400 text-sm">Aircraft: {registration} ({manufacturer} {model})</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </Card>

            {modelPath && (
                <Card className="mt-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Aircraft 3D Model</h2>
                    <Model3DViewer 
                        selectedModel={aircraft}
                        mpdPosition={null}
                        onCanvasClick={() => {}}
                        getModelPath={getModelPath}
                    />
                </Card>
            )}

            <Card className="mt-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Program Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-neutral-700 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Aircraft Registration</p>
                        <p className="text-white font-semibold text-lg">{registration}</p>
                    </div>
                    <div className="bg-neutral-700 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Aircraft Type</p>
                        <p className="text-white font-semibold text-lg">{manufacturer} {model}</p>
                    </div>
                    <div className="bg-neutral-700 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Created By</p>
                        <p className="text-white font-semibold text-sm">{mpl.createdBy?.name || mpl.createdBy?.email || 'N/A'}</p>
                    </div>
                    <div className="bg-neutral-700 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Created Date</p>
                        <p className="text-white font-semibold text-sm">
                            {new Date(mpl.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {mpl.description && (
                    <div className="mb-6">
                        <p className="text-gray-400 text-sm mb-2">Description</p>
                        <div className="bg-neutral-700/50 rounded-lg p-4 border border-neutral-600">
                            <p className="text-white">{mpl.description}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-700/50 rounded-lg p-4 border border-neutral-600">
                        <p className="text-gray-400 text-sm mb-1">CAMO Organization</p>
                        <p className="text-white font-semibold">{mpl.camoOrganization}</p>
                    </div>
                    <div className="bg-neutral-700/50 rounded-lg p-4 border border-neutral-600">
                        <p className="text-gray-400 text-sm mb-1">Scheduling Type</p>
                        <p className="text-white font-semibold">{getSchedulingTypeDisplay(mpl.schedulingType)}</p>
                    </div>
                </div>
            </Card>

            <Card className="mt-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Maintenance Scheduling</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['FH', 'FH_FC', 'FH_Calendar', 'All'].includes(mpl.schedulingType) && mpl.flightHours && (
                        <div className="bg-neutral-700 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                Flight Hours
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-gray-400 text-sm">Interval:</p>
                                    <p className="text-white font-semibold">{mpl.flightHours.interval} FH</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-400 text-sm">Threshold:</p>
                                    <p className="text-white font-semibold">{mpl.flightHours.threshold} FH</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-400 text-sm">Last Compliance:</p>
                                    <p className="text-white font-semibold">{mpl.flightHours.lastCompliance || 'N/A'} FH</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {['FC', 'FH_FC', 'FC_Calendar', 'All'].includes(mpl.schedulingType) && mpl.flightCycles && (
                        <div className="bg-neutral-700 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                Flight Cycles
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-gray-400 text-sm">Interval:</p>
                                    <p className="text-white font-semibold">{mpl.flightCycles.interval} FC</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-400 text-sm">Threshold:</p>
                                    <p className="text-white font-semibold">{mpl.flightCycles.threshold} FC</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-400 text-sm">Last Compliance:</p>
                                    <p className="text-white font-semibold">{mpl.flightCycles.lastCompliance || 'N/A'} FC</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {['Calendar', 'FH_Calendar', 'FC_Calendar', 'All'].includes(mpl.schedulingType) && mpl.calendar && (
                        <div className="bg-neutral-700 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                Calendar
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-gray-400 text-sm">Interval:</p>
                                    <p className="text-white font-semibold">{mpl.calendar.interval} {mpl.calendar.intervalUnit}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-400 text-sm">Last Compliance Date:</p>
                                    <p className="text-white font-semibold">
                                        {mpl.calendar.lastComplianceDate 
                                            ? new Date(mpl.calendar.lastComplianceDate).toLocaleDateString() 
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {mpl.nextDueDate && (
                        <div className="bg-neutral-700 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                Next Due
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-gray-400 text-sm">Date:</p>
                                    <p className="text-white font-semibold">
                                        {new Date(mpl.nextDueDate).toLocaleDateString()}
                                    </p>
                                </div>
                                {mpl.nextDueFH && (
                                    <div className="flex justify-between">
                                        <p className="text-gray-400 text-sm">FH:</p>
                                        <p className="text-white font-semibold">{mpl.nextDueFH}</p>
                                    </div>
                                )}
                                {mpl.nextDueFC && (
                                    <div className="flex justify-between">
                                        <p className="text-gray-400 text-sm">FC:</p>
                                        <p className="text-white font-semibold">{mpl.nextDueFC}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {mpl.relatedServiceBulletins && mpl.relatedServiceBulletins.length > 0 && (
                <Card className="mt-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Related Service Bulletins</h2>
                    <div className="space-y-3">
                        {mpl.relatedServiceBulletins.map((sb, index) => (
                            <div 
                                key={index}
                                className="bg-neutral-700 rounded-lg p-4 flex justify-between items-center"
                            >
                                <div>
                                    <p className="text-white font-semibold">
                                        SB {sb.sbNumber} 
                                        {sb.revision && ` (Rev. ${sb.revision})`}
                                    </p>
                                    <p className="text-gray-400 text-sm">Compliance Status: {sb.complianceStatus}</p>
                                </div>
                                <Badge 
                                    variant={
                                        sb.complianceStatus === 'Completed' ? 'success' :
                                        sb.complianceStatus === 'In Progress' ? 'warning' :
                                        'default'
                                    }
                                >
                                    {sb.complianceStatus}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {mpl.camoNotes && (
                <Card className="mt-6 bg-blue-900/20 border-blue-700">
                    <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-blue-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8.25D7 6.675m0 2.574v12.318c0 .597.237 1.17.659 1.591a2.25 2.25 0 001.591.659h10.5a2.25 2.25 0 001.591-.659c.422-.422.659-.994.659-1.591V9.298m0 0H21m0 0V6.675c0-.597-.237-1.169-.659-1.591A2.25 2.25 0 0018.75 4.5H5.25a2.25 2.25 0 00-1.591.659C3.237 5.506 3 6.075 3 6.675v2.625m9.5 11.625h3m-11.25 0h.008v.008H4.5v-.008z" />
                        </svg>
                        CAMO Notes
                    </h2>
                    <div className="bg-neutral-700/50 rounded-lg p-4 border border-neutral-600">
                        <p className="text-white">{mpl.camoNotes}</p>
                    </div>
                </Card>
            )}

            {mpl.sentToMRO && mpl.mroOrganization && (
                <Card className="mt-6 bg-green-900/20 border-green-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Sent to MRO</h3>
                                <p className="text-gray-300 text-sm">
                                    Sent to: <span className="text-white font-semibold">{mpl.mroOrganization}</span>
                                    {mpl.sentToMRODate && ` on ${new Date(mpl.sentToMRODate).toLocaleString()}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </GlassmorphismDashboard>
    );
}

export default ViewMPL;
