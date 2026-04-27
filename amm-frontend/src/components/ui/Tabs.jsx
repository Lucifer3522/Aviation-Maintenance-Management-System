function Tabs({ tabs, activeTab, onTabChange }) {
    return (
        <div className="flex border-b border-neutral-700">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onTabChange(tab.value)}
                    className={`flex-1 px-6 py-4 font-semibold transition-all ${
                        activeTab === tab.value
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-neutral-700'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default Tabs;
