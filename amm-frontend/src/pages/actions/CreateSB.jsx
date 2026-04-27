import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sbService, aircraftModelService } from '../../services';
import { Button, Input, Select, Card, PageHeader } from '../../components/ui';

function CreateServiceBulletin() {
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [aircraftModels, setAircraftModels] = useState([]);
    const [formData, setFormData] = useState({
        sbNumber: '',
        title: '',
        description: '',
        aircraftModel: '',
        issueDate: new Date().toISOString().split('T')[0],
        effectiveDate: '',
        category: 'Recommended',
        complianceType: 'Before Next Flight',
        complianceValue: '',
        complianceUnit: 'hours',
        applicability: {
            serialNumberRange: {
                from: '',
                to: ''
            },
            specificSerialNumbers: ''
        },
        workDescription: '',
        estimatedManHours: '',
        requiredTools: '',
        requiredMaterials: '',
        references: '',
        status: 'Open'
    });

    useEffect(() => {
        fetchAircraftModels();
    }, []);

    const fetchAircraftModels = async () => {
        try {
            const data = await aircraftModelService.getAllAircraftModels();
            setAircraftModels(data);
        } catch (error) {
            console.error('Error fetching aircraft models:', error);
            alert('Failed to load aircraft models');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('applicability.serialNumberRange.')) {
            const field = name.split('.')[2];
            setFormData(prev => ({
                ...prev,
                applicability: {
                    ...prev.applicability,
                    serialNumberRange: {
                        ...prev.applicability.serialNumberRange,
                        [field]: value
                    }
                }
            }));
        } else if (name.startsWith('applicability.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                applicability: {
                    ...prev.applicability,
                    [field]: value
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
        
        if (!formData.sbNumber) {
            alert('SB Number is required');
            return;
        }

        if (!formData.title) {
            alert('Title is required');
            return;
        }

        if (!formData.aircraftModel) {
            alert('Please select an aircraft model');
            return;
        }

        if (!formData.description) {
            alert('Description is required');
            return;
        }

        setLoading(true);
        try {
            const selectedModel = aircraftModels.find(m => m._id === formData.aircraftModel);
            
            // Extract ATA chapter from SB number (e.g., SB-A320-27-001 -> 27)
            const ataChapter = formData.sbNumber.includes('-') 
                ? formData.sbNumber.split('-')[2] || '00' 
                : '00';
            
            const payload = {
                aircraftModelId: formData.aircraftModel,
                sbNumber: formData.sbNumber,
                title: formData.title,
                description: formData.description,
                manufacturer: selectedModel?.manufacturer || 'Unknown',
                ataChapter: ataChapter,
                issuedDate: formData.issueDate,
                effectiveDate: formData.effectiveDate || formData.issueDate,
                category: formData.category,
                complianceType: formData.complianceType,
                estimatedManHours: formData.estimatedManHours ? parseFloat(formData.estimatedManHours) : undefined,
                serialNumberRange: {
                    from: formData.applicability.serialNumberRange.from || undefined,
                    to: formData.applicability.serialNumberRange.to || undefined
                },
                requiredTools: formData.requiredTools ? formData.requiredTools.split(',').map(s => s.trim()) : [],
                specialInstructions: formData.workDescription || undefined,
                status: formData.status || 'Active'
            };

            if (formData.complianceType === 'Within X Hours/Cycles' && formData.complianceValue) {
                payload.complianceThreshold = {
                    [formData.complianceUnit === 'hours' ? 'flightHours' : formData.complianceUnit]: parseInt(formData.complianceValue)
                };
            }

            console.log('Sending SB payload:', payload);
            await sbService.createServiceBulletin(payload);
            alert('Service Bulletin created successfully !');
            navigate('/camo');
        } catch (error) {
            console.error('Error creating service bulletin:', error);
            alert(`Failed to create service bulletin: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (category) => {
        switch(category) {
            case 'Mandatory': return 'bg-red-900/30 border-red-700';
            case 'Recommended': return 'bg-yellow-900/30 border-yellow-700';
            case 'Optional': return 'bg-green-900/30 border-green-700';
            default: return 'bg-gray-900/30 border-gray-700';
        }
    };

    return (
        <div className="p-6 bg-neutral-900 min-h-screen text-white">
            <PageHeader
                title="Create Service Bulletin"
                subtitle="Create a new Service Bulletin"
            >
            </PageHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 dark:border-neutral-600 pb-2">
                            Basic Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="SB Number"
                                name="sbNumber"
                                value={formData.sbNumber}
                                onChange={handleInputChange}
                                placeholder="SB-A320-27-001"
                                required
                            />

                            <Select
                                label="Aircraft Model"
                                name="aircraftModel"
                                value={formData.aircraftModel}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Aircraft Model</option>
                                {aircraftModels.map(model => (
                                    <option key={model._id} value={model._id}>
                                        {model.manufacturer} {model.model}
                                    </option>
                                ))}
                            </Select>

                            <Input
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Engine Fan Blade Inspection"
                                required
                                className="md:col-span-2"
                            />

                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="Service bulletin"
                                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 dark:border-neutral-600 pb-2">
                            Category & Compliance
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Select
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Mandatory">Mandatory</option>
                                <option value="Recommended">Recommended</option>
                                <option value="Optional">Optional</option>
                            </Select>

                            <Input
                                type="date"
                                label="Issue Date"
                                name="issueDate"
                                value={formData.issueDate}
                                onChange={handleInputChange}
                                required
                            />

                            <Input
                                type="date"
                                label="Effective Date"
                                name="effectiveDate"
                                value={formData.effectiveDate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Select
                                label="Compliance Type"
                                name="complianceType"
                                value={formData.complianceType}
                                onChange={handleInputChange}
                            >
                                <option value="Before Next Flight">Before Next Flight</option>
                                <option value="Within X Hours/Cycles">Within X Hours/Cycles</option>
                                <option value="Calendar">Calendar</option>
                                <option value="At Next Maintenance">At Next Maintenance</option>
                            </Select>

                            {formData.complianceType === 'Within X Hours/Cycles' && (
                                <>
                                    <Input
                                        type="number"
                                        label="Compliance Value"
                                        name="complianceValue"
                                        value={formData.complianceValue}
                                        onChange={handleInputChange}
                                        min="1"
                                        placeholder="500"
                                    />

                                    <Select
                                        label="Unit"
                                        name="complianceUnit"
                                        value={formData.complianceUnit}
                                        onChange={handleInputChange}
                                    >
                                        <option value="hours">Flight Hours</option>
                                        <option value="cycles">Flight Cycles</option>
                                        <option value="days">Days</option>
                                    </Select>
                                </>
                            )}
                        </div>
                    </div>
                </Card>

                <Card>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 dark:border-neutral-600 pb-2">
                            Applicability
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Serial Number From"
                                name="applicability.serialNumberRange.from"
                                value={formData.applicability.serialNumberRange.from}
                                onChange={handleInputChange}
                                placeholder="SN001"
                            />

                            <Input
                                label="Serial Number To"
                                name="applicability.serialNumberRange.to"
                                value={formData.applicability.serialNumberRange.to}
                                onChange={handleInputChange}
                                placeholder="SN999"
                            />

                            <div className="md:col-span-2">
                                <Input
                                    label="Specific Serial Numbers"
                                    name="applicability.specificSerialNumbers"
                                    value={formData.applicability.specificSerialNumbers}
                                    onChange={handleInputChange}
                                    placeholder="SN123, SN456, SN789"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 dark:border-neutral-600 pb-2">
                            Work Details
                        </h2>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Work Description
                            </label>
                            <textarea
                                name="workDescription"
                                value={formData.workDescription}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Work instructions"
                                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                type="number"
                                step="0.5"
                                label="Estimated Man Hours"
                                name="estimatedManHours"
                                value={formData.estimatedManHours}
                                onChange={handleInputChange}
                                placeholder="4.5"
                            />

                            <Input
                                label="Required Tools"
                                name="requiredTools"
                                value={formData.requiredTools}
                                onChange={handleInputChange}
                                placeholder="Torque wrench, Borescope"
                                className="md:col-span-2"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Required Materials
                            </label>
                            <textarea
                                name="requiredMaterials"
                                value={formData.requiredMaterials}
                                onChange={handleInputChange}
                                rows={2}
                                placeholder="Part numbers, materials, consumables"
                                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                References
                            </label>
                            <textarea
                                name="references"
                                value={formData.references}
                                onChange={handleInputChange}
                                rows={2}
                                placeholder="AMM references"
                                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                        <Button
                            type="button"
                            variant="danger"
                            onClick={() => navigate('/camo')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Service Bulletin'}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}

export default CreateServiceBulletin;
