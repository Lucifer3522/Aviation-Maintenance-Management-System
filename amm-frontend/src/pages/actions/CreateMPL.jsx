import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mplService, aircraftService } from '../../services';
import { Button, Input, Select, Card, PageHeader } from '../../components/ui';

function CreateMPL() {
    const navigate = useNavigate();
    const location = useLocation();
    const mpdData = location.state?.mpd;

    const [loading, setLoading] = useState(false);
    const [aircrafts, setAircrafts] = useState([]);
    const [formData, setFormData] = useState({
        name: mpdData?.name || '',
        description: mpdData?.description || '',
        mpdReference: mpdData?._id || '',
        aircraft: '',
        schedulingType: 'FH',
        intervalValue: '',
        intervalUnit: 'hours',
        compliance: {
            mustBeCompleted: false,
            deadline: '',
            tolerance: 0
        },
        effectiveDate: new Date().toISOString().split('T')[0],
        notes: ''
    });

    useEffect(() => {
        fetchAircrafts();
    }, []);

    const fetchAircrafts = async () => {
        try {
            const data = await aircraftService.getAllAircraft();
            setAircrafts(data);
        } catch (error) {
            console.error('Error fetching aircrafts:', error);
            alert('Failed to load aircrafts');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('compliance.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                compliance: {
                    ...prev.compliance,
                    [field]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name) {
            alert('Please enter MPL name');
            return;
        }

        if (!formData.aircraft) {
            alert('Please select an aircraft');
            return;
        }

        if (!formData.intervalValue) {
            alert('Please enter interval value');
            return;
        }

        setLoading(true);
        try {
            const mpNumber = `MPL-${formData.aircraft.slice(-6)}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            
            const intervalValue = parseInt(formData.intervalValue);
            
            const payload = {
                title: formData.name,
                description: formData.description,
                mpNumber: mpNumber,
                aircraftId: formData.aircraft,
                mpdId: formData.mpdReference || null,
                schedulingType: formData.schedulingType,
                status: 'Active',
                camoNotes: formData.notes
            };

            if (formData.schedulingType === 'FH') {
                payload.flightHours = {
                    interval: intervalValue,
                    threshold: Math.floor(intervalValue * 0.1),
                    lastCompliance: 0
                };
            } else if (formData.schedulingType === 'FC') {
                payload.flightCycles = {
                    interval: intervalValue,
                    threshold: Math.floor(intervalValue * 0.1),
                    lastCompliance: 0
                };
            } else if (formData.schedulingType === 'Calendar') {
                payload.calendar = {
                    interval: intervalValue,
                    intervalUnit: formData.intervalUnit === 'days' ? 'Days' : 
                                formData.intervalUnit === 'months' ? 'Months' : 'Years'
                };
            }

            console.log('Sending MPL payload:', payload);
            await mplService.createMPL(payload);
            alert('MPL created successfully!');
            navigate('/camo');
        } catch (error) {
            console.error('Error creating MPL:', error);
            alert(`Failed to create MPL: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getIntervalUnitOptions = () => {
        switch(formData.schedulingType) {
            case 'FH':
                return [{ value: 'hours', label: 'Flight Hours' }];
            case 'FC':
                return [{ value: 'cycles', label: 'Flight Cycles' }];
            case 'Calendar':
                return [
                    { value: 'days', label: 'Days' },
                    { value: 'months', label: 'Months' },
                    { value: 'years', label: 'Years' }
                ];
            default:
                return [];
        }
    };

    return (
        <div className="p-6 bg-neutral-900 min-h-screen">
            <PageHeader
                title="Create MPL"
                subtitle="Create a new Maintenance Program List"
            />

            {mpdData && (
                <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                    <p className="text-blue-400 text-sm">
                        📋 Based on MPD: <span className="font-semibold">{mpdData.name}</span>
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 dark:border-neutral-600 pb-2">
                            Basic Information
                        </h2>

                        <Input
                            label="MPL Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter MPL name"
                            required
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Enter MPL description..."
                                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <Select
                            label="Select Aircraft"
                            name="aircraft"
                            value={formData.aircraft}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Aircraft</option>
                            {aircrafts.map(aircraft => (
                                <option key={aircraft._id} value={aircraft._id}>
                                    {aircraft.registration} - {aircraft.aircraftModelId?.fullName}
                                </option>
                            ))}
                        </Select>
                    </div>
                </Card>

                <Card>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 dark:border-neutral-600 pb-2">
                            Scheduling Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Select
                                label="Scheduling Type"
                                name="schedulingType"
                                value={formData.schedulingType}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    const newType = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        schedulingType: newType,
                                        intervalUnit: newType === 'FH' ? 'hours' : 
                                                    newType === 'FC' ? 'cycles' : 'days'
                                    }));
                                }}
                                required
                            >
                                <option value="FH">Flight Hours (FH)</option>
                                <option value="FC">Flight Cycles (FC)</option>
                                <option value="Calendar">Calendar</option>
                            </Select>

                            <Input
                                type="number"
                                label="Interval Value"
                                name="intervalValue"
                                value={formData.intervalValue}
                                onChange={handleInputChange}
                                min="1"
                                placeholder="e.g., 500"
                                required
                            />

                            <Select
                                label="Unit"
                                name="intervalUnit"
                                value={formData.intervalUnit}
                                onChange={handleInputChange}
                                required
                            >
                                {getIntervalUnitOptions().map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <Input
                            type="date"
                            label="Effective Date"
                            name="effectiveDate"
                            value={formData.effectiveDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </Card>

                <Card>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 dark:border-neutral-600 pb-2">
                            Compliance Settings
                        </h2>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="compliance.mustBeCompleted"
                                checked={formData.compliance.mustBeCompleted}
                                onChange={handleInputChange}
                                className="w-4 h-4 rounded bg-neutral-700 border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-300">
                                Must be completed (Mandatory)
                            </label>
                        </div>

                        {formData.compliance.mustBeCompleted && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                <Input
                                    type="date"
                                    label="Deadline"
                                    name="compliance.deadline"
                                    value={formData.compliance.deadline}
                                    onChange={handleInputChange}
                                />

                                <Input
                                    type="number"
                                    label="Tolerance (%)"
                                    name="compliance.tolerance"
                                    value={formData.compliance.tolerance}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="100"
                                    placeholder="0-100"
                                />
                            </div>
                        )}
                    </div>
                </Card>

                <Card>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 dark:border-neutral-600 pb-2">
                            Additional Information
                        </h2>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Add any additional notes or instructions..."
                                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-700 mt-6">
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
                            {loading ? 'Creating...' : 'Create MPL'}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}

export default CreateMPL;
