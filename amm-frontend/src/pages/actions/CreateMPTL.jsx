import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mptlService, mplService, authService, aircraftService } from '../../services';
import { Button, Input, Select, Card, PageHeader } from '../../components/ui';

function CreateMPTL() {
    const navigate = useNavigate();
    const location = useLocation();
    const mplData = location.state?.mpl;

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [mpdList, setMpdList] = useState([]);
    const [formData, setFormData] = useState({
        mplReference: mplData?._id || '',
        aircraft: mplData?.aircraftId?._id || '',
        workOrderNumber: '',
        title: mplData?.title || '',
        description: '',
        scheduledStartDate: new Date().toISOString().split('T')[0],
        scheduledEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        tasks: []
    });

    useEffect(() => {
        fetchUsers();
        if (mplData) {
            setFormData(prev => ({
                ...prev,
                tasks: [{
                    taskNumber: '001',
                    description: mplData.description || 'Task from MPL',
                    taskType: 'Inspection',
                    assignedRole: 'B1_TECH',
                    estimatedHours: 4,
                    assignedTo: '',
                    mpdId: '',
                    status: 'Not Started'
                }]
            }));
        }
    }, [mplData]);

    useEffect(() => {
        if (formData.aircraft) {
            fetchMPDList();
        }
    }, [formData.aircraft]);

    const fetchMPDList = async () => {
        try {
            const mpds = await aircraftService.getAllAircraftMPD(formData.aircraft);
            setMpdList(mpds || []);
        } catch (error) {
            console.error('Error fetching MPD list:', error);
            setMpdList([]);
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
        
        if (!formData.mplReference) {
            alert('MPL reference is required');
            return;
        }

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
            const taskListNumber = `MPTL-${formData.aircraft.slice(-6)}-${Date.now()}`;
            
            const payload = {
                mplId: formData.mplReference,
                aircraftId: formData.aircraft,
                taskListNumber: taskListNumber,
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

            console.log('Creating MPTL with payload:', payload);
            await mptlService.createMPTL(payload);
            alert('MPTL created successfully!');
            navigate('/mro');
        } catch (error) {
            console.error('Error creating MPTL:', error);
            alert(`Failed to create MPTL: ${error.message}`);
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

    return (
        <div className="p-6 bg-neutral-900 min-h-screen">
            <PageHeader
                title="Create MPTL"
                subtitle="Create a new Maintenance Package Task List"
            />

            {mplData && (
                <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                        MPL: <span className="font-semibold">{mplData.title}</span> (Aircraft: {mplData.aircraftId?.registration})
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 dark:border-neutral-600 pb-2">
                            Basic Information
                        </h2>
                        
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
                                placeholder="WO-2024-001"
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

                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={2}
                                    placeholder="Optional description..."
                                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {mplData && (
                            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mt-4">
                                <p className="text-sm text-gray-300">
                                    <span className="font-semibold">MPL Reference:</span> {mplData.title}
                                </p>
                                <p className="text-sm text-gray-300 mt-1">
                                    <span className="font-semibold">Aircraft:</span> {mplData.aircraftId?.registration}
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

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
                        {loading ? 'Creating...' : 'Create MPTL'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateMPTL;
