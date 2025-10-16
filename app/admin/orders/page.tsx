'use client';

import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/staticAuth';
import { formatINR } from '../../utils/auth';
interface OrderItem {
  _id?: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface Order {
  _id: string;
  user: string | { _id: string; name?: string; email?: string };
  orderItems: OrderItem[];
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  paymentInfo: {
    id: string;
    status: string;
    method: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  createdAt: string;
  updatedAt: string;
}


export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const API_BASE: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  type OrderStatus = Order['orderStatus'];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await authFetch(`${API_BASE}/orders`);

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const json: any = await response.json();
        const list: Order[] = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
        setOrders(list);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const nextStatus = capitalize(newStatus) as OrderStatus;
      const response = await authFetch(`${API_BASE}/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ orderStatus: nextStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update the local state with correct typing for 'order'
      setOrders(orders.map((order: Order): Order => (
        order._id === orderId ? { ...order, orderStatus: nextStatus } : order
      )));
    } catch (err: any) {
      setError(err?.message || 'An error occurred while updating order status');
    }
  };

  function capitalize(value: string) {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Orders Management</h1>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map((order: Order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.orderItems.map((item: OrderItem) => item.name).join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatINR(order.totalPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 
                              order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                              order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={order.orderStatus.toLowerCase()}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(order._id, e.target.value)}
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}