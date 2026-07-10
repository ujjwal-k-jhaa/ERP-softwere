import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Send, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  UserPlus, 
  Sliders, 
  Plus, 
  Factory, 
  Cpu, 
  Wrench, 
  Database, 
  Save, 
  Key,
  Globe,
  BellRing,
  Settings as SettingsIcon
} from 'lucide-react';
import { PayrollRecord, WorkOrder, Workspace } from '../../types';

// ==========================================
// 1. FINANCE & GENERAL LEDGER VIEW
// ==========================================
export function FinanceView() {
  const [ledgerPostings, setLedgerPostings] = useState([
    { id: 'TX-9081', desc: 'SaaS licensing ARR - Acme Corp', type: 'Credit', amount: 48000, account: '1010-Cash Assets', status: 'Settled' },
    { id: 'TX-9082', desc: 'Titanium alloy raw supply logistics', type: 'Debit', amount: 12400, account: '2100-Accounts Payable', status: 'Settled' },
    { id: 'TX-9083', desc: 'Azure Node Compute Cluster usage billing', type: 'Debit', amount: 6800, account: '5200-Server Expenses', status: 'Processing' },
    { id: 'TX-9084', desc: 'Inbound Wire Reconcile - Global Indus Ltd', type: 'Credit', amount: 125000, account: '1200-Accounts Receivable', status: 'Settled' },
    { id: 'TX-9085', desc: 'Sub-contractor retainer - design audit', type: 'Debit', amount: 4500, account: '5400-Professional Fees', status: 'Settled' }
  ]);

  const [newPosting, setNewPosting] = useState({ desc: '', type: 'Credit', amount: 1000, account: '1010-Cash Assets' });

  const handlePostLedger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosting.desc) return;
    const item = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      desc: newPosting.desc,
      type: newPosting.type,
      amount: Number(newPosting.amount),
      account: newPosting.account,
      status: 'Settled'
    };
    setLedgerPostings([item, ...ledgerPostings]);
    setNewPosting({ desc: '', type: 'Credit', amount: 1000, account: '1010-Cash Assets' });
  };

  return (
    <div className="space-y-6" id="finance-view-root">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-indigo-400" />
          Finance Ledger Systems
        </h2>
        <p className="text-xs text-slate-400">Post journal entries, audit general cash ledger accounts, and manage double-entry assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ledger Entry Form */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Quick Journal Voucher</span>
            <h3 className="text-sm font-semibold text-slate-200">Post Direct Entry</h3>
          </div>

          <form onSubmit={handlePostLedger} className="space-y-3">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Description</label>
              <input 
                type="text" 
                placeholder="e.g., Office lease allocation" 
                value={newPosting.desc}
                onChange={e => setNewPosting({...newPosting, desc: e.target.value})}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Entry Type</label>
                <select 
                  value={newPosting.type}
                  onChange={e => setNewPosting({...newPosting, type: e.target.value})}
                  className="w-full px-2 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg outline-none"
                >
                  <option value="Credit">Credit (Inflow)</option>
                  <option value="Debit">Debit (Outflow)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Amount (USD)</label>
                <input 
                  type="number" 
                  value={newPosting.amount}
                  onChange={e => setNewPosting({...newPosting, amount: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">General Account</label>
              <select 
                value={newPosting.account}
                onChange={e => setNewPosting({...newPosting, account: e.target.value})}
                className="w-full px-2 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg outline-none"
              >
                <option value="1010-Cash Assets">1010-Cash Assets</option>
                <option value="1200-Accounts Receivable">1200-Accounts Receivable</option>
                <option value="2100-Accounts Payable">2100-Accounts Payable</option>
                <option value="5200-Server Expenses">5200-Server Expenses</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              <span>Post Ledger Voucher</span>
            </button>
          </form>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Audit Trail Verified
            </span>
            <p className="text-[10px] text-slate-500 leading-relaxed">OMEGA ERP implements high-security blockchain hash checks to audit postings in alignment with SOC2 requirements.</p>
          </div>
        </div>

        {/* Ledger list */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Historical General Ledger Accounts</h3>
                <p className="text-[11px] text-slate-500">Live feed of standard accounts ledger postings.</p>
              </div>
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] rounded font-mono font-bold">DOUBLE ENTRY OK</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-800">
                    <th className="py-2.5 px-4">TX Code</th>
                    <th className="py-2.5 px-4">Transaction Specification</th>
                    <th className="py-2.5 px-4">Ledger Account</th>
                    <th className="py-2.5 px-4">Post Type</th>
                    <th className="py-2.5 px-4 text-right">Value (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {ledgerPostings.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-850 text-xs transition-colors">
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">{tx.id}</td>
                      <td className="py-2.5 px-4 text-slate-200 font-medium">{tx.desc}</td>
                      <td className="py-2.5 px-4 text-slate-400 font-mono text-[10px]">{tx.account}</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border ${
                          tx.type === 'Credit' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className={`py-2.5 px-4 text-right font-mono font-bold ${
                        tx.type === 'Credit' ? 'text-emerald-400' : 'text-slate-300'
                      }`}>
                        {tx.type === 'Credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>Linked Banking Node: Citibank US East Main</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>FEED DECRYPTED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 2. HUMAN CAPITAL MANAGEMENT (HCM) VIEW
// ==========================================
export function HCMView() {
  const [employees, setEmployees] = useState<PayrollRecord[]>([
    { id: 'EMP-01', employeeName: 'Sarah Connor', role: 'Staff Robotics Eng', department: 'R&D', salary: 145000, status: 'Paid' },
    { id: 'EMP-02', employeeName: 'Marcus Vance', role: 'Warehouse Lead Supervisor', department: 'Logistics', salary: 78000, status: 'Paid' },
    { id: 'EMP-03', employeeName: 'Alex Rivera', role: 'Treasury Portfolio Lead', department: 'Finance', salary: 125000, status: 'Processing' },
    { id: 'EMP-04', employeeName: 'Linus Torvalds', role: 'Principal kernel Engineer', department: 'Core Infra', salary: 280000, status: 'Paid' },
    { id: 'EMP-05', employeeName: 'Bruce Banner', role: 'Thermal Stress Specialist', department: 'Safety Labs', salary: 110000, status: 'On Hold' }
  ]);

  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleRunPayroll = () => {
    // Process all employees to Paid
    setEmployees(employees.map(emp => ({ ...emp, status: 'Paid' })));
    setIsPayrollModalOpen(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6" id="hcm-view-root">
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500/30 text-slate-200 text-xs px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Payroll compilation batch dispatched to Citibank clearing house securely.</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Human Capital Management
          </h2>
          <p className="text-xs text-slate-400">Manage organizational charts, salary structures, direct deposit payroll registries, and tax nodes.</p>
        </div>

        <button 
          onClick={() => setIsPayrollModalOpen(true)}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-900/10"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Execute Monthly Payroll</span>
        </button>
      </div>

      {/* Staff stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Workforce Headcount</span>
          <h4 className="text-xl font-extrabold text-slate-200">{employees.length} Staff FTEs</h4>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Monthly Payroll Liability</span>
          <h4 className="text-xl font-extrabold text-slate-200">
            ${Math.round(employees.reduce((sum, e) => sum + e.salary, 0) / 12).toLocaleString()} /mo
          </h4>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">FICA Compliance Status</span>
          <h4 className="text-xl font-extrabold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            SECURED (99.8%)
          </h4>
        </div>
      </div>

      {/* Employees grid table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Enterprise Corporate Staff List</span>
          <span className="text-[10px] text-slate-500 font-mono">W-2 Form ledger synchronized with IRS systems</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-800">
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Staff Member Name</th>
                <th className="py-3 px-4">SaaS Corporate Role</th>
                <th className="py-3 px-4">Operational Dept</th>
                <th className="py-3 px-4 text-right">Annual Gross Salary</th>
                <th className="py-3 px-4 text-center">Payroll Phase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-850 text-xs transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">{emp.id}</td>
                  <td className="py-3 px-4 text-slate-200 font-semibold">{emp.employeeName}</td>
                  <td className="py-3 px-4 text-slate-400 font-normal">{emp.role}</td>
                  <td className="py-3 px-4 text-slate-400">{emp.department}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300 font-semibold">${emp.salary.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase border ${
                      emp.status === 'Paid' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : emp.status === 'Processing'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Run Payroll modal overlay */}
      {isPayrollModalOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-200">Reconcile ACH Payroll Batch?</h4>
                <p className="text-xs text-slate-400">You are compiling direct deposit wage distributions for {employees.length} active FTE employees. Total batch liability equals <strong>${Math.round(employees.reduce((sum, e) => sum + e.salary, 0) / 12).toLocaleString()} USD</strong>.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-500 space-y-1">
              <span className="font-bold uppercase tracking-wider text-slate-400">ACH Cleared Compliance Node</span>
              <p>Executing this batch flags all "Processing" and "On Hold" employees as "Paid" and automatically issues digitally signed direct wage receipts.</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsPayrollModalOpen(false)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleRunPayroll}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-md shadow-emerald-900/20"
              >
                Compile & Disburse Cash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// 3. MANUFACTURING & OPERATIONS VIEW
// ==========================================
export function ManufacturingView() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    { id: 'WO-2409', partName: 'Servo Bracket Assembly', quantity: 150, status: 'In Progress', priority: 'High', assignedTo: 'Bay Alpha-4' },
    { id: 'WO-2410', partName: 'Optic Housing Core Frame', quantity: 45, status: 'Scheduled', priority: 'Medium', assignedTo: 'Bay Beta-1' },
    { id: 'WO-2411', partName: 'High-Torque Coupler Cylinders', quantity: 200, status: 'Completed', priority: 'Low', assignedTo: 'Bay Charlie-7' },
    { id: 'WO-2412', partName: 'Titanium Base Plate Moldings', quantity: 80, status: 'Delayed', priority: 'High', assignedTo: 'Bay Alpha-2' }
  ]);

  const [newWO, setNewWO] = useState({ partName: '', quantity: 50, priority: 'High' as const, assignedTo: 'Bay Alpha-4' });

  const handleCreateWO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWO.partName) return;
    const wo: WorkOrder = {
      id: `WO-${Math.floor(2500 + Math.random() * 500)}`,
      partName: newWO.partName,
      quantity: Number(newWO.quantity),
      status: 'Scheduled',
      priority: newWO.priority,
      assignedTo: newWO.assignedTo
    };
    setWorkOrders([wo, ...workOrders]);
    setNewWO({ partName: '', quantity: 50, priority: 'High', assignedTo: 'Bay Alpha-4' });
  };

  return (
    <div className="space-y-6" id="manufacturing-view-root">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <Factory className="w-5 h-5 text-indigo-400" />
          Manufacturing Bay Operations
        </h2>
        <p className="text-xs text-slate-400">Track heavy machinery assembly status, program active Work Orders (WO), and monitor bay loads.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Machinery status gauges */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>CNC Milling Line Alpha</span>
                <span className="text-emerald-400">98.2% Load</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98%' }} />
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">Temp: 42°C • Status: NORMAL</span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>3D Printer Line Beta</span>
                <span className="text-indigo-400">64.5% Load</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '64%' }} />
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">Resin Level: OK • Status: NORMAL</span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Solder Station Gamma</span>
                <span className="text-rose-400">Overtemp Alert</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-[10px] text-rose-400 block font-mono">Temp: 185°C • COOLING REQUIRED</span>
            </div>
          </div>

          {/* Active Work orders Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Operational Work Order (WO) Board</span>
              <span className="text-[10px] text-slate-500 font-mono">Continuous production tracking</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-800">
                    <th className="py-2.5 px-4">WO ID</th>
                    <th className="py-2.5 px-4">Molded Part Assembly</th>
                    <th className="py-2.5 px-4 text-right">Target Quantity</th>
                    <th className="py-2.5 px-4">Assembly Bay</th>
                    <th className="py-2.5 px-4">Priority</th>
                    <th className="py-2.5 px-4 text-center">WO State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {workOrders.map((wo) => (
                    <tr key={wo.id} className="hover:bg-slate-850 text-xs transition-colors">
                      <td className="py-2.5 px-4 font-mono text-slate-400">{wo.id}</td>
                      <td className="py-2.5 px-4 text-slate-200 font-semibold">{wo.partName}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-300">{wo.quantity} pcs</td>
                      <td className="py-2.5 px-4 text-slate-400">{wo.assignedTo}</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-1.5 py-0.2 text-[9px] font-bold uppercase rounded ${
                          wo.priority === 'High' 
                            ? 'bg-rose-500/10 text-rose-400' 
                            : wo.priority === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-indigo-500/10 text-indigo-400'
                        }`}>
                          {wo.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase border ${
                          wo.status === 'Completed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : wo.status === 'In Progress'
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : wo.status === 'Scheduled'
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse'
                        }`}>
                          {wo.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Work order scheduler form */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bay Scheduler</span>
            <h3 className="text-sm font-semibold text-slate-200">Issue New Assembly WO</h3>
          </div>

          <form onSubmit={handleCreateWO} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Part Name / Spec</label>
              <input 
                type="text" 
                placeholder="e.g. Servo Bracket Pin v3" 
                value={newWO.partName}
                onChange={e => setNewWO({...newWO, partName: e.target.value})}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Target Quantity</label>
                <input 
                  type="number" 
                  value={newWO.quantity}
                  onChange={e => setNewWO({...newWO, quantity: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Priority</label>
                <select 
                  value={newWO.priority}
                  onChange={e => setNewWO({...newWO, priority: e.target.value as 'High' | 'Medium' | 'Low'})}
                  className="w-full px-2 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg outline-none"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Assigned Assembly Bay</label>
              <select 
                value={newWO.assignedTo}
                onChange={e => setNewWO({...newWO, assignedTo: e.target.value})}
                className="w-full px-2 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg outline-none"
              >
                <option value="Bay Alpha-4">Bay Alpha-4 (Robotics)</option>
                <option value="Bay Beta-1">Bay Beta-1 (Hardware)</option>
                <option value="Bay Charlie-7">Bay Charlie-7 (Electronics)</option>
                <option value="Bay Alpha-2">Bay Alpha-2 (Thermal)</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Dispatch to Assembly Line</span>
            </button>
          </form>

          <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">ISO 9001 Regulatory Tag</span>
            <p className="text-[10px] text-slate-500 leading-normal">
              Work orders automatically queue into standard Manufacturing Resource Planning (MRP) buffers to lock machine tolerances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 4. SYSTEM SETTINGS & CONFIGURATION VIEW
// ==========================================
export function SettingsView() {
  const [tenantName, setTenantName] = useState('Omega Manufacturing Global Corp');
  const [apiKey, setApiKey] = useState('sk_live_9280a82bcfc12a80f08928e');
  const [isCopied, setIsCopied] = useState(false);
  const [notifTrigger, setNotifTrigger] = useState(true);

  const handleCopyKey = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="settings-view-root">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-indigo-400" />
          Enterprise System Settings
        </h2>
        <p className="text-xs text-slate-400">Configure global metadata variables, secure third-party webhook keys, and verify cloud tenant statuses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card & Company Config */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">Company Registry Specifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Organization Tenant Name</label>
                <input 
                  type="text" 
                  value={tenantName}
                  onChange={e => setTenantName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Fiscal Base Currency</label>
                <select className="w-full px-2 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg outline-none">
                  <option value="USD">United States Dollar ($ USD)</option>
                  <option value="EUR">Euro (€ EUR)</option>
                  <option value="GBP">British Pound Sterling (£ GBP)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SaaS Deployment Region</label>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg font-mono">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>aws-us-east-1 (Northern Virginia)</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Database Shard Replica Node</label>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg font-mono">
                  <Database className="w-4 h-4 text-indigo-400" />
                  <span>Drizzle-PG-Replica-04 (Synced)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-850">
              <span className="text-[11px] text-slate-500">Last metadata synclog compiled 3 minutes ago by Admin.</span>
              <button 
                onClick={() => alert("Company registry metadata variables synchronized successfully.")}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1 shadow-md shadow-indigo-950/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Config Parameters</span>
              </button>
            </div>
          </div>

          {/* Secure Webhooks & API Keys */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400 animate-pulse" />
              SaaS External Integrations & API Keys
            </h3>
            
            <p className="text-xs text-slate-400">Expose API keys to link third-party logistics nodes (FedEx API, Stripe Ledger, Citibank ACH Clearing).</p>

            <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-lg flex items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block">LIVE SECRET API TOKEN</span>
                <span className="text-xs font-mono text-slate-300 font-semibold truncate block max-w-[280px]">{apiKey}</span>
              </div>

              <button 
                onClick={handleCopyKey}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-[10px] font-mono font-bold text-slate-300 border border-slate-800 rounded-lg transition-all whitespace-nowrap"
              >
                {isCopied ? 'COPIED TO CLIPBOARD' : 'REVEAL / COPY KEY'}
              </button>
            </div>

            <div className="p-3 bg-indigo-600/5 border border-indigo-500/10 rounded-lg text-[10px] text-slate-500 leading-relaxed">
              <strong>Security Protocol Mandate:</strong> Do not share sk_live keys in open channels. Access logs list all pulls matching this credential.
            </div>
          </div>
        </div>

        {/* Preferences Rail column */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">SaaS Preferences</h3>
            
            {/* Toggle alerts */}
            <div className="flex items-center justify-between p-1">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-200 block">Critical Stock Emails</span>
                <p className="text-[10px] text-slate-500">Auto-mail suppliers on stock depletion alerts.</p>
              </div>
              <input 
                type="checkbox" 
                checked={notifTrigger}
                onChange={() => setNotifTrigger(!notifTrigger)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-800 rounded bg-slate-950 outline-none cursor-pointer"
              />
            </div>

            {/* System Status telemetry logs card */}
            <div className="p-4 bg-slate-950 border border-slate-800/60 rounded-xl space-y-3 font-mono">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tenant Deployment Logs</span>
              
              <div className="text-[10px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>SSL HANDSHAKE:</span>
                  <span className="text-emerald-400 font-bold">SECURED (TLS 1.3)</span>
                </div>
                <div className="flex justify-between">
                  <span>DOCKER INGRESS:</span>
                  <span className="text-indigo-400 font-bold">CONTAINER_RUN_3000</span>
                </div>
                <div className="flex justify-between">
                  <span>FRAMEWORK COMPLIANCE:</span>
                  <span className="text-slate-300 font-bold">REACT19_VITE6</span>
                </div>
                <div className="flex justify-between">
                  <span>LATENCY SPEED:</span>
                  <span className="text-emerald-400 font-bold">14ms average</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
