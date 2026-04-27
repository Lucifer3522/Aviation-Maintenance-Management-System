function StatCard({ title, value, icon, color = "blue", className = "" }) {
    const colors = {
        blue: "bg-blue-600",
        green: "bg-green-600",
        yellow: "bg-yellow-600",
        red: "bg-red-600",
        purple: "bg-purple-600",
        indigo: "bg-indigo-600",
        orange: "bg-orange-600"
    };
    
    return (
        <div className={`bg-white dark:bg-neutral-800 rounded-xl p-6 shadow dark:shadow-lg border border-gray-200 dark:border-neutral-700 ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
                    <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{value}</p>
                </div>
                {icon && (
                    <div className={`${colors[color]} p-3 rounded-lg text-white`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StatCard;
