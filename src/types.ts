export type StockStatus = 'Stable' | 'Low' | 'Critical';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  location: string;
  stockLevel: number;
  status: StockStatus;
  unitValue: number;
  category: string;
  quantity: number;
  supplier: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  code: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  user: {
    name: string;
    avatar: string;
  };
}

export interface FinanceDataPoint {
  period: string;
  inflow: number;
  outflow: number;
}

export interface Workspace {
  id: string;
  name: string;
  code: string;
  type: string;
}

export interface WorkOrder {
  id: string;
  partName: string;
  quantity: number;
  status: 'In Progress' | 'Scheduled' | 'Completed' | 'Delayed';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
}

export interface PayrollRecord {
  id: string;
  employeeName: string;
  role: string;
  department: string;
  salary: number;
  status: 'Paid' | 'Processing' | 'On Hold';
}
