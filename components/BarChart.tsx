
import React, { useState } from 'react';
import { useTranslation } from '../services/i18n';

interface BarChartProps {
    data: { name: string; value: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const { t } = useTranslation();
    // Handle empty data case for maxValue to prevent errors
    const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 1;

    const [activeTooltip, setActiveTooltip] = useState<{
        content: string;
        x: number;
        y: number;
    } | null>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, item: { name: string; value: number }) => {
        setActiveTooltip({
            content: `${item.name}: Rp ${item.value.toLocaleString('id-ID')}`,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handleMouseLeave = () => {
        setActiveTooltip(null);
    };

    return (
        <div className="w-full h-full flex items-end justify-around p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 relative" onMouseLeave={handleMouseLeave}>
            {activeTooltip && (
                <div 
                    style={{ 
                        position: 'fixed', 
                        top: activeTooltip.y, 
                        left: activeTooltip.x,
                        transform: 'translate(15px, -110%)', // Position tooltip above and to the right of cursor
                        pointerEvents: 'none',
                        zIndex: 100,
                    }}
                    className="bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-md shadow-lg transition-opacity duration-200 dark:bg-slate-700"
                >
                    {activeTooltip.content}
                </div>
            )}
            
            {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center h-full justify-end w-full mx-1">
                    <div
                        className="w-full bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-all duration-200 ease-in-out cursor-pointer"
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                        onMouseMove={(e) => handleMouseMove(e, item)}
                        onMouseLeave={handleMouseLeave} // Hide tooltip if mouse leaves a specific bar
                    >
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 select-none">{item.name}</span>
                </div>
            ))}
            
            {data.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-slate-500 dark:text-slate-400">Tidak ada data untuk ditampilkan.</p>
                </div>
            )}
        </div>
    );
};

export default BarChart;
