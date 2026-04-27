function Table({ columns, data, onRowClick, className = "" }) {
    return (
        <div className={`bg-white dark:bg-neutral-800 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700">
                            {columns.map((column, index) => (
                                <th 
                                    key={index}
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {data.length === 0 ? (
                            <tr>
                                <td 
                                    colSpan={columns.length}
                                    className="px-6 py-8 text-center text-gray-600 dark:text-gray-400"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr 
                                    key={rowIndex}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700' : ''} transition-colors`}
                                >
                                    {columns.map((column, colIndex) => (
                                        <td 
                                            key={colIndex}
                                            className="px-6 py-4 text-sm text-gray-900 dark:text-white"
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
