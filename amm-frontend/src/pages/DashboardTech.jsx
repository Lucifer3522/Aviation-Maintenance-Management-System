import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mptlService, authService, taskService } from "../services";
import Loading from "../components/Loading";
import { StatCard, PageHeader, EmptyState } from "../components/ui";
import { TaskCard } from "../components/pages";
import { GlassmorphismDashboard } from "../components/GlassmorphismCard";
import "../styles/glassmorphism.css";

function TechnicianDashboard() {
    const navigate = useNavigate();
    const [myTasks, setMyTasks] = useState([]);
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [completedByAR, setCompletedByAR] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvalComments, setApprovalComments] = useState({});
    const [approvalLoading, setApprovalLoading] = useState({});
    const [filter, setFilter] = useState('all'); // all, pending, inProgress, completed
    const user = authService.getUser() || {};

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log('User role:', user.role);
            console.log('Fetching data...');
            await Promise.all([
                fetchMyTasks(),
                fetchPendingApprovals(),
                fetchCompletedTasks()
            ]);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const fetchPendingApprovals = async () => {
        try {
            let approvalsTasks = [];
            
            // B1 Technician - Get pending B1 approvals
            if (user.role === 'B1_TECH') {
                const response = await taskService.getPendingB1Tasks();
                approvalsTasks = response.tasks || [];
                console.log('B1 Pending Approvals:', approvalsTasks);
            }
            // B2 Technician - Get pending B2 approvals
            else if (user.role === 'B2_TECH') {
                const response = await taskService.getPendingB2Tasks();
                approvalsTasks = response.tasks || [];
                console.log('B2 Pending Approvals:', approvalsTasks);
            }
            
            setPendingApprovals(approvalsTasks);
        } catch (error) {
            console.error("Error fetching pending approvals:", error);
        }
    };

    const fetchCompletedTasks = async () => {
        try {
            let completedTasks = [];
            
            // B1 Technician - Get completed B1 tasks
            if (user.role === 'B1_TECH') {
                const response = await taskService.getCompletedB1Tasks();
                completedTasks = response.tasks || [];
                console.log('B1 Completed Tasks:', completedTasks);
            }
            // B2 Technician - Get completed B2 tasks
            else if (user.role === 'B2_TECH') {
                const response = await taskService.getCompletedB2Tasks();
                completedTasks = response.tasks || [];
                console.log('B2 Completed Tasks:', completedTasks);
            }
            
            setCompletedByAR(completedTasks);
        } catch (error) {
            console.error("Error fetching completed tasks:", error);
        }
    };

    const fetchMyTasks = async () => {
        try {
            const mptls = await mptlService.getAllMPTL();
            
            const assignedTasks = [];
            mptls.forEach(mptl => {
                if (mptl.tasks && mptl.tasks.length > 0) {
                    mptl.tasks.forEach(task => {
                        if (task.assignedRole === user.role || task.assignedTo?._id === user._id) {
                            assignedTasks.push({
                                ...task,
                                mptlId: mptl._id,
                                mptlNumber: mptl.taskListNumber,
                                aircraft: mptl.aircraftId?.registration
                            });
                        }
                    });
                }
            });
            
            setMyTasks(assignedTasks);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (mptlId, taskId, newStatus) => {
        try {
            const updateData = { status: newStatus };
            if (newStatus === 'In Progress') {
                updateData.startedAt = new Date();
            } else if (newStatus === 'Completed') {
                updateData.completedAt = new Date();
            }

            await mptlService.updateTask(mptlId, taskId, updateData);
            alert(`Task status updated to ${newStatus}`);
            fetchMyTasks();
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task status");
        }
    };

    const handleAddWorkLog = async (mptlId, taskId) => {
        const notes = prompt("Enter work log notes:");
        if (!notes) return;

        const hoursWorked = prompt("Enter hours worked:");
        if (!hoursWorked) return;

        try {
            await mptlService.addWorkLog(mptlId, taskId, {
                notes,
                hoursWorked: parseFloat(hoursWorked)
            });
            alert("Work log added successfully!");
            fetchMyTasks();
        } catch (error) {
            console.error("Error adding work log:", error);
            alert("Failed to add work log");
        }
    };

    const handleApproveTask = async (taskId) => {
        const comments = approvalComments[taskId] || '';
        if (comments.length < 5 && comments.length > 0) {
            alert('Comments must be at least 5 characters or leave empty');
            return;
        }

        setApprovalLoading(prev => ({...prev, [taskId]: true}));
        try {
            if (user.role === 'B1_TECH') {
                await taskService.approveB1(taskId, comments);
            } else if (user.role === 'B2_TECH') {
                await taskService.approveB2(taskId, comments);
            }
            alert('Task approved successfully!');
            setApprovalComments(prev => ({...prev, [taskId]: ''}));
            await Promise.all([fetchPendingApprovals(), fetchCompletedTasks()]);
        } catch (error) {
            console.error('Error approving task:', error);
            alert('Error approving task: ' + error.message);
        } finally {
            setApprovalLoading(prev => ({...prev, [taskId]: false}));
        }
    };

    const handleRejectTask = async (taskId) => {
        const rejectionReason = prompt('Enter rejection reason:');
        if (!rejectionReason) return;

        setApprovalLoading(prev => ({...prev, [taskId]: true}));
        try {
            if (user.role === 'B1_TECH') {
                await taskService.rejectB1(taskId, rejectionReason);
            } else if (user.role === 'B2_TECH') {
                await taskService.rejectB2(taskId, rejectionReason);
            }
            alert('Task rejected');
            fetchData();
        } catch (error) {
            console.error('Error rejecting task:', error);
            alert('Error rejecting task: ' + error.message);
        } finally {
            setApprovalLoading(prev => ({...prev, [taskId]: false}));
        }
    };

    if (loading) {
        return <Loading message="Loading your tasks..." />;
    }

    const notStartedTasks = myTasks.filter(t => t.status === 'Not Started');
    const inProgressTasks = myTasks.filter(t => t.status === 'In Progress');
    const completedTasks = myTasks.filter(t => t.status === 'Completed');

    const getRoleIcon = (role) => {
        if (role === 'B1_TECH') return '🔧';
        if (role === 'B2_TECH') return '⚡';
        if (role === 'C_TECH') return '✈️';
        return '👷';
    };

    return (
        <GlassmorphismDashboard>
            <PageHeader 
                title={`${getRoleIcon(user.role)} Technician Dashboard`}
                subtitle={`${
                    user.role === 'B1_TECH' ? 'Mechanical Technician' :
                    user.role === 'B2_TECH' ? 'Avionics/Electrical Technician' :
                    'Line Maintenance Technician'
                }`}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard 
                    title="Total Tasks" 
                    value={myTasks.length}
                    color="blue"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                    }
                />
                
                <StatCard 
                    title="Not Started" 
                    value={notStartedTasks.length}
                    color="blue"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                
                <StatCard 
                    title="In Progress" 
                    value={inProgressTasks.length}
                    color="yellow"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    }
                />
                
                <StatCard 
                    title="Completed" 
                    value={completedTasks.length}
                    color="green"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Pending Approvals Section */}
            {pendingApprovals.length > 0 && (
                    <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden mb-6 border border-gray-200 dark:border-neutral-700">
                    <div className="p-6 border-b border-gray-200 dark:border-neutral-700 bg-blue-50 dark:bg-blue-900/20">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-blue-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Tasks Pending Your Approval ({pendingApprovals.length})
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            {pendingApprovals.map((task) => (
                                <div key={task._id} className="bg-white dark:bg-neutral-700/50 border border-gray-300 dark:border-neutral-600 rounded-lg p-4 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">{task.taskNumber}</h3>
                                            <p className="text-sm text-gray-700 dark:text-neutral-300">{task.title}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                                            user.role === 'B1_TECH' 
                                                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 border-blue-300 dark:border-blue-700/50' 
                                                : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 border-purple-300 dark:border-purple-700/50'
                                        }`}>
                                            {user.role === 'B1_TECH' ? 'B1 Review' : 'B2 Review'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                                        <div className="bg-gray-100 dark:bg-neutral-800 rounded p-2">
                                            <span className="text-gray-600 dark:text-neutral-400">Priority:</span>
                                            <p className={`font-semibold ${
                                                task.priority === 'Critical' ? 'text-red-600 dark:text-red-400' :
                                                task.priority === 'High' ? 'text-orange-600 dark:text-orange-400' :
                                                task.priority === 'Medium' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'
                                            }`}>
                                                {task.priority || 'Medium'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-100 dark:bg-neutral-800 rounded p-2">
                                            <span className="text-gray-600 dark:text-neutral-400">Aircraft:</span>
                                            <p className="font-semibold text-blue-600 dark:text-blue-300">{task.aircraftId?.aircraftNumber || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-100 dark:bg-neutral-800 rounded p-2">
                                            <span className="text-gray-600 dark:text-neutral-400">Task Type:</span>
                                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                                {task.requiredApprovalBy === 'B1_ONLY' && '🔧 B1 Only'}
                                                {task.requiredApprovalBy === 'B2_ONLY' && '⚡ B2 Only'}
                                                {task.requiredApprovalBy === 'BOTH' && '🔄 Both Required'}
                                            </p>
                                        </div>
                                    </div>

                                    {task.description && (
                                        <div className="mb-3 text-xs text-gray-700 dark:text-neutral-300 bg-gray-50 dark:bg-neutral-800/50 p-2 rounded">
                                            <strong>Description:</strong> {task.description}
                                        </div>
                                    )}

                                    {/* CRS Approval Status */}
                                    {task.crsApproval?.approved && (
                                        <div className="mb-3 text-xs bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700/50 text-green-700 dark:text-green-300 p-3 rounded">
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0zm16.062-3.5a.75.75 0 11-1.062-1.062L9.75 13.939 7.5 11.689a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.06 0l8.062-8.062z" clipRule="evenodd" />
                                                </svg>
                                                <strong>CRS Approved</strong>
                                            </div>
                                            <div className="text-gray-700 dark:text-neutral-300 ml-6">
                                                <p><strong>Approved By:</strong> {task.crsApproval.approvedBy?.name || 'N/A'}</p>
                                                <p><strong>Date:</strong> {task.crsApproval.approvalDate ? new Date(task.crsApproval.approvalDate).toLocaleDateString() : 'N/A'} | {task.crsApproval.approvalDate ? new Date(task.crsApproval.approvalDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
                                                {task.crsApproval.comments && <p><strong>Comments:</strong> {task.crsApproval.comments}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* Comment Form */}
                                    <div className="mb-3 space-y-2">
                                        <textarea
                                            value={approvalComments[task._id] || ''}
                                            onChange={(e) => setApprovalComments(prev => ({...prev, [task._id]: e.target.value}))}
                                            placeholder="Add approval comments (optional)..."
                                            className="w-full bg-white dark:bg-neutral-700 text-gray-900 dark:text-white border border-gray-300 dark:border-neutral-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500"
                                            rows="2"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => handleRejectTask(task._id)}
                                            disabled={approvalLoading[task._id]}
                                            className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-700/50 text-sm rounded transition disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleApproveTask(task._id)}
                                            disabled={approvalLoading[task._id]}
                                            className="px-4 py-2 bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 border border-blue-700/50 text-sm rounded transition disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {approvalLoading[task._id] ? 'Approving...' : 'Approve'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">My Assigned Tasks</h2>
                    
                    {/* Task Filter Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                filter === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                            }`}
                        >
                            All ({myTasks.length})
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                filter === 'pending'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                            }`}
                        >
                            Pending ({myTasks.filter(t => t.status === 'Not Started').length})
                        </button>
                        <button
                            onClick={() => setFilter('inProgress')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                filter === 'inProgress'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                            }`}
                        >
                            In Progress ({myTasks.filter(t => t.status === 'In Progress').length})
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                filter === 'completed'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                            }`}
                        >
                            Completed ({myTasks.filter(t => t.status === 'Completed').length})
                        </button>
                    </div>
                </div>
                
                {myTasks.length === 0 ? (
                    <EmptyState
                        title="No Tasks Assigned"
                        description="You don't have any tasks assigned to you yet"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {myTasks
                            .filter(task => {
                                if (filter === 'all') return true;
                                if (filter === 'pending') return task.status === 'Not Started';
                                if (filter === 'inProgress') return task.status === 'In Progress';
                                if (filter === 'completed') return task.status === 'Completed';
                                return true;
                            })
                            .map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onUpdateStatus={handleUpdateStatus}
                                    onViewDetails={(mptlId) => navigate(`/tech/mptl/${mptlId}`)}
                                />
                            ))}
                    </div>
                )}
            </div>

            {/* CRS Completed Tasks Section */}
            {completedByAR.length > 0 && (
                <div className="bg-neutral-800 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-neutral-700 bg-green-900/20">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-green-400">
                                <path fillRule="evenodd" d="M2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0zm16.062-3.5a.75.75 0 11-1.062-1.062L9.75 13.939 7.5 11.689a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.06 0l8.062-8.062z" clipRule="evenodd" />
                            </svg>
                            CRS Completed Tasks ({completedByAR.length})
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            {completedByAR.map((task) => (
                                <div key={task._id} className="bg-neutral-700/50 border border-neutral-600 rounded-lg p-4 hover:border-green-500/50 transition">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-green-300">{task.taskNumber}</h3>
                                            <p className="text-sm text-neutral-300">{task.title}</p>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-green-900/40 text-green-200 border-green-700/50">
                                            ✓ Completed
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                                        <div className="bg-neutral-800 rounded p-2">
                                            <span className="text-neutral-400">Priority:</span>
                                            <p className={`font-semibold ${
                                                task.priority === 'Critical' ? 'text-red-400' :
                                                task.priority === 'High' ? 'text-orange-400' :
                                                task.priority === 'Medium' ? 'text-blue-400' : 'text-green-400'
                                            }`}>
                                                {task.priority || 'Medium'}
                                            </p>
                                        </div>
                                        <div className="bg-neutral-800 rounded p-2">
                                            <span className="text-neutral-400">Aircraft:</span>
                                            <p className="font-semibold text-blue-300">{task.aircraftId?.aircraftNumber || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* CRS Completion Details */}
                                    <div className="bg-green-900/20 border border-green-700/50 rounded p-3 text-xs text-green-200">
                                        <div className="font-semibold mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                                            </svg>
                                            CRS Approval Details
                                        </div>
                                        <p><strong>Approved By:</strong> {task.crsApproval.approvedBy?.name || 'N/A'}</p>
                                        <p><strong>Date:</strong> {task.crsApproval.approvalDate ? new Date(task.crsApproval.approvalDate).toLocaleDateString() : 'N/A'}</p>
                                        <p><strong>Time:</strong> {task.crsApproval.approvalDate ? new Date(task.crsApproval.approvalDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
                                        {task.crsApproval.comments && (
                                            <p className="mt-2"><strong>CRS Comments:</strong> {task.crsApproval.comments}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </GlassmorphismDashboard>
    );
}

export default TechnicianDashboard;
