import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { aircraftModelService } from "../services";
import Loading from "../components/Loading";
import { PageHeader, Button } from "../components/ui";
import { AircraftModelsTable, AircraftModelFormModal } from "../components/pages";

function AircraftModels() {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingModel, setEditingModel] = useState(null);
    const [formData, setFormData] = useState({
        manufacturer: "",
        model: "",
        fullName: "",
        modelPath: "",
        description: "",
        specifications: {
            maxTakeoffWeight: "",
            maxPassengers: "",
            maxRange: "",
            engineType: ""
        }
    });

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        try {
            const data = await aircraftModelService.getAllAircraftModels();
            console.log("Aircraft Models:", data);
            setModels(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching aircraft models:", error);
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingModel(null);
        setFormData({
            manufacturer: "",
            model: "",
            fullName: "",
            modelPath: "",
            description: "",
            specifications: {
                maxTakeoffWeight: "",
                maxPassengers: "",
                maxRange: "",
                engineType: ""
            }
        });
        setShowAddModal(true);
    };

    const handleOpenEditModal = (model) => {
        setEditingModel(model);
        setFormData({
            manufacturer: model.manufacturer || "",
            model: model.model || "",
            fullName: model.fullName || "",
            modelPath: model.modelPath || "",
            description: model.description || "",
            specifications: {
                maxTakeoffWeight: model.specifications?.maxTakeoffWeight || "",
                maxPassengers: model.specifications?.maxPassengers || "",
                maxRange: model.specifications?.maxRange || "",
                engineType: model.specifications?.engineType || ""
            }
        });
        setShowAddModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith("spec_")) {
            const specField = name.replace("spec_", "");
            setFormData(prev => ({
                ...prev,
                specifications: {
                    ...prev.specifications,
                    [specField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingModel) {
                await aircraftModelService.updateAircraftModel(editingModel._id, formData);
                alert("Aircraft model updated successfully!");
            } else {
                await aircraftModelService.createAircraftModel(formData);
                alert("Aircraft model created successfully!");
            }
            setShowAddModal(false);
            fetchModels();
        } catch (error) {
            console.error("Error saving aircraft model:", error);
            alert(`Error: ${error.message || "Failed to save aircraft model. Please try again."}`);
        }
    };

    const handleDelete = async (modelId, modelName) => {
        if (!confirm(`Are you sure you want to delete ${modelName}? This action cannot be undone.`)) {
            return;
        }

        try {
            await aircraftModelService.deleteAircraftModel(modelId);
            alert("Aircraft model deleted successfully!");
            fetchModels();
        } catch (error) {
            console.error("Error deleting aircraft model:", error);
            alert(`Error: ${error.message || "Failed to delete aircraft model. Please try again."}`);
        }
    };

    if (loading) {
        return <Loading message="Loading aircraft models..." />;
    }

    return (
        <div className="h-full w-full bg-neutral-900 text-white p-6 overflow-y-auto">
            <PageHeader
                title="Aircraft Models"
                subtitle="Manage aircraft model database"
            >
                <Button
                    variant="primary"
                    onClick={handleOpenAddModal}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add New Model
                </Button>
            </PageHeader>

            <AircraftModelsTable
                models={models}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
                loading={loading}
            />

            <AircraftModelFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleSubmit}
                formData={formData}
                onChange={handleChange}
                editingModel={editingModel}
            />
        </div>
    );
}

export default AircraftModels;
