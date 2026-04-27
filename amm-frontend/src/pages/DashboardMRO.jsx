import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mptlService, mplService } from "../services";
import Loading from "../components/Loading";
import { StatCard, PageHeader, Button, Card } from "../components/ui";
import Tabs from "../components/ui/Tabs";
import { MPTLTable, MPLTable } from "../components/tables";
import { GlassmorphismDashboard } from "../components/GlassmorphismCard";
import "../styles/glassmorphism.css";

function MRODashboard() {
    const navigate = useNavigate();
    const [mptls, setMptls] = useState([]);
    const [mpls, setMpls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('mptls');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [mptlData, mplData] = await Promise.all([
                mptlService.getAllMPTL(),
                mplService.getAllMPL()
            ]);
            setMptls(mptlData);
            setMpls(mplData.filter(m => m.sentToMRO));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching MRO data:", error);
            setLoading(false);
        }
    };

    const handleDeleteMPTL = async (mptlId, taskListNumber) => {
        if (!confirm(`Are you sure you want to delete MPTL ${taskListNumber}?`)) return;

        try {
            await mptlService.deleteMPTL(mptlId);
            alert("MPTL deleted successfully!");
            fetchData();
        } catch (error) {
            console.error("Error deleting MPTL:", error);
            alert("Failed to delete MPTL");
        }
    };

    if (loading) {
        return <Loading message="Loading MRO Dashboard..." />;
    }

    const inProgressMPTLs = mptls.filter(m => m.overallStatus === 'In Progress');
    const awaitingCRS = mptls.filter(m => m.overallStatus === 'Awaiting CRS');
    const completedMPTLs = mptls.filter(m => m.overallStatus === 'Completed');

    return (
        <GlassmorphismDashboard>
            <PageHeader 
                title="MRO Dashboard" 
                subtitle="Maintenance Repair Overhaul Organization"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard 
                    title="Total MPTLs" 
                    value={mptls.length}
                    color="blue"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                    }
                />
                
                <StatCard 
                    title="In Progress" 
                    value={inProgressMPTLs.length}
                    color="yellow"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    }
                />
                
                <StatCard 
                    title="Awaiting CRS" 
                    value={awaitingCRS.length}
                    color="orange"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                
                <StatCard 
                    title="Completed" 
                    value={completedMPTLs.length}
                    color="green"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            <Card className="overflow-hidden p-0">
                <Tabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={[
                        { value: 'mptls', label: 'Task Lists (MPTL)' },
                        { value: 'received-mpls', label: 'Received MPLs' }
                    ]}
                />

                <div className="p-6">
                    {activeTab === 'mptls' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-white">Maintenance Package Task Lists</h2>
                                <Button onClick={() => navigate('/mro/mptl/create')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Create MPTL
                                </Button>
                            </div>
                            <MPTLTable 
                                mptls={mptls}
                                onDelete={handleDeleteMPTL}
                            />
                        </div>
                    )}

                    {activeTab === 'received-mpls' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-white">Received Maintenance Program Lists</h2>
                            </div>
                            <MPLTable 
                                mpls={mpls}
                                hideActions={true}
                                customActions={(mpl) => (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={() => navigate('/mro/mptl/create', { state: { mpl } })}
                                        >
                                            Create MPTL
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => alert('MPL detail page coming soon')}
                                        >
                                            View MPL
                                        </Button>
                                    </>
                                )}
                            />
                        </div>
                    )}
                </div>
            </Card>
        </GlassmorphismDashboard>
    );
}

export default MRODashboard;
