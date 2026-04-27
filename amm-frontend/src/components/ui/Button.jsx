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
    const baseStyles = "font-semibold rounded-lg transition-all flex items-center justify-center gap-2";
    
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-gray-600 hover:bg-gray-700 text-white",
        success: "bg-green-600 hover:bg-green-700 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
        info: "bg-indigo-600 hover:bg-indigo-700 text-white",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
    };
    
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg"
    };
    
    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
    
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
