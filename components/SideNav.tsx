import React from 'react';
import { HomeIcon, TableIcon, PuzzlePieceIcon, Cog6ToothIcon, CubeIcon, ShoppingCartIcon, UserGroupIcon, ChartBarIcon, SparklesIcon } from './IconComponents';

interface SideNavProps {
    activeView: string;
    onViewChange: (view: string) => void;
}

const navSections = [
    {
        title: 'Menu Utama',
        items: [
            { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
            { id: 'dataview', label: 'Tampilan Data', icon: TableIcon },
            { id: 'data-analysis', label: 'Analisis Data', icon: SparklesIcon },
            { id: 'reports', label: 'Laporan', icon: ChartBarIcon },
        ]
    },
    {
        title: 'Manajemen',
        items: [
            { id: 'sales', label: 'Penjualan', icon: ShoppingCartIcon },
            { id: 'inventory', label: 'Inventaris', icon: CubeIcon },
            { id: 'customers', label: 'Pelanggan', icon: UserGroupIcon },
        ]
    },
    {
        title: 'Sistem',
        items: [
            { id: 'integrations', label: 'Integrations', icon: PuzzlePieceIcon },
            { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
        ]
    }
];

const SideNav: React.FC<SideNavProps> = ({ activeView, onViewChange }) => {
    return (
        <aside className="w-56 flex-shrink-0 pt-8 pr-8 hidden md:block">
            <nav className="flex flex-col space-y-4">
                {navSections.map(section => (
                    <div key={section.title}>
                        <p className="px-4 pt-2 pb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{section.title}</p>
                        <div className="space-y-1">
                            {section.items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => onViewChange(item.id)}
                                    aria-current={activeView === item.id ? 'page' : undefined}
                                    className={`flex items-center w-full px-4 py-2.5 text-sm font-medium text-left rounded-lg transition-colors duration-150
                                    ${
                                        activeView === item.id
                                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'
                                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default SideNav;