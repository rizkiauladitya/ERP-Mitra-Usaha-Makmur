import React, { useState, useMemo } from 'react';
import { TableRow } from '../types';

interface DataTableProps {
  headers: string[];
  data: TableRow[];
}

type SortConfig = {
  key: string;
  direction: 'ascending' | 'descending';
} | null;

const DataTable: React.FC<DataTableProps> = ({ headers, data }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (header: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [header]: value
    }));
  };

  const sortedAndFilteredData = useMemo(() => {
    let processData = [...data];

    // Filtering
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        processData = processData.filter(row =>
          // FIX: Safely convert cell value to string for filtering. This handles numbers, nulls, and undefined values.
          (row[key] ?? '').toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Sorting
    if (sortConfig !== null) {
      processData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return processData;
  }, [data, filters, sortConfig]);

  const getSortIndicator = (header: string) => {
    if (!sortConfig || sortConfig.key !== header) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <div className="max-h-[50vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700 sticky top-0 z-10">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      scope="col"
                      onClick={() => requestSort(header)}
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none"
                    >
                      {header}
                      <span className="text-indigo-500">{getSortIndicator(header)}</span>
                    </th>
                  ))}
                </tr>
                <tr>
                  {headers.map((header) => (
                    <th key={`${header}-filter`} className="px-4 py-2">
                      <input
                        type="text"
                        placeholder={`Filter ${header}...`}
                        onChange={(e) => handleFilterChange(header, e.target.value)}
                        className="w-full text-sm p-1 border border-slate-300 rounded-md dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {sortedAndFilteredData.map((row, rowIndex) => (
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