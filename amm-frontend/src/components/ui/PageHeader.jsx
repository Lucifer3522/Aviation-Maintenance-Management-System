function PageHeader({ title, subtitle, actions, children }) {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    {subtitle && <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
                </div>
                {actions && (
                    <div className="flex gap-2">
                        {actions}
                    </div>
                )}
                <div className="h-full flex items-center justify-center">
                {children}
                </div>
            </div>
        </div>
    );
}

export default PageHeader;
