import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Briefcase, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  X,
  Calendar
} from 'lucide-react';
import { InventoryItem, LogEntry, FinanceDataPoint } from '../../types';

interface DashboardPageProps {
  inventoryItems: InventoryItem[];
  logEntries: LogEntry[];
  onAddSimulatedLog: (log: LogEntry) => void;
  onRefreshStats?: () => void;
}

// Sparkline miniature path generator helper
const generateSparklinePath = (points: number[], width: number, height: number) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  
  return points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 4) - 2;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
};

// Default monthly ledger data
const INITIAL_FINANCE_DATA: FinanceDataPoint[] = [
  { period: 'Jan 2026', inflow: 145000, outflow: 98000 },
  { period: 'Feb 2026', inflow: 168000, outflow: 110000 },
  { period: 'Mar 2026', inflow: 152000, outflow: 115000 },
  { period: 'Apr 2026', inflow: 195000, outflow: 122000 },
  { period: 'May 2026', inflow: 220000, outflow: 135000 },
  { period: 'Jun 2026', inflow: 245000, outflow: 142000 }
];

export default function DashboardPage({
  inventoryItems,
  logEntries,
  onAddSimulatedLog,
  onRefreshStats
}: DashboardPageProps) {
  
  // Interactive Cash Flow chart States
  const [financeData, setFinanceData] = useState<FinanceDataPoint[]>(INITIAL_FINANCE_DATA);
  const [selectedChartPoint, setSelectedChartPoint] = useState<number | null>(null);
  const [selectedMonthModal, setSelectedMonthModal] = useState<FinanceDataPoint | null>(null);
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic helper to construct realistic ledger line items summing exactly to inflow/outflow totals
  const getGranularBreakdown = (point: FinanceDataPoint) => {
    return {
      inflowItems: [
        { name: 'Enterprise Client Licensing SaaS', amount: Math.round(point.inflow * 0.45), category: 'Subscriptions' },
        { name: 'Global Supply Distribution Services', amount: Math.round(point.inflow * 0.32), category: 'Sales Logistics' },
        { name: 'Consulting & Technical OEM Integrations', amount: Math.round(point.inflow * 0.15), category: 'Professional Services' },
        { name: 'Government & Research Grants', amount: point.inflow - Math.round(point.inflow * 0.45) - Math.round(point.inflow * 0.32) - Math.round(point.inflow * 0.15), category: 'Indirect Funding' }
      ],
      outflowItems: [
        { name: 'Hardware Parts & Titanium Sourcing', amount: Math.round(point.outflow * 0.38), category: 'Manufacturing Materials' },
        { name: 'Amazon Web Services Server Compute & CDN', amount: Math.round(point.outflow * 0.28), category: 'Infrastructure Cloud' },
        { name: 'Transit, Cargo Logistics & Custom Clearance', amount: Math.round(point.outflow * 0.18), category: 'Logistics Distribution' },
        { name: 'Direct Staff Payroll, QA & Maintenance Retainers', amount: point.outflow - Math.round(point.outflow * 0.38) - Math.round(point.outflow * 0.28) - Math.round(point.outflow * 0.18), category: 'Operational Payroll' }
      ]
    };
  };

  // Dynamic calculations based on inventoryItems
  const lowStockAlertCount = useMemo(() => {
    return inventoryItems.filter(item => item.status === 'Low' || item.status === 'Critical').length;
  }, [inventoryItems]);

  const totalInventoryValue = useMemo(() => {
    return inventoryItems.reduce((sum, item) => sum + (item.stockLevel * item.unitValue), 0);
  }, [inventoryItems]);

  // Simulated metrics
  const stats = useMemo(() => {
    return {
      revenue: {
        val: "$1,125,000",
        change: "+14.8%",
        positive: true,
        desc: "vs trailing fiscal quarter",
        points: [30, 45, 35, 55, 60, 75, 80],
        color: "text-emerald-400 border-emerald-500/20"
      },
      costs: {
        val: "$722,000",
        change: "-4.2%",
        positive: true, // Costs going down is positive
        desc: "Optimized logistics routes",
        points: [70, 68, 65, 62, 60, 58, 55],
        color: "text-indigo-400 border-indigo-500/20"
      },
      workOrders: {
        val: "14 Active",
        change: "+2 new",
        positive: true,
        desc: "Manufacturing bay A, B, D",
        points: [5, 8, 12, 10, 14, 11, 14],
        color: "text-indigo-400 border-indigo-500/20"
      },
      lowStock: {
        val: `${lowStockAlertCount} SKU Alert${lowStockAlertCount !== 1 ? 's' : ''}`,
        change: lowStockAlertCount > 2 ? 'Action Required' : 'Within Bounds',
        positive: lowStockAlertCount <= 2,
        desc: `Asset registry total val: $${totalInventoryValue.toLocaleString('en-US', {maximumFractionDigits: 0})}`,
        points: [5, 4, 3, 2, 4, lowStockAlertCount, lowStockAlertCount],
        color: lowStockAlertCount > 2 ? "text-rose-400 border-rose-500/20 animate-pulse" : "text-amber-400 border-amber-500/20"
      }
    };
  }, [lowStockAlertCount, totalInventoryValue]);

  // Handler to manually compile/simulate operational logs
  const handleSimulateEvent = () => {
    const events = [
      { code: 'PO-3042', msg: 'Purchase Order generated for Silicon Core Transceivers.', type: 'info' as const },
      { code: 'WO-1982', msg: 'Work Order #1982 marked completed at Bay Charlie.', type: 'success' as const },
      { code: 'LED-409', msg: 'Inbound wire of $45,000 reconciled with Citibank ledger.', type: 'success' as const },
      { code: 'SYS-ERR', msg: 'Minor API warning: external pricing Oracle delayed response.', type: 'warning' as const },
      { code: 'SKU-LOW', msg: 'Stock level alert trigger: SKU PRT-7729-BC fell below safety safety buffers.', type: 'error' as const },
      { code: 'HCM-PAY', msg: 'Payroll direct deposit logs compiled for QA Engineering department.', type: 'info' as const }
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const simulatedLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      code: randomEvent.code,
      message: randomEvent.msg,
      type: randomEvent.type,
      user: {
        name: ['Alex Rivera', 'Sarah Connor', 'Marcus Vance', 'Linus Torvalds'][Math.floor(Math.random() * 4)],
        avatar: `https://images.unsplash.com/photo-${[
          '1535713875002-d1d0cf377fde',
          '1494790108377-be9c29b29330',
          '1507003211169-0a1dd7228f2d',
          '1573496359142-b8d87734a5a2'
        ][Math.floor(Math.random() * 4)]}?w=100&fit=crop&q=80`
      }
    };
    onAddSimulatedLog(simulatedLog);
  };

  // Re-calculate/simulate live statistics updates
  const handleRefreshStats = () => {
    setIsRefreshing(true);
    if (onRefreshStats) {
      onRefreshStats();
    }
    setTimeout(() => {
      // Slightly fluctuate finance data points to simulate real-time updates
      const updated = financeData.map(d => ({
        ...d,
        inflow: Math.round(d.inflow * (1 + (Math.random() * 0.06 - 0.03))),
        outflow: Math.round(d.outflow * (1 + (Math.random() * 0.04 - 0.02)))
      }));
      setFinanceData(updated);
      setIsRefreshing(false);
    }, 800);
  };

  // Chart plotting computations
  const maxFinanceValue = useMemo(() => {
    const values = financeData.flatMap(d => [d.inflow, d.outflow]);
    return Math.max(...values, 260000);
  }, [financeData]);

  const svgHeight = 200;
  const svgWidth = 560;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartPoints = useMemo(() => {
    const usableWidth = svgWidth - paddingLeft - paddingRight;
    const usableHeight = svgHeight - paddingTop - paddingBottom;
    
    return financeData.map((d, index) => {
      const x = paddingLeft + (index / (financeData.length - 1)) * usableWidth;
      const inflowY = paddingTop + usableHeight - (d.inflow / maxFinanceValue) * usableHeight;
      const outflowY = paddingTop + usableHeight - (d.outflow / maxFinanceValue) * usableHeight;
      return { x, inflowY, outflowY, d };
    });
  }, [financeData, maxFinanceValue]);

  // Construct Area/Line SVG Path Strings
  const inflowPath = useMemo(() => {
    return chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.inflowY}`).join(' ');
  }, [chartPoints]);

  const outflowPath = useMemo(() => {
    return chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.outflowY}`).join(' ');
  }, [chartPoints]);

  const inflowAreaPath = useMemo(() => {
    const usableHeight = svgHeight - paddingBottom;
    if (chartPoints.length === 0) return '';
    return `${inflowPath} L ${chartPoints[chartPoints.length - 1].x} ${usableHeight} L ${chartPoints[0].x} ${usableHeight} Z`;
  }, [chartPoints, inflowPath]);

  const outflowAreaPath = useMemo(() => {
    const usableHeight = svgHeight - paddingBottom;
    if (chartPoints.length === 0) return '';
    return `${outflowPath} L ${chartPoints[chartPoints.length - 1].x} ${usableHeight} L ${chartPoints[0].x} ${usableHeight} Z`;
  }, [chartPoints, outflowPath]);

  return (
    <div className="space-y-6" id="erp-command-center">
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            ERP Commander Console
          </h2>
          <p className="text-xs text-slate-400">Integrated global logistics telemetry, dual-axis financial cash ledger flow, and audit lines.</p>
        </div>

        {/* Console triggers */}
        <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
          <button
            onClick={handleSimulateEvent}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-semibold rounded-lg transition-all"
            title="Simulate a real operational event logs"
            id="simulate-event-trigger"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Simulate Operation Event</span>
          </button>

          <button
            onClick={handleRefreshStats}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
            id="refresh-stats-trigger"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Compiling Live Stats...' : 'Refresh Stats'}</span>
          </button>
        </div>
      </div>

      {/* SUMMARY KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-summary-cards">
        
        {/* Total Revenue */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/10 transition-all shadow-2xl group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Gross Revenue (YTD)</span>
              <h4 className="text-xl font-bold text-slate-200 tracking-tight">{stats.revenue.val}</h4>
            </div>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/10">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          
          {/* Sparkline & trend info */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-800/60">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{stats.revenue.change}</span>
              </div>
              <span className="text-[10px] text-slate-500">{stats.revenue.desc}</span>
            </div>
            {/* Minimal SVG Sparkline */}
            <svg className="w-16 h-8 text-emerald-400" strokeWidth="1.5" fill="none" stroke="currentColor">
              <path d={generateSparklinePath(stats.revenue.points, 64, 32)} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Operational Costs */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/10 transition-all shadow-2xl group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Operating Expenditures</span>
              <h4 className="text-xl font-bold text-slate-200 tracking-tight">{stats.costs.val}</h4>
            </div>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/10">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          
          {/* Sparkline & trend info */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-800/60">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
                <span>{stats.costs.change}</span>
              </div>
              <span className="text-[10px] text-slate-500">{stats.costs.desc}</span>
            </div>
            {/* Minimal SVG Sparkline */}
            <svg className="w-16 h-8 text-indigo-400" strokeWidth="1.5" fill="none" stroke="currentColor">
              <path d={generateSparklinePath(stats.costs.points, 64, 32)} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Active Work Orders */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/10 transition-all shadow-2xl group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Work Orders</span>
              <h4 className="text-xl font-bold text-slate-200 tracking-tight">{stats.workOrders.val}</h4>
            </div>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/10">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          
          {/* Sparkline & trend info */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-800/60">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-xs text-indigo-400 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
                <span>{stats.workOrders.change}</span>
              </div>
              <span className="text-[10px] text-slate-500">{stats.workOrders.desc}</span>
            </div>
            {/* Minimal SVG Sparkline */}
            <svg className="w-16 h-8 text-indigo-400" strokeWidth="1.5" fill="none" stroke="currentColor">
              <path d={generateSparklinePath(stats.workOrders.points, 64, 32)} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/10 transition-all shadow-2xl group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Depleted Stock Alerts</span>
              <h4 className="text-xl font-bold text-slate-200 tracking-tight">{stats.lowStock.val}</h4>
            </div>
            <div className={`p-2 rounded-lg border ${
              lowStockAlertCount > 2 
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/10'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          
          {/* Sparkline & trend info */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-800/60">
            <div className="space-y-0.5">
              <div className={`flex items-center gap-1 text-xs font-semibold ${
                lowStockAlertCount > 2 ? 'text-rose-400' : 'text-slate-400'
              }`}>
                <span>{stats.lowStock.change}</span>
              </div>
              <span className="text-[10px] text-slate-500 truncate max-w-[120px] block" title={stats.lowStock.desc}>{stats.lowStock.desc}</span>
            </div>
            {/* Minimal SVG Sparkline */}
            <svg className={`w-16 h-8 ${lowStockAlertCount > 2 ? 'text-rose-400' : 'text-amber-400'}`} strokeWidth="1.5" fill="none" stroke="currentColor">
              <path d={generateSparklinePath(stats.lowStock.points, 64, 32)} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

      </div>

      {/* DATA VISUALIZATIONS SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-charts-split">
        
        {/* LEFT PANEL: Cash Flow dual-axis chart (replaces Recharts with zero-deps custom high-fidelity SVG chart) */}
        <div className="lg:col-span-7 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-xl p-5 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-slate-200 tracking-tight">Financial Treasury (Cash Flow)</h3>
                <p className="text-[11px] text-slate-400">Comparing gross cash inflow channels against internal manufacturing overhead.</p>
              </div>

              {/* Chart presentation selector */}
              <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded-lg">
                <button 
                  onClick={() => setChartType('area')}
                  className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-colors ${
                    chartType === 'area' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/10' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Area Blend
                </button>
                <button 
                  onClick={() => setChartType('line')}
                  className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-colors ${
                    chartType === 'line' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/10' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Line Curve
                </button>
              </div>
            </div>

            {/* Quick Chart Legends */}
            <div className="flex items-center gap-4 text-[10px] mb-5 pl-2 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-400/20" />
                <span className="text-slate-400">Cash Inflow (Average: $187K)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500 border border-indigo-400/20" />
                <span className="text-slate-400">Cash Outflow (Average: $120K)</span>
              </div>
            </div>
          </div>

          {/* Interactive Custom SVG Chart Container */}
          <div className="relative w-full overflow-hidden" id="cash-flow-svg-chart">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-full text-slate-300 overflow-visible"
              style={{ minHeight: '210px' }}
            >
              <defs>
                {/* Emerald Gradient */}
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                {/* Indigo Gradient */}
                <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const usableHeight = svgHeight - paddingTop - paddingBottom;
                const y = paddingTop + usableHeight * ratio;
                const value = Math.round(maxFinanceValue * (1 - ratio));
                return (
                  <g key={index} className="opacity-40">
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={svgWidth - paddingRight} 
                      y2={y} 
                      stroke="#1e293b" 
                      strokeDasharray="4,4" 
                      strokeWidth="1"
                    />
                    <text 
                      x={paddingLeft - 8} 
                      y={y + 4} 
                      textAnchor="end" 
                      fill="#94a3b8" 
                      className="text-[9px] font-mono"
                    >
                      ${Math.round(value/1000)}k
                    </text>
                  </g>
                );
              })}

              {/* Vertical Tick Bars & Point Selection Anchors */}
              {chartPoints.map((pt, i) => (
                <g key={i}>
                  <line 
                    x1={pt.x} 
                    y1={paddingTop} 
                    x2={pt.x} 
                    y2={svgHeight - paddingBottom} 
                    stroke="#1e293b" 
                    strokeWidth="1"
                    className="opacity-20"
                  />
                  <text 
                    x={pt.x} 
                    y={svgHeight - 8} 
                    textAnchor="middle" 
                    fill="#64748b" 
                    className="text-[9px] font-semibold"
                  >
                    {pt.d.period.split(' ')[0]}
                  </text>

                  {/* Invisible broad mouse hover triggers to reveal data points */}
                  <rect 
                    x={pt.x - 30} 
                    y={paddingTop} 
                    width={60} 
                    height={svgHeight - paddingTop - paddingBottom} 
                    fill="transparent" 
                    className="cursor-pointer"
                    onMouseEnter={() => setSelectedChartPoint(i)}
                    onMouseLeave={() => setSelectedChartPoint(null)}
                    onClick={() => setSelectedMonthModal(pt.d)}
                  />
                </g>
              ))}

              {/* Draw Filled Area Curves */}
              <motion.path 
                d={inflowAreaPath} 
                fill="url(#emeraldGrad)" 
                animate={{ d: inflowAreaPath, opacity: chartType === 'area' ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path 
                d={outflowAreaPath} 
                fill="url(#indigoGrad)" 
                animate={{ d: outflowAreaPath, opacity: chartType === 'area' ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Draw Stroke Curves */}
              <motion.path 
                d={inflowPath} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                animate={{ d: inflowPath }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path 
                d={outflowPath} 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                animate={{ d: outflowPath }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Plot dots for vertices */}
              {chartPoints.map((pt, i) => (
                <g key={i}>
                  {/* Inflow vertex */}
                  <motion.circle 
                    cx={pt.x} 
                    animate={{ cy: pt.inflowY }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    r={selectedChartPoint === i ? 5 : 3} 
                    fill="#0f172a" 
                    stroke="#10b981" 
                    strokeWidth="2" 
                    className="cursor-pointer"
                    onClick={() => setSelectedMonthModal(pt.d)}
                  />
                  {/* Outflow vertex */}
                  <motion.circle 
                    cx={pt.x} 
                    animate={{ cy: pt.outflowY }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    r={selectedChartPoint === i ? 5 : 3} 
                    fill="#0f172a" 
                    stroke="#6366f1" 
                    strokeWidth="2" 
                    className="cursor-pointer"
                    onClick={() => setSelectedMonthModal(pt.d)}
                  />
                </g>
              ))}

              {/* Interactive Selected Data Tooltip Panel */}
              {selectedChartPoint !== null && (
                <g>
                  {/* Indicator Line vertical */}
                  <line 
                    x1={chartPoints[selectedChartPoint].x} 
                    y1={paddingTop} 
                    x2={chartPoints[selectedChartPoint].x} 
                    y2={svgHeight - paddingBottom} 
                    stroke="#6366f1" 
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                  {/* Tooltip Box placed dynamically near selection */}
                  <foreignObject 
                    x={chartPoints[selectedChartPoint].x > svgWidth - 160 ? chartPoints[selectedChartPoint].x - 145 : chartPoints[selectedChartPoint].x + 10} 
                    y={paddingTop + 5} 
                    width="135" 
                    height="94"
                    className="cursor-pointer"
                    onClick={() => setSelectedMonthModal(financeData[selectedChartPoint])}
                  >
                    <div className="bg-slate-950/95 border border-indigo-500/25 p-2 rounded-lg shadow-2xl text-[10px] space-y-1 backdrop-blur-md hover:border-indigo-500/55 transition-all">
                      <strong className="text-slate-200 block border-b border-slate-800 pb-0.5 font-mono">{financeData[selectedChartPoint].period}</strong>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Inbound:</span>
                        <span className="text-emerald-400 font-bold">${financeData[selectedChartPoint].inflow.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Outbound:</span>
                        <span className="text-indigo-400 font-bold">${financeData[selectedChartPoint].outflow.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800/80 pt-0.5">
                        <span className="text-slate-400 font-semibold">Net:</span>
                        <span className="text-slate-200 font-bold">${(financeData[selectedChartPoint].inflow - financeData[selectedChartPoint].outflow).toLocaleString()}</span>
                      </div>
                      <div className="text-[8px] text-indigo-400 font-bold text-center pt-0.5 animate-pulse">
                        Click to view ledger list
                      </div>
                    </div>
                  </foreignObject>
                </g>
              )}
            </svg>

            {/* Hint message inside card */}
            <div className="text-[10px] text-slate-500 text-center font-mono flex items-center justify-center gap-1.5 mt-2 bg-slate-950/30 p-1.5 rounded-md border border-slate-850">
              <Clock className="w-3.5 h-3.5 text-slate-600 animate-pulse" />
              <span>Hover over chart vertices to pull live ledger metadata.</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Real-time system activity stream feed */}
        <div className="lg:col-span-5 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-xl p-5 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-slate-200 tracking-tight">Active Operation Stream</h3>
                <p className="text-[11px] text-slate-400">Live system audit lines and critical ledger modifications.</p>
              </div>

              {/* Indicator */}
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>SYNCED</span>
              </div>
            </div>

            {/* Stream listings */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1" id="operation-logs-stream">
              {logEntries.map((log) => {
                const bubbleColor = {
                  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  info: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  error: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                };

                return (
                  <div 
                    key={log.id} 
                    className="p-2.5 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/80 hover:border-slate-800 rounded-lg flex gap-3 items-start transition-all duration-150 text-[11px]"
                  >
                    {/* User Avatar */}
                    <img 
                      src={log.user.avatar} 
                      alt={log.user.name} 
                      className="w-7 h-7 rounded-full border border-slate-700 object-cover mt-0.5 shrink-0" 
                    />

                    {/* Content */}
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 text-slate-400">
                        <span className="font-semibold text-slate-300 truncate">{log.user.name}</span>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 select-none shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                      
                      <p className="text-slate-200 font-medium leading-relaxed break-words">{log.message}</p>
                      
                      {/* Technical code tags */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className={`px-1.5 py-0.2 text-[9px] font-mono font-bold rounded border uppercase tracking-wider ${bubbleColor[log.type]}`}>
                          {log.code}
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono">ID: {log.id.slice(-4)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini analytics summary inside right pane */}
          <div className="mt-4 pt-4 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500 font-mono bg-slate-950/20 p-2.5 rounded-lg border border-slate-850">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Audit count: {logEntries.length} items</span>
            </div>
            <button 
              onClick={() => {
                // Clear simulated items
                alert("ERP audit archives locked. Root credentials required to purge data logs.");
              }}
              className="text-indigo-400 hover:underline hover:text-indigo-300 transition-colors"
            >
              Archive logs
            </button>
          </div>

        </div>

      </div>

      {/* Cash Flow Month Granular Ledger Modal */}
      {selectedMonthModal && (() => {
        const { inflowItems, outflowItems } = getGranularBreakdown(selectedMonthModal);
        const netMargins = selectedMonthModal.inflow - selectedMonthModal.outflow;
        const marginPercent = Math.round((netMargins / selectedMonthModal.inflow) * 100);

        return (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            {/* Modal Glass Container */}
            <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.8)] p-6 md:p-8 animate-in zoom-in-95 duration-200">
              
              {/* Decorative Ambient Glass Glows */}
              <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => setSelectedMonthModal(null)}
                className="absolute top-5 right-5 p-2 bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition-all cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Title */}
              <div className="flex items-center gap-3.5 mb-6 relative z-10">
                <div className="p-3 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
                    Ledger Breakdown for <span className="text-indigo-400 font-extrabold">{selectedMonthModal.period}</span>
                  </h3>
                  <p className="text-xs text-slate-400">SOC2 compliant double-entry general ledger voucher audit trail.</p>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                
                {/* INFLOW SEGMENT (Emerald) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                    <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Inbound Channels
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200">${selectedMonthModal.inflow.toLocaleString()}</span>
                  </div>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {inflowItems.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950/50 border border-slate-800/60 rounded-xl space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-200 truncate pr-2" title={item.name}>{item.name}</span>
                          <span className="font-mono font-bold text-emerald-400 shrink-0">${item.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 font-mono">{item.category}</span>
                          <span className="text-slate-400 font-semibold">{Math.round((item.amount / selectedMonthModal.inflow) * 100)}%</span>
                        </div>
                        {/* Progress meter */}
                        <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" 
                            style={{ width: `${(item.amount / selectedMonthModal.inflow) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* OUTFLOW SEGMENT (Indigo) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                    <span className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      Outbound Channels
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200">${selectedMonthModal.outflow.toLocaleString()}</span>
                  </div>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {outflowItems.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950/50 border border-slate-800/60 rounded-xl space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-200 truncate pr-2" title={item.name}>{item.name}</span>
                          <span className="font-mono font-bold text-indigo-400 shrink-0">${item.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 font-mono">{item.category}</span>
                          <span className="text-slate-400 font-semibold">{Math.round((item.amount / selectedMonthModal.outflow) * 100)}%</span>
                        </div>
                        {/* Progress meter */}
                        <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" 
                            style={{ width: `${(item.amount / selectedMonthModal.outflow) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom retention analysis summary */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <div className="bg-slate-950/45 border border-slate-800/60 px-4 py-2.5 rounded-xl flex items-center gap-3 w-full sm:w-auto">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Retained Earnings Margin</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-200">${netMargins.toLocaleString()}</span>
                      <span className="text-xs text-emerald-400 font-semibold">+{marginPercent}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMonthModal(null)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-950/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirm & Dismiss Audit
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
