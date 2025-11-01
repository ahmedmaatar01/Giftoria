"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { useTranslation } from "react-i18next";

export default function Orders() {
  const { user, authToken } = useContextElement();
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickNoteModal, setQuickNoteModal] = useState(null);
  const [quickNote, setQuickNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

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
      case 'delivered':
        return 'badge bg-success text-white';
      case 'shipped':
      case 'out_for_delivery':
        return 'badge bg-info text-white';
      case 'processing':
        return 'badge bg-primary text-white';
      case 'confirmed':
        return 'badge bg-success text-white';
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'cancelled':
        return 'badge bg-danger text-white';
      default:
        return 'badge bg-secondary text-white';
    }
  };

  const formatStatusName = (status) => {
    if (!status) return 'Pending';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const addQuickNote = async (orderId) => {
    if (!quickNote.trim() || !authToken) return;
    setAddingNote(true);
    try {
      const res = await fetch(`http://localhost:8000/api/commands/${orderId}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          content: quickNote,
          note_type: 'customer',
          is_visible_to_customer: true
        }),
      });
      if (res.ok) {
        setQuickNote("");
        setQuickNoteModal(null);
        // Show success message
        alert('Note added successfully!');
      }
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Failed to add note. Please try again.');
    } finally {
      setAddingNote(false);
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
                        {formatStatusName(order.status)}
                      </span>
                    </td>
                    <td>
                      ${parseFloat(order.total || 0).toFixed(2)} for {countItems(order)} item(s)
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        <Link
                          href={`/my-account-orders-details?id=${order.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View Details
                        </Link>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setQuickNoteModal(order.id)}
                        >
                          Add Note
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Quick Note Modal */}
      {quickNoteModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Note to Order #{quickNoteModal}</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setQuickNoteModal(null);
                    setQuickNote("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Your Note</label>
                  <textarea 
                    className="form-control"
                    rows="4"
                    placeholder="Add your note or question about this order..."
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setQuickNoteModal(null);
                    setQuickNote("");
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => addQuickNote(quickNoteModal)}
                  disabled={!quickNote.trim() || addingNote}
                >
                  {addingNote ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
