function EmptyState({ title, description, icon, action }) {
    return (
        <div className="bg-white/10 backdrop-blur-[20px] rounded-[2rem] p-12 text-center border border-white/20 shadow-lg">
            {icon && (
                <div className="flex justify-center mb-6">
                    <div className="bg-white/20 backdrop-blur-[15px] p-6 rounded-[1.75rem] text-white/80 border border-white/20">
                        {icon}
                    </div>
                </div>
            )}
            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            {description && <p className="text-white/70 mb-6 text-lg">{description}</p>}
            {action}
        </div>
    );
}

export default EmptyState;
