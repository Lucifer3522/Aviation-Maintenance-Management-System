import { useState, useEffect } from "react";
import { Badge, Button, Modal, PageHeader } from "../ui";
import LogDetailsModal from "./LogDetailsModal";
import axios from "axios";

export default function SystemLogsTable({ logs, onRefresh, loading, pagination, onPageChange }) {
    const [selectedLog, setSelectedLog] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const getActionBadgeVariant = (actionType) => {
        if (actionType.includes('CREATED')) return 'success';
        if (actionType.includes('UPDATED')) return 'warning';
        if (actionType.includes('DELETED')) return 'danger';
        return 'info';
    };

    const formatActionType = (actionType) => {
        return actionType
            .split('_')
            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handleViewDetails = (log) => {
        setSelectedLog(log);
        setShowDetailsModal(true);
    };

    if (loading) {
        return (
            <div className="bg-neutral-800 rounded-lg p-6">
                <p className="text-white text-center">Loading logs...</p>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="bg-neutral-800 rounded-lg p-6">
                <p className="text-gray-400 text-center py-8">No audit logs found</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white/10 backdrop-blur-[20px] rounded-[2rem] p-6 overflow-x-auto border border-white/20 shadow-xl">
                <table className="w-full">
                    <thead className="bg-neutral-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Date & Time</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">User</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Action</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Target ID</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-white">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700">
                        {logs.map((log) => (
                            <tr key={log._id} className="hover:bg-neutral-700/50 transition text-white">
                                <td className="px-4 py-3 text-sm">
                                    <div className="font-medium">
                                        {new Date(log.timestamp).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div>
                                        <p className="font-medium text-sm">
                                            {log.userId?.username || 'Unknown User'}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {log.userId?.role || '-'}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant={getActionBadgeVariant(log.actionType)}>
                                        {formatActionType(log.actionType)}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3">
                                    <code className="bg-neutral-700 px-2 py-1 rounded text-xs text-gray-300">
                                        {log.targetId}
                                    </code>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleViewDetails(log)}
                                    >
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination && (
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-400">
                        Showing page <span className="font-semibold text-white">{pagination.currentPage}</span> of{' '}
                        <span className="font-semibold text-white">{pagination.totalPages}</span> •{' '}
                        <span className="font-semibold text-white">{pagination.totalRecords}</span> total logs
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={!pagination.hasPreviousPage}
                            onClick={() => onPageChange(pagination.currentPage - 1)}
                        >
                            ← Previous
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={!pagination.hasNextPage}
                            onClick={() => onPageChange(pagination.currentPage + 1)}
                        >
                            Next →
                        </Button>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {selectedLog && (
                <LogDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedLog(null);
                    }}
                    log={selectedLog}
                />
            )}
        </>
    );
}
