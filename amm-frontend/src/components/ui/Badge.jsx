function Badge({ children, variant = "default", size = "md", className = "" }) {
    const variants = {
        default: "bg-white/20 text-white",
        primary: "bg-blue-500/40 text-blue-100",
        secondary: "bg-purple-500/40 text-purple-100",
        success: "bg-emerald-500/40 text-emerald-100",
        warning: "bg-amber-500/40 text-amber-100",
        danger: "bg-red-500/40 text-red-100",
        info: "bg-indigo-500/40 text-indigo-100",
    };
    
    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5 text-base"
    };
    
    return (
        <span className={`inline-block rounded-[1.25rem] font-semibold backdrop-blur-[20px] border border-white/20 ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
}

export default Badge;
