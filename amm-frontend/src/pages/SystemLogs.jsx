import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PageHeader, Button, EmptyState } from "../components/ui";
import SystemLogsTable from "../components/pages/SystemLogsTable";
import authService from "../services/service-auth";

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

    // Available action types for filter
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
        <div className="p-6 h-full w-full bg-neutral-900 text-white overflow-y-auto">
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
                        🔄 Refresh
                    </Button>
                    <Button
                        variant={showFilters ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        ⚙️ Filters
                    </Button>
                </div>
            </PageHeader>

            {/* Filters Section */}
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
                    <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                        <p className="text-xs text-gray-400 font-semibold uppercase">Total Logs</p>
                        <p className="text-3xl font-bold text-white mt-2">{pagination.totalRecords}</p>
                    </div>
                    <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                        <p className="text-xs text-gray-400 font-semibold uppercase">Total Pages</p>
                        <p className="text-3xl font-bold text-white mt-2">{pagination.totalPages}</p>
                    </div>
                    <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                        <p className="text-xs text-gray-400 font-semibold uppercase">Current Page</p>
                        <p className="text-3xl font-bold text-white mt-2">{pagination.currentPage}</p>
                    </div>
                    <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                        <p className="text-xs text-gray-400 font-semibold uppercase">Per Page</p>
                        <p className="text-3xl font-bold text-white mt-2">20</p>
                    </div>
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
        </div>
    );
}

export default SystemLogs;
