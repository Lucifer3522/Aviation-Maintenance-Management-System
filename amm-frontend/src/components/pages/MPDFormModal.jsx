import { Modal, Input, Select, Button } from '../ui';
import Model3DViewer from './Model3DViewer';

function MPDFormModal({ 
    isOpen, 
    onClose, 
    onSubmit, 
    formData, 
    onChange,
    editingMPD,
    aircraftModels,
    selectedModel,
    mpdPosition,
    onPositionChange,
    onCanvasClick,
    getModelPath
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingMPD ? "Edit MPD" : "Add New MPD"}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Select
                            label="Aircraft Model"
                            name="aircraftModelId"
                            value={formData.aircraftModelId}
                            onChange={onChange}
                            required
                        >
                            <option value="">Select an Aircraft Model</option>
                            {aircraftModels.map((model) => (
                                <option key={model._id} value={model._id}>
                                    {model.manufacturer} {model.model}
                                </option>
                            ))}
                        </Select>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Code"
                                name="code"
                                value={formData.code}
                                onChange={onChange}
                                required
                                placeholder="MPD-001"
                            />
                            <Input
                                label="ATA Chapter"
                                name="ataChapter"
                                value={formData.ataChapter}
                                onChange={onChange}
                                placeholder="32"
                            />
                        </div>

                        <Input
                            label="Task Description"
                            name="task"
                            value={formData.task}
                            onChange={onChange}
                            required
                            placeholder="Inspect landing gear"
                        />

                        <Input
                            label="Maintenance Type"
                            name="maintenance"
                            value={formData.maintenance}
                            onChange={onChange}
                            required
                            placeholder="Visual Inspection"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Check Type"
                                name="checkType"
                                value={formData.checkType}
                                onChange={onChange}
                                required
                            >
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="A-Check">A-Check</option>
                                <option value="B-Check">B-Check</option>
                                <option value="C-Check">C-Check</option>
                                <option value="D-Check">D-Check</option>
                                <option value="Special">Special</option>
                            </Select>

                            <Select
                                label="Criticality Level"
                                name="criticalityLevel"
                                value={formData.criticalityLevel}
                                onChange={onChange}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </Select>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <Input
                                label="Period"
                                name="period"
                                value={formData.period}
                                onChange={onChange}
                                placeholder="500 FH"
                            />
                            <Input
                                label="Cal FC"
                                name="cal_fc"
                                type="number"
                                value={formData.cal_fc}
                                onChange={onChange}
                                min="0"
                            />
                            <Input
                                label="Cal FH"
                                name="cal_fh"
                                type="number"
                                value={formData.cal_fh}
                                onChange={onChange}
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={onChange}
                                rows="3"
                                placeholder="Additional details..."
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Position on 3D Model
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">X</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={mpdPosition[0].toFixed(2)}
                                        onChange={(e) => onPositionChange('x', e.target.value)}
                                        className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Y</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={mpdPosition[1].toFixed(2)}
                                        onChange={(e) => onPositionChange('y', e.target.value)}
                                        className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Z</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={mpdPosition[2].toFixed(2)}
                                        onChange={(e) => onPositionChange('z', e.target.value)}
                                        className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1"
                            >
                                {editingMPD ? "Update MPD" : "Create MPD"}
                            </Button>
                            <Button
                                type="button"
                                variant="danger"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="space-y-4">
                    <div className="bg-neutral-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-2">3D Model Preview</h3>
                        <Model3DViewer
                            selectedModel={selectedModel}
                            mpdPosition={mpdPosition}
                            onCanvasClick={onCanvasClick}
                            getModelPath={getModelPath}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default MPDFormModal;
