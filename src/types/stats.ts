export interface StatusCounts {
  confirmed: number;
  preparing: number;
  outForDelivery: number;
  delivered: number;
  cancelled: number;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  todayOrdersCount: number;
  todayRevenue: number;
  pendingOrders: number;
  menuItemsCount: number;
  statusCounts: StatusCounts;
}
