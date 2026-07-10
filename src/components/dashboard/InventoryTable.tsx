import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  X, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  SlidersHorizontal,
  Package,
  Layers,
  MapPin,
  DollarSign,
  Check,
  AlertCircle
} from 'lucide-react';
import { InventoryItem, StockStatus } from '../../types';

// Let's create an elegant initial mock data set for a dense B2B ERP experience
const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', sku: 'PRT-9082-XM', name: 'High-Torque Actuator Servo', location: 'WH-Alpha (A-12)', stockLevel: 142, status: 'Stable', unitValue: 340.00, category: 'Robotics', quantity: 142, supplier: 'Apex Dynamics' },
  { id: '2', sku: 'PRT-3410-YL', name: 'Alloy Core Hex Coupler', location: 'WH-Alpha (C-04)', stockLevel: 12, status: 'Critical', unitValue: 45.50, category: 'Hardware', quantity: 12, supplier: 'Midwest Alloys' },
  { id: '3', sku: 'PRT-1102-ZX', name: 'Optic Fiber Transceiver Module', location: 'WH-Beta (B-09)', stockLevel: 34, status: 'Low', unitValue: 189.90, category: 'Networking', quantity: 34, supplier: 'OptiLink Corp' },
  { id: '4', sku: 'PRT-5561-AA', name: 'Liquid Coolant Heat Sink', location: 'WH-Gamma (D-02)', stockLevel: 250, status: 'Stable', unitValue: 78.00, category: 'Thermal', quantity: 250, supplier: 'CoolMaster Ltd' },
  { id: '5', sku: 'PRT-7729-BC', name: 'Proximity Sensor Probe v4', location: 'WH-Alpha (A-08)', stockLevel: 8, status: 'Critical', unitValue: 125.00, category: 'Sensors', quantity: 8, supplier: 'SensorTech' },
  { id: '6', sku: 'PRT-4430-KL', name: 'Reinforced Titanium Bracket', location: 'WH-Beta (D-15)', stockLevel: 85, status: 'Stable', unitValue: 56.20, category: 'Hardware', quantity: 85, supplier: 'TitanForge' },
  { id: '7', sku: 'PRT-1029-DR', name: 'High-Speed Logic Controller', location: 'WH-Alpha (E-11)', stockLevel: 24, status: 'Low', unitValue: 610.00, category: 'Electronics', quantity: 24, supplier: 'MicroLogic' },
  { id: '8', sku: 'PRT-6650-ST', name: 'Sub-Zero Pressure Valve', location: 'WH-Gamma (F-07)', stockLevel: 110, status: 'Stable', unitValue: 420.00, category: 'Valves', quantity: 110, supplier: 'FlowControl LLC' },
  { id: '9', sku: 'PRT-8891-EF', name: 'Pneumatic Feed Cylinder', location: 'WH-Beta (A-03)', stockLevel: 15, status: 'Low', unitValue: 275.00, category: 'Pneumatics', quantity: 15, supplier: 'AeroFluid' },
  { id: '10', sku: 'PRT-2204-GH', name: 'Brushless Micro Motor', location: 'WH-Alpha (B-14)', stockLevel: 180, status: 'Stable', unitValue: 95.00, category: 'Robotics', quantity: 180, supplier: 'Apex Dynamics' }
];

interface InventoryTableProps {
  items?: InventoryItem[];
  onItemsChange?: (items: InventoryItem[]) => void;
}

export default function InventoryTable({ items: externalItems, onItemsChange }: InventoryTableProps) {
  // Use state if external props aren't provided
  const [internalItems, setInternalItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const itemsList = externalItems || internalItems;

  const updateItems = (newItems: InventoryItem[]) => {
    if (onItemsChange) {
      onItemsChange(newItems);
    } else {
      setInternalItems(newItems);
    }
  };

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'sku' | 'name' | 'stockLevel' | 'unitValue'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Checkbox Row Selection States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchStatus, setBatchStatus] = useState<StockStatus | 'NoChange'>('NoChange');
  const [batchLocation, setBatchLocation] = useState('');

  const handleBatchApply = () => {
    if (batchStatus === 'NoChange' && !batchLocation.trim()) {
      return;
    }

    const updated = itemsList.map(item => {
      if (selectedIds.includes(item.id)) {
        return {
          ...item,
          status: batchStatus !== 'NoChange' ? batchStatus : item.status,
          location: batchLocation.trim() !== '' ? batchLocation : item.location,
        };
      }
      return item;
    });

    updateItems(updated);
    setSelectedIds([]); // Clear selection after apply
    setBatchStatus('NoChange');
    setBatchLocation('');
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
    setBatchStatus('NoChange');
    setBatchLocation('');
  };

  // Add Asset Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<InventoryItem>>({
    sku: '',
    name: '',
    location: '',
    stockLevel: 10,
    status: 'Stable',
    unitValue: 100.00,
    category: '',
    supplier: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Handle Asset Create Submission
  const handleAddAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!newAsset.sku) errors.sku = 'SKU is required';
    if (!newAsset.name) errors.name = 'Item Name is required';
    if (!newAsset.location) errors.location = 'Location is required';
    if (newAsset.stockLevel === undefined || newAsset.stockLevel < 0) errors.stockLevel = 'Invalid stock quantity';
    if (newAsset.unitValue === undefined || newAsset.unitValue < 0) errors.unitValue = 'Invalid unit value';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Determine status from stock level if not manually adjusted
    let status: StockStatus = 'Stable';
    const stock = Number(newAsset.stockLevel);
    if (stock <= 10) status = 'Critical';
    else if (stock <= 40) status = 'Low';

    const createdItem: InventoryItem = {
      id: Date.now().toString(),
      sku: newAsset.sku!.toUpperCase(),
      name: newAsset.name!,
      location: newAsset.location!,
      stockLevel: stock,
      status: status,
      unitValue: Number(newAsset.unitValue),
      category: newAsset.category || 'Hardware',
      quantity: stock,
      supplier: newAsset.supplier || 'Standard Vendor'
    };

    updateItems([createdItem, ...itemsList]);
    
    // Reset form and close
    setNewAsset({
      sku: '',
      name: '',
      location: '',
      stockLevel: 10,
      status: 'Stable',
      unitValue: 100.00,
      category: '',
      supplier: ''
    });
    setFormErrors({});
    setIsDrawerOpen(false);
  };

  // Sort function
  const handleSort = (column: 'sku' | 'name' | 'stockLevel' | 'unitValue') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Filtering Logic
  const filteredAndSortedItems = useMemo(() => {
    let result = [...itemsList];

    // Search query filter
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        item => 
          item.name.toLowerCase().includes(query) || 
          item.sku.toLowerCase().includes(query) || 
          item.location.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    // Status category filter
    if (statusFilter !== 'All') {
      result = result.filter(item => item.status === statusFilter);
    }

    // Sort execution
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === 'string') {
        aVal = (aVal as string).toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [itemsList, searchTerm, statusFilter, sortBy, sortDirection]);

  // Paginated Slicing
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedItems, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage) || 1;

  // Custom Status Badge Renderer
  const renderStatusBadge = (status: StockStatus) => {
    const styles = {
      Stable: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      Low: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/85 rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.65)] transition-all duration-300" id="inventory-table-container">
      {/* Decorative ambient glowing backdrops for the glass look */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Controller Ribbon */}
      <div className="p-5 border-b border-slate-800/80 flex flex-col xl:flex-row gap-4 items-center justify-between bg-slate-950/40 backdrop-blur-md relative z-10">
        <div className="flex flex-col gap-1 w-full xl:w-auto">
          <h3 className="text-sm font-semibold text-slate-100 tracking-tight flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <Package className="w-4 h-4" />
            </div>
            Asset & Spare Parts Inventory
          </h3>
          <p className="text-xs text-slate-400">Manage real-time supply logistics, SKU tracking, and inventory levels.</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by SKU, Name, WH..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page to 1
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/70 border border-slate-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs rounded-lg text-slate-200 placeholder-slate-500 outline-none transition-all duration-200 backdrop-blur-sm"
              id="global-inventory-search"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Status Dropdown Filter */}
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StockStatus | 'All');
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto appearance-none pl-8 pr-10 py-2 bg-slate-950/70 border border-slate-800/80 focus:border-indigo-500 text-xs rounded-lg text-slate-200 outline-none transition-all duration-200 cursor-pointer backdrop-blur-sm"
              id="inventory-status-dropdown"
            >
              <option value="All">All Statuses</option>
              <option value="Stable">Stable</option>
              <option value="Low">Low</option>
              <option value="Critical">Critical</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <div className="absolute right-3.5 top-3.5 pointer-events-none w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-400"></div>
          </div>

          {/* Export Action */}
          <button 
            title="Export Data"
            className="p-2 bg-slate-950/70 hover:bg-slate-800 text-slate-300 border border-slate-800/80 hover:border-slate-700 rounded-lg transition-all text-xs flex items-center gap-1 backdrop-blur-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">CSV</span>
          </button>

          {/* Add Asset Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-xs rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:scale-[1.02] active:scale-[0.98]"
            id="add-asset-button"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Main Dense Table */}
      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider select-none">
              {/* Checkbox column header */}
              <th className="py-3 px-4 w-[5%] text-center">
                <div className="flex items-center justify-center">
                  <label className="relative flex items-center justify-center cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={paginatedItems.length > 0 && paginatedItems.every(item => selectedIds.includes(item.id))}
                      onChange={() => {
                        const allInPageSelected = paginatedItems.every(item => selectedIds.includes(item.id));
                        if (allInPageSelected) {
                          const pageIds = paginatedItems.map(item => item.id);
                          setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
                        } else {
                          const pageIds = paginatedItems.map(item => item.id);
                          setSelectedIds(prev => {
                            const newIds = [...prev];
                            pageIds.forEach(id => {
                              if (!newIds.includes(id)) newIds.push(id);
                            });
                            return newIds;
                          });
                        }
                      }}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                      paginatedItems.length > 0 && paginatedItems.every(item => selectedIds.includes(item.id))
                        ? 'bg-indigo-500 border-indigo-400 text-slate-100 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                        : 'bg-slate-950/80 border-slate-700 hover:border-slate-500 text-transparent'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </label>
                </div>
              </th>

              <th className="py-3 px-4 w-[13%] cursor-pointer hover:bg-slate-900/40 transition-colors" onClick={() => handleSort('sku')}>
                <div className="flex items-center gap-1">
                  SKU / Part No.
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 w-[32%] cursor-pointer hover:bg-slate-900/40 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Item / Asset Specification
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 w-[18%]">Warehouse Location</th>
              <th className="py-3 px-4 w-[11%] cursor-pointer hover:bg-slate-900/40 transition-colors" onClick={() => handleSort('stockLevel')}>
                <div className="flex items-center gap-1">
                  Levels
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 w-[11%]">Status</th>
              <th className="py-3 px-4 w-[10%] cursor-pointer hover:bg-slate-900/40 transition-colors" onClick={() => handleSort('unitValue')}>
                <div className="flex items-center gap-1">
                  Unit Val (USD)
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item) => (
                <tr 
                  key={item.id} 
                  className={`transition-all duration-150 border-b border-slate-800/40 text-xs ${
                    selectedIds.includes(item.id) 
                      ? 'bg-indigo-500/10 hover:bg-indigo-500/15' 
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  {/* Row Checkbox */}
                  <td className="py-2.5 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <label className="relative flex items-center justify-center cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => {
                            setSelectedIds(prev => 
                              prev.includes(item.id)
                                ? prev.filter(id => id !== item.id)
                                : [...prev, item.id]
                            );
                          }}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                          selectedIds.includes(item.id)
                            ? 'bg-indigo-500 border-indigo-400 text-slate-100 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                            : 'bg-slate-950/80 border-slate-700 hover:border-slate-500 text-transparent'
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </label>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-2.5 px-4 font-mono text-[11px] font-medium text-slate-300">
                    {item.sku}
                  </td>
                  {/* Item Description */}
                  <td className="py-2.5 px-4 font-medium text-slate-200">
                    <div className="flex flex-col">
                      <span className="truncate max-w-[280px]">{item.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{item.category} • supplied by {item.supplier}</span>
                    </div>
                  </td>
                  {/* Location */}
                  <td className="py-2.5 px-4 text-slate-300 font-normal">
                    <div className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </td>
                  {/* Stock Level */}
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-300 text-right pr-8">
                    {item.stockLevel} units
                  </td>
                  {/* Status */}
                  <td className="py-2.5 px-4">
                    {renderStatusBadge(item.status)}
                  </td>
                  {/* Unit Value */}
                  <td className="py-2.5 px-4 font-mono text-right pr-6 font-semibold text-emerald-400">
                    ${item.unitValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                    <SlidersHorizontal className="w-8 h-8 text-slate-600 animate-pulse" />
                    <p className="text-xs">No assets match the current filter parameters.</p>
                    <button 
                      onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                      className="text-indigo-400 text-xs hover:underline mt-1"
                    >
                      Clear search filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Bulk Batch Actions Apple Glass Panel */}
      {selectedIds.length > 0 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 w-[92%] sm:w-auto min-w-[300px] md:min-w-[580px] bg-slate-950/90 backdrop-blur-xl border border-indigo-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(99,102,241,0.2)] rounded-2xl p-4 md:py-3 md:px-5 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-8 duration-300 ease-out">
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center justify-center w-5.5 h-5.5 rounded-full bg-indigo-500 text-slate-100 text-[11px] font-bold shadow-[0_0_12px_rgba(99,102,241,0.5)]">
              {selectedIds.length}
            </span>
            <div className="text-left">
              <p className="text-[11px] font-bold text-slate-100 tracking-tight">Batch Actions Menu</p>
              <p className="text-[10px] text-slate-400">Update selected parts in bulk</p>
            </div>
          </div>
          
          <div className="hidden md:block w-[1px] h-8 bg-slate-800" />

          {/* Input & Action controls */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            {/* New Location Input */}
            <div className="relative w-full sm:w-36">
              <MapPin className="absolute left-2 top-2.5 h-3 w-3 text-slate-500" />
              <input 
                type="text" 
                placeholder="New Location..." 
                value={batchLocation}
                onChange={(e) => setBatchLocation(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 bg-slate-950 border border-slate-800 text-[11px] rounded-lg text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all duration-200"
              />
            </div>

            {/* New Status Select */}
            <div className="relative w-full sm:w-36">
              <select
                value={batchStatus}
                onChange={(e) => setBatchStatus(e.target.value as StockStatus | 'NoChange')}
                className="w-full appearance-none pl-3 pr-8 py-1.5 bg-slate-950 border border-slate-800 text-[11px] rounded-lg text-slate-200 outline-none transition-all duration-200 cursor-pointer"
              >
                <option value="NoChange">Status: No Change</option>
                <option value="Stable">Stable</option>
                <option value="Low">Low</option>
                <option value="Critical">Critical</option>
              </select>
              <div className="absolute right-2.5 top-3.5 pointer-events-none w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-400"></div>
            </div>

            {/* Submit / Cancel Button Row */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              <button
                onClick={handleBatchApply}
                disabled={batchStatus === 'NoChange' && !batchLocation.trim()}
                className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-[11px] rounded-lg transition-all duration-200 shadow-[0_0_12px_rgba(99,102,241,0.25)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Apply
              </button>
              <button
                onClick={handleClearSelection}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] rounded-lg transition-colors border border-slate-800/80"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer & Pagination */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <span className="text-[11px] text-slate-500">
          Showing <strong className="text-slate-300">{filteredAndSortedItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to{' '}
          <strong className="text-slate-300">
            {Math.min(currentPage * itemsPerPage, filteredAndSortedItems.length)}
          </strong>{' '}
          of <strong className="text-slate-300">{filteredAndSortedItems.length}</strong> items in registry
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 bg-slate-900 border border-slate-800 rounded-md text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none hover:text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium px-2">
            Page <span className="text-slate-200 ml-1">{currentPage}</span> of <span>{totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 bg-slate-900 border border-slate-800 rounded-md text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none hover:text-slate-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Premium Add Asset Form Drawer Modal (Slide-over overlay) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="add-asset-drawer-backdrop">
          {/* Backdrop Blur */}
          <div 
            onClick={() => setIsDrawerOpen(false)} 
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 z-10">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Register New Asset</h4>
                  <p className="text-[11px] text-slate-500">Record part numbers to standard ledger</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleAddAssetSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* SKU & Category Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    SKU / Part Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PRT-1022-XM"
                    value={newAsset.sku}
                    onChange={(e) => setNewAsset({...newAsset, sku: e.target.value})}
                    className={`w-full px-3 py-2 bg-slate-950 border ${formErrors.sku ? 'border-rose-500' : 'border-slate-800'} text-xs text-slate-200 placeholder-slate-600 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none`}
                  />
                  {formErrors.sku && <p className="text-[10px] text-rose-500 mt-1">{formErrors.sku}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Asset Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Robotics, Sensors"
                    value={newAsset.category}
                    onChange={(e) => setNewAsset({...newAsset, category: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Asset Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Asset / Part Specification <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brushless Servo Motor v2"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-950 border ${formErrors.name ? 'border-rose-500' : 'border-slate-800'} text-xs text-slate-200 placeholder-slate-600 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none`}
                />
                {formErrors.name && <p className="text-[10px] text-rose-500 mt-1">{formErrors.name}</p>}
              </div>

              {/* Warehouse Location */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Warehouse Location & Bay <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. WH-Alpha (Bay-04)"
                    value={newAsset.location}
                    onChange={(e) => setNewAsset({...newAsset, location: e.target.value})}
                    className={`w-full pl-8 pr-3 py-2 bg-slate-950 border ${formErrors.location ? 'border-rose-500' : 'border-slate-800'} text-xs text-slate-200 placeholder-slate-600 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none`}
                  />
                </div>
                {formErrors.location && <p className="text-[10px] text-rose-500 mt-1">{formErrors.location}</p>}
              </div>

              {/* Stock Quantity & Unit Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Initial Stock Level <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="number"
                      min="0"
                      required
                      value={newAsset.stockLevel === undefined ? '' : newAsset.stockLevel}
                      onChange={(e) => setNewAsset({...newAsset, stockLevel: e.target.value !== '' ? Number(e.target.value) : undefined})}
                      className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Unit Value (USD) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={newAsset.unitValue === undefined ? '' : newAsset.unitValue}
                      onChange={(e) => setNewAsset({...newAsset, unitValue: e.target.value !== '' ? Number(e.target.value) : undefined})}
                      className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Supplier & Vendor Info */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Primary Vendor / Supplier
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Dynamics Ltd."
                  value={newAsset.supplier}
                  onChange={(e) => setNewAsset({...newAsset, supplier: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Guidelines helper card */}
              <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Automatic Assessment Ledger</span>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Assets under 10 units are automatically assessed as <span className="text-rose-400">Critical</span> status. Stock under 40 units is set to <span className="text-amber-400">Low</span> status. Everything else is compiled as <span className="text-emerald-400">Stable</span>.
                </p>
              </div>
            </form>

            {/* Form footer actions */}
            <div className="p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAssetSubmit}
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-md shadow-emerald-950/20"
              >
                Save Asset to Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
