import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mplService, mpdService, aircraftService, sbService } from "../services";
import Loading from "../components/Loading";
import { StatCard, PageHeader, Button, Card } from "../components/ui";
import Tabs from "../components/ui/Tabs";
import { MPLTable, MPDTable, ServiceBulletinTable } from "../components/tables";

function CAMODashboard() {
    const navigate = useNavigate();
    const [mpls, setMpls] = useState([]);
    const [mpds, setMpds] = useState([]);
    const [aircrafts, setAircrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('mpls');
    const [serviceBulletins, setServiceBulletins] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [mplData, mpdData, aircraftData, serviceBulletinData] = await Promise.all([
                mplService.getAllMPL(),
                mpdService.getAllMPD(),
                aircraftService.getAllAircraft(),
                sbService.getAllServiceBulletins()
            ]);
            setMpls(mplData);
            setMpds(mpdData);
            setAircrafts(aircraftData);
            setServiceBulletins(serviceBulletinData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching CAMO data:", error);
            setLoading(false);
        }
    };

    const handleSendToMRO = async (mplId) => {
        const mroOrg = prompt("Enter MRO Organization name:");
        if (!mroOrg) return;

        try {
            await mplService.sendMPLtoMRO(mplId, mroOrg);
            alert("MPL sent to MRO successfully!");
            fetchData();
        } catch (error) {
            console.error("Error sending MPL to MRO:", error);
            alert("Failed to send MPL to MRO");
        }
    };

    const handleDeleteMPL = async (mplId, mpNumber) => {
        if (!confirm(`Are you sure you want to delete MPL ${mpNumber}?`)) return;

        try {
            await mplService.deleteMPL(mplId);
            alert("MPL deleted successfully!");
            fetchData();
        } catch (error) {
            console.error("Error deleting MPL:", error);
            alert("Failed to delete MPL");
        }
    };

    if (loading) {
        return <Loading message="Loading CAMO Dashboard..." />;
    }

    const activeMPLs = mpls.filter(m => m.status === 'Active');

    return (
        <div className="h-full w-full bg-neutral-100 dark:bg-neutral-900 text-gray-900 dark:text-white p-6 overflow-y-auto">
            <PageHeader 
                title="CAMO Dashboard" 
                subtitle="Continuing Airworthiness Management Organization"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard 
                    title="Active MPLs" 
                    value={activeMPLs.length}
                    color="blue"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                    }
                />
                
                <StatCard 
                    title="Total Aircraft" 
                    value={aircrafts.length}
                    color="green"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    }
                />
                
                <StatCard 
                    title="Total MPDs" 
                    value={mpds.length}
                    color="purple"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    }
                />

                <StatCard 
                    title="Total Service Bulletins" 
                    value={serviceBulletins.length}
                    color="yellow"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    }
                />
            </div>

            <Card className="overflow-hidden p-0">
                <Tabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={[
                        { value: 'mpls', label: 'Maintenance Program Lists (MPL)' },
                        { value: 'mpds', label: 'Manufacturer MPDs' },
                        { value: 'sb', label: 'Service Bulletins' },
                    ]}
                />

                <div className="p-6">
                    {activeTab === 'mpls' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Maintenance Program Lists</h2>
                                <Button onClick={() => navigate('/camo/mpl/create')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Create MPL
                                </Button>
                            </div>
                            <MPLTable 
                                mpls={mpls}
                                onSendToMRO={handleSendToMRO}
                                onDelete={handleDeleteMPL}
                            />
                        </div>
                    )}

                    {activeTab === 'mpds' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Manufacturer MPDs</h2>
                            </div>
                            <MPDTable mpds={mpds} limit={10} />
                        </div>
                    )}

                    {activeTab === 'sb' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Service Bulletins</h2>
                                <Button onClick={() => navigate('/camo/sb/create')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Create SB
                                </Button>
                            </div>
                            <ServiceBulletinTable serviceBulletins={serviceBulletins}/>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default CAMODashboard;
