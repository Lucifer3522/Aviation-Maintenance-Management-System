import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Model3DViewer from "../components/pages/Model3DViewer";
import { mptlService, aircraftService, authService } from "../services";
import Loading from "../components/Loading";
import { Button, Card, Badge } from "../components/ui";

const getModelPath = (aircraft) => {
    if (aircraft?.aircraftModelId?.modelPath) {
        return aircraft.aircraftModelId.modelPath;
    }

    const manufacturer = aircraft?.aircraftModelId?.manufacturer || aircraft?.manufacturer;
    const model = aircraft?.aircraftModelId?.model || aircraft?.model;

    if (!manufacturer || !model) {
        console.log("Missing Data:", aircraft);
        return null;
    }

    const modelFileName = `${manufacturer}_${model}.glb`;
    const path = `/src/assets/models/${manufacturer}/${modelFileName}`;

    return path;
};

function ViewMPTL() {
    const navigate = useNavigate();
    const { mptlId } = useParams();
    const [mptl, setMptl] = useState(null);
    const [aircraft, setAircraft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const user = authService.getUser() || {};

    useEffect(() => {
        fetchMPTLData();
    }, [mptlId]);

    const fetchMPTLData = async () => {
        try {
            const mptlData = await mptlService.getMPTL(mptlId);
            
            setMptl(mptlData);

            if (mptlData.aircraftId) {
                const aircraftId = mptlData.aircraftId._id || mptlData.aircraftId;
                const aircraftData = await aircraftService.getAircraft(aircraftId);
                setAircraft(aircraftData);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching MPTL:", error);
            alert("Failed to load MPTL data");
            navigate(-1);
        }
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        try {
            const updateData = { status: newStatus };
            if (newStatus === 'In Progress') {
                updateData.startedAt = new Date();
            } else if (newStatus === 'Completed') {
                updateData.completedAt = new Date();
            }

            await mptlService.updateTask(mptlId, taskId, updateData);
            fetchMPTLData();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleAddWorkLog = async (taskId) => {
        const notes = prompt("Enter WorkLog:");
        if (!notes) return;

        const hoursWorked = prompt("Enter Worked Hours:");
        if (!hoursWorked) return;

        try {
            await mptlService.addWorkLog(mptlId, taskId, {
                notes,
                hoursWorked: parseFloat(hoursWorked)
            });
            fetchMPTLData();
        } catch (error) {
            console.error("Error Worklog:", error);
        }
    };

    const handleTechSignOff = async (taskId) => {
        const licenseNumber = prompt("License Number:");
        if (!licenseNumber) return;

        try {
            await mptlService.updateTask(mptlId, taskId, {
                technicianSignOff: {
                    technicianId: user._id,
                    technicianName: user.name,
                    licenseNumber: licenseNumber,
                    signedDate: new Date()
                }
            });
            fetchMPTLData();
        } catch (error) {
            console.error("Error Signing Off:", error);
        }
    };

    const handleRequestCRS = async () => {
        const allTasksCompleted = mptl.tasks.every(task => task.status === 'Completed');
        if (!allTasksCompleted) {
            alert("All Tasks must Be Completed !");
            return;
        }

        const allTasksSigned = mptl.tasks.every(task => task.technicianSignOff);
        if (!allTasksSigned) {
            alert("All Tasks must Be Signed Off by Technicians.");
            return;
        }

        try {
            await mptlService.updateMPTL(mptlId, {
                overallStatus: 'Awaiting CRS'
            });
            fetchMPTLData();
        } catch (error) {
            console.error("Error requesting CRS:", error);
        }
    };

    const getOverallStatus = () => {
        if (!mptl?.tasks || mptl.tasks.length === 0) return 'No Tasks';
        
        const allCompleted = mptl.tasks.every(task => task.status === 'Completed');
        const someInProgress = mptl.tasks.some(task => task.status === 'In Progress');
        
        if (allCompleted) return 'Completed';
        if (someInProgress) return 'In Progress';
        return 'Not Started';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return '#4ade80';
            case 'In Progress':
                return '#60a5fa';
            case 'Not Started':
                return '#facc15';
            case 'On Hold':
                return '#f97316';
            case 'Cancelled':
                return '#ef4444';
            default:
                return '#9ca3af';
        }
    };

    if (loading || !mptl) return <Loading message="Loading MPTL Details..." />;

    const modelPath = aircraft ? getModelPath(aircraft) : null;
    const manufacturer = aircraft?.aircraftModelId?.manufacturer || aircraft?.manufacturer || 'Unknown';
    const model = aircraft?.aircraftModelId?.model || aircraft?.model || 'Unknown';
    const registration = aircraft?.registration || mptl.aircraftId?.registration || 'N/A';
    const overallStatus = getOverallStatus();

    const totalHours = mptl.tasks.reduce((sum, task) => sum + (task.manhours?.estimated || 0), 0);
    const completedTasks = mptl.tasks.filter(t => t.status === 'Completed').length;
    const totalTasks = mptl.tasks.length;

    const currentTask = selectedTask || (mptl.tasks && mptl.tasks.length > 0 ? mptl.tasks[0] : null);

    return (
        <div className="h-full w-full bg-neutral-900 text-white p-6 flex flex-col gap-6 overflow-y-auto">
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-semibold">{mptl.title}</h1>
                            <Badge 
                                variant={
                                    overallStatus === 'Completed' ? 'success' :
                                    overallStatus === 'In Progress' ? 'warning' :
                                    'default'
                                }
                            >
                                {overallStatus}
                            </Badge>
                        </div>
                        <p className="text-gray-300">Task List: {mptl.taskListNumber}</p>
                        <p className="text-gray-400 text-sm">Aircraft: {registration} ({manufacturer} {model})</p>
                    </div>
                </div>
            </Card>

            {modelPath && currentTask && currentTask.mpdId ? (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-semibold">Task Location on Aircraft</h2>
                            <p className="text-gray-400 text-sm mt-1">
                                Showing: {currentTask.taskNumber} - {currentTask.description}
                            </p>
                        </div>
                        <Badge variant={
                            currentTask.status === 'Completed' ? 'success' :
                            currentTask.status === 'In Progress' ? 'warning' :
                            'default'
                        }>
                            {currentTask.status}
                        </Badge>
                    </div>
                    <Model3DViewer 
                        selectedModel={aircraft}
                        mpdPosition={currentTask.mpdId?.position}
                        onCanvasClick={() => {}}
                        getModelPath={getModelPath}
                    />
                    <p className="text-gray-400 text-sm mt-2">
                        * Marker shows the maintenance location for the currently selected task.
                    </p>
                </Card>
            ) : modelPath ? (
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Aircraft 3D Model</h2>
                    <Model3DViewer 
                        selectedModel={aircraft}
                        mpdPosition={null}
                        onCanvasClick={() => {}}
                        getModelPath={getModelPath}
                    />
                </Card>
            ) : (
                <Card>
                    <p className="text-gray-400">3D model not available for this aircraft.</p>
                </Card>
            )}

            <Card>
                <h2 className="text-xl font-semibold mb-4">Work Order Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-neutral-700 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Work Order</p>
                        <p className="text-white font-semibold text-lg">{mptl.workOrderNumber || 'N/A'}</p>
                    </div>
                    <div className="bg-neutral-700 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Total Tasks</p>
                        <p className="text-white font-semibold text-lg">{completedTasks}/{totalTasks}</p>
                    </div>
                    <div className="bg-neutral-700 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Estimated Hours</p>
                        <p className="text-white font-semibold text-lg">{totalHours.toFixed(1)}h</p>
                    </div>
                    <div className="bg-neutral-700 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Scheduled Date</p>
                        <p className="text-white font-semibold text-sm">
                            {mptl.scheduledStartDate ? new Date(mptl.scheduledStartDate).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>
                {mptl.description && (
                    <div className="mt-4">
                        <p className="text-gray-400 text-sm">Description</p>
                        <p className="text-white">{mptl.description}</p>
                    </div>
                )}
            </Card>

            {mptl.crsIssued ? (
                <Card className="bg-green-900/20 border-green-700">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                </svg>
                                <h2 className="text-xl font-semibold text-white">CRS Issued - Work Order Certified</h2>
                            </div>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-300">CRS Number: <span className="text-white font-semibold">{mptl.crsNumber}</span></p>
                                <p className="text-gray-300">Issued Date: <span className="text-white">{new Date(mptl.crsIssuedDate).toLocaleString()}</span></p>
                                {mptl.crsIssuedBy && (
                                    <p className="text-gray-300">Issued By: <span className="text-white">{mptl.crsIssuedBy.name || mptl.crsIssuedBy.email}</span></p>
                                )}
                                {mptl.crsNotes && (
                                    <p className="text-gray-300">Notes: <span className="text-white">{mptl.crsNotes}</span></p>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            ) : mptl.overallStatus === 'Awaiting CRS' ? (
                <Card className="bg-yellow-900/20 border-yellow-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-yellow-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Awaiting CRS Approval</h3>
                                <p className="text-gray-300 text-sm">All tasks completed. Waiting for CRS to issue certificate.</p>
                            </div>
                        </div>
                        {user.role === 'CRS' && (
                            <Button
                                variant="success"
                                onClick={async () => {
                                    const crsNumber = prompt("Enter CRS Certificate Number:");
                                    if (!crsNumber) return;
                                    
                                    const crsNotes = prompt("Enter CRS Notes (optional):");
                                    
                                    try {
                                        await mptlService.issueCRS(mptlId, {
                                            crsNumber,
                                            crsNotes: crsNotes || ''
                                        });
                                        fetchMPTLData();
                                    } catch (error) {
                                        console.error("Error issuing CRS:", error);
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                </svg>
                                Issue CRS Certificate
                            </Button>
                        )}
                    </div>
                </Card>
            ) : (
                completedTasks === totalTasks && totalTasks > 0 && (
                    <Card className="bg-blue-900/20 border-blue-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-blue-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">All Tasks Completed</h3>
                                    <p className="text-gray-300 text-sm">Ready to request CRS approval</p>
                                </div>
                            </div>
                            {(user.role === 'B1_TECH' || user.role === 'B2_TECH' || user.role === 'C_TECH' || user.role === 'MRO') && (
                                <Button
                                    variant="primary"
                                    onClick={handleRequestCRS}
                                >
                                    Request CRS Approval
                                </Button>
                            )}
                        </div>
                    </Card>
                )
            )}

            <Card>
                <h2 className="text-xl font-semibold mb-4">Tasks ({totalTasks})</h2>
                {mptl.tasks.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No Tasks</p>
                ) : (
                    <div className="space-y-4">
                        {mptl.tasks.map((task) => (
                            <div 
                                key={task._id} 
                                className={`bg-neutral-800 rounded-xl p-6 transition-all cursor-pointer ${
                                    selectedTask?._id === task._id 
                                        ? 'ring-2 ring-blue-500 bg-neutral-700/70' 
                                        : 'hover:bg-neutral-700/50'
                                }`}
                                onClick={() => setSelectedTask(task)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-lg font-semibold text-white">{task.description}</h3>
                                            <Badge 
                                                variant={
                                                    task.status === 'Completed' ? 'success' :
                                                    task.status === 'In Progress' ? 'warning' :
                                                    'default'
                                                }
                                            >
                                                {task.status}
                                            </Badge>
                                            {task.mpdId?.position && (
                                                <Badge variant="default">
                                                    3D View
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Task #{task.taskNumber} • {task.taskType}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Required Role</p>
                                        <p className="text-sm font-semibold text-white">
                                            {task.assignedRole === 'B1_TECH' ? 'B1 Technician' :
                                            task.assignedRole === 'B2_TECH' ? 'B2 Technician' :
                                            task.assignedRole === 'C_TECH' ? 'C Technician' : task.assignedRole}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Estimated Hours</p>
                                        <p className="text-sm text-white">{task.manhours?.estimated || 0}h</p>
                                    </div>
                                    {task.assignedTo && (
                                        <div>
                                            <p className="text-xs text-gray-400">Assigned To</p>
                                            <p className="text-sm text-white">{task.assignedTo.name || task.assignedTo.email || 'Assigned'}</p>
                                        </div>
                                    )}
                                    {task.startedAt && (
                                        <div>
                                            <p className="text-xs text-gray-400">Started</p>
                                            <p className="text-sm text-white">
                                                {new Date(task.startedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                    {task.completedAt && (
                                        <div>
                                            <p className="text-xs text-gray-400">Completed</p>
                                            <p className="text-sm text-white">
                                                {new Date(task.completedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {(task.status === 'Not Started' || task.status === 'Pending') && (
                                        <Button
                                            size="sm"
                                            variant="warning"
                                            onClick={() => handleUpdateStatus(task._id, 'In Progress')}
                                        >
                                            Start Task
                                        </Button>
                                    )}
                                    {task.status === 'In Progress' && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={() => handleUpdateStatus(task._id, 'Completed')}
                                            >
                                                Complete Task
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleAddWorkLog(task._id)}
                                            >
                                                Add Work Log
                                            </Button>
                                        </>
                                    )}
                                    {task.status === 'Completed' && !task.technicianSignOff && (
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={() => handleTechSignOff(task._id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            Sign Off Task
                                        </Button>
                                    )}
                                    {task.status === 'Completed' && task.technicianSignOff && (
                                        <div className="flex items-center gap-2 text-green-400 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                            </svg>
                                            Signed Off
                                        </div>
                                    )}
                                </div>

                                {task.technicianSignOff && (
                                    <div className="mt-4 pt-4 border-t border-neutral-700">
                                        <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                                            <p className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                                </svg>
                                                Technician Sign-Off
                                            </p>
                                            <div className="text-sm text-gray-300 space-y-1">
                                                <p>Technician: <span className="text-white font-semibold">{task.technicianSignOff.technicianName}</span></p>
                                                <p>License: <span className="text-white font-semibold">{task.technicianSignOff.licenseNumber}</span></p>
                                                <p>Signed: <span className="text-white">{new Date(task.technicianSignOff.signedDate).toLocaleString()}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {task.workLogs && task.workLogs.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-neutral-700">
                                        <p className="text-sm font-semibold text-gray-300 mb-2">Work Logs</p>
                                        <div className="space-y-2">
                                            {task.workLogs.map((log, index) => (
                                                <div key={index} className="text-sm bg-neutral-900/50 rounded p-2">
                                                    <p className="text-gray-400">
                                                        {new Date(log.logDate).toLocaleString()} - {log.technicianName} ({log.hoursWorked}h)
                                                    </p>
                                                    <p className="text-white">{log.notes}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {mptl.mplId && (
                <Card>
                    <h2 className="text-xl font-semibold mb-2">Maintenance Program Reference</h2>
                    <p className="text-gray-300">
                        Based on MPL: {mptl.mplId?.title || mptl.mplId?.name || 'N/A'}
                    </p>
                </Card>
            )}
        </div>
    );
}

export default ViewMPTL;
