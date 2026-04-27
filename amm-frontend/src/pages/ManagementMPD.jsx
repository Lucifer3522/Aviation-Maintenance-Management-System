import { useEffect, useState } from "react";
import { mpdService, aircraftModelService } from "../services";
import Loading from "../components/Loading";
import { PageHeader, Button } from "../components/ui";
import { MPDTable, MPDFormModal } from "../components/pages";

function MPDManagement() {
    const [mpds, setMpds] = useState([]);
    const [aircraftModels, setAircraftModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMPD, setEditingMPD] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [mpdPosition, setMpdPosition] = useState([0, 0, 0]);
    const [formData, setFormData] = useState({
        aircraftModelId: "",
        manufacturer: "",
        engineType: "",
        task: "",
        code: "",
        maintenance: "",
        checkType: "A-Check",
        cal_fc: 0,
        cal_fh: 0,
        period: "",
        position: [0, 0, 0],
        ataChapter: "",
        description: "",
        criticalityLevel: "Medium"
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [mpdData, modelsData] = await Promise.all([
                mpdService.getAllMPDs(),
                aircraftModelService.getAllAircraftModels()
            ]);
            setMpds(mpdData);
            setAircraftModels(modelsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingMPD(null);
        setFormData({
            aircraftModelId: "",
            manufacturer: "",
            engineType: "",
            task: "",
            code: "",
            maintenance: "",
            checkType: "A-Check",
            cal_fc: 0,
            cal_fh: 0,
            period: "",
            position: [0, 0, 0],
            ataChapter: "",
            description: "",
            criticalityLevel: "Medium"
        });
        setMpdPosition([0, 0, 0]);
        setSelectedModel(null);
        setShowAddModal(true);
    };

    const handleOpenEditModal = (mpd) => {
        setEditingMPD(mpd);
        
        const model = aircraftModels.find(m => m._id === mpd.aircraftModelId);
        
        setFormData({
            aircraftModelId: mpd.aircraftModelId || "",
            manufacturer: mpd.manufacturer || model?.manufacturer || "",
            engineType: mpd.engineType || model?.engineType || "",
            task: mpd.task || "",
            code: mpd.code || "",
            maintenance: mpd.maintenance || "",
            checkType: mpd.checkType || "A-Check",
            cal_fc: mpd.cal_fc || 0,
            cal_fh: mpd.cal_fh || 0,
            period: mpd.period || "",
            position: mpd.position || [0, 0, 0],
            ataChapter: mpd.ataChapter || "",
            description: mpd.description || "",
            criticalityLevel: mpd.criticalityLevel || "Medium"
        });
        setMpdPosition(mpd.position || [0, 0, 0]);
        
        setSelectedModel(model);
        setShowAddModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "aircraftModelId") {
            const model = aircraftModels.find(m => m._id === value);
            setSelectedModel(model);
            
            setFormData(prev => ({
                ...prev,
                aircraftModelId: value,
                manufacturer: model?.manufacturer || '',
                engineType: model?.engineType || ''
            }));
            return;
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePositionChange = (axis, value) => {
        const newPosition = [...mpdPosition];
        const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
        newPosition[axisIndex] = parseFloat(value) || 0;
        setMpdPosition(newPosition);
        setFormData(prev => ({
            ...prev,
            position: newPosition
        }));
    };

    const handleCanvasClick = (event) => {
        if (event.point) {
            const scaleFactor = 2.5;
            const newPosition = [
                event.point.x / scaleFactor,
                event.point.y / scaleFactor,
                event.point.z / scaleFactor
            ];
            setMpdPosition(newPosition);
            setFormData(prev => ({
                ...prev,
                position: newPosition
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingMPD) {
                await mpdService.updateMPD(editingMPD._id, formData);
                alert("MPD updated !");
            } else {
                await mpdService.createMPD(formData.aircraftModelId, formData);
                alert("MPD created !");
            }
            setShowAddModal(false);
            fetchData();
        } catch (error) {
            console.error("Error saving MPD:", error);
            alert(`Error: ${error.message || "Failed to save MPD. Please try again."}`);
        }
    };

    const handleDelete = async (mpdId, mpdCode) => {
        if (!confirm(`Are you sure you want to delete MPD ${mpdCode}? This action cannot be undone.`)) {
            return;
        }

        try {
            await mpdService.deleteMPD(mpdId);
            alert("MPD deleted successfully!");
            fetchData();
        } catch (error) {
            console.error("Error deleting MPD:", error);
            alert(`Error: ${error.message || "Failed to delete MPD. Please try again."}`);
        }
    };

    const getModelPath = (model) => {
        if (!model || !model.manufacturer || !model.model) return null;
        const modelFileName = `${model.manufacturer}_${model.model}.glb`;
        return `/src/assets/models/${model.manufacturer}/${modelFileName}`;
    };

    if (loading) {
        return <Loading message="Loading MPD data..." />;
    }

    return (
        <div className="h-full w-full bg-neutral-900 text-white p-6 overflow-y-auto">
            <PageHeader
                title="MPD Management"
                subtitle="Manage Maintenance Planning Document database"
            >
                <Button
                    variant="primary"
                    onClick={handleOpenAddModal}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add New MPD
                </Button>
            </PageHeader>

            <MPDTable
                mpds={mpds}
                aircraftModels={aircraftModels}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
                loading={loading}
            />

            <MPDFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleSubmit}
                formData={formData}
                onChange={handleChange}
                editingMPD={editingMPD}
                aircraftModels={aircraftModels}
                selectedModel={selectedModel}
                mpdPosition={mpdPosition}
                onPositionChange={handlePositionChange}
                onCanvasClick={handleCanvasClick}
                getModelPath={getModelPath}
            />
        </div>
    );
}

export default MPDManagement;
