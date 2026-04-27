function Table({ columns, data, onRowClick, className = "" }) {
    return (
        <div className={`bg-white/10 backdrop-blur-[20px] rounded-[2rem] overflow-hidden border border-white/20 shadow-lg ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-white/5 to-white/10 border-b border-white/20">
                            {columns.map((column, index) => (
                                <th 
                                    key={index}
                                    className="px-8 py-5 text-left text-sm font-bold text-white/90 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {data.length === 0 ? (
                            <tr>
                                <td 
                                    colSpan={columns.length}
                                    className="px-8 py-12 text-center text-white/60 font-medium"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr 
                                    key={rowIndex}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={`${onRowClick ? 'cursor-pointer hover:bg-white/10 transition-colors' : ''}`}
                                >
                                    {columns.map((column, colIndex) => (
                                        <td 
                                            key={colIndex}
                                            className="px-8 py-5 text-sm text-white/80"
                                        >
                                            {column.render ? column.render(row) : row[column.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table;
