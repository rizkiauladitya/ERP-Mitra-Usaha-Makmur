// services/mockDataService.ts

// --- Helper Function for Dates ---
const createDate = (monthOffset: number, day: number): string => {
  const date = new Date();
  // Set to noon to avoid timezone issues
  date.setHours(12, 0, 0, 0);
  date.setMonth(date.getMonth() - monthOffset);
  date.setDate(day);
  return date.toISOString().split('T')[0];
};


// --- 10 Customers ---
export const initialCustomers = [
  { name: 'Pak Budi', email: 'pak.budi@example.com', contact: '081234567890', address: 'Jl. Merdeka No. 1, Jakarta', history: '5 Transaksi' },
  { name: 'Bu Siti', email: 'bu.siti@example.com', contact: '081876543210', address: 'Jl. Pahlawan No. 2, Surabaya', history: '8 Transaksi' },
  { name: 'Toko Jaya', email: 'info@tokojaya.com', contact: '021-555-1111', address: 'Pasar Baru Blok B No. 3, Jakarta', history: '12 Transaksi' },
  { name: 'Toko Laris', email: 'laris@toko.com', contact: '085611112222', address: 'Jl. Kenanga No. 4, Bandung', history: '10 Transaksi' },
  { name: 'Warung Amanah', email: 'amanah.warung@example.com', contact: '081333334444', address: 'Jl. Gajah Mada No. 5, Semarang', history: '7 Transaksi' },
  { name: 'Adi Santoso', email: 'adi.santoso@example.com', contact: '087855556666', address: 'Jl. Melati No. 6, Yogyakarta', history: '3 Transaksi' },
  { name: 'CV Berkah', email: 'cv.berkah@example.com', contact: '031-888-2222', address: 'Komp. Ruko Sejahtera, Surabaya', history: '9 Transaksi' },
  { name: 'Resto Padang Nikmat', email: 'padang.nikmat@example.com', contact: '022-444-3333', address: 'Jl. Sudirman No. 7, Bandung', history: '11 Transaksi' },
  { name: 'Eka Putri', email: 'eka.putri@example.com', contact: '081999990000', address: 'Jl. Mawar No. 8, Denpasar', history: '2 Transaksi' },
  { name: 'Kantin Sekolah Ceria', email: 'kantin.ceria@example.com', contact: '081212121212', address: 'Jl. Pendidikan No. 9, Jakarta', history: '15 Transaksi' },
];

// --- 10 Inventory Items ---
export const initialInventory = [
  { name: 'Beras Rojolele 5kg', sku: 'BRS-RJ-5K', stock: 50, location: 'Rak A-1', price: 65000 },
  { name: 'Gula Pasir 1kg', sku: 'GLA-PS-1K', stock: 120, location: 'Rak A-2', price: 15000 },
  { name: 'Minyak Goreng Sania 2L', sku: 'MYK-SN-2L', stock: 80, location: 'Rak A-3', price: 35000 },
  { name: 'Kopi Kapal Api Special 165g', sku: 'KPI-KA-165', stock: 200, location: 'Rak C-1', price: 13000 },
  { name: 'Sabun Lifebuoy Total 10', sku: 'SBN-LB-T10', stock: 250, location: 'Rak B-1', price: 4500 },
  { name: 'Teh Celup Sariwangi', sku: 'TEH-SW-BOX', stock: 150, location: 'Rak C-2', price: 6000 },
  { name: 'Indomie Goreng Satuan', sku: 'MIE-IG-PCS', stock: 300, location: 'Rak C-3', price: 3000 },
  { name: 'Air Mineral Aqua 600ml', sku: 'AIR-AQ-600', stock: 280, location: 'Rak D-1', price: 3500 },
  { name: 'Kecap Manis ABC 520ml', sku: 'KCP-AC-520', stock: 90, location: 'Rak A-4', price: 20000 },
  { name: 'Gudang Garam Surya 12', sku: 'RKK-GG-S12', stock: 100, location: 'Kasir', price: 25000 },
];

// --- 10 Sales Transactions ---
// This function now returns a static, consistent list of sales data.
export const generateSalesData = () => {
    // Current month sales (4 transactions)
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const salesData = [
      { id: `INV-${currentYear}${String(currentMonth).padStart(2, '0')}001`, customer: 'Toko Jaya', date: createDate(0, 2), total: 1250000, status: 'Lunas' },
      { id: `INV-${currentYear}${String(currentMonth).padStart(2, '0')}002`, customer: 'Bu Siti', date: createDate(0, 5), total: 350000, status: 'Lunas' },
      { id: `INV-${currentYear}${String(currentMonth).padStart(2, '0')}003`, customer: 'Kantin Sekolah Ceria', date: createDate(0, 10), total: 780000, status: 'Belum Lunas' },
      { id: `INV-${currentYear}${String(currentMonth).padStart(2, '0')}004`, customer: 'Toko Laris', date: createDate(0, 15), total: 2100000, status: 'Lunas' },
      
      // Previous month sales (3 transactions)
      { id: `INV-${currentYear}${String(currentMonth - 1).padStart(2, '0')}005`, customer: 'Resto Padang Nikmat', date: createDate(1, 8), total: 4500000, status: 'Lunas' },
      { id: `INV-${currentYear}${String(currentMonth - 1).padStart(2, '0')}006`, customer: 'Pak Budi', date: createDate(1, 18), total: 150000, status: 'Lunas' },
      { id: `INV-${currentYear}${String(currentMonth - 1).padStart(2, '0')}007`, customer: 'CV Berkah', date: createDate(1, 25), total: 3200000, status: 'Lunas' },

      // Two months ago sales (3 transactions)
      { id: `INV-${currentYear}${String(currentMonth - 2).padStart(2, '0')}008`, customer: 'Warung Amanah', date: createDate(2, 12), total: 950000, status: 'Lunas' },
      { id: `INV-${currentYear}${String(currentMonth - 2).padStart(2, '0')}009`, customer: 'Toko Jaya', date: createDate(2, 20), total: 1800000, status: 'Lunas' },
      { id: `INV-${currentYear}${String(currentMonth - 2).padStart(2, '0')}010`, customer: 'Adi Santoso', date: createDate(2, 28), total: 80000, status: 'Belum Lunas' },
    ];
    return salesData.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// --- System Data (can remain as is) ---
export const initialIntegrations = [
    { name: 'Sistem Akuntansi ABC', type: 'Akuntansi', status: 'Terhubung', description: 'Sinkronisasi faktur dan pembayaran secara otomatis.' },
    { name: 'Payment Gateway XYZ', type: 'Payment Gateway', status: 'Terhubung', description: 'Terima pembayaran online melalui berbagai metode.' },
    { name: 'Layanan Logistik JNE', type: 'Logistik', status: 'Tidak Terhubung', description: 'Lacak pengiriman dan perbarui status pesanan.' },
];

export const initialUsers = [
    { name: 'Admin ERP', email: 'admin@mitrausahamakmur.com', role: 'Admin' },
    { name: 'Budi Hartono', email: 'budi.hartono@mitrausahamakmur.com', role: 'Manajer' },
    { name: 'Citra Dewi', email: 'citra.dewi@mitrausahamakmur.com', role: 'Staf' },
];

// --- Simplified Transaction Log ---
export const initialTransactions = [
    { id: 1, date: createDate(0, 15), item: "Minyak Goreng Sania 2L", quantity: 20, price: "35000", customer: "Toko Laris" },
    { id: 2, date: createDate(0, 10), item: "Indomie Goreng Satuan", quantity: 120, price: "3000", customer: "Kantin Sekolah Ceria" },
    { id: 3, date: createDate(1, 25), item: "Beras Rojolele 5kg", quantity: 30, price: "65000", customer: "CV Berkah" },
];
