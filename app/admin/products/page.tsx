'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authFetch } from '../../utils/staticAuth';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingInfo {
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
}

interface PaymentInfo {
  id: string;
  status: string;
  method: string;
  totalPrice: number;
}

interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  orderStatus: string;
  createdAt: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Using authFetch utility with static credentials
      const response = await authFetch('http://localhost:5000/api/orders');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await authFetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update order status');
    }
  };

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 relative"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order._id}</td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                        <br />
                        <span className="text-xs text-gray-400">{order.shippingInfo.email}</span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.orderItems.map((item) => (
                          <div key={item._id} className="flex items-center space-x-2">
                            <img src={item.image} alt={item.name} className="h-8 w-8 rounded object-cover" />
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">${order.paymentInfo.totalPrice.toFixed(2)}</td>

                      <td className="px-6 py-4 text-sm">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => router.push(`/admin/orders/${order._id}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
