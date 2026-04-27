function Card({ children, className = "", ...props }) {
    return (
        <div 
            className={`bg-white/10 backdrop-blur-[20px] rounded-[2rem] p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export default Card;
