import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { aircraftModelService, aircraftService } from "../../services";
import Loading from "../../components/Loading";
import { PageHeader } from "../../components/ui";
import { AircraftEditForm } from "../../components/pages";

function EditAircraft() {
    const navigate = useNavigate();
    const { aircraftId } = useParams();
    const [aircraftModels, setAircraftModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        aircraftModelId: "",
        registration: "",
        serialNumber: "",
        station: "",
        year: new Date().getFullYear(),
        flightHours: 0,
        cycles: 0,
        status: "Active"
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!aircraftId) {
                console.error("No aircraft ID provided");
                alert("No aircraft ID provided. Redirecting to dashboard.");
                navigate("/");
                return;
            }

            try {
                const [modelsData, aircraftData] = await Promise.all([
                    aircraftModelService.getAllAircraftModels(),
                    aircraftService.getAircraft(aircraftId)
                ]);

                setAircraftModels(modelsData);

                const modelId = typeof aircraftData.aircraftModelId === 'object' 
                    ? aircraftData.aircraftModelId._id 
                    : aircraftData.aircraftModelId;

                setFormData({
                    aircraftModelId: modelId || "",
                    registration: aircraftData.registration || "",
                    serialNumber: aircraftData.serialNumber || "",
                    station: aircraftData.station || "",
                    year: aircraftData.year || new Date().getFullYear(),
                    flightHours: aircraftData.flightHours || 0,
                    cycles: aircraftData.cycles || 0,
                    status: aircraftData.status || "Active"
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching aircraft data:", error);
                alert("Error loading aircraft data. Redirecting to dashboard.");
                navigate("/");
            }
        };

        fetchData();
    }, [aircraftId, navigate]);

    const handleSubmit = async (data) => {
        setSubmitting(true);

        try {
            await aircraftService.updateAircraft(aircraftId, data);
            alert(`Aircraft ${data.registration} updated successfully!`);
            navigate(`/aircraft/${aircraftId}`);
        } catch (error) {
            console.error("Error updating aircraft:", error);
            alert(`Error: ${error.message || "Failed to update aircraft. Please try again."}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = () => {
        navigate(`/aircraft/${aircraftId}`);
    };

    if (loading) {
        return <Loading message="Loading aircraft data..." />;
    }

    return (
        <div className="h-full w-full bg-neutral-900 text-white p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <PageHeader
                    title="Edit Aircraft"
                    subtitle="Update aircraft information"
                    onBack={() => navigate(`/aircraft/${aircraftId}`)}
                />

                <AircraftEditForm
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    aircraftModels={aircraftModels}
                    submitting={submitting}
                />
            </div>
        </div>
    );
}

export default EditAircraft;
