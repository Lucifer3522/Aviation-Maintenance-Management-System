import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mplService, aircraftService } from '../../services';
import Loading from '../../components/Loading';
import { Button, Input, Select, Card, PageHeader } from '../../components/ui';

function EditMPL() {
    const navigate = useNavigate();
    const { mplId } = useParams();
    const id = mplId;
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [aircrafts, setAircrafts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        mpdReference: '',
        aircraft: '',
        schedulingType: 'FH',
        intervalValue: '',
        intervalUnit: 'hours',
        compliance: {
            mustBeCompleted: false,
            deadline: '',
            tolerance: 0
        },
        effectiveDate: '',
        notes: ''
    });

    useEffect(() => {
        fetchMPL();
        fetchAircrafts();
    }, [id]);

    const fetchMPL = async () => {
        try {
            const data = await mplService.getMPL(id);
            console.log('Fetched MPL data:', data);
            
            let intervalValue = '';
            let intervalUnit = 'hours';
            
            if (data.schedulingType === 'FH' && data.flightHours) {
                intervalValue = data.flightHours.interval || '';
                intervalUnit = 'hours';
            } else if (data.schedulingType === 'FC' && data.flightCycles) {
                intervalValue = data.flightCycles.interval || '';
                intervalUnit = 'cycles';
            } else if (data.schedulingType === 'Calendar' && data.calendar) {
                intervalValue = data.calendar.interval || '';
                intervalUnit = data.calendar.intervalUnit?.toLowerCase() || 'days';
            }
            
            setFormData({
                name: data.title || '',
                description: data.description || '',
                mpdReference: data.mpdId?._id || '',
                aircraft: data.aircraftId?._id || '',
                schedulingType: data.schedulingType || 'FH',
                intervalValue: intervalValue,
                intervalUnit: intervalUnit,
                compliance: {
                    mustBeCompleted: false,
                    deadline: '',
                    tolerance: 0
                },
                effectiveDate: data.createdAt ? 
                    new Date(data.createdAt).toISOString().split('T')[0] : '',
                notes: data.camoNotes || ''
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching MPL:', error);
            alert('Failed to load MPL');
            navigate('/camo');
        }
    };

    const fetchAircrafts = async () => {
        try {
            const data = await aircraftService.getAllAircraft();
            setAircrafts(data);
        } catch (error) {
            console.error('Error fetching aircrafts:', error);
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

        setSaving(true);
        try {
            const intervalValue = parseInt(formData.intervalValue);
            
            const payload = {
                title: formData.name,
                description: formData.description,
                aircraftId: formData.aircraft,
                mpdId: formData.mpdReference || null,
                schedulingType: formData.schedulingType,
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

            console.log('Sending update payload:', payload);
            await mplService.updateMPL(id, payload);
            alert('MPL updated successfully!');
            navigate('/camo');
        } catch (error) {
            console.error('Error updating MPL:', error);
            alert(`Failed to update MPL: ${error.message}`);
        } finally {
            setSaving(false);
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

    if (loading) {
        return <Loading message="Loading MPL..." />;
    }

    return (
        <div className="p-6 bg-neutral-900 min-h-screen">
            <PageHeader
                title="Edit MPL"
                subtitle="Update Maintenance Program List"
            />
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
                            variant="secondary"
                            onClick={() => navigate('/camo')}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}

export default EditMPL;
