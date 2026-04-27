import { authService } from "../services";

function Sidebar({ closeSidebar }) {
    const user = authService.getUser() || {};
    const role = user.role || 'MRO';

    const getRoleDashboard = () => {
        switch (role) {
            case 'SUPER_ADMIN': return '/';
            case 'ADMIN': return '/';
            case 'CAMO': return '/camo';
            case 'MRO': return '/mro';
            case 'B1_TECH':
            case 'B2_TECH':
            case 'C_TECH': return '/tech';
            case 'CRS': return '/crs';
            default: return '/';
        }
    };

    const handleLinkClick = () => {
        if (closeSidebar) {
            closeSidebar();
        }
    };

    return (
        <>
            <div
                id="default-sidebar"
                className="bg-gradient-to-b from-slate-900 to-slate-800 p-4 sm:p-6 w-full h-full"
                aria-label="Sidebar"
            >
                <div className="h-full rounded-[2rem] shadow-2xl px-5 py-6 overflow-y-auto bg-white/10 backdrop-blur-[20px] border border-white/20 flex flex-col">
                    <div className="mb-6 px-4 py-3 bg-gradient-to-r from-blue-500/40 to-blue-600/40 rounded-[1.5rem] border border-white/20 backdrop-blur-[15px]">
                        <p className="text-xs text-white/60">Role</p>
                        <p className="font-semibold text-white text-sm mt-1">
                            {role === 'SUPER_ADMIN' ? 'Super Admin' :
                                role === 'B1_TECH' ? 'B1 Technician' :
                                    role === 'B2_TECH' ? 'B2 Technician' :
                                        role === 'C_TECH' ? 'C Technician' :
                                            role}
                        </p>
                    </div>

                    <ul className="space-y-2 font-medium flex-1">
                        <li>
                            <a
                                href={getRoleDashboard()}
                                onClick={handleLinkClick}
                                className="flex items-center p-3 text-white hover:text-white hover:bg-white/20 rounded-[1.5rem] transition-all backdrop-blur-[10px] border border-white/0 hover:border-white/20 group text-sm font-medium"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                <span className="ms-3">Dashboard</span>
                            </a>
                        </li>

                        {role === 'CAMO' && (
                            <>
                                <li>
                                    <a
                                        href="/camo"
                                        onClick={handleLinkClick}
                                        className="flex items-center p-3 text-white hover:text-white hover:bg-white/20 rounded-[1.5rem] transition-all backdrop-blur-[10px] border border-white/0 hover:border-white/20 group text-sm font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                        </svg>
                                        <span className="ms-3">MPL Management</span>
                                    </a>
                                </li>
                            </>
                        )}

                        {role === 'MRO' && (
                            <>
                                <li>
                                    <a
                                        href="/mro"
                                        onClick={handleLinkClick}
                                        className="flex items-center p-3 text-white hover:text-white hover:bg-white/20 rounded-[1.5rem] transition-all backdrop-blur-[10px] border border-white/0 hover:border-white/20 group text-sm font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                                        </svg>
                                        <span className="ms-3">Task Lists (MPTL)</span>
                                    </a>
                                </li>
                            </>
                        )}

                        {['B1_TECH', 'B2_TECH', 'C_TECH'].includes(role) && (
                            <>
                                <li>
                                    <a
                                        href="/tech"
                                        onClick={handleLinkClick}
                                        className="flex items-center p-3 text-white hover:text-white hover:bg-white/20 rounded-[1.5rem] transition-all backdrop-blur-[10px] border border-white/0 hover:border-white/20 group text-sm font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="ms-3">My Tasks</span>
                                    </a>
                                </li>
                            </>
                        )}

                        {role === 'CRS' && (
                            <>
                                <li>
                                    <a
                                        href="/crs"
                                        onClick={handleLinkClick}
                                        className="flex items-center p-3 text-white hover:text-white hover:bg-white/20 rounded-[1.5rem] transition-all backdrop-blur-[10px] border border-white/0 hover:border-white/20 group text-sm font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                        </svg>
                                        <span className="ms-3">CRS Management</span>
                                    </a>
                                </li>
                            </>
                        )}

                        {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
                            <>
                                <li>
                                    <a
                                        href="/admin/users"
                                        onClick={handleLinkClick}
                                        className="flex items-center p-3 text-white hover:text-white hover:bg-white/20 rounded-[1.5rem] transition-all backdrop-blur-[10px] border border-white/0 hover:border-white/20 group text-sm font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                        </svg>
                                        <span className="ms-3">User Management</span>
                                    </a>
                                </li>
                            </>
                        )}

                        {role === 'SUPER_ADMIN' && (
                            <>
                                <li>
                                    <a
                                        href="/admin/roles"
                                        onClick={handleLinkClick}
                                        className="flex items-center p-3 text-white hover:text-white hover:bg-white/20 rounded-[1.5rem] transition-all backdrop-blur-[10px] border border-white/0 hover:border-white/20 group text-sm font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                        </svg>
                                        <span className="ms-3">Role Management</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/admin/logs"
                                        onClick={handleLinkClick}
                                        className="flex items-center p-3 text-white hover:text-white hover:bg-white/20 rounded-[1.5rem] transition-all backdrop-blur-[10px] border border-white/0 hover:border-white/20 group text-sm font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75m-1.5 0a6 6 0 01-6-6v.75m6 6a6 6 0 006-6v.75m0 0a.75.75 0 001.5 0v-.75A7.5 7.5 0 004.5 12m0 6v-.75a.75.75 0 011.5 0v.75m0 0v1.75A1.75 1.75 0 016.25 21H3.75a1.75 1.75 0 01-1.75-1.75V18.75" />
                                        </svg>
                                        <span className="ms-3">System Logs</span>
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="border-t border-white/20 pt-5 mt-6">
                        <ul className="space-y-2 font-medium">
                            {(role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'CAMO') && (
                                <>
                                    <li>
                                        <a
                                            href="/aircraftModels"
                                            onClick={handleLinkClick}
                                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors text-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                                            </svg>
                                            <span className="ms-3">Aircraft Models</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/mpd"
                                            onClick={handleLinkClick}
                                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors text-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                            <span className="ms-3">MPD Management</span>
                                        </a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
