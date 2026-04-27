function Modal({ isOpen, onClose, children, title, maxWidth = "max-w-6xl" }) {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-[10px]"
                onClick={onClose}
            ></div>
            
            <div className={`relative top-[75px] bg-white/15 backdrop-blur-[30px] rounded-[2.5rem] ${maxWidth} w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20`}>
                {title && (
                    <div className="flex justify-between items-center p-8 border-b border-white/10">
                        <h2 className="text-2xl font-bold text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-[1rem]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
