function Button({ 
    children, 
    variant = "primary", 
    size = "md", 
    onClick, 
    type = "button",
    disabled = false,
    className = "",
    ...props 
}) {
    const baseStyles = "font-semibold rounded-[2rem] transition-all flex items-center justify-center gap-2 backdrop-blur-[20px] border border-white/20 shadow-lg";
    
    const variants = {
        primary: "bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/90 text-white",
        secondary: "bg-white/30 hover:bg-white/40 text-white border-white/30",
        success: "bg-gradient-to-r from-emerald-500/80 to-emerald-600/80 hover:from-emerald-600/90 hover:to-emerald-700/90 text-white",
        danger: "bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-600/90 hover:to-red-700/90 text-white",
        warning: "bg-gradient-to-r from-amber-500/80 to-amber-600/80 hover:from-amber-600/90 hover:to-amber-700/90 text-white",
        info: "bg-gradient-to-r from-indigo-500/80 to-indigo-600/80 hover:from-indigo-600/90 hover:to-indigo-700/90 text-white",
        outline: "border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60"
    };
    
    const sizes = {
        sm: "px-4 py-2.5 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };
    
    const disabledStyles = disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer";
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
