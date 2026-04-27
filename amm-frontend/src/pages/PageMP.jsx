import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { aircraftService } from "../services/service-aircraft";
import Loading from "../components/Loading";
import { Button, EmptyState } from "../components/ui";
import { PackageCard, PackageDetailModal } from "../components/pages";
import { GlassmorphismDashboard } from "../components/GlassmorphismCard";
import "../styles/glassmorphism.css";

function MaintenancePackages() {
    const { aircraftId } = useParams();
    const navigate = useNavigate();
    const [aircraft, setAircraft] = useState(null);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPackage, setSelectedPackage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [aircraftData, packagesData] = await Promise.all([
                    aircraftService.getAircraft(aircraftId),
                    aircraftService.getAllAircraftMPD(aircraftId)
                ]);
                
                setAircraft(aircraftData);
                setPackages(packagesData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [aircraftId]);

    if (loading) {
        return <Loading message="Loading maintenance packages..." />;
    }

    return (
        <GlassmorphismDashboard>
            <div className="mb-6">
                <Button
                    variant="secondary"
                    onClick={() => navigate(`/aircraft/${aircraftId}`)}
                    className="mb-4"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Aircraft Details
                </Button>
                {aircraft && (
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            {aircraft.manufacturer} {aircraft.model}
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Registration: {aircraft.registration}
                        </p>
                    </div>
                )}
            </div>

            {packages.length === 0 ? (
                <EmptyState message="No maintenance packages available for this aircraft." />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <PackageCard
                            key={pkg._id}
                            package={pkg}
                            onClick={() => setSelectedPackage(pkg)}
                        />
                    ))}
                </div>
            )}

            <PackageDetailModal
                package={selectedPackage}
                isOpen={!!selectedPackage}
                onClose={() => setSelectedPackage(null)}
            />
        </GlassmorphismDashboard>
    );
}

export default MaintenancePackages;
