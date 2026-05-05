function Select({ 
    label, 
    name, 
    value, 
    onChange, 
    options = [], 
    required = false,
    disabled = false,
    className = "",
    error,
    placeholder = "Select an option",
    children,
    ...props 
}) {
    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-white/90 font-semibold">
                    {label} {required && <span className="text-red-300">*</span>}
                </label>
            )}
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="w-full px-5 py-3 bg-slate-700/40 backdrop-blur-[20px] border border-white/20 rounded-[1.5rem] text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                style={{
                    colorScheme: 'dark'
                }}
                {...props}
            >
                {children ? (
                    children
                ) : (
                    <>
                        {placeholder && <option value="" className="bg-slate-800 text-white">{placeholder}</option>}
                        {options.map((option, index) => (
                            <option 
                                key={option.value || index} 
                                value={option.value}
                                className="bg-slate-800 text-white"
                            >
                                {option.label}
                            </option>
                        ))}
                    </>
                )}
            </select>
            {error && <p className="text-red-300 text-sm font-medium">{error}</p>}
        </div>
    );
}

export default Select;
