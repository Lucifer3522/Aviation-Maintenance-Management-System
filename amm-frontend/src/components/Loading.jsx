function Loading({ message = "Loading..." }) {
    return (
        <div className="flex items-center justify-center h-full w-full bg-neutral-900">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-neutral-700 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                
                {/* Loading Message */}
                <p className="text-white text-lg font-medium">{message}</p>
            </div>
        </div>
    );
}

export default Loading;
