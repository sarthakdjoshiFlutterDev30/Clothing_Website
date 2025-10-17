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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string>('');
  const API_BASE: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const SHOP_NAME: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_SHOP_NAME || 'Clothing Store';
  const SHOP_ADDRESS: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_SHOP_ADDRESS || '123 Fashion Street, Mumbai, MH 400001, India';
  const SHOP_GST: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_SHOP_GST || 'GSTIN: 22AAAAA0000A1Z5';
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

  function escapeHtml(input: any): string {
    const str = String(input ?? '');
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const openOrderDetails = async (orderId: string) => {
    try {
      setDetailError('');
      setDetailLoading(true);
      const response = await authFetch(`${API_BASE}/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to load order details');
      }
      const json: any = await response.json();
      const data: Order = (json && json.data) ? json.data : json;
      setSelectedOrder(data);
    } catch (e: any) {
      setDetailError(e?.message || 'Unable to load order details');
    } finally {
      setDetailLoading(false);
    }
  };

  const printInvoice = () => {
    if (!selectedOrder) return;

    const order = selectedOrder as any;
    const doc = window.open('', '_blank', 'width=900,height=700');
    if (!doc) return;

    const styles = `
      <style>
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; color: #111; margin: 24px; }
        .header { display:flex; justify-content: space-between; align-items:flex-start; margin-bottom: 16px; }
        .brand { font-size: 18px; font-weight: 600; }
        .shop { font-size: 12px; color:#555; margin-top: 4px; white-space: pre-line; }
        .meta { text-align: right; font-size: 12px; color:#555; }
        .section { margin-top: 16px; }
        .section h3 { margin: 0 0 8px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; font-size: 12px; text-align:left; }
        th { background: #f9fafb; }
        .totals { width: 320px; margin-left: auto; }
        .totals td { border: none; padding: 4px 0; }
        .totals .line { border-top: 1px solid #e5e7eb; margin: 6px 0; }
        @media print { @page { size: A4; margin: 0; } body { margin: 16mm; } }
      </style>
    `;

    const address = order?.shippingInfo?.address || {};
    const itemsRows = (order?.orderItems || []).map((item: any) => `
      <tr>
        <td>${escapeHtml(item.name)}</td>
        <td>${[item.size, item.color].filter(Boolean).map(escapeHtml).join(' / ')}</td>
        <td>${Number(item.quantity)}</td>
        <td>${escapeHtml(formatINR(item.price))}</td>
        <td>${escapeHtml(formatINR(item.price * item.quantity))}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Invoice</title>
        ${styles}
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">${escapeHtml(SHOP_NAME)}</div>
            <div class="shop">${escapeHtml(SHOP_ADDRESS)}\n${escapeHtml(SHOP_GST)}</div>
          </div>
          <div class="meta">
            <div><strong>Order ID:</strong> ${String(order._id)}</div>
            <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</div>
          </div>
        </div>

        <div class="section">
          <h3>Invoice</h3>
        </div>

        <div class="section">
          <h3>Billing & Shipping</h3>
          <div style="display:flex; gap:24px;">
            <div style="flex:1; font-size:12px; color:#111;">
              <div>${escapeHtml(order?.shippingInfo?.firstName || '')} ${escapeHtml(order?.shippingInfo?.lastName || '')}</div>
              <div>${escapeHtml(address.street || '')}</div>
              <div>${escapeHtml(address.city || '')}, ${escapeHtml(address.state || '')} ${escapeHtml(address.zipCode || '')}</div>
              <div>${escapeHtml(address.country || '')}</div>
              <div style="color:#555;">Phone: ${escapeHtml(order?.shippingInfo?.phone || '')}</div>
              <div style="color:#555;">Email: ${escapeHtml(order?.shippingInfo?.email || '')}</div>
            </div>
            <div style="flex:1; font-size:12px; color:#111;">
              <div><strong>Payment Method:</strong> ${escapeHtml(order?.paymentInfo?.method || 'N/A')}</div>
              <div><strong>Payment Status:</strong> ${escapeHtml(order?.paymentInfo?.status || 'N/A')}</div>
              <div><strong>Payment ID:</strong> ${escapeHtml(order?.paymentInfo?.id || 'N/A')}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Variant</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>
        </div>

        <div class="section" style="display:flex;">
          <table class="totals">
            <tbody>
              <tr><td>Items</td><td style="text-align:right;">${escapeHtml(formatINR(order?.itemsPrice || 0))}</td></tr>
              <tr><td>Tax</td><td style="text-align:right;">${escapeHtml(formatINR(order?.taxPrice || 0))}</td></tr>
              <tr><td>Shipping</td><td style="text-align:right;">${escapeHtml(formatINR(order?.shippingPrice || 0))}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="section" style="display:flex;">
          <table class="totals">
            <tbody>
              <tr><td style="font-weight:600;">Total</td><td style="text-align:right; font-weight:600;">${escapeHtml(formatINR(order?.totalPrice || 0))}</td></tr>
            </tbody>
          </table>
        </div>

        <script>
          window.onload = () => { window.print(); setTimeout(() => window.close(), 300); };
        </script>
      </body>
      </html>
    `;

    doc.document.open();
    doc.document.write(html);
    doc.document.close();
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Orders Management</h1>

      <div className="flex flex-col">
        {/* Desktop/tablet table view */}
        <div className="hidden md:block -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                          {typeof order.user === 'object' && order.user ? (
                            <div className="flex flex-col">
                              <span className="font-medium">{(order.user as any).name || 'Customer'}</span>
                              <span className="text-gray-500">{(order.user as any).email || ''}</span>
                            </div>
                          ) : (
                            <span>{String(order.user)}</span>
                          )}
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
                          <div className="flex items-center gap-3">
                            <button
                              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                              onClick={() => openOrderDetails(order._id)}
                            >
                              View
                            </button>
                            <select
                              className="block pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                              value={order.orderStatus.toLowerCase()}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(order._id, e.target.value)}
                            >
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
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

        {/* Mobile card list view */}
        <div className="md:hidden space-y-3">
          {orders.length > 0 ? (
            orders.map((order: Order) => (
              <div key={order._id} className="bg-white shadow rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Order</div>
                    <div className="font-mono text-sm text-gray-900 break-all">{order._id}</div>
                  </div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full h-6 items-center 
                    ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                      order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Customer</div>
                    <div className="text-gray-900">
                      {typeof order.user === 'object' && order.user ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{(order.user as any).name || 'Customer'}</span>
                          <span className="text-gray-500 truncate">{(order.user as any).email || ''}</span>
                        </div>
                      ) : (
                        <span>{String(order.user)}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Date</div>
                    <div className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-gray-900">{formatINR(order.totalPrice)}</div>
                  </div>
                  <div className="flex items-end justify-end">
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => openOrderDetails(order._id)}
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={order.orderStatus.toLowerCase()}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500">No orders found</div>
          )}
        </div>
      </div>

      {(selectedOrder || detailLoading || detailError) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white w-full max-w-4xl mx-4 rounded-lg shadow-lg overflow-hidden max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {detailLoading && (
                <div className="text-sm text-gray-500">Loading details...</div>
              )}
              {detailError && (
                <div className="text-sm text-red-600">{detailError}</div>
              )}
              {selectedOrder && !detailLoading && !detailError && (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Order ID</div>
                  <div className="font-mono text-sm text-gray-900 break-all">{selectedOrder._id}</div>
                  <div className="text-sm text-gray-500 mt-4">Placed On</div>
                  <div className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                  <div className="text-sm text-gray-500 mt-4">Status</div>
                  <div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${selectedOrder.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        selectedOrder.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                        selectedOrder.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Customer</div>
                  <div className="text-gray-900">
                    {typeof selectedOrder.user === 'object' && selectedOrder.user ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{(selectedOrder.user as any).name || 'Customer'}</span>
                        <span className="text-gray-500">{(selectedOrder.user as any).email || ''}</span>
                      </div>
                    ) : (
                      <span>{String(selectedOrder.user)}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-4">Payment</div>
                  <div className="text-gray-900">
                    <div className="flex flex-col">
                      <span>Method: {selectedOrder?.paymentInfo?.method || 'N/A'}</span>
                      <span>Status: {selectedOrder?.paymentInfo?.status || 'N/A'}</span>
                      <span>ID: {selectedOrder?.paymentInfo?.id || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <div className="text-gray-700 text-sm">
                  <div>{selectedOrder?.shippingInfo?.firstName} {selectedOrder?.shippingInfo?.lastName}</div>
                  <div>{selectedOrder?.shippingInfo?.address?.street}</div>
                  <div>{selectedOrder?.shippingInfo?.address?.city}, {selectedOrder?.shippingInfo?.address?.state} {selectedOrder?.shippingInfo?.address?.zipCode}</div>
                  <div>{selectedOrder?.shippingInfo?.address?.country}</div>
                  <div className="mt-1 text-gray-500">Phone: {selectedOrder?.shippingInfo?.phone}</div>
                  <div className="text-gray-500">Email: {selectedOrder?.shippingInfo?.email}</div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3">Items</h3>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder?.orderItems?.map((item) => (
                        <tr key={item._id || item.product}>
                          <td className="px-4 py-2 text-sm text-gray-900 flex items-center gap-3">
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.image} alt={item.name} className="h-10 w-10 object-cover rounded" />
                            ) : null}
                            <span>{item.name}</span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">{[item.size, item.color].filter(Boolean).join(' / ')}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{formatINR(item.price)}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{formatINR(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-start-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Summary</h4>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Items</span>
                    <span>{formatINR(selectedOrder?.itemsPrice || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 mt-1">
                    <span>Tax</span>
                    <span>{formatINR(selectedOrder?.taxPrice || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 mt-1">
                    <span>Shipping</span>
                    <span>{formatINR(selectedOrder?.shippingPrice || 0)}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2" />
                  <div className="flex justify-between text-sm font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatINR(selectedOrder?.totalPrice || 0)}</span>
                  </div>
                </div>
              </div>
              </>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                onClick={printInvoice}
                disabled={!selectedOrder}
              >
                Print Invoice
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}