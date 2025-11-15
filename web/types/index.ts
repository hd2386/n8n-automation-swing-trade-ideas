export interface Subscription {
  email: string;
  selectedStocks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Stock {
  ticker: string;
  name: string;
}

export interface WorkflowStep {
  title: string;
  description: string;
  icon?: string;
}
