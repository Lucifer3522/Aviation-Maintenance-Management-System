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
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                {...props}
            >
                {children ? (
                    children
                ) : (
                    <>
                        {placeholder && <option value="">{placeholder}</option>}
                        {options.map((option, index) => (
                            <option 
                                key={option.value || index} 
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </>
                )}
            </select>
            {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
    );
}

export default Select;
