
import React, { createContext, useState, useContext, FC, ReactNode } from 'react';

type Language = 'id' | 'en';

// Using English as keys for simplicity
const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    'Save': 'Save',
    'Edit': 'Edit',
    'Delete': 'Delete',
    'Cancel': 'Cancel',
    'Add': 'Add',
    'Actions': 'Actions',
    'Status': 'Status',
    'Close': 'Close',
    'Total': 'Total',

    // Sidenav
    'Main Menu': 'Main Menu',
    'Dashboard': 'Dashboard',
    'Data View': 'Data View',
    'Data Analysis': 'Data Analysis',
    'Reports': 'Reports',
    'Management': 'Management',
    'Sales': 'Sales',
    'Inventory': 'Inventory',
    'Customers': 'Customers',
    'System': 'System',
    'Integrations': 'Integrations',
    'Settings': 'Settings',

    // Header
    'ERP Mitra Usaha Makmur': 'Prosperous Partner Business ERP',

    // Dashboard
    'Total Sales': 'Total Sales',
    'Inventory Items': 'Inventory Items',
    'Total Customers': 'Total Customers',
    'Sales This Month': 'Sales This Month',
    'AI Insights': 'AI Insights',
    'Insight 1': "Sales of 'Minyak Goreng Sania 2L' increased by 25% this month, consider restocking.",
    'Insight 2': "Customer 'Bu Siti' has the highest average order value.",
    'Insight 3': "Stock of 'Indomie Goreng Satuan' will run out in 2 weeks based on current sales trends.",

    // Data View
    'Transaction Data View': 'Transaction Data View',
    'Add Data': 'Add Data',
    'Date': 'Date',
    'Item': 'Item',
    'Quantity': 'Quantity',
    'Price': 'Price',
    'Customer': 'Customer',
    
    // Reports
    'Sales Reports': 'Sales Reports',
    'Period': 'Period',
    'This Month': 'This Month',
    'Last 3 Months': 'Last 3 Months',
    'This Year': 'This Year',
    'Category': 'Category',
    'All Products': 'All Products',
    'Food': 'Food',
    'Beverages': 'Beverages',
    'Household Needs': 'Household Needs',
    'From Date': 'From Date',
    'To Date': 'To Date',
    'Sales Trend': 'Sales Trend',

    // Sales View
    'Add Sale': 'Add Sale',
    'Invoice ID': 'Invoice ID',
    'Paid': 'Paid',
    'Unpaid': 'Unpaid',

    // Inventory View
    'Add Inventory': 'Add Inventory',
    'Item Name': 'Item Name',
    'SKU': 'SKU',
    'Stock Quantity': 'Stock Quantity',
    'Location': 'Location',

    // Customers View
    'Add Customer': 'Add Customer',
    'Transaction History': 'Transaction History',

    // Integrations View
    'Add Integration': 'Add Integration',
    'Connect': 'Connect',
    'Disconnect': 'Disconnect',
    'Connected': 'Connected',
    'Not Connected': 'Not Connected',

    // Settings View
    'User Management': 'User Management',
    'Add User': 'Add User',
    'User Name': 'User Name',
    'Email': 'Email',
    'Role': 'Role',
    'Admin': 'Admin',
    'Manager': 'Manager',
    'Staff': 'Staff',
    'Application Preferences': 'Application Preferences',
    'Language': 'Language',
    
    // Modals & Forms
    'Save Changes': 'Save Changes',
    'Add Transaction Data': 'Add Transaction Data',
    'Add New Sale': 'Add New Sale',
    'Edit Sale': 'Edit Sale',
    'Add Inventory Item': 'Add Inventory Item',
    'Edit Inventory Item': 'Edit Inventory Item',
    'Add New Customer': 'Add New Customer',
    'Edit Customer': 'Edit Customer',
    'Add New Integration': 'Add New Integration',
    'Add New User': 'Add New User',
    'Edit User': 'Edit User',
    'Delete Sale': 'Delete Sale',
    'Delete Sale Confirmation': 'Are you sure you want to delete sale with Invoice ID {id}?',
    'Delete Inventory Item': 'Delete Inventory Item',
    'Delete Inventory Confirmation': 'Are you sure you want to delete item with SKU {sku}?',
    'Delete Customer': 'Delete Customer',
    'Delete Customer Confirmation': 'Are you sure you want to delete customer with email {email}?',
    'Delete User': 'Delete User',
    'Delete User Confirmation': 'Are you sure you want to delete user with email {email}?',
    
    // Data Analysis View
    'Turn Data Into Insights': 'Turn Data Into Insights',
    'Upload your CSV file to start visualizing and analyzing with AI.': 'Upload your CSV file to start visualizing and analyzing with AI.',
    'Clear Data': 'Clear Data',
    'File Name': 'File Name',
    'Total Rows': 'Total Rows',
    'Total Columns': 'Total Columns',
    'Data Table': 'Data Table',
    'AI Analysis Panel': 'AI Analysis Panel',
    'Ask a question about your data:': 'Ask a question about your data:',
    'Example: What were the total sales last month?': 'Example: What were the total sales last month?',
    'Or try one of these:': 'Or try one of these:',
    'Provide a brief summary': 'Provide a brief summary',
    'What are the main trends?': 'What are the main trends?',
    'Identify anomalies': 'Identify anomalies',
    'Provide suggestions': 'Provide suggestions',
    'Analyze...': 'Analyzing...',
    'Get Insights': 'Get Insights',
    'Analysis Result:': 'Analysis Result:',
    'Clear': 'Clear',
    'AI is thinking...': 'AI is thinking...',
    'Loading...': 'Loading...',
    'Processing file...': 'Processing file...',
    
    // File Upload
    'Click to upload': 'Click to upload',
    'or drag and drop': 'or drag and drop',
    'CSV or Excel': 'CSV or Excel',
    
    // Errors
    'An Error Occurred': 'An Error Occurred',

  },
  id: {
    // General
    'Save': 'Simpan',
    'Edit': 'Ubah',
    'Delete': 'Hapus',
    'Cancel': 'Batal',
    'Add': 'Tambah',
    'Actions': 'Aksi',
    'Status': 'Status',
    'Close': 'Tutup',
    'Total': 'Total',

    // Sidenav
    'Main Menu': 'Menu Utama',
    'Dashboard': 'Dashboard',
    'Data View': 'Tampilan Data',
    'Data Analysis': 'Analisis Data',
    'Reports': 'Laporan',
    'Management': 'Manajemen',
    'Sales': 'Penjualan',
    'Inventory': 'Inventaris',
    'Customers': 'Pelanggan',
    'System': 'Sistem',
    'Integrations': 'Integrasi',
    'Settings': 'Pengaturan',

    // Header
    'ERP Mitra Usaha Makmur': 'ERP Mitra Usaha Makmur',
    
    // Dashboard
    'Total Sales': 'Total Penjualan',
    'Inventory Items': 'Item Inventaris',
    'Total Customers': 'Total Pelanggan',
    'Sales This Month': 'Penjualan Bulan Ini',
    'AI Insights': 'Wawasan AI',
    'Insight 1': "Penjualan 'Minyak Goreng Sania 2L' meningkat 25% bulan ini, pertimbangkan untuk menambah stok.",
    'Insight 2': "Pelanggan 'Bu Siti' memiliki nilai pesanan rata-rata tertinggi.",
    'Insight 3': "Stok 'Indomie Goreng Satuan' akan habis dalam 2 minggu berdasarkan tren penjualan saat ini.",
    
    // Data View
    'Transaction Data View': 'Tampilan Data Transaksi',
    'Add Data': 'Tambah Data',
    'Date': 'Tanggal',
    'Item': 'Item',
    'Quantity': 'Kuantitas',
    'Price': 'Harga',
    'Customer': 'Pelanggan',

    // Reports
    'Sales Reports': 'Laporan Penjualan',
    'Period': 'Periode',
    'This Month': 'Bulan Ini',
    'Last 3 Months': '3 Bulan Terakhir',
    'This Year': 'Tahun Ini',
    'Category': 'Kategori',
    'All Products': 'Semua Produk',
    'Food': 'Makanan',
    'Beverages': 'Minuman',
    'Household Needs': 'Kebutuhan Rumah Tangga',
    'From Date': 'Dari Tanggal',
    'To Date': 'Sampai Tanggal',
    'Sales Trend': 'Tren Penjualan',
    
    // Sales View
    'Add Sale': 'Tambah Penjualan',
    'Invoice ID': 'Invoice ID',
    'Paid': 'Lunas',
    'Unpaid': 'Belum Lunas',

    // Inventory View
    'Add Inventory': 'Tambah Inventaris',
    'Item Name': 'Nama Barang',
    'SKU': 'SKU',
    'Stock Quantity': 'Jumlah Stok',
    'Location': 'Lokasi',
    
    // Customers View
    'Add Customer': 'Tambah Pelanggan',
    'Transaction History': 'Riwayat Transaksi',

    // Integrations View
    'Add Integration': 'Tambah Integrasi',
    'Connect': 'Hubungkan',
    'Disconnect': 'Putuskan',
    'Connected': 'Terhubung',
    'Not Connected': 'Tidak Terhubung',

    // Settings View
    'User Management': 'Manajemen Pengguna',
    'Add User': 'Tambah Pengguna',
    'User Name': 'Nama Pengguna',
    'Email': 'Email',
    'Role': 'Role',
    'Admin': 'Admin',
    'Manager': 'Manajer',
    'Staff': 'Staf',
    'Application Preferences': 'Preferensi Aplikasi',
    'Language': 'Bahasa',
    
    // Modals & Forms
    'Save Changes': 'Simpan Perubahan',
    'Add Transaction Data': 'Tambah Data Transaksi',
    'Add New Sale': 'Tambah Penjualan Baru',
    'Edit Sale': 'Edit Penjualan',
    'Add Inventory Item': 'Tambah Item Inventaris',
    'Edit Inventory Item': 'Edit Item Inventaris',
    'Add New Customer': 'Tambah Pelanggan Baru',
    'Edit Customer': 'Edit Pelanggan',
    'Add New Integration': 'Tambah Integrasi Baru',
    'Add New User': 'Tambah Pengguna Baru',
    'Edit User': 'Edit Pengguna',
    'Delete Sale': 'Hapus Penjualan',
    'Delete Sale Confirmation': 'Apakah Anda yakin ingin menghapus penjualan dengan Invoice ID {id}?',
    'Delete Inventory Item': 'Hapus Item Inventaris',
    'Delete Inventory Confirmation': 'Apakah Anda yakin ingin menghapus item dengan SKU {sku}?',
    'Delete Customer': 'Hapus Pelanggan',
    'Delete Customer Confirmation': 'Apakah Anda yakin ingin menghapus pelanggan dengan email {email}?',
    'Delete User': 'Hapus Pengguna',
    'Delete User Confirmation': 'Apakah Anda yakin ingin menghapus pengguna dengan email {email}?',

    // Data Analysis View
    'Turn Data Into Insights': 'Ubah Data Menjadi Wawasan',
    'Upload your CSV file to start visualizing and analyzing with AI.': 'Unggah file CSV Anda untuk memulai visualisasi dan analisis dengan AI.',
    'Clear Data': 'Hapus Data',
    'File Name': 'Nama File',
    'Total Rows': 'Total Baris',
    'Total Columns': 'Total Kolom',
    'Data Table': 'Tabel Data',
    'AI Analysis Panel': 'Panel Analisis AI',
    'Ask a question about your data:': 'Ajukan pertanyaan tentang data Anda:',
    'Example: What were the total sales last month?': 'Contoh: Berapa total penjualan bulan lalu?',
    'Or try one of these:': 'Atau coba salah satu dari ini:',
    'Provide a brief summary': 'Berikan ringkasan singkat',
    'What are the main trends?': 'Apa tren utama?',
    'Identify anomalies': 'Identifikasi anomali',
    'Provide suggestions': 'Berikan saran',
    'Analyze...': 'Menganalisis...',
    'Get Insights': 'Dapatkan Wawasan',
    'Analysis Result:': 'Hasil Analisis:',
    'Clear': 'Hapus',
    'AI is thinking...': 'AI sedang berpikir...',
    'Loading...': 'Memuat...',
    'Processing file...': 'Memproses file...',

    // File Upload
    'Click to upload': 'Klik untuk mengunggah',
    'or drag and drop': 'atau seret dan lepas',
    'CSV or Excel': 'CSV atau Excel',
    
    // Errors
    'An Error Occurred': 'Terjadi Kesalahan',
  },
};


interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = (translations[language] && translations[language][key]) || (translations['id'] && translations['id'][key]) || key;
    if (params) {
        Object.keys(params).forEach(pKey => {
            translation = translation.replace(`{${pKey}}`, String(params[pKey]));
        });
    }
    return translation;
  };

  // FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension.
  // JSX syntax was causing parsing errors.
  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
