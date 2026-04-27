import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { aircraftModelService, aircraftService } from "../../services";
import Loading from "../../components/Loading";

function AddAircraft() {
    const navigate = useNavigate();
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
        const fetchModels = async () => {
            try {
                const data = await aircraftModelService.getAllAircraftModels();
                setAircraftModels(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching aircraft models:", error);
                setLoading(false);
            }
        };

        fetchModels();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const result = await aircraftService.createAircraft(formData);
            alert(`Aircraft created successfully !\n${result.maintenancePackages.length} maintenance packages generated.`);
            navigate("/");
        } catch (error) {
            console.error("Error creating aircraft:", error);
            alert(`Error: ${error.message || "Failed to create aircraft. Please try again."}`);
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

    if (loading) {
        return <Loading message="Loading aircraft models..." />;
    }

    return (
        <div className="h-full w-full bg-neutral-900 text-white p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Add New Aircraft</h1>
                    <p className="text-gray-400 mt-2">
                        Create a new Aircraft
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-neutral-800 rounded-xl p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Aircraft Model *
                        </label>
                        <select
                            name="aircraftModelId"
                            value={formData.aircraftModelId}
                            onChange={handleChange}
                            required
                            className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select an aircraft model</option>
                            {aircraftModels.map((model) => (
                                <option key={model._id} value={model._id}>
                                    {model.manufacturer} {model.model} {model.fullName && `(${model.fullName})`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Registration Number *
                        </label>
                        <input
                            type="text"
                            name="registration"
                            value={formData.registration}
                            onChange={handleChange}
                            required
                            placeholder="TC-ABC"
                            className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Serial Number
                        </label>
                        <input
                            type="text"
                            name="serialNumber"
                            value={formData.serialNumber}
                            onChange={handleChange}
                            placeholder="12345"
                            className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Station *
                        </label>
                        <input
                            type="text"
                            name="station"
                            value={formData.station}
                            onChange={handleChange}
                            required
                            placeholder="IST-Hangar-1"
                            className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Year *
                            </label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                min="1900"
                                max={new Date().getFullYear() + 5}
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Flight Hours
                            </label>
                            <input
                                type="number"
                                name="flightHours"
                                value={formData.flightHours}
                                onChange={handleChange}
                                min="0"
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Cycles
                            </label>
                            <input
                                type="number"
                                name="cycles"
                                value={formData.cycles}
                                onChange={handleChange}
                                min="0"
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Active">Active</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Grounded">Grounded</option>
                            <option value="Retired">Retired</option>
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
                        >
                            {submitting ? "Creating Aircraft..." : "Create Aircraft"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="px-6 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-3 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddAircraft;
