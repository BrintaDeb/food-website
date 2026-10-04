import { EventEmitter } from 'events';
import type { Order, OrderStatus } from '@/types/order';

export interface OrderUpdatedPayload {
  orderId: string;
  status: OrderStatus;
  statusStep: number;
  updatedAt: string;
  phone?: string;
}

// Preserve emitter singleton across Next.js dev reloads
declare global {
  // eslint-disable-next-line no-var
  var __orderEventEmitter: EventEmitter | undefined;
}

export const orderEvents: EventEmitter =
  global.__orderEventEmitter ?? new EventEmitter();

if (process.env.NODE_ENV !== 'production') {
  global.__orderEventEmitter = orderEvents;
}

// Increase listener cap for active browser client streams
orderEvents.setMaxListeners(100);

export function emitOrderCreated(order: Order) {
  orderEvents.emit('order:created', order);
}

export function emitOrderUpdated(payload: OrderUpdatedPayload) {
  orderEvents.emit('order:updated', payload);
}
