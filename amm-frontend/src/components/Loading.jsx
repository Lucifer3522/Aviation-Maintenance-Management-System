function Loading({ message = "Loading..." }) {
    return (
        <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-20 h-20">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-white/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-400 rounded-full border-t-transparent animate-spin"></div>
                </div>
                
                <p className="text-white text-lg font-medium text-center">{message}</p>
            </div>
        </div>
    );
}

export default Loading;
