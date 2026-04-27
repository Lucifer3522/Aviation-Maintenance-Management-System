import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { aircraftService } from "../services";
import authService from "../services/service-auth";
import { PageHeader, Button, Modal, EmptyState } from "../components/ui";
import { AircraftGrid, AircraftTableView } from "../components/pages";

function Dashboard() {
    const navigate = useNavigate();
    const [aircrafts, setAircrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("cards");
    const [deleteModal, setDeleteModal] = useState({ show: false, aircraft: null });

    useEffect(() => {
        const user = authService.getUser() || {};
        const role = user.role;

        if (role) {
            switch(role) {
                case 'CAMO':
                    navigate('/camo');
                    return;
                case 'MRO':
                    navigate('/mro');
                    return;
                case 'B1_TECH':
                case 'B2_TECH':
                case 'C_TECH':
                    navigate('/tech');
                    return;
                case 'CRS':
                    navigate('/crs');
                    return;
                case 'SUPER_ADMIN':
                case 'ADMIN':
                    fetchAircrafts();
                    break;
                default:
                    fetchAircrafts();
            }
        } else {
            fetchAircrafts();
        }
    }, [navigate]);

    const fetchAircrafts = async () => {
        try {
            const data = await aircraftService.getAllAircraft();
            setAircrafts(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setLoading(false);
        }
    };

    const handleDeleteClick = (aircraft) => {
        setDeleteModal({ show: true, aircraft });
    };

    const handleConfirmDelete = async () => {
        try {
            await aircraftService.deleteAircraft(deleteModal.aircraft._id);
            setAircrafts(aircrafts.filter(a => a._id !== deleteModal.aircraft._id));
            setDeleteModal({ show: false, aircraft: null });
            alert("Aircraft deleted successfully!");
        } catch (error) {
            console.error("Error deleting aircraft:", error);
            alert(`Error: ${error.message || "Failed to delete aircraft. Please try again."}`);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModal({ show: false, aircraft: null });
    };

    return (
        <div className="p-4 h-full w-full bg-neutral-100 dark:bg-neutral-900 text-gray-900 dark:text-white p-6 overflow-y-auto">
            <PageHeader
                title="Aircraft Dashboard"
                subtitle="Managing and Monitoring Aircraft Fleet"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-neutral-200 dark:bg-neutral-800 rounded-lg p-1 flex">
                        <button
                            onClick={() => setViewMode("cards")}
                            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                                viewMode === "cards"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                            Cards
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                                viewMode === "table"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                            </svg>
                            Table
                        </button>
                    </div>

                    <Button
                        variant="primary"
                        onClick={() => navigate("/aircraft/add")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add New Aircraft
                    </Button>
                </div>
            </PageHeader>

            {loading ? (
                <p className="text-gray-600 dark:text-neutral-400">Loading Aircraft Data...</p>
            ) : aircrafts.length === 0 ? (
                <EmptyState 
                    message="No aircraft in your fleet yet"
                />
            ) : viewMode === "cards" ? (
                <AircraftGrid
                    aircraft={aircrafts}
                    onView={(id) => navigate(`/aircraft/${id}`)}
                    onEdit={(id) => navigate(`/aircraft/edit/${id}`)}
                    onDelete={handleDeleteClick}
                />
            ) : (
                <AircraftTableView
                    aircraft={aircrafts}
                    onView={(id) => navigate(`/aircraft/${id}`)}
                    onEdit={(id) => navigate(`/aircraft/edit/${id}`)}
                    onDelete={handleDeleteClick}
                />
            )}

            <Modal
                isOpen={deleteModal.show}
                onClose={handleCancelDelete}
                title="Delete Aircraft"
                maxWidth="max-w-xl"
            >
                <div className="bg-neutral-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg p-4 mb-6">
                    <p className="text-white mb-2">
                        Are you sure you want to delete this aircraft?
                    </p>
                    <div className="text-gray-400 space-y-1">
                        <p><strong className="text-white">Registration:</strong> {deleteModal.aircraft?.registration}</p>
                        <p><strong className="text-white">Model:</strong> {deleteModal.aircraft?.manufacturer} {deleteModal.aircraft?.model}</p>
                        <p><strong className="text-white">Station:</strong> {deleteModal.aircraft?.station}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="danger"
                        onClick={handleConfirmDelete}
                        className="flex-1"
                    >
                        Yes, Delete Aircraft
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleCancelDelete}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
export default Dashboard;