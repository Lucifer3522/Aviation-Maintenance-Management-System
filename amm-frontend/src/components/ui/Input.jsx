function Input({ 
    label, 
    type = "text", 
    name, 
    value, 
    onChange, 
    placeholder, 
    required = false,
    disabled = false,
    className = "",
    error,
    ...props 
}) {
    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-white/90 font-semibold">
                    {label} {required && <span className="text-red-300">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className="w-full px-5 py-3 bg-white/10 backdrop-blur-[20px] border border-white/20 rounded-[1.5rem] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                {...props}
            />
            {error && <p className="text-red-300 text-sm font-medium">{error}</p>}
        </div>
    );
}

export default Input;
