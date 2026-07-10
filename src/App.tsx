import React, { useState } from 'react';
import Layout from './components/ui/Layout';
import DashboardPage from './app/dashboard/page';
import InventoryTable from './components/dashboard/InventoryTable';
import { 
  FinanceView, 
  HCMView, 
  ManufacturingView, 
  SettingsView 
} from './components/dashboard/OtherPages';
import { InventoryItem, LogEntry, Workspace } from './types';

// Central seed data for active visual consistency and instant rendering
const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', sku: 'PRT-9082-XM', name: 'High-Torque Actuator Servo', location: 'WH-Alpha (A-12)', stockLevel: 142, status: 'Stable', unitValue: 340.00, category: 'Robotics', quantity: 142, supplier: 'Apex Dynamics' },
  { id: '2', sku: 'PRT-3410-YL', name: 'Alloy Core Hex Coupler', location: 'WH-Alpha (C-04)', stockLevel: 12, status: 'Critical', unitValue: 45.50, category: 'Hardware', quantity: 12, supplier: 'Midwest Alloys' },
  { id: '3', sku: 'PRT-1102-ZX', name: 'Optic Fiber Transceiver Module', location: 'WH-Beta (B-09)', stockLevel: 34, status: 'Low', unitValue: 189.90, category: 'Networking', quantity: 34, supplier: 'OptiLink Corp' },
  { id: '4', sku: 'PRT-5561-AA', name: 'Liquid Coolant Heat Sink', location: 'WH-Gamma (D-02)', stockLevel: 250, status: 'Stable', unitValue: 78.00, category: 'Thermal', quantity: 250, supplier: 'CoolMaster Ltd' },
  { id: '5', sku: 'PRT-7729-BC', name: 'Proximity Sensor Probe v4', location: 'WH-Alpha (A-08)', stockLevel: 8, status: 'Critical', unitValue: 125.00, category: 'Sensors', quantity: 8, supplier: 'SensorTech' },
  { id: '6', sku: 'PRT-4430-KL', name: 'Reinforced Titanium Bracket', location: 'WH-Beta (D-15)', stockLevel: 85, status: 'Stable', unitValue: 56.20, category: 'Hardware', quantity: 85, supplier: 'TitanForge' }
];

const INITIAL_LOGS: LogEntry[] = [
  { id: 'log-101', timestamp: '08:34:12', code: 'PO-1002', message: 'PO-1002 approved by Admin Kapil Mishra.', type: 'success', user: { name: 'Kapil Mishra', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80' } },
  { id: 'log-102', timestamp: '08:12:05', code: 'SYS-SYNC', message: 'Omega general ledger data-nodes verified with Citibank node.', type: 'info', user: { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80' } },
  { id: 'log-103', timestamp: '07:45:50', code: 'STK-LOW', message: 'Low Stock Alert: SKU PRT-7729-BC fell below safety threshold.', type: 'warning', user: { name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80' } }
];

const WORKSPACES: Workspace[] = [
  { id: 'ws-1', name: 'Omega Manufacturing Global Corp', code: 'US-EAST-MAIN', type: 'Primary' },
  { id: 'ws-2', name: 'Asia Tech & Assembly Bay Delta', code: 'APAC-SNG-02', type: 'Secondary' },
  { id: 'ws-3', name: 'Europe Logistics & Supply Hub', code: 'EU-AMS-09', type: 'Secondary' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(WORKSPACES[0]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [logEntries, setLogEntries] = useState<LogEntry[]>(INITIAL_LOGS);

  // Add system logs interactively
  const handleAddLog = (newLog: LogEntry) => {
    setLogEntries([newLog, ...logEntries]);
  };

  // Interactively sync Add Asset items into the global log stream
  const handleInventoryChange = (newItems: InventoryItem[]) => {
    // Detect if an item was added
    if (newItems.length > inventoryItems.length) {
      const addedItem = newItems[0]; // The newest item is placed at index 0
      const systemAuditLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        code: 'REG-STK',
        message: `Asset registered: SKU ${addedItem.sku} (${addedItem.name}) added to ${addedItem.location}.`,
        type: 'success',
        user: {
          name: 'Kapil Mishra',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80'
        }
      };
      setLogEntries([systemAuditLog, ...logEntries]);
    }
    setInventoryItems(newItems);
  };

  // Render view conditionally based on sidebar selections
  const renderViewContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage 
            inventoryItems={inventoryItems}
            logEntries={logEntries}
            onAddSimulatedLog={handleAddLog}
            onRefreshStats={() => {
              // Optionally log statistics refresh
              const refreshLog: LogEntry = {
                id: `log-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                code: 'SYS-REF',
                message: 'Statistical ledgers re-compiled and cache keys refreshed.',
                type: 'info',
                user: { name: 'System Core', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&fit=crop&q=80' }
              };
              setLogEntries(prev => [refreshLog, ...prev]);
            }}
          />
        );
      case 'inventory':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">Enterprise Asset Control</h2>
              <span className="text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
                TOTAL SKU: {inventoryItems.length}
              </span>
            </div>
            <InventoryTable 
              items={inventoryItems}
              onItemsChange={handleInventoryChange}
            />
          </div>
        );
      case 'finance':
        return <FinanceView />;
      case 'hcm':
        return <HCMView />;
      case 'manufacturing':
        return <ManufacturingView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div className="p-12 text-center text-slate-500">
            View layer "{activeTab}" is compile-initialized but offline.
          </div>
        );
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      workspaces={WORKSPACES}
      activeWorkspace={activeWorkspace}
      setActiveWorkspace={setActiveWorkspace}
    >
      {renderViewContent()}
    </Layout>
  );
}
