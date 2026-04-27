function Card({ children, className = "", ...props }) {
    return (
        <div 
            className={`bg-white dark:bg-neutral-800 rounded-xl p-6 border border-gray-200 dark:border-neutral-700 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export default Card;
