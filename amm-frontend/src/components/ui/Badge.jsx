function Badge({ children, variant = "default", size = "md", className = "" }) {
    const variants = {
        default: "bg-gray-900/50 text-gray-300",
        primary: "bg-blue-900/50 text-blue-300",
        secondary: "bg-purple-900/50 text-purple-300",
        success: "bg-green-900/50 text-green-300",
        warning: "bg-yellow-900/50 text-yellow-300",
        danger: "bg-red-900/50 text-red-300",
        info: "bg-indigo-900/50 text-indigo-300",
    };
    
    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base"
    };
    
    return (
        <span className={`inline-block rounded font-medium backdrop-blur-sm ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
}

export default Badge;
