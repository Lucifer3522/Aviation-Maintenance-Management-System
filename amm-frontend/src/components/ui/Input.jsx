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
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label} {required && <span className="text-red-500">*</span>}
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
                className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                {...props}
            />
            {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
        </div>
    );
}

export default Input;
