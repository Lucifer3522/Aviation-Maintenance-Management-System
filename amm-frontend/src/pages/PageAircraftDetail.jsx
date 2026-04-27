import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AircraftModel from "../components/AircraftModel";
import { aircraftService, mptlService } from "../services";
import Loading from "../components/Loading";
import { Button, Card } from "../components/ui";
import { AircraftInfoCard, MPDTaskTable, MPTLStatusCard } from "../components/pages";
import { GlassmorphismDashboard, GlassmorphismCard } from "../components/GlassmorphismCard";
import "../styles/glassmorphism.css";

const getModelPath = (aircraft) => {
    if (aircraft?.aircraftModelId?.modelPath) {
        return aircraft.aircraftModelId.modelPath;
    }

    const manufacturer = aircraft?.aircraftModelId?.manufacturer || aircraft?.manufacturer;
    const model = aircraft?.aircraftModelId?.model || aircraft?.model;

    if (!manufacturer || !model) {
        console.log("Missing manufacturer or model data:", aircraft);
        return null;
    }

    const modelFileName = `${manufacturer}_${model}.glb`;
    const path = `/src/assets/models/${manufacturer}/${modelFileName}`;

    console.log("Generated model path:", path);
    console.log("Manufacturer:", manufacturer, "Model:", model);

    return path;
};

function AircraftDetail() {
    const { aircraftId } = useParams();
    const navigate = useNavigate();
    const [aircraft, setAircraft] = useState(null);
    const [mpdList, setMpdList] = useState([]);
    const [mptlList, setMptlList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!aircraftId) {
                console.error("No aircraft ID provided");
                alert("No aircraft ID provided. Redirecting to dashboard.");
                navigate("/");
                return;
            }

            try {
                const [aircraftData, mpdData, mptlData] = await Promise.all([
                    aircraftService.getAircraft(aircraftId),
                    aircraftService.getAllAircraftMPD(aircraftId),
                    mptlService.getMPTLByAircraft(aircraftId).catch(err => {
                        console.warn("Could not fetch MPTL data:", err);
                        return [];
                    })
                ]);

                setAircraft(aircraftData);
                setMpdList(mpdData);
                setMptlList(mptlData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching aircraft data:", error);
                alert("Error loading aircraft data. Redirecting to dashboard.");
                navigate("/");
            }
        };

        fetchData();
    }, [aircraftId, navigate]);

    if (loading || !aircraft) return <Loading message="Loading Aircraft Details..." />;

    const modelPath = getModelPath(aircraft);
    const manufacturer = aircraft.aircraftModelId?.manufacturer || aircraft.manufacturer || 'Unknown';
    const model = aircraft.aircraftModelId?.model || aircraft.model || 'Unknown';

    return (
        <GlassmorphismDashboard>
            {modelPath ? (
                <Card>
                    <h1 className="text-2xl font-semibold text-white">{manufacturer} {model}</h1>
                    <p className="text-gray-300 pb-2">{aircraft.registration}</p>
                    <AircraftModel modelPath={modelPath} mpdList={mpdList} />
                </Card>
            ) : (
                <Card>
                    <p className="text-gray-400">3D model not available.</p>
                </Card>
            )}

            <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-5">
                <AircraftInfoCard 
                    aircraft={aircraft}
                    manufacturer={manufacturer}
                    model={model}
                />
                <div className="flex gap-3 mt-4 sm:mt-0">
                    <Button
                        variant="success"
                        onClick={() => navigate(`/aircraft/${aircraftId}/mp`)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                        Maintenance Packages
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => navigate(`/aircraft/edit/${aircraftId}`)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit Aircraft
                    </Button>
                </div>
            </Card>

            {/* Active Maintenance Task Lists (MPTL) */}
            {mptlList && mptlList.length > 0 && (
                <Card className="overflow-y-auto mt-5">
                    <h2 className="text-xl font-semibold mb-4 text-white">Active Work Orders / Task Lists</h2>
                    <MPTLStatusCard mptlList={mptlList} />
                </Card>
            )}

            {/* Maintenance Planning Document (MPD) */}
            <Card className="flex-1 overflow-y-auto mt-5">
                <h2 className="text-xl font-semibold mb-4 text-white">Maintenance Planning Document (MPD)</h2>
                <MPDTaskTable mpdList={mpdList} />
            </Card>
        </GlassmorphismDashboard>
    );
}

export default AircraftDetail;
