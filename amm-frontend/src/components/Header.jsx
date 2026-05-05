import Logo from "../assets/Icons/logo.png";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services";

function Header({ sidebarOpen, toggleSidebar }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsLoggedIn(authService.isAuth());
    }, [location]);

    const handleLogout = () => {
        authService.userLogout();
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <header className="bg-white/10 backdrop-blur-[20px] fixed top-0 left-0 w-full h-[75px] z-50 border-b border-white/20 shadow-lg mt-0 ml-0 rounded-none">
            <nav aria-label="Global" className="h-full mx-auto flex items-center justify-between px-6 sm:px-8 lg:px-10 gap-4">
                {isLoggedIn && (
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden inline-flex items-center justify-center p-3 rounded-[1.25rem] text-white/70 hover:text-white hover:bg-white/20 focus:outline-none transition-all backdrop-blur-[15px] border border-white/20"
                        aria-label="Toggle sidebar"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {sidebarOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                )}

                {/* Logo & Brand */}
                <div className="flex lg:flex-1 items-center gap-3 sm:gap-4">
                    <a href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                        <img src={Logo} alt="Logo" className="h-8 sm:h-10 w-auto" />
                        <span className="text-white text-base sm:text-lg lg:text-xl font-bold hidden sm:inline bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
                            Aviation Maintenance Manager
                        </span>
                        <span className="text-white text-xs sm:hidden font-bold">AMM</span>
                    </a>
                </div>

                {/* Right Actions - Logout */}
                <div className="flex items-center justify-end flex-1 lg:flex-none ml-auto">
                    {isLoggedIn && (
                        <div
                            className="relative flex items-center justify-center"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <button
                                onClick={handleLogout}
                                className="px-4 sm:px-6 py-2.5 text-xs sm:text-sm text-red-200 hover:text-red-100 hover:bg-red-500/20 transition-all flex items-center gap-1 sm:gap-2 rounded-[1.25rem] backdrop-blur-[15px] border border-red-400/30 hover:border-red-400/60 font-medium"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                                    />
                                </svg>
                                <span className="hidden sm:inline">Logout</span>
                                <span className="sm:hidden">Log</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;