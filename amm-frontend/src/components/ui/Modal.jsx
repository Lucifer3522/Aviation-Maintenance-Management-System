function Modal({ isOpen, onClose, children, title, maxWidth = "max-w-6xl" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            
            <div className={`relative bg-white dark:bg-neutral-800 rounded-xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-neutral-700`}>
                {title && (
                    <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-neutral-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
