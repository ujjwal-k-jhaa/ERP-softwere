import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  Package, 
  Users, 
  Factory, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bell, 
  Building2, 
  Sun, 
  Moon,
  LogOut,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Command,
  Info
} from 'lucide-react';
import { Workspace } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspace: (ws: Workspace) => void;
}

export default function Layout({
  children,
  activeTab,
  setActiveTab,
  workspaces,
  activeWorkspace,
  setActiveWorkspace,
}: LayoutProps) {
  // Sidebar open/collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Workspace dropdown state
  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false);
  // Notification dropdown state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // Command palette alert
  const [showSearchFeedback, setShowSearchFeedback] = useState(false);
  // Premium dark-mode restriction feedback
  const [themeToast, setThemeToast] = useState<string | null>(null);

  // Hardcoded premium user profile info
  const userProfile = {
    name: "Kapil Mishra",
    email: "kapilkmishra06@gmail.com",
    role: "Senior Enterprise Admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80"
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'finance', label: 'Finance Ledgers', icon: DollarSign, badge: 'Live' },
    { id: 'inventory', label: 'Inventory Registry', icon: Package, badge: 'Stock' },
    { id: 'hcm', label: 'HCM & Payroll', icon: Users, badge: null },
    { id: 'manufacturing', label: 'Manufacturing & WO', icon: Factory, badge: '2 Active' },
    { id: 'settings', label: 'System Settings', icon: Settings, badge: null },
  ];

  // Quick system mock notifications
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Work Order Approved', desc: 'WO-2409 approved by Operational Manager.', read: false, time: '3m ago' },
    { id: 'n2', title: 'Critical Stock Alert', desc: 'SKU PRT-3410-YL stock level is below 15%.', read: false, time: '12m ago' },
    { id: 'n3', title: 'Ledger Audit Synchronized', desc: 'External ledger linked with standard Bank API.', read: true, time: '2h ago' }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const triggerThemeToast = () => {
    setThemeToast("System locked in Enterprise High-Contrast Dark Slate Mode for optical safety.");
    setTimeout(() => setThemeToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex overflow-hidden">
      
      {/* Toast Notification for premium B2B UI details */}
      {themeToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-indigo-500/30 text-slate-200 text-xs px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{themeToast}</span>
        </div>
      )}

      {/* SIDEBAR NAVIGATION - Collapsible */}
      <aside 
        className={`bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 relative z-40 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
        id="app-sidebar"
      >
        {/* Sidebar Header with Branding */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white tracking-wider shrink-0 shadow-lg shadow-indigo-900/30">
                Ω
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold tracking-widest text-slate-200 uppercase">OMEGA ERP</span>
                  <span className="text-[9px] text-slate-500 font-medium font-mono uppercase">V4.92 • ENTERPRISE</span>
                </div>
              )}
            </div>

            {/* Toggle Arrow */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md transition-all absolute -right-3 top-5"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              id="sidebar-toggle-btn"
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all text-xs group ${
                    isActive 
                      ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 font-semibold' 
                      : 'border border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {/* Badge */}
                  {!isCollapsed && item.badge && (
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${
                      item.badge === 'Live' 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile section at bottom of sidebar */}
        <div className="border-t border-slate-800/80 p-3 bg-slate-950/30" id="sidebar-user-section">
          {isCollapsed ? (
            <div className="flex justify-center py-1">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name} 
                className="w-8 h-8 rounded-full border border-slate-700 object-cover cursor-pointer"
                title={`${userProfile.name} - ${userProfile.role}`}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name} 
                  className="w-9 h-9 rounded-full border border-slate-700 object-cover"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-semibold text-slate-200 truncate">{userProfile.name}</span>
                  <span className="text-[10px] text-slate-500 truncate">{userProfile.role}</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="p-2 bg-slate-950 border border-slate-800/60 rounded-lg flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ONLINE</span>
                </div>
                <span className="text-slate-600 font-mono text-[9px]">ID: SA-9280</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* CONTENT AREA SHELL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOPBAR HEADER */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-6 z-30" id="app-topbar">
          
          {/* Workspace Multi-Tenant Selector */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs border border-slate-800 hover:border-slate-700 rounded-lg text-slate-200 transition-all cursor-pointer select-none"
                id="workspace-dropdown-trigger"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold text-slate-200">{activeWorkspace.name}</span>
                <span className="px-1 py-0.5 bg-slate-950 text-slate-500 font-mono text-[9px] rounded border border-slate-800">{activeWorkspace.code}</span>
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-400 ml-1"></div>
              </button>

              {/* Dropdown Panel */}
              {isWsDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsWsDropdownOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-1 duration-100">
                    <div className="p-3 bg-slate-950 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Tenant Workspace Registry
                    </div>
                    <div className="p-1.5 divide-y divide-slate-800/40">
                      {workspaces.map((ws) => (
                        <button
                          key={ws.id}
                          onClick={() => {
                            setActiveWorkspace(ws);
                            setIsWsDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg flex flex-col gap-0.5 text-xs transition-colors ${
                            activeWorkspace.id === ws.id 
                              ? 'bg-indigo-600/10 text-indigo-400' 
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{ws.name}</span>
                            <span className="font-mono text-[9px] px-1 bg-slate-950 border border-slate-800 rounded text-slate-400">{ws.code}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">{ws.type} Deployment Layer</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Search bar, Notification Bell, Theme toggle, System metrics */}
          <div className="flex items-center gap-4">
            
            {/* Global command-palette search bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search command palette... (Press '/')"
                onFocus={() => setShowSearchFeedback(true)}
                onBlur={() => setTimeout(() => setShowSearchFeedback(false), 200)}
                className="w-72 pl-9 pr-8 py-1.5 bg-slate-950 border border-slate-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs rounded-lg text-slate-200 placeholder-slate-500 outline-none transition-all duration-200"
                id="global-command-search"
              />
              <span className="absolute right-3 top-2.5 px-1 py-0.5 bg-slate-900 border border-slate-800 text-[9px] text-slate-500 font-mono rounded select-none">/</span>

              {/* Smart command quick reference panel */}
              {showSearchFeedback && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-xs text-slate-400 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Quick ERP Navigation CMDs</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button onClick={() => { setActiveTab('dashboard'); }} className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left rounded font-mono text-[10px] text-slate-300">/go dash</button>
                    <button onClick={() => { setActiveTab('inventory'); }} className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left rounded font-mono text-[10px] text-slate-300">/go stock</button>
                    <button onClick={() => { setActiveTab('finance'); }} className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left rounded font-mono text-[10px] text-slate-300">/go ledger</button>
                    <button onClick={() => { setActiveTab('settings'); }} className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left rounded font-mono text-[10px] text-slate-300">/go config</button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification badge and popover dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 rounded-lg transition-all relative cursor-pointer"
                id="notification-badge-button"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-slate-900 animate-pulse"></span>
                )}
              </button>

              {/* Notification Overlay Popover */}
              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsNotificationOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in duration-100">
                    <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">System Logs & Alerts</span>
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-indigo-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="divide-y divide-slate-800 max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className={`p-3 text-xs space-y-1 hover:bg-slate-800/40 transition-colors ${!n.read ? 'bg-indigo-950/10' : ''}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-200">{n.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-normal">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 bg-slate-950 text-center border-t border-slate-800">
                      <button 
                        onClick={() => { setActiveTab('dashboard'); setIsNotificationOpen(false); }}
                        className="text-[10px] text-slate-500 hover:text-slate-300"
                      >
                        View all operational stream events
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Light/Dark Toggle layout feedback */}
            <button
              onClick={triggerThemeToast}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 border border-slate-800 hover:border-slate-700 rounded-lg transition-all"
              title="Toggle system color theme"
              id="theme-toggle-btn"
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* Quick Session Health Check Status */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-500 border-l border-slate-800 pl-4">
              <span className="text-slate-600">HOST:</span>
              <span className="text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.5 rounded">CLOUD_OK</span>
            </div>
          </div>
        </header>

        {/* PRIMARY VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950" id="main-viewport-pane">
          {children}
        </main>
      </div>
    </div>
  );
}
