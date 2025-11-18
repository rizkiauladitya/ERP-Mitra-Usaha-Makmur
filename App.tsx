
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { TableRow } from './types';
import { analyzeDataWithGemini } from './services/geminiService';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import AnalysisPanel from './components/AnalysisPanel';
import SideNav from './components/SideNav';
import BarChart from './components/BarChart';
import Modal from './components/Modal';
import { SparklesIcon, XCircleIcon, DocumentTextIcon, HashtagIcon, ViewColumnsIcon, PlusIcon, PencilIcon, TrashIcon } from './components/IconComponents';
import { generateSalesData, initialCustomers, initialInventory, initialIntegrations, initialUsers, initialTransactions } from './services/mockDataService';
import { useTranslation } from './services/i18n';


// --- Reusable UI Components ---

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md flex items-center space-x-4 border border-slate-200 dark:border-slate-700">
    <div className={`rounded-full p-3 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{value}</p>
    </div>
  </div>
);

// --- Form Components for Modals ---
interface FormProps<T> {
    initialData?: T;
    onSave: (data: T) => void;
    onClose: () => void;
}

const AddTransactionForm: React.FC<FormProps<any>> = ({ initialData, onSave, onClose }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ item: '', quantity: '', price: '', customer: '', date: new Date().toISOString().split('T')[0], ...initialData });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
     return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium">{t('Date')}</label><input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">{t('Item')}</label><input type="text" name="item" value={formData.item} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">{t('Quantity')}</label><input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">{t('Price')} (Rp)</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">{t('Customer')}</label><input type="text" name="customer" value={formData.customer} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">{t('Cancel')}</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">{initialData ? t('Save Changes') : t('Save')}</button>
            </div>
        </form>
    );
}

const AddSaleForm: React.FC<FormProps<any>> = ({ initialData, onSave, onClose }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ id: `INV-${Math.floor(10000 + Math.random() * 90000)}`, customer: '', date: new Date().toISOString().split('T')[0], total: '', status: 'Belum Lunas', ...initialData });
    
    useEffect(() => {
        if(initialData) setFormData(initialData);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium">{t('Invoice ID')}</label><input type="text" name="id" value={formData.id} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required readOnly/></div>
            <div><label className="block text-sm font-medium">{t('Customer')}</label><input type="text" name="customer" value={formData.customer} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">{t('Date')}</label><input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">{t('Total Sales')} (Rp)</label><input type="number" name="total" value={formData.total} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">{t('Status')}</label><select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600"><option>{t('Unpaid')}</option><option>{t('Paid')}</option></select></div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">{t('Cancel')}</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">{initialData ? t('Save Changes') : t('Save')}</button>
            </div>
        </form>
    );
};

const AddInventoryForm: React.FC<FormProps<any>> = ({ initialData, onSave, onClose }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: '', stock: '', location: '', price: '', sku: '', ...initialData });
    
    useEffect(() => {
        if(initialData) setFormData(initialData);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.sku) {
             onSave({ ...formData, sku: `${formData.name.substring(0,3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}` });
        } else {
            onSave(formData);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium">{t('Item Name')}</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">{t('Stock Quantity')}</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">{t('Location')}</label><input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">{t('Price')} (Rp)</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">{t('Cancel')}</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">{initialData ? t('Save Changes') : t('Save')}</button>
            </div>
        </form>
    );
};

const AddCustomerForm: React.FC<FormProps<any>> = ({ initialData, onSave, onClose }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: '', contact: '', address: '', email: '', history: '0 Transaksi', ...initialData });
    
    useEffect(() => {
        if(initialData) setFormData(initialData);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium">{t('Customers')}</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">Kontak</label><input type="text" name="contact" value={formData.contact} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">Alamat</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">{t('Email')}</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">{t('Cancel')}</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">{initialData ? t('Save Changes') : t('Save')}</button>
            </div>
        </form>
    );
};

const AddIntegrationForm: React.FC<FormProps<any>> = ({ initialData, onSave, onClose }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: '', type: 'Akuntansi', status: 'Tidak Terhubung', description: '', ...initialData });
    
    useEffect(() => {
        if(initialData) setFormData(initialData);
    }, [initialData]);

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium">Nama Layanan</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">Tipe</label><select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600"><option>Akuntansi</option><option>Payment Gateway</option><option>Logistik</option><option>Lainnya</option></select></div>
            <div><label className="block text-sm font-medium">Deskripsi</label><textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required /></div>
            <div><label className="block text-sm font-medium">Status Awal</label><select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600"><option>{t('Not Connected')}</option><option>{t('Connected')}</option></select></div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">{t('Cancel')}</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">{initialData ? t('Save Changes') : t('Save')}</button>
            </div>
        </form>
    );
};

const AddUserForm: React.FC<FormProps<any>> = ({ initialData, onSave, onClose }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Staf', ...initialData });
    
    useEffect(() => {
        if(initialData) setFormData(initialData);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium">{t('User Name')}</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">{t('Email')}</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600" required/></div>
            <div><label className="block text-sm font-medium">{t('Role')}</label><select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600"><option>{t('Admin')}</option><option>{t('Manager')}</option><option>{t('Staff')}</option></select></div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">{t('Cancel')}</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">{initialData ? t('Save Changes') : t('Save')}</button>
            </div>
        </form>
    );
};


// --- View Components ---

const DashboardView: React.FC<{stats: any}> = ({ stats }) => {
    const { t } = useTranslation();
    const insights = [
        t('Insight 1'),
        t('Insight 2'),
        t('Insight 3'),
    ];
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('Dashboard')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('Total Sales')} value={`Rp ${stats.totalSales.toLocaleString('id-ID')}`} color="bg-blue-100 dark:bg-blue-500/20" icon={<HashtagIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />} />
                <StatCard title={t('Inventory Items')} value={stats.totalInventoryItems} color="bg-emerald-100 dark:bg-emerald-500/20" icon={<ViewColumnsIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />} />
                <StatCard title={t('Total Customers')} value={stats.totalCustomers} color="bg-amber-100 dark:bg-amber-500/20" icon={<DocumentTextIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />} />
                <StatCard title={t('Sales This Month')} value={`Rp ${stats.thisMonthSales.toLocaleString('id-ID')}`} color="bg-indigo-100 dark:bg-indigo-500/20" icon={<HashtagIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />} />
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                    <SparklesIcon className="w-6 h-6 mr-2 text-indigo-500" />
                    {t('AI Insights')}
                </h2>
                <ul className="space-y-3">
                    {insights.map((insight, index) => (
                         <li key={index} className="flex items-start">
                            <SparklesIcon className="w-4 h-4 mr-3 mt-1 text-indigo-400 flex-shrink-0" />
                            <p className="text-sm text-slate-600 dark:text-slate-300">{insight}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const DataView: React.FC<{transactions: any[], onAdd: () => void}> = ({ transactions, onAdd }) => {
    const { t } = useTranslation();
    const headers = [t('Date'), t('Item'), t('Quantity'), t('Price'), t('Customer')];
    const data = transactions.map(transaction => ({
        [t('Date')]: transaction.date,
        [t('Item')]: transaction.item,
        [t('Quantity')]: transaction.quantity,
        [t('Price')]: `Rp ${Number(transaction.price).toLocaleString('id-ID')}`,
        [t('Customer')]: transaction.customer,
    }));

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('Transaction Data View')}</h1>
                <button onClick={onAdd} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5 mr-2 -ml-1"/>
                    {t('Add Data')}
                </button>
            </div>
            <DataTable headers={headers} data={data} />
        </div>
    );
};

const ReportsView: React.FC<{salesData: any[]}> = ({ salesData }) => {
    const { t } = useTranslation();
    const today = new Date();
    const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    
    const [startDate, setStartDate] = useState(threeMonthsAgo.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

    const chartData = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const filtered = salesData.filter(sale => {
            const transactionDate = new Date(sale.date);
            return transactionDate >= start && transactionDate <= end;
        });

        const monthlySales = filtered.reduce((acc, curr) => {
            const monthYear = new Date(curr.date).toLocaleString('id-ID', { month: 'short', year: 'numeric' });
            acc[monthYear] = (acc[monthYear] || 0) + curr.total;
            return acc;
        }, {} as Record<string, number>);
        
        const sortedMonths = Object.keys(monthlySales).sort((a, b) => {
            const [monthA, yearA] = a.split(' ');
            const [monthB, yearB] = b.split(' ');
            const monthMap: {[key: string]: number} = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5, Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11 };
            return new Date(parseInt(yearA), monthMap[monthA]).getTime() - new Date(parseInt(yearB), monthMap[monthB]).getTime();
        });

        return sortedMonths.map(monthYear => ({ name: monthYear.split(' ')[0], value: monthlySales[monthYear] }));

    }, [startDate, endDate, salesData]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('Sales Reports')}</h1>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap gap-4 mb-6 items-end">
                    <div>
                        <label htmlFor="period" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('Period')}</label>
                        <select id="period" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-slate-700 dark:border-slate-600">
                            <option>{t('This Month')}</option>
                            <option>{t('Last 3 Months')}</option>
                            <option>{t('This Year')}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('Category')}</label>
                        <select id="category" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-slate-700 dark:border-slate-600">
                            <option>{t('All Products')}</option>
                            <option>{t('Food')}</option>
                            <option>{t('Beverages')}</option>
                             <option>{t('Household Needs')}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('From Date')}</label>
                        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('To Date')}</label>
                        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                </div>
                <div>
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('Sales Trend')}</h2>
                     <div className="h-72 w-full">
                        <BarChart data={chartData} />
                     </div>
                </div>
            </div>
        </div>
    );
};

const SalesView: React.FC<{sales: any[], onAdd: () => void, onEdit: (sale: any) => void, onDelete: (saleId: string) => void}> = ({ sales, onAdd, onEdit, onDelete }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('Sales')}</h1>
                <button onClick={onAdd} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5 mr-2 -ml-1"/>
                    {t('Add Sale')}
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                 <div className="overflow-x-auto">
                    <div className="max-h-[70vh] overflow-y-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-700 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Invoice ID')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Customer')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Date')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Total Sales')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Status')}</th>
                                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {sales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">{sale.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{sale.customer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{sale.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">Rp {Number(sale.total).toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sale.status === 'Lunas' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                                {sale.status === 'Lunas' ? t('Paid') : t('Unpaid')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                            <button onClick={() => onEdit(sale)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><PencilIcon className="w-4 h-4"/></button>
                                            <button onClick={() => onDelete(sale.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><TrashIcon className="w-4 h-4"/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </div>
        </div>
    );
};

const InventoryView: React.FC<{items: any[], onAdd: () => void, onEdit: (item: any) => void, onDelete: (sku: string) => void}> = ({ items, onAdd, onEdit, onDelete }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('Inventory')}</h1>
                <button onClick={onAdd} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5 mr-2 -ml-1"/>
                    {t('Add Inventory')}
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                 <div className="overflow-x-auto">
                    <div className="max-h-[70vh] overflow-y-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-700 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Item Name')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('SKU')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Stock Quantity')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Location')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Price')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                 {items.map((item) => (
                                    <tr key={item.sku} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{item.sku}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{item.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{item.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                            <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><PencilIcon className="w-4 h-4"/></button>
                                            <button onClick={() => onDelete(item.sku)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><TrashIcon className="w-4 h-4"/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CustomersView: React.FC<{customers: any[], onAdd: () => void, onEdit: (customer: any) => void, onDelete: (customerEmail: string) => void}> = ({ customers, onAdd, onEdit, onDelete }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('Customers')}</h1>
                <button onClick={onAdd} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5 mr-2 -ml-1"/>
                    {t('Add Customer')}
                </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customers.map(customer => (
                        <div key={customer.email} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col">
                            <div className="flex-grow">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{customer.name}</h2>
                                <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1 truncate">{customer.email}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{customer.address}</p>
                                 <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Kontak: {customer.contact}</p>
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                               <span>{t('Transaction History')}: {customer.history}</span>
                               <div className="space-x-3">
                                    <button onClick={() => onEdit(customer)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><PencilIcon className="w-4 h-4"/></button>
                                    <button onClick={() => onDelete(customer.email)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><TrashIcon className="w-4 h-4"/></button>
                               </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const IntegrationsView: React.FC<{integrations: any[], onAdd: () => void, onToggleStatus: (name: string) => void}> = ({ integrations, onAdd, onToggleStatus }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('Integrations')}</h1>
                <button onClick={onAdd} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5 mr-2 -ml-1"/>
                    {t('Add Integration')}
                </button>
            </div>
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                    {integrations.map(int => (
                        <li key={int.name} className="p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{int.name} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({int.type})</span></h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{int.description}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className={`flex items-center text-sm font-medium ${int.status === 'Terhubung' ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                                    <span className={`w-2 h-2 mr-2 rounded-full ${int.status === 'Terhubung' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                    {int.status === 'Terhubung' ? t('Connected') : t('Not Connected')}
                                </span>
                                <button onClick={() => onToggleStatus(int.name)} className="px-4 py-1.5 text-sm font-medium border rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600">
                                    {int.status === 'Terhubung' ? t('Disconnect') : t('Connect')}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
             </div>
        </div>
    );
};

const SettingsView: React.FC<{users: any[], onAddUser: () => void, onEditUser: (user: any) => void, onDeleteUser: (email: string) => void, onLanguageChange: (lang: any) => void}> = ({ users, onAddUser, onEditUser, onDeleteUser, onLanguageChange }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('Settings')}</h1>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t('User Management')}</h2>
                    <button onClick={onAddUser} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                       <PlusIcon className="w-5 h-5 mr-2 -ml-1"/>
                       {t('Add User')}
                    </button>
                </div>
                 <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('User Name')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Email')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Role')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {users.map((user) => (
                            <tr key={user.email}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{t(user.role)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                    <button onClick={() => onEditUser(user)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><PencilIcon className="w-4 h-4"/></button>
                                    <button onClick={() => onDeleteUser(user.email)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><TrashIcon className="w-4 h-4"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 max-w-4xl">
                 <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t('Application Preferences')}</h2>
                 <div className="mt-4">
                    <label htmlFor="language" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('Language')}</label>
                    <select
                        id="language"
                        onChange={(e) => onLanguageChange(e.target.value)}
                        defaultValue="id"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-slate-700 dark:border-slate-600 max-w-xs"
                    >
                        <option value="id">Bahasa Indonesia</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

// Simple CSV parser
const parseCSV = (csvText: string): { headers: string[]; data: TableRow[] } => {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("CSV harus memiliki setidaknya satu header dan satu baris data.");
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = lines.slice(1).map(line => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const row: TableRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
    });
    return row;
  });

  return { headers, data };
};


const DataAnalysisView: React.FC = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<TableRow[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isLoadingFile, setIsLoadingFile] = useState(false);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const resetDataState = useCallback(() => {
        setData([]);
        setHeaders([]);
        setFileName(null);
        setAnalysisResult(null);
        setError(null);
    }, []);

    const handleClearAnalysis = () => {
        setAnalysisResult(null);
    };

    const handleFileSelect = useCallback((file: File) => {
        setIsLoadingFile(true);
        setError(null);
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                if (file.name.toLowerCase().endsWith('.csv')) {
                    const { headers, data } = parseCSV(text);
                    setHeaders(headers);
                    setData(data);
                } else {
                    throw new Error("Saat ini hanya file CSV yang didukung. Dukungan Excel akan segera hadir.");
                }
            } catch (e) {
                if (e instanceof Error) {
                    setError(`Gagal memproses file: ${e.message}`);
                } else {
                    setError("Terjadi kesalahan yang tidak diketahui saat memproses file.");
                }
                resetDataState();
            } finally {
                setIsLoadingFile(false);
            }
        };
        reader.onerror = () => {
            setError("Gagal membaca file.");
            setIsLoadingFile(false);
            resetDataState();
        };
        reader.readAsText(file);
    }, [resetDataState]);

    const handleAnalyze = useCallback(async (prompt: string) => {
        if (data.length === 0 || headers.length === 0) {
            setError("Tidak ada data untuk dianalisis. Silakan unggah file terlebih dahulu.");
            return;
        }
        setIsLoadingAnalysis(true);
        setError(null);
        try {
            const result = await analyzeDataWithGemini(data, headers, prompt);
            setAnalysisResult(result);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Terjadi kesalahan tak terduga saat menganalisis data.");
            }
        } finally {
            setIsLoadingAnalysis(false);
        }
    }, [data, headers]);
    
     return (
        <>
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md relative mb-6 dark:bg-red-900/20 dark:text-red-300" role="alert">
                    <p className="font-bold">{t('An Error Occurred')}</p>
                    <p>{error}</p>
                </div>
            )}

            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-16">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">{t('Turn Data Into Insights')}</h2>
                        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">{t('Upload your CSV file to start visualizing and analyzing with AI.')}</p>
                    </div>
                    <FileUpload onFileSelect={handleFileSelect} isLoading={isLoadingFile} />
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                         <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('Data Analysis')}</h1>
                         <button onClick={resetDataState} className="text-sm font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                            <XCircleIcon className="w-5 h-5" />
                            {t('Clear Data')}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard title={t('File Name')} value={fileName || 'N/A'} color="bg-sky-100 dark:bg-sky-500/20" icon={<DocumentTextIcon className="w-6 h-6 text-sky-600 dark:text-sky-400" />} />
                        <StatCard title={t('Total Rows')} value={data.length.toLocaleString('id-ID')} color="bg-amber-100 dark:bg-amber-500/20" icon={<HashtagIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />} />
                        <StatCard title={t('Total Columns')} value={headers.length} color="bg-emerald-100 dark:bg-emerald-500/20" icon={<ViewColumnsIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />} />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                        <div className="xl:col-span-3">
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{t('Data Table')}</h2>
                            <DataTable headers={headers} data={data} />
                        </div>
                        <div className="xl:col-span-2">
                            <AnalysisPanel onAnalyze={handleAnalyze} isLoading={isLoadingAnalysis} result={analysisResult} onClear={handleClearAnalysis} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};


export default function App() {
  const { t, setLanguage } = useTranslation();
  const [activeView, setActiveView] = useState('dashboard');
  
  // --- Centralized State Management ---
  const [transactions, setTransactions] = useState(initialTransactions);
  const [sales, setSales] = useState(() => generateSalesData());
  const [inventory, setInventory] = useState(initialInventory);
  const [customers, setCustomers] = useState(initialCustomers);
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [users, setUsers] = useState(initialUsers);

  const dashboardStats = useMemo(() => {
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const thisMonthSales = sales
      .filter(sale => new Date(sale.date) >= startOfMonth)
      .reduce((sum, sale) => sum + sale.total, 0);

    return {
      totalSales,
      thisMonthSales,
      totalInventoryItems: inventory.length,
      totalCustomers: customers.length
    };
  }, [sales, inventory, customers]);


  // --- Modal and Deletion Confirmation State ---
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; content: React.ReactNode | null }>({ isOpen: false, title: '', content: null });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; onConfirm: () => void; title: string; message: string }>({ isOpen: false, onConfirm: () => {}, title: '', message: '' });

  const openModal = (title: string, content: React.ReactNode) => setModalConfig({ isOpen: true, title, content });
  const closeModal = () => setModalConfig({ isOpen: false, title: '', content: null });
  const closeDeleteConfirmation = () => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));

  // --- Data Handling Functions ---
  const handleAddTransaction = (newTransaction: any) => { setTransactions(prev => [{...newTransaction, id: prev.length + 1}, ...prev]); closeModal(); };
  
  const handleSaveSale = (saleData: any) => {
    setSales(prev => {
        const exists = prev.find(s => s.id === saleData.id);
        if (exists) {
            return prev.map(s => s.id === saleData.id ? saleData : s);
        }
        return [saleData, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    closeModal();
  };
  const handleDeleteSale = (saleId: string) => {
    setDeleteConfirmation({
        isOpen: true,
        title: t("Delete Sale"),
        message: t('Delete Sale Confirmation', { id: saleId }),
        onConfirm: () => {
            setSales(prev => prev.filter(s => s.id !== saleId));
            closeDeleteConfirmation();
        }
    });
  };

  const handleSaveInventory = (itemData: any) => {
    setInventory(prev => {
        const exists = prev.find(i => i.sku === itemData.sku);
        if (exists) {
            return prev.map(i => i.sku === itemData.sku ? itemData : i);
        }
        return [itemData, ...prev];
    });
    closeModal();
  };
   const handleDeleteInventory = (sku: string) => {
    setDeleteConfirmation({
        isOpen: true,
        title: t("Delete Inventory Item"),
        message: t('Delete Inventory Confirmation', { sku }),
        onConfirm: () => {
            setInventory(prev => prev.filter(i => i.sku !== sku));
            closeDeleteConfirmation();
        }
    });
  };

  const handleSaveCustomer = (customerData: any) => {
    setCustomers(prev => {
        const exists = prev.find(c => c.email === customerData.email && c.email !== customerData.originalEmail);
        if(exists) { alert("Email sudah digunakan!"); return prev; }

        const isUpdating = prev.some(c => c.email === (customerData.originalEmail || customerData.email));
        if (isUpdating) {
             return prev.map(c => c.email === (customerData.originalEmail || customerData.email) ? { ...customerData, email: customerData.email } : c);
        }
        return [customerData, ...prev];
    });
    closeModal();
  };
   const handleDeleteCustomer = (customerEmail: string) => {
    setDeleteConfirmation({
        isOpen: true,
        title: t("Delete Customer"),
        message: t('Delete Customer Confirmation', { email: customerEmail }),
        onConfirm: () => {
            setCustomers(prev => prev.filter(c => c.email !== customerEmail));
            closeDeleteConfirmation();
        }
    });
  };
  
  const handleAddIntegration = (newIntegration: any) => { setIntegrations(prev => [newIntegration, ...prev]); closeModal(); };
  const handleToggleIntegrationStatus = (name: string) => {
      setIntegrations(prev => prev.map(i => i.name === name ? { ...i, status: i.status === 'Terhubung' ? 'Tidak Terhubung' : 'Terhubung' } : i));
  }

  const handleSaveUser = (userData: any) => {
      setUsers(prev => {
          const isUpdating = prev.some(u => u.email === (userData.originalEmail || userData.email));
          if (isUpdating) {
              return prev.map(u => u.email === (userData.originalEmail || userData.email) ? { ...userData, email: userData.email } : u);
          }
          return [userData, ...prev];
      });
      closeModal();
  };
  const handleDeleteUser = (userEmail: string) => {
     setDeleteConfirmation({
        isOpen: true,
        title: t("Delete User"),
        message: t('Delete User Confirmation', { email: userEmail }),
        onConfirm: () => {
            setUsers(prev => prev.filter(u => u.email !== userEmail));
            closeDeleteConfirmation();
        }
    });
  };

  
  const renderContent = () => {
    switch (activeView) {
        case 'dashboard': return <DashboardView stats={dashboardStats}/>;
        case 'dataview': return <DataView transactions={transactions} onAdd={() => openModal(t('Add Transaction Data'), <AddTransactionForm onSave={handleAddTransaction} onClose={closeModal}/>)} />;
        case 'reports': return <ReportsView salesData={sales} />;
        case 'sales': return <SalesView sales={sales} onAdd={() => openModal(t('Add New Sale'), <AddSaleForm onSave={handleSaveSale} onClose={closeModal}/>)} onEdit={(sale) => openModal(t('Edit Sale'), <AddSaleForm initialData={sale} onSave={handleSaveSale} onClose={closeModal}/>)} onDelete={handleDeleteSale} />;
        case 'inventory': return <InventoryView items={inventory} onAdd={() => openModal(t('Add Inventory Item'), <AddInventoryForm onSave={handleSaveInventory} onClose={closeModal}/>)} onEdit={(item) => openModal(t('Edit Inventory Item'), <AddInventoryForm initialData={item} onSave={handleSaveInventory} onClose={closeModal}/>)} onDelete={handleDeleteInventory} />;
        case 'customers': return <CustomersView customers={customers} onAdd={() => openModal(t('Add New Customer'), <AddCustomerForm onSave={handleSaveCustomer} onClose={closeModal}/>)} onEdit={(customer) => openModal(t('Edit Customer'), <AddCustomerForm initialData={{...customer, originalEmail: customer.email}} onSave={handleSaveCustomer} onClose={closeModal}/>)} onDelete={handleDeleteCustomer} />;
        case 'integrations': return <IntegrationsView integrations={integrations} onAdd={() => openModal(t('Add New Integration'), <AddIntegrationForm onSave={handleAddIntegration} onClose={closeModal}/>)} onToggleStatus={handleToggleIntegrationStatus} />;
        case 'settings': return <SettingsView users={users} onAddUser={() => openModal(t('Add New User'), <AddUserForm onSave={handleSaveUser} onClose={closeModal}/>)} onEditUser={(user) => openModal(t('Edit User'), <AddUserForm initialData={{...user, originalEmail: user.email}} onSave={handleSaveUser} onClose={closeModal}/>)} onDeleteUser={handleDeleteUser} onLanguageChange={setLanguage} />;
        case 'data-analysis':
        default:
            return <DataAnalysisView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-slate-800 dark:text-slate-200">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm p-4 sticky top-0 z-20 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                <SparklesIcon className="w-6 h-6 mr-2 text-indigo-500"/>
                {t('ERP Mitra Usaha Makmur')}
            </h1>
        </div>
      </header>
      
      <div className="container mx-auto flex flex-col md:flex-row">
        <SideNav activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-8">
            {renderContent()}
        </main>
      </div>

      <Modal isOpen={modalConfig.isOpen} title={modalConfig.title} onClose={closeModal}>
        {modalConfig.content}
      </Modal>

       {deleteConfirmation.isOpen && (
            <Modal isOpen={true} title={deleteConfirmation.title} onClose={closeDeleteConfirmation}>
                <div className="text-slate-700 dark:text-slate-300">
                    <p>{deleteConfirmation.message}</p>
                    <div className="flex justify-end space-x-3 pt-6">
                        <button onClick={closeDeleteConfirmation} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">{t('Cancel')}</button>
                        <button onClick={deleteConfirmation.onConfirm} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">{t('Delete')}</button>
                    </div>
                </div>
            </Modal>
        )}

    </div>
  );
}
