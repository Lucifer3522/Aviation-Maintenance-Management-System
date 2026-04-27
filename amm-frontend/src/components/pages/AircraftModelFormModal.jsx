import { Modal, Input, Button } from '../ui';

function AircraftModelFormModal({ isOpen, onClose, onSubmit, formData, onChange, editingModel }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingModel ? "Edit Aircraft Model" : "Add New Aircraft Model"}
            size="3xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Manufacturer"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={onChange}
                        required
                        placeholder="Airbus"
                    />

                    <Input
                        label="Model"
                        name="model"
                        value={formData.model}
                        onChange={onChange}
                        required
                        placeholder="A320"
                    />
                </div>

                <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={onChange}
                    placeholder="Airbus A320"
                />

                <Input
                    label="3D Model Path"
                    name="modelPath"
                    value={formData.modelPath}
                    onChange={onChange}
                    placeholder="/src/assets/models/Airbus/Airbus_A320.glb"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        rows="3"
                        placeholder="Single-aisle airliner"
                        className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Max Takeoff Weight (kg)"
                            name="spec_maxTakeoffWeight"
                            type="number"
                            value={formData.specifications.maxTakeoffWeight}
                            onChange={onChange}
                            placeholder="78000"
                        />

                        <Input
                            label="Max Passengers"
                            name="spec_maxPassengers"
                            type="number"
                            value={formData.specifications.maxPassengers}
                            onChange={onChange}
                            placeholder="180"
                        />

                        <Input
                            label="Max Range (km)"
                            name="spec_maxRange"
                            type="number"
                            value={formData.specifications.maxRange}
                            onChange={onChange}
                            placeholder="6150"
                        />

                        <Input
                            label="Engine Type"
                            name="spec_engineType"
                            value={formData.specifications.engineType}
                            onChange={onChange}
                            placeholder="CFM56-5"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                    >
                        {editingModel ? "Update Model" : "Create Model"}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default AircraftModelFormModal;
