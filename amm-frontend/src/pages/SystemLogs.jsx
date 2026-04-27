import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PageHeader, Button, EmptyState } from "../components/ui";
import SystemLogsTable from "../components/pages/SystemLogsTable";
import authService from "../services/service-auth";
import { GlassmorphismDashboard } from "../components/GlassmorphismCard";
import "../styles/glassmorphism.css";
import { StatCard } from "../components/ui";

function SystemLogs() {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        actionType: '',
        userId: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    // Check authorization on component mount
    useEffect(() => {
        const user = authService.getUser() || {};
        if (user.role !== 'SUPER_ADMIN') {
            navigate('/');
        }
    }, [navigate]);

    // Fetch logs on page change or filter change
    useEffect(() => {
        fetchLogs(currentPage);
    }, [currentPage]);

    const fetchLogs = async (page = 1) => {
        try {
            setLoading(true);
            const token = authService.getToken();
            const params = {
                page,
                limit: 20
            };

            if (filters.actionType) {
                params.actionType = filters.actionType;
            }
            if (filters.userId) {
                params.userId = filters.userId;
            }

            console.log('Fetching logs with params:', params);
            console.log('Token:', token ? 'Present' : 'Missing');

            const response = await axios.get('/api/admin/logs', {
                params,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Response:', response.data);

            if (response.data.success) {
                setLogs(response.data.data);
                setPagination(response.data.pagination);
            } else {
                console.error('API returned success: false', response.data);
            }
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            console.error('Error response:', error.response?.data);
            if (error.response?.status === 403) {
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
        fetchLogs(1);
    };

    const handleResetFilters = () => {
        setFilters({ actionType: '', userId: '' });
        setCurrentPage(1);
        setShowFilters(false);
    };

    const handleRefresh = () => {
        fetchLogs(currentPage);
    };

    const actionTypes = [
        'AIRCRAFT_CREATED', 'AIRCRAFT_UPDATED', 'AIRCRAFT_DELETED',
        'AIRCRAFT_MODEL_CREATED', 'AIRCRAFT_MODEL_UPDATED', 'AIRCRAFT_MODEL_DELETED',
        'MPD_CREATED', 'MPD_UPDATED', 'MPD_DELETED',
        'MPL_CREATED', 'MPL_UPDATED', 'MPL_DELETED',
        'MPTL_CREATED', 'MPTL_UPDATED', 'MPTL_DELETED',
        'MP_CREATED', 'MP_UPDATED', 'MP_DELETED',
        'SERVICE_BULLETIN_CREATED', 'SERVICE_BULLETIN_UPDATED', 'SERVICE_BULLETIN_DELETED',
        'USER_CREATED', 'USER_UPDATED', 'USER_DELETED',
        'ROLE_CREATED', 'ROLE_UPDATED', 'ROLE_DELETED'
    ];

    return (
        <GlassmorphismDashboard>
            <PageHeader
                title="System Audit Logs"
                subtitle="Monitor all system activities and user actions"
            >
                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant={showFilters ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        Filters
                    </Button>
                </div>
            </PageHeader>

            {showFilters && (
                <div className="bg-neutral-800 rounded-lg p-6 mb-6 border border-neutral-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                Action Type
                            </label>
                            <select
                                name="actionType"
                                value={filters.actionType}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white border border-neutral-600 hover:border-neutral-500 focus:border-blue-500 focus:outline-none transition"
                            >
                                <option value="">All Actions</option>
                                {actionTypes.map((action) => (
                                    <option key={action} value={action}>
                                        {action}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                User ID (Optional)
                            </label>
                            <input
                                type="text"
                                name="userId"
                                value={filters.userId}
                                onChange={handleFilterChange}
                                placeholder="Enter user ID or leave empty"
                                className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white border border-neutral-600 hover:border-neutral-500 focus:border-blue-500 focus:outline-none transition"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleResetFilters}
                        >
                            Clear Filters
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleApplyFilters}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            )}

            {/* Statistics Section */}
            {pagination && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <StatCard 
                        title="Total Logs"
                        value={pagination.totalRecords}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                        }
                        color="blue"
                    />
                    
                    <StatCard 
                        title="Total Pages"
                        value={pagination.totalPages}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                        }
                        color="green"
                    />
                    
                    <StatCard 
                        title="Current Page"
                        value={pagination.currentPage}
                        icon={
                           <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                        }
                        color="purple"
                    />
                    
                    <StatCard 
                        title="Per Page"
                        value={20}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
                            </svg>
                        }
                        color="yellow"
                    />
                </div>
            )}

            {/* Logs Table */}
            <SystemLogsTable
                logs={logs}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onRefresh={handleRefresh}
            />
        </GlassmorphismDashboard>
    );
}

export default SystemLogs;
