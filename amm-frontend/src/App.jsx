// Import Required Libraries
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState } from "react"
import "./styles/glassmorphism.css"
import "./styles/ultra-glassmorphism-fixed.css"

// ----- [ REACT PAGES ] ----- //

// Application Pages
import PageLogin from "./pages/PageLogin"
import PageAircraftDetail from "./pages/PageAircraftDetail"
import PageMP from "./pages/PageMP"
import PageAircraftModels from "./pages/PageAircraftModels"
import ManagementMPD from "./pages/ManagementMPD"
import ManagementUser from "./pages/ManagmentUser"
import ManagementRole from "./pages/ManagmentRole"
import SystemLogs from "./pages/SystemLogs"

// Dashboard Pages
import Dashboard from "./pages/Dashboard"
import DashboardCAMO from "./pages/DashboardCAMO"
import DashboardMRO from "./pages/DashboardMRO"
import DashboardTech from "./pages/DashboardTech"
import DashboardCRS from "./pages/DashboardCRS"
import ViewMPTL from "./pages/ViewMPTL"

// Application Action Pages
import AddAircraft from "./pages/actions/AddAircraft"
import EditAircraft from "./pages/actions/EditAircraft"
import EditMPL from "./pages/actions/EditMPL"
import CreateMPTL from "./pages/actions/CreateMPTL"
import EditMPTL from "./pages/actions/EditMPTL"
import CreateMPL from "./pages/actions/CreateMPL"
import CreateSB from "./pages/actions/CreateSB"

// ----- [ REACT COMPONENTS ] ----- //

// Application Components
import Auth from "./components/Auth"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (isLoginPage) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <Header />
        <main className="h-full">
          <Routes>
            <Route path="/login" element={<PageLogin />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Application Header */}
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Container */}
      <div className="flex flex-1 pt-[75px] overflow-hidden">
        {/* Application Sidebar - Desktop Visible, Mobile Hidden */}
        <aside className="hidden lg:block w-full lg:w-[280px] h-full overflow-y-auto glass bg-gradient-to-b from-white/10 to-white/5 border-r border-white/20 flex-shrink-0 backdrop-blur-xl">
          <Sidebar closeSidebar={closeSidebar} />
        </aside>

        {/* Mobile Sidebar - Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={closeSidebar}
          ></div>
        )}
        
        <aside className={`
          fixed left-0 top-[75px] h-[calc(100vh-75px)] w-[280px] glass bg-gradient-to-b from-white/10 to-white/5 overflow-y-auto z-40 backdrop-blur-xl border-r border-white/20
          transform transition-transform duration-300 lg:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar closeSidebar={closeSidebar} />
        </aside>

        {/* Application Main Content */}
        <main className="flex-1 glass bg-gradient-to-br from-blue-950/50 to-slate-900/50 overflow-y-auto w-full backdrop-blur-sm">
          <Routes>
            {/* Application Main Pages*/}
            <Route path="/" element={<Auth><Dashboard /></Auth>} />
          
            {/* Application CAMO Pages*/}
            <Route path="/camo" element={<Auth><DashboardCAMO /></Auth>} />
            <Route path="/camo/mpl/create" element={<Auth><CreateMPL /></Auth>} />
            <Route path="/camo/mpl/edit/:mplId" element={<Auth><EditMPL /></Auth>} />
            <Route path="/camo/sb/create" element={<Auth><CreateSB /></Auth>} />

            {/* Application MRO Pages*/}
            <Route path="/mro" element={<Auth><DashboardMRO /></Auth>} />
            <Route path="/mro/mptl/create" element={<Auth><CreateMPTL /></Auth>} />
            <Route path="/mro/mptl/edit/:mptlId" element={<Auth><EditMPTL /></Auth>} />
          
            {/* Application Technication Pages*/}
            <Route path="/tech" element={<Auth><DashboardTech /></Auth>} />
            <Route path="/tech/mptl/:mptlId" element={<Auth><ViewMPTL /></Auth>} />

            {/* Application CRS Pages*/}
            <Route path="/crs" element={<Auth><DashboardCRS /></Auth>} />
            <Route path="/crs/mptl/:mptlId" element={<Auth><ViewMPTL /></Auth>} />
          
            {/* Application Aircraft Pages*/}
            <Route path="/aircraftModels" element={<Auth><PageAircraftModels /></Auth>} />
            <Route path="/aircraft/:aircraftId" element={<Auth><PageAircraftDetail /></Auth>} />
            <Route path="/aircraft/add" element={<Auth><AddAircraft /></Auth>} />
            <Route path="/aircraft/edit/:aircraftId" element={<Auth><EditAircraft /></Auth>} />
            <Route path="/aircraft/:aircraftId/mp" element={<Auth><PageMP /></Auth>} />
            
            {/* Application MPD Pages*/}
            <Route path="/mpd" element={<Auth><ManagementMPD /></Auth>} />

            {/* Application Admin Pages*/}
            <Route path="/admin/users" element={<Auth><ManagementUser /></Auth>} />
            <Route path="/admin/roles" element={<Auth><ManagementRole /></Auth>} />
            <Route path="/admin/logs" element={<Auth><SystemLogs /></Auth>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Application
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App
