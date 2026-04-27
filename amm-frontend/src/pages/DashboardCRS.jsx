import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mptlService, authService, taskService } from "../services";
import Loading from "../components/Loading";
import { StatCard, PageHeader, EmptyState } from "../components/ui";
import { CRSCard } from "../components/pages";
import { GlassmorphismDashboard } from "../components/GlassmorphismCard";
import "../styles/glassmorphism.css";

function CRSDashboard() {
    const navigate = useNavigate();
    const [mptls, setMptls] = useState([]);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [taskStats, setTaskStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [approvalLoading, setApprovalLoading] = useState({});
    const [selectedTaskComments, setSelectedTaskComments] = useState({});
    const [showCommentForm, setShowCommentForm] = useState({});
    const user = authService.getUser() || {};

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [mptlData, tasksData, statsData] = await Promise.all([
                mptlService.getAllMPTL(),
                taskService.getPendingCRSReview(),
                taskService.getApprovalStats()
            ]);
            setMptls(mptlData);
            setPendingTasks(tasksData.tasks || []);
            setTaskStats(statsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleIssueCRS = async (mptlId) => {
        const crsNumber = prompt("Enter CRS Certificate Number:");
        if (!crsNumber) return;

        const crsNotes = prompt("Enter CRS Notes (optional):");

        try {
            await mptlService.issueCRS(mptlId, {
                crsNumber,
                crsNotes: crsNotes || ''
            });
            alert("Certificate of Release to Service issued successfully!");
            fetchData();
        } catch (error) {
            console.error("Error issuing CRS:", error);
            alert(error.message || "Failed to issue CRS");
        }
    };

    const handleApproveTask = async (taskId) => {
        const comments = selectedTaskComments[taskId] || '';
        if (!comments.trim()) {
            alert('Please add comments before approving');
            return;
        }

        setApprovalLoading(prev => ({...prev, [taskId]: true}));
        try {
            await taskService.approveCRS(taskId, comments);
            alert('Task approved successfully!');
            setSelectedTaskComments(prev => ({...prev, [taskId]: ''}));
            setShowCommentForm(prev => ({...prev, [taskId]: false}));
            fetchData();
        } catch (error) {
            alert('Error approving task: ' + error.message);
        } finally {
            setApprovalLoading(prev => ({...prev, [taskId]: false}));
        }
    };

    const handleRejectTask = async (taskId) => {
        const rejectionReason = prompt("Enter rejection reason:");
        if (!rejectionReason) return;

        setApprovalLoading(prev => ({...prev, [taskId]: true}));
        try {
            await taskService.rejectCRS(taskId, rejectionReason);
            alert('Task rejected with reason provided');
            fetchData();
        } catch (error) {
            alert('Error rejecting task: ' + error.message);
        } finally {
            setApprovalLoading(prev => ({...prev, [taskId]: false}));
        }
    };

    if (loading) {
        return <Loading message="Loading CRS Dashboard..." />;
    }

    const awaitingCRS = mptls.filter(m => m.overallStatus === 'Awaiting CRS');
    const completedMPTLs = mptls.filter(m => m.crsIssued);
    const inProgressMPTLs = mptls.filter(m => m.overallStatus === 'In Progress');

    return (
        <GlassmorphismDashboard>
            <PageHeader 
                title="CRS Dashboard"
                subtitle="Certificate of Release to Service - Quality Control"
            />

            {/* Task Approval Stats */}
            {taskStats && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <StatCard 
                        title="B1 Pending"
                        value={taskStats.pendingB1Approvals || 0}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        color="blue"
                    />
                    <StatCard 
                        title="B2 Pending"
                        value={taskStats.pendingB2Approvals || 0}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        color="purple"
                    />
                    <StatCard 
                        title="CRS Review"
                        value={taskStats.pendingCRSReviews || 0}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        color="amber"
                    />
                    <StatCard 
                        title="Completed"
                        value={taskStats.completedTasks || 0}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        color="green"
                    />
                    <StatCard 
                        title="Rejected"
                        value={taskStats.rejectedTasks || 0}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        }
                        color="red"
                    />
                </div>
            )}

            {/* Task Approvals Section */}
            {pendingTasks.length > 0 && (
                <div className="bg-neutral-800 rounded-xl overflow-hidden mb-6">
                    <div className="p-6 border-b border-neutral-700 bg-amber-900/20">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-amber-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Task Approvals Ready for CRS Review ({pendingTasks.length})
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            {pendingTasks.map((task) => (
                                <div key={task._id} className="bg-neutral-700/50 border border-neutral-600 rounded-lg p-4 hover:border-amber-500/50 transition">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-amber-300">{task.taskNumber}</h3>
                                            <p className="text-sm text-neutral-300">{task.title}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-amber-900/40 text-amber-200 text-xs font-semibold rounded-full border border-amber-700/50">
                                            Ready for CRS
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                                        <div className="bg-neutral-800 rounded p-2">
                                            <span className="text-neutral-400">Priority:</span>
                                            <p className={`font-semibold ${
                                                task.priority === 'Critical' ? 'text-red-400' :
                                                task.priority === 'High' ? 'text-orange-400' :
                                                task.priority === 'Medium' ? 'text-amber-400' : 'text-green-400'
                                            }`}>
                                                {task.priority || 'Medium'}
                                            </p>
                                        </div>
                                        <div className="bg-neutral-800 rounded p-2">
                                            <span className="text-neutral-400">Aircraft:</span>
                                            <p className="font-semibold text-blue-300">{task.aircraftId?.aircraftNumber || 'N/A'}</p>
                                        </div>
                                        <div className="bg-neutral-800 rounded p-2">
                                            <span className="text-neutral-400">Approvals Required:</span>
                                            <p className="font-semibold text-green-400">
                                                {task.requiredApprovalBy === 'B1_ONLY' && '✓ B1 Approved'}
                                                {task.requiredApprovalBy === 'B2_ONLY' && '✓ B2 Approved'}
                                                {task.requiredApprovalBy === 'BOTH' && '✓ B1 & B2 Approved'}
                                            </p>
                                        </div>
                                    </div>

                                    {task.description && (
                                        <div className="mb-3 text-xs text-neutral-300 bg-neutral-800/50 p-2 rounded">
                                            <strong>Description:</strong> {task.description}
                                        </div>
                                    )}

                                    {/* Comment Form */}
                                    {showCommentForm[task._id] ? (
                                        <div className="mb-3 space-y-2">
                                            <textarea
                                                value={selectedTaskComments[task._id] || ''}
                                                onChange={(e) => setSelectedTaskComments(prev => ({...prev, [task._id]: e.target.value}))}
                                                placeholder="Add your approval comments..."
                                                className="w-full bg-neutral-700 text-white border border-neutral-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                                                rows="2"
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => {
                                                        setShowCommentForm(prev => ({...prev, [task._id]: false}));
                                                        setSelectedTaskComments(prev => ({...prev, [task._id]: ''}));
                                                    }}
                                                    className="px-3 py-1 bg-neutral-600 hover:bg-neutral-500 text-white text-sm rounded transition"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleApproveTask(task._id)}
                                                    disabled={approvalLoading[task._id]}
                                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition disabled:opacity-50"
                                                >
                                                    {approvalLoading[task._id] ? 'Approving...' : 'Confirm Approval'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}

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
                                            onClick={() => setShowCommentForm(prev => ({...prev, [task._id]: !prev[task._id]}))}
                                            className="px-4 py-2 bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 border border-amber-700/50 text-sm rounded transition flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Awaiting CRS Section */}
            <div className="bg-neutral-800 rounded-xl overflow-hidden mb-6">
                <div className="p-6 border-b border-neutral-700 bg-orange-900/20">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-orange-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        Maintenance Awaiting CRS Approval
                    </h2>
                </div>

                <div className="p-6">
                    {awaitingCRS.length === 0 ? (
                        <EmptyState message="No maintenance work awaiting CRS approval" />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {awaitingCRS.map((mptl) => (
                                <CRSCard
                                    key={mptl._id}
                                    mptl={mptl}
                                    onIssueCRS={handleIssueCRS}
                                    onViewDetails={(id) => navigate(`/crs/mptl/${id}`)}
                                    status="awaiting"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Completed MPTLs with CRS */}
            <div className="bg-neutral-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-neutral-700 bg-green-900/20">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        CRS Certificates Issued
                    </h2>
                </div>

                <div className="p-6">
                    {completedMPTLs.length === 0 ? (
                        <EmptyState message="No CRS certificates issued yet" />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {completedMPTLs.map((mptl) => (
                                <CRSCard
                                    key={mptl._id}
                                    mptl={mptl}
                                    onViewDetails={(id) => navigate(`/crs/mptl/${id}`)}
                                    onViewCertificate={(id) => navigate(`/crs/certificate/${id}`)}
                                    status="issued"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </GlassmorphismDashboard>
    );
}

export default CRSDashboard;
