function PageHeader({ title, subtitle, actions, children }) {
    return (
        <div className="mb-8 p-8 bg-white/10 backdrop-blur-[20px] rounded-[2rem] border border-white/20 shadow-lg">
            <div className="flex justify-between items-center gap-6">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold text-white">{title}</h1>
                    {subtitle && <p className="text-white/70 mt-2 text-lg">{subtitle}</p>}
                </div>
                {actions && (
                    <div className="flex gap-3 flex-wrap justify-end">
                        {actions}
                    </div>
                )}
                {children && (
                    <div className="flex items-center justify-center">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PageHeader;
