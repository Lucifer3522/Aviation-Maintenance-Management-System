import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mptlService, authService, aircraftService } from '../../services';
import { Button, Input, Select, Card, PageHeader } from '../../components/ui';

function EditMPTL() {
    const navigate = useNavigate();
    const { mptlId } = useParams();

    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [users, setUsers] = useState([]);
    const [mpdList, setMpdList] = useState([]);
    const [formData, setFormData] = useState({
        mplReference: '',
        aircraft: '',
        workOrderNumber: '',
        title: '',
        description: '',
        scheduledStartDate: '',
        scheduledEndDate: '',
        tasks: []
    });

    useEffect(() => {
        fetchMPTLData();
        fetchUsers();
    }, [mptlId]);

    const fetchMPTLData = async () => {
        try {
            setFetchingData(true);
            const data = await mptlService.getMPTLById(mptlId);
            
            // Map backend data to form structure
            setFormData({
                mplReference: data.mplId?._id || data.mplId || '',
                aircraft: data.aircraftId?._id || data.aircraftId || '',
                workOrderNumber: data.workOrderNumber || '',
                title: data.title || '',
                description: data.description || '',
                scheduledStartDate: data.scheduledStartDate ? new Date(data.scheduledStartDate).toISOString().split('T')[0] : '',
                scheduledEndDate: data.scheduledEndDate ? new Date(data.scheduledEndDate).toISOString().split('T')[0] : '',
                tasks: data.tasks.map(task => ({
                    taskNumber: task.taskNumber,
                    description: task.description,
                    taskType: task.taskType || 'Inspection',
                    assignedRole: task.assignedRole || 'B1_TECH',
                    estimatedHours: task.manhours?.estimated || 4,
                    assignedTo: task.assignedTo?._id || task.assignedTo || '',
                    mpdId: task.mpdId?._id || task.mpdId || '',
                    status: task.status || 'Not Started'
                }))
            });

            // Fetch MPD list for the aircraft
            if (data.aircraftId) {
                const aircraftId = data.aircraftId._id || data.aircraftId;
                try {
                    const mpds = await aircraftService.getAllAircraftMPD(aircraftId);
                    setMpdList(mpds || []);
                } catch (err) {
                    console.error('Error fetching MPD list:', err);
                    setMpdList([]);
                }
            }
        } catch (error) {
            console.error('Error fetching MPTL:', error);
            alert(`Failed to load MPTL: ${error.message}`);
            navigate('/mro');
        } finally {
            setFetchingData(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setUsers([]);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTaskChange = (index, field, value) => {
        const updatedTasks = [...formData.tasks];
        updatedTasks[index][field] = value;
        setFormData(prev => ({
            ...prev,
            tasks: updatedTasks
        }));
    };

    const addTask = () => {
        const newTaskNumber = String(formData.tasks.length + 1).padStart(3, '0');
        setFormData(prev => ({
            ...prev,
            tasks: [...prev.tasks, {
                taskNumber: newTaskNumber,
                description: '',
                taskType: 'Inspection',
                assignedRole: 'B1_TECH',
                estimatedHours: 4,
                assignedTo: '',
                mpdId: '',
                status: 'Not Started'
            }]
        }));
    };

    const removeTask = (index) => {
        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title) {
            alert('Title is required');
            return;
        }

        if (!formData.workOrderNumber) {
            alert('Work order number is required');
            return;
        }

        if (formData.tasks.length === 0) {
            alert('At least one task is required');
            return;
        }

        const invalidTask = formData.tasks.find(task => !task.description);
        if (invalidTask) {
            alert('All tasks must have descriptions');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                workOrderNumber: formData.workOrderNumber,
                title: formData.title,
                description: formData.description,
                scheduledStartDate: formData.scheduledStartDate,
                scheduledEndDate: formData.scheduledEndDate,
                tasks: formData.tasks.map(task => ({
                    taskNumber: task.taskNumber,
                    description: task.description,
                    taskType: task.taskType,
                    assignedRole: task.assignedRole,
                    assignedTo: task.assignedTo || undefined,
                    mpdId: task.mpdId || undefined,
                    status: task.status,
                    manhours: {
                        estimated: parseFloat(task.estimatedHours)
                    }
                }))
            };

            console.log('Updating MPTL with payload:', payload);
            await mptlService.updateMPTL(mptlId, payload);
            alert('MPTL updated successfully!');
            navigate('/mro');
        } catch (error) {
            console.error('Error updating MPTL:', error);
            alert(`Failed to update MPTL: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getRoleIcon = (role) => {
        switch(role) {
            case 'B1_TECH': return '🔧';
            case 'B2_TECH': return '⚡';
            case 'C_TECH': return '✈️';
            default: return '👤';
        }
    };

    const getRoleLabel = (role) => {
        switch(role) {
            case 'B1_TECH': return 'B1 Technician (Mechanical)';
            case 'B2_TECH': return 'B2 Technician (Avionics)';
            case 'C_TECH': return 'C Technician (Line)';
            default: return role;
        }
    };

    if (fetchingData) {
        return (
            <div className="min-h-screen bg-neutral-900 text-white p-8">
                <div className="max-w-6xl mx-auto text-center py-20">
                    <div className="text-xl">Loading MPTL data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <PageHeader 
                    title="Edit MPTL" 
                    subtitle="Update Maintenance Package Task List"
                >
                    <Button
                        type="button"
                        onClick={() => navigate('/mro')}
                        variant="secondary"
                    >
                        ← Back to MRO
                    </Button>
                </PageHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter MPTL title"
                                required
                            />
                            <Input
                                label="Work Order Number"
                                name="workOrderNumber"
                                value={formData.workOrderNumber}
                                onChange={handleInputChange}
                                placeholder="Enter work order number"
                                required
                            />
                            <Input
                                type="date"
                                label="Scheduled Start Date"
                                name="scheduledStartDate"
                                value={formData.scheduledStartDate}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                type="date"
                                label="Scheduled End Date"
                                name="scheduledEndDate"
                                value={formData.scheduledEndDate}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-neutral-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Enter detailed description"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Tasks Section */}
                    <Card>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-700 dark:border-neutral-600 pb-2">
                                <h2 className="text-xl font-semibold text-white">Tasks</h2>
                                <Button
                                    type="button"
                                    onClick={addTask}
                                    variant="success"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Add Task
                                </Button>
                            </div>

                            {formData.tasks.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    No tasks added yet. Click "Add Task" to create your first task.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formData.tasks.map((task, index) => (
                                        <div key={index} className="bg-neutral-700 rounded-lg p-4 relative">
                                            <button
                                                type="button"
                                                onClick={() => removeTask(index)}
                                                className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    label="Task Number"
                                                    value={task.taskNumber}
                                                    onChange={(e) => handleTaskChange(index, 'taskNumber', e.target.value)}
                                                    readOnly
                                                />

                                                <Select
                                                    label="Task Type"
                                                    value={task.taskType}
                                                    onChange={(e) => handleTaskChange(index, 'taskType', e.target.value)}
                                                    required
                                                    options={[
                                                        { value: 'Inspection', label: 'Inspection' },
                                                        { value: 'Repair', label: 'Repair' },
                                                        { value: 'Replacement', label: 'Replacement' },
                                                        { value: 'Modification', label: 'Modification' },
                                                        { value: 'Test', label: 'Test' },
                                                        { value: 'Lubrication', label: 'Lubrication' },
                                                        { value: 'Servicing', label: 'Servicing' }
                                                    ]}
                                                />

                                                <Select
                                                    label="Required Role"
                                                    value={task.assignedRole}
                                                    onChange={(e) => handleTaskChange(index, 'assignedRole', e.target.value)}
                                                    required
                                                    options={[
                                                        { value: 'B1_TECH', label: 'B1 Technician (Mechanical)' },
                                                        { value: 'B2_TECH', label: 'B2 Technician (Avionics)' },
                                                        { value: 'C_TECH', label: 'C Technician (Line)' }
                                                    ]}
                                                />

                                                <Input
                                                    label="Estimated Hours"
                                                    type="number"
                                                    step="0.5"
                                                    min="0.5"
                                                    value={task.estimatedHours}
                                                    onChange={(e) => handleTaskChange(index, 'estimatedHours', e.target.value)}
                                                    required
                                                />

                                                <Select
                                                    label="MPD Position (Optional - for 3D view)"
                                                    value={task.mpdId || ''}
                                                    onChange={(e) => handleTaskChange(index, 'mpdId', e.target.value)}
                                                    options={[
                                                        { value: '', label: 'No MPD Position' },
                                                        ...mpdList.map(mpd => ({
                                                            value: mpd._id,
                                                            label: `${mpd.code} - ${mpd.task?.substring(0, 50) || 'N/A'}`
                                                        }))
                                                    ]}
                                                />

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Task Description *
                                                    </label>
                                                    <textarea
                                                        value={task.description}
                                                        onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                                                        rows={3}
                                                        placeholder="Enter task description..."
                                                        className="w-full px-4 py-2 bg-neutral-600 border border-gray-500 rounded-lg text-white"
                                                        required
                                                    />
                                                </div>

                                                <Input
                                                    label="Assign To (Optional)"
                                                    value={task.assignedTo}
                                                    onChange={(e) => handleTaskChange(index, 'assignedTo', e.target.value)}
                                                    placeholder="Enter technician ID or leave empty"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Summary */}
                    {formData.tasks.length > 0 && (
                        <Card className="bg-blue-900/20 border-blue-700">
                            <h3 className="font-semibold text-white mb-4">Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400">Total Tasks</p>
                                    <p className="text-white font-semibold text-lg">{formData.tasks.length}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Total Estimated Hours</p>
                                    <p className="text-white font-semibold text-lg">
                                        {formData.tasks.reduce((sum, task) => sum + parseFloat(task.estimatedHours || 0), 0).toFixed(1)}h
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">B1 Tasks</p>
                                    <p className="text-white font-semibold text-lg">
                                        {formData.tasks.filter(t => t.assignedRole === 'B1_TECH').length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">B2 Tasks</p>
                                    <p className="text-white font-semibold text-lg">
                                        {formData.tasks.filter(t => t.assignedRole === 'B2_TECH').length}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                        <Button
                            type="button"
                            onClick={() => navigate('/mro')}
                            variant="secondary"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading || formData.tasks.length === 0}
                        >
                            {loading ? 'Updating...' : 'Update MPTL'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditMPTL;
