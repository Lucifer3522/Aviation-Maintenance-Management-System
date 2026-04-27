function StatCard({ title, value, icon, color = "blue", className = "" }) {
    const colors = {
        blue: "bg-gradient-to-br from-blue-500/70 to-blue-600/70",
        green: "bg-gradient-to-br from-emerald-500/70 to-emerald-600/70",
        yellow: "bg-gradient-to-br from-amber-500/70 to-amber-600/70",
        red: "bg-gradient-to-br from-red-500/70 to-red-600/70",
        purple: "bg-gradient-to-br from-purple-500/70 to-purple-600/70",
        indigo: "bg-gradient-to-br from-indigo-500/70 to-indigo-600/70",
        orange: "bg-gradient-to-br from-orange-500/70 to-orange-600/70"
    };
    
    return (
        <div className={`bg-white/10 backdrop-blur-[20px] rounded-[2rem] p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/70 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold mt-3 text-white">{value}</p>
                </div>
                {icon && (
                    <div className={`${colors[color]} backdrop-blur-[15px] p-4 rounded-[1.5rem] text-white border border-white/20`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StatCard;
