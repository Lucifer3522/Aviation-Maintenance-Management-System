function Tabs({ tabs, activeTab, onTabChange }) {
    return (
        <div className="flex border-b border-white/20 bg-white/10 backdrop-blur-[15px] rounded-[2rem] p-1 gap-1">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onTabChange(tab.value)}
                    className={`flex-1 px-6 py-3 font-semibold rounded-[1.5rem] transition-all ${
                        activeTab === tab.value
                            ? 'bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white shadow-lg'
                            : 'text-white/60 hover:text-white/80 hover:bg-white/10'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default Tabs;
