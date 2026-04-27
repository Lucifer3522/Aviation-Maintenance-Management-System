import { Input, Select, Button } from '../ui';

function AircraftEditForm({ 
    formData, 
    onChange, 
    onSubmit, 
    onCancel,
    aircraftModels,
    submitting 
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-neutral-800 rounded-xl p-6 space-y-6">
            <Select
                label="Aircraft Model"
                name="aircraftModelId"
                value={formData.aircraftModelId}
                onChange={onChange}
                required
            >
                <option value="">Select an aircraft model</option>
                {aircraftModels.map((model) => (
                    <option key={model._id} value={model._id}>
                        {model.manufacturer} {model.model}
                    </option>
                ))}
            </Select>

            <Input
                label="Registration Number"
                type="text"
                name="registration"
                value={formData.registration}
                onChange={onChange}
                required
                placeholder="TC-ABC"
                className="uppercase"
            />

            <Input
                label="Serial Number"
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={onChange}
                placeholder="12345"
            />

            <Input
                label="Station"
                type="text"
                name="station"
                value={formData.station}
                onChange={onChange}
                required
                placeholder="IST-Hangar-1"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                    label="Year"
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={onChange}
                    required
                    min="1900"
                    max={new Date().getFullYear() + 5}
                />

                <Input
                    label="Flight Hours"
                    type="number"
                    name="flightHours"
                    value={formData.flightHours}
                    onChange={onChange}
                    min="0"
                />

                <Input
                    label="Cycles"
                    type="number"
                    name="cycles"
                    value={formData.cycles}
                    onChange={onChange}
                    min="0"
                />
            </div>

            <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={onChange}
            >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Grounded">Grounded</option>
                <option value="Retired">Retired</option>
            </Select>

            <div className="flex gap-4 pt-4">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                    className="flex-1"
                >
                    {submitting ? "Updating Aircraft..." : "Update Aircraft"}
                </Button>
                <Button
                    type="button"
                    variant="danger"
                    onClick={onCancel}
                    className="px-6"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}

export default AircraftEditForm;
