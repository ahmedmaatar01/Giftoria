"use client";

import { useContextElement } from "@/context/Context";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function OrderDetails() {
  const { user, authToken } = useContextElement();
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // New state for notes and status history
  const [notes, setNotes] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    if (!orderId || !authToken) return;
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/api/commands/${orderId}/details`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
          },
        });
        if (!res.ok) throw new Error("Failed to fetch order details");
        const data = await res.json();
        setOrder(data);
        
        // Fetch notes and status history
        fetchNotes();
        fetchStatusHistory();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, authToken]);

  // Fetch notes for the order
  const fetchNotes = async () => {
    if (!orderId || !authToken) return;
    setNotesLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/commands/${orderId}/notes`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setNotesLoading(false);
    }
  };

  // Fetch status history for the order
  const fetchStatusHistory = async () => {
    if (!orderId) return;
    setHistoryLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/commands/${orderId}/status-history`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setStatusHistory(data.history);
      }
    } catch (err) {
      console.error('Error fetching status history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Add a new note
  const addNote = async () => {
    if (!newNote.trim() || !orderId || !authToken) return;
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
          content: newNote,
          note_type: 'customer',
          is_visible_to_customer: true
        }),
      });
      if (res.ok) {
        setNewNote("");
        fetchNotes(); // Refresh notes
      }
    } catch (err) {
      console.error('Error adding note:', err);
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return <div className="py-5 text-center">Loading order details...</div>;
  }
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  if (!order) {
    return <div className="alert alert-warning">Order not found.</div>;
  }

  // Helper: format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Helper: get order status badge
  const getStatusBadgeClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return "badge bg-success";
      case "shipped":
      case "out_for_delivery":
        return "badge bg-info";
      case "processing":
        return "badge bg-primary";
      case "pending":
        return "badge text-white";
      case "cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  // Helper: get timeline badge class
  const getTimelineBadgeClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return "bg-success";
      case "shipped":
      case "out_for_delivery":
        return "bg-info";
      case "processing":
        return "bg-primary";
      case "pending":
        return "";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // Helper: format status name
  const formatStatusName = (status) => {
    if (!status) return "Unknown";
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Tab content
  const tabTitles = ["Order History", "Item Details", "My Notes", "Status Timeline", "Order Info"];

  return (
    <div className="wd-form-order">
      <div className="order-head">
        <div className="content">
          <div 
            className={getStatusBadgeClass(order.status)}
            style={order.status?.toLowerCase() === 'pending' ? { backgroundColor: '#967740' } : {}}
          >
            {order.status || "Pending"}
          </div>
          <h6 className="mt-8 fw-5">Order #{order.id}</h6>
        </div>
      </div>
      <div className="tf-grid-layout md-col-2 gap-15">
        <div className="item">
          <div className="text-2 text_black-2">Customer</div>
          <div className="text-2 mt_4 fw-6">{order.customer_first_name} {order.customer_last_name}</div>
        </div>
        <div className="item">
          <div className="text-2 text_black-2">Email</div>
          <div className="text-2 mt_4 fw-6">{order.customer_email}</div>
        </div>
        <div className="item">
          <div className="text-2 text_black-2">Placed At</div>
          <div className="text-2 mt_4 fw-6">{formatDate(order.placed_at || order.created_at)}</div>
        </div>
        <div className="item">
          <div className="text-2 text_black-2">Shipping Address</div>
          <div className="text-2 mt_4 fw-6">{order.shipping_address}</div>
        </div>
      </div>
      <div className="widget-tabs style-has-border widget-order-tab">
        <ul className="widget-menu-tab">
          {tabTitles.map((title, idx) => (
            <li
              key={title}
              className={"item-title" + (activeTab === idx ? " active" : "")}
              onClick={() => setActiveTab(idx)}
              style={{cursor:'pointer'}}
            >
              <span className="inner">{title}</span>
            </li>
          ))}
        </ul>
        <div className="widget-content-tab">
          {/* Order History */}
          <div className={"widget-content-inner" + (activeTab === 0 ? " active" : "")}
            style={{display: activeTab === 0 ? 'block' : 'none'}}>
            <div className="widget-timeline">
              <ul className="timeline">
                <li>
                  <div className="timeline-badge success" />
                  <div className="timeline-box">
                    <div className="text-2 fw-6">Order Placed</div>
                    <span>{formatDate(order.placed_at || order.created_at)}</span>
                  </div>
                </li>
                {/* Render status history timeline */}
                {statusHistory.map((history, index) => (
                  <li key={history.id}>
                    <div 
                      className={`timeline-badge ${getTimelineBadgeClass(history.new_status)}`}
                      style={history.new_status?.toLowerCase() === 'pending' ? { backgroundColor: '#967740' } : {}}
                    />
                    <div className="timeline-box">
                      <div className="text-2 fw-6">Status: {formatStatusName(history.new_status)}</div>
                      <span>{formatDate(history.created_at)}</span>
                      {history.notes && (
                        <p className="mt-2 text-muted">{history.notes}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Item Details */}
          <div className={"widget-content-inner" + (activeTab === 1 ? " active" : "")}
            style={{display: activeTab === 1 ? 'block' : 'none'}}>
            {order.products && order.products.length > 0 ? (
              <>
                {order.products.map((product) => (
                  <div key={product.id} className="order-head mb-3">
                    <div className="content">
                      <div className="text-2 fw-6">{product.name}</div>
                      <div className="mt_4">
                        <span className="fw-6">Price :</span> ${parseFloat(product.pivot?.unit_price || product.price || 0).toFixed(2)}
                      </div>
                      <div className="mt_4">
                        <span className="fw-6">Quantity :</span> {product.pivot?.quantity || 1}
                      </div>
                      {/* Custom fields if any */}
                      {product.pivot?.custom_fields && Array.isArray(JSON.parse(product.pivot.custom_fields)) && (
                        <div className="mt_4">
                          <span className="fw-6">Custom Fields:</span>
                          <ul>
                            {JSON.parse(product.pivot.custom_fields).map((cf, idx) => (
                              <li key={idx}>{cf.name}: {cf.value}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <ul>
                  <li className="d-flex justify-content-between text-2">
                    <span>Total Price</span>
                    <span className="fw-6">${parseFloat(order.total || 0).toFixed(2)}</span>
                  </li>
                  <li className="d-flex justify-content-between text-2 mt_8">
                    <span>Payment Method</span>
                    <span className="fw-6">{order.payment_method || 'N/A'}</span>
                  </li>
                </ul>
              </>
            ) : (
              <div>No products found in this order.</div>
            )}
          </div>
          
          {/* My Notes */}
          <div className={"widget-content-inner" + (activeTab === 2 ? " active" : "")}
            style={{display: activeTab === 2 ? 'block' : 'none'}}>
            {/* Add note form */}
            <div className="mb-4 p-3 border rounded">
              <h6 className="mb-3">Add a Note</h6>
              <div className="mb-3">
                <textarea 
                  className="form-control"
                  rows="3"
                  placeholder="Add your note or question about this order..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-dark btn-sm"
                style={{ backgroundColor: '#000000' }}
                onClick={addNote}
                disabled={!newNote.trim() || addingNote}
              >
                {addingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>
            
            {/* Notes list */}
            <div>
              <h6 className="mb-3">Order Notes</h6>
              {notesLoading ? (
                <div className="text-center py-3">Loading notes...</div>
              ) : notes.length === 0 ? (
                <div className="alert alert-info" style={{ backgroundColor: '#F1ECE4', borderColor: '#F1ECE4', color: '#000000' }}>No notes yet. Add your first note above!</div>
              ) : (
                <div className="notes-list">
                  {notes.map(note => (
                    <div key={note.id} className="note-item mb-3 p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className={`badge ${note.note_type === 'customer' ? 'bg-primary' : 'bg-warning'}`}>
                            {note.note_type === 'customer' ? 'You' : 'Admin'}
                          </span>
                        </div>
                        <small className="text-muted">{formatDate(note.created_at)}</small>
                      </div>
                      <p className="mb-0">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Status Timeline */}
          <div className={"widget-content-inner" + (activeTab === 3 ? " active" : "")}
            style={{display: activeTab === 3 ? 'block' : 'none'}}>
            <h6 className="mb-3">Order Status Timeline</h6>
            {historyLoading ? (
              <div className="text-center py-3">Loading status history...</div>
            ) : statusHistory.length === 0 ? (
              <div className="alert alert-info" style={{ backgroundColor: '#F1ECE4', borderColor: '#F1ECE4', color: '#000000' }}>No status changes recorded yet.</div>
            ) : (
              <div className="timeline-vertical">
                {statusHistory.map((history, index) => (
                  <div key={history.id} className="timeline-item d-flex mb-4">
                    <div className="timeline-marker me-3">
                      <div 
                        className={`rounded-circle ${getTimelineBadgeClass(history.new_status)} d-flex align-items-center justify-content-center`} 
                        style={{
                          width: '30px', 
                          height: '30px',
                          ...(history.new_status?.toLowerCase() === 'pending' ? { backgroundColor: '#967740' } : {})
                        }}
                      >
                        <i className="fas fa-check text-white" style={{fontSize: '12px'}}></i>
                      </div>
                    </div>
                    <div className="timeline-content flex-grow-1">
                      <div className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <strong>{formatStatusName(history.new_status)}</strong>
                            {history.old_status && (
                              <small className="text-muted ms-2">
                                (from {formatStatusName(history.old_status)})
                              </small>
                            )}
                          </div>
                          <small className="text-muted">{formatDate(history.created_at)}</small>
                        </div>
                        {history.notes && (
                          <p className="mb-2 text-muted">{history.notes}</p>
                        )}
                        <small className="text-muted">
                          Changed by: {history.changed_by_system ? 'System' : 'Admin'}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Order Info */}
          <div className={"widget-content-inner" + (activeTab === 4 ? " active" : "")}
            style={{display: activeTab === 4 ? 'block' : 'none'}}>
            <ul className="mt_20">
              <li>
                Order Number : <span className="fw-7">#{order.id}</span>
              </li>
              <li>
                Date : <span className="fw-7">{formatDate(order.placed_at || order.created_at)}</span>
              </li>
              <li>
                Total : <span className="fw-7">${parseFloat(order.total || 0).toFixed(2)}</span>
              </li>
              <li>
                Payment Method : <span className="fw-7">{order.payment_method || 'N/A'}</span>
              </li>
              <li>
                Shipping Address : <span className="fw-7">{order.shipping_address}</span>
              </li>
              {order.desired_delivery_at && (
                <li>
                  Desired Delivery : <span className="fw-7">{formatDate(order.desired_delivery_at)}</span>
                </li>
              )}
              <li>
                Phone : <span className="fw-7">{order.customer_phone}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
