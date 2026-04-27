import { Modal, Button } from "../ui";

export default function LogDetailsModal({ isOpen, onClose, log }) {
    const formatJSON = (data) => {
        return JSON.stringify(data, null, 2);
    };

    const copyToClipboard = () => {
        const jsonString = formatJSON(log);
        navigator.clipboard.writeText(jsonString);
        alert('Log details copied to clipboard!');
    };

    if (!log) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Audit Log Details"
            maxWidth="max-w-4xl"
        >
            <div className="space-y-4">
                {/* Header Information */}
                <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b border-white/20">
                    <div>
                        <p className="text-xs text-white/50 font-semibold uppercase">Timestamp</p>
                        <p className="text-white mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-white/50 font-semibold uppercase">Action Type</p>
                        <p className="text-white mt-1 font-mono">{log.actionType}</p>
                    </div>
                    <div>
                        <p className="text-xs text-white/50 font-semibold uppercase">User</p>
                        <p className="text-white mt-1">
                            {log.userId?.username} ({log.userId?.role})
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-white/50 font-semibold uppercase">Target ID</p>
                        <p className="text-white mt-1 font-mono text-sm">{log.targetId}</p>
                    </div>
                </div>

                {/* IP Address and User Agent */}
                {(log.ipAddress || log.userAgent) && (
                    <div className="bg-white/10 backdrop-blur-[15px] rounded-[1.5rem] p-4 mb-4 border border-white/20\">
                        {log.ipAddress && (
                            <div className="mb-2">
                                <p className="text-xs text-white/50 font-semibold uppercase">IP Address</p>
                                <p className="text-white/70 font-mono text-sm mt-1\">{log.ipAddress}</p>
                            </div>
                        )}
                        {log.userAgent && (
                            <div>
                                <p className="text-xs text-white/50 font-semibold uppercase\">User Agent</p>
                                <p className="text-white/70 text-xs mt-1 break-all\">{log.userAgent}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Payload Section */}
                {(log.payload || log.changes) && (
                    <>
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-sm font-semibold text-white">Full Payload</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyToClipboard}
                                >
                                    📋 Copy JSON
                                </Button>
                            </div>

                            {/* Changes Before/After */}
                            {log.changes && (log.changes.before || log.changes.after) && (
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {log.changes.before && (
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase mb-2">
                                                Before
                                            </p>
                                            <pre className="bg-neutral-900 p-3 rounded text-xs text-green-400 overflow-x-auto border border-neutral-700">
                                                {formatJSON(log.changes.before)}
                                            </pre>
                                        </div>
                                    )}
                                    {log.changes.after && (
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase mb-2">
                                                After
                                            </p>
                                            <pre className="bg-neutral-900 p-3 rounded text-xs text-blue-400 overflow-x-auto border border-neutral-700">
                                                {formatJSON(log.changes.after)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* General Payload */}
                            {log.payload && (
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase mb-2">
                                        Payload
                                    </p>
                                    <pre className="bg-neutral-900 p-3 rounded text-xs text-gray-300 overflow-x-auto border border-neutral-700">
                                        {formatJSON(log.payload)}
                                    </pre>
                                </div>
                            )}

                            {!log.payload && !log.changes && (
                                <div className="bg-neutral-700/50 p-4 rounded text-gray-400 text-sm">
                                    No payload data available for this log
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Footer */}
                <div className="flex justify-end pt-4 border-t border-neutral-700">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
