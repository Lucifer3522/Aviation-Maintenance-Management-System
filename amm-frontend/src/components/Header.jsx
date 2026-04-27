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
        <header className="bg-neutral-900 h-full">
            <nav aria-label="Global" className="h-full mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
                {isLoggedIn && (
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none transition-colors"
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
                <div className="flex lg:flex-1 items-center gap-2 sm:gap-4">
                    <a href="/" className="flex items-center gap-2 sm:gap-3">
                        <img src={Logo} alt="Logo" className="h-6 sm:h-8 w-auto" />
                        <span className="text-white text-sm sm:text-base lg:text-lg font-medium hidden sm:inline">
                            My Maintenance Network
                        </span>
                        <span className="text-white text-xs sm:hidden">MMN</span>
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
                                className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-red-400 hover:bg-neutral-700 transition-colors flex items-center gap-1 sm:gap-2 rounded-md"
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