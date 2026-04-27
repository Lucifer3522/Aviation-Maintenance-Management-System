function EmptyState({ title, description, icon, action }) {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center border border-gray-200 dark:border-neutral-700">
            {icon && (
                <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 dark:bg-neutral-700 p-4 rounded-full text-gray-600 dark:text-gray-400">
                        {icon}
                    </div>
                </div>
            )}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            {description && <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
            {action}
        </div>
    );
}

export default EmptyState;
