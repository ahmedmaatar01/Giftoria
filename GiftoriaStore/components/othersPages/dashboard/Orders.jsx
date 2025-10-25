"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useContextElement } from "@/context/Context";

export default function Orders() {
  const { user, authToken } = useContextElement();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/users/${user.id}/commands`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.commands || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authToken]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'cancelled':
        return 'text-danger';
      case 'processing':
        return 'text-info';
      default:
        return 'text-secondary';
    }
  };

  const countItems = (order) => {
    if (!order.products) return 0;
    return order.products.reduce((total, product) => {
      const quantity = product.pivot?.quantity || 1;
      return total + quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="my-account-content account-order">
        <div className="wrap-account-order">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-account-content account-order">
        <div className="wrap-account-order">
          <div className="alert alert-danger">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="my-account-content account-order">
        <div className="wrap-account-order">
          <div className="alert alert-warning">
            Please log in to view your orders.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content account-order">
      <div className="wrap-account-order">
        {orders.length === 0 ? (
          <div className="alert alert-info">
            <strong>No orders yet!</strong> You haven't placed any orders yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="fw-6">Order</th>
                  <th className="fw-6">Date</th>
                  <th className="fw-6">Status</th>
                  <th className="fw-6">Total</th>
                  <th className="fw-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="tf-order-item">
                    <td>#{order.id}</td>
                    <td>{formatDate(order.placed_at || order.created_at)}</td>
                    <td>
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      ${parseFloat(order.total || 0).toFixed(2)} for {countItems(order)} item(s)
                    </td>
                    <td>
                      <Link
                        href={`/my-account-orders-details?id=${order.id}`}
                        className="tf-btn btn-fill animate-hover-btn rounded-0 justify-content-center"
                      >
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
