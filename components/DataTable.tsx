
import React from 'react';
import { TableRow } from '../types';

interface DataTableProps {
  headers: string[];
  data: TableRow[];
}

const DataTable: React.FC<DataTableProps> = ({ headers, data }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <div className="max-h-[50vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700 sticky top-0">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    {headers.map((header, colIndex) => (
                      <td
                        key={`${rowIndex}-${colIndex}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300"
                      >
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
