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
    if (!dateString) return t("order_details.not_available");
    const date = new Date(dateString);
    
    if (i18n.language === 'ar') {
      const monthNames = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
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
  const tabTitles = [
    t("order_details.order_history"),
    t("order_details.item_details"), 
    t("order_details.my_notes"),
    t("order_details.status_timeline"),
    t("order_details.order_info")
  ];

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
                    <div className="text-2 fw-6">{t("order_details.order_placed")}</div>
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
                      <div className="text-2 fw-6">{t("order_details.status")}: {formatStatusName(history.new_status)}</div>
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
            style={{display: activeTab === 1 ? 'block' : 'none', direction: i18n.language === 'ar' ? 'rtl' : 'ltr'}}>
            {order.products && order.products.length > 0 ? (
              <>
                {order.products.map((product) => (
                  <div key={product.id} className="order-head mb-3">
                    <div className="content">
                      <div className="text-2 fw-6">{product.name}</div>
                      <div className="mt_4">
                        <span className="fw-6">{t("order_details.price")} :</span> ${parseFloat(product.pivot?.unit_price || product.price || 0).toFixed(2)}
                      </div>
                      <div className="mt_4">
                        <span className="fw-6">{t("order_details.quantity")} :</span> {product.pivot?.quantity || 1}
                      </div>
                      {/* Custom fields if any */}
                      {product.pivot?.custom_fields && Array.isArray(JSON.parse(product.pivot.custom_fields)) && (
                        <div className="mt_4">
                          <span className="fw-6">{t("order_details.custom_fields")}:</span>
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
                
                {/* Gift Card Section */}
                {order.has_gift_card && (
                  <div className="order-head mb-3" >
                    <div className="content">
                      <div className="text-2 fw-6" style={{ color: '#495057', marginBottom: '10px' }}>
                         {t("order_details.gift_card_details", "Gift Card Details")}
                      </div>
                      
                      <div className="mt_4">
                        <span className="fw-6">{t("order_details.gift_card_type", "Type")}: </span>
                        <span className>
                          {(order.gift_card_is_custom === true || order.gift_card_is_custom === 1)
                            ? t("order_details.custom_design", "Custom Design") 
                            : t("order_details.template_design", "Template Design")
                          }
                        </span>
                      </div>
                      
                      {/* Debug log to see the exact values */}
                      {console.log('Gift Card Debug:', {
                        has_gift_card: order.has_gift_card,
                        gift_card_is_custom: order.gift_card_is_custom,
                        gift_card_template: order.gift_card_template,
                        typeof_is_custom: typeof order.gift_card_is_custom
                      })}
                      
                      {(order.gift_card_is_custom === false || order.gift_card_is_custom === 0 || order.gift_card_is_custom === null) && order.gift_card_template && (
                        <>
                          <div className="mt_4">
                            <span className="fw-6">{t("order_details.template_name", "Template")}: </span>
                            <span>{order.gift_card_template.name}</span>
                          </div>
                          
                          <div className="mt_4">
                            <span className="fw-6">{t("order_details.template_image", "Template Image")}: </span>
                            <br />
                            {(order.gift_card_template.image_url || order.gift_card_template.image) ? (
                              <img 
                                src={
                                  order.gift_card_template.image_url || 
                                  `http://localhost:8000/storage/${order.gift_card_template.image}`
                                } 
                                alt={order.gift_card_template.name}
                                style={{ 
                                  maxWidth: '200px', 
                                  maxHeight: '150px', 
                                  borderRadius: '8px',
                                  border: '1px solid #DEE2E6',
                                  marginTop: '8px',
                                  display: 'block'
                                }}
                                onError={(e) => {
                                  console.log('Image failed to load:', e.target.src);
                                  e.target.style.display = 'none';
                                  // Show fallback text
                                  const fallback = document.createElement('div');
                                  fallback.textContent = t("order_details.image_not_available", "Image not available");
                                  fallback.style.cssText = 'color: #6c757d; font-style: italic; margin-top: 8px;';
                                  e.target.parentNode.appendChild(fallback);
                                }}
                                onLoad={(e) => {
                                  console.log('Image loaded successfully:', e.target.src);
                                }}
                              />
                            ) : (
                              <div style={{ color: '#6c757d', fontStyle: 'italic', marginTop: '8px' }}>
                                {t("order_details.no_template_image", "No template image available")}
                              </div>
                            )}
                            {/* Debug info - remove in production */}
                            {console.log('Gift Card Template Data:', order.gift_card_template)}
                          </div>
                        </>
                      )}
                      
                      {order.gift_card_message && (
                        <div className="mt_4">
                          <span className="fw-6">{t("order_details.gift_card_message", "Message")}: </span>
                          <div style={{ 
                            backgroundColor: '#FFFFFF', 
                            padding: '10px', 
                            borderRadius: '6px', 
                            border: '1px solid #DEE2E6',
                            marginTop: '5px',
                            whiteSpace: 'pre-wrap'
                          }}>
                            "{order.gift_card_message}"
                          </div>
                        </div>
                      )}
                      
                      {order.gift_card_signature && (
                        <div className="mt_4">
                          <span className="fw-6">{t("order_details.gift_card_signature", "From")}: </span>
                          <div style={{ marginTop: '8px' }}>
                            {order.gift_card_signature_type === 'image' ? (
                              <div>
                                <img 
                                  src={order.gift_card_signature_url || `http://localhost:8000/storage/${order.gift_card_signature}`}
                                  alt="Signature"
                                  style={{ 
                                    maxWidth: '300px', 
                                    maxHeight: '100px', 
                                    border: '1px solid #DEE2E6',
                                    borderRadius: '6px',
                                    backgroundColor: '#FFFFFF',
                                    padding: '8px',
                                    display: 'block'
                                  }}
                                  onError={(e) => {
                                    console.log('Signature image failed to load:', e.target.src);
                                    e.target.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.textContent = t("order_details.signature_image_not_available", "Signature image not available");
                                    fallback.style.cssText = 'color: #6c757d; font-style: italic;';
                                    e.target.parentNode.appendChild(fallback);
                                  }}
                                />
                                <small className="text-muted d-block mt-2">
                                  <i className="fas fa-signature me-1"></i>
                                  {t("order_details.drawn_signature", "Drawn signature")}
                                </small>
                              </div>
                            ) : (
                              <div>
                                <span style={{ 
                                  fontStyle: 'italic', 
                                  fontSize: '1.1em',
                                  color: '#495057',
                                  display: 'inline-block',
                                  padding: '8px 12px',
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid #DEE2E6',
                                  borderRadius: '6px'
                                }}>
                                  — {order.gift_card_signature}
                                </span>
                                <small className="text-muted d-block mt-2">
                                  <i className="fas fa-pen me-1"></i>
                                  {t("order_details.text_signature", "Text signature")}
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <ul>
                  <li className="d-flex justify-content-between text-2">
                    <span>{t("order_details.total_price")}</span>
                    <span className="fw-6">${parseFloat(order.total || 0).toFixed(2)}</span>
                  </li>
                  <li className="d-flex justify-content-between text-2 mt_8">
                    <span>{t("order_details.payment_method")}</span>
                    <span className="fw-6">{order.payment_method || t("order_details.not_available")}</span>
                  </li>
                </ul>
              </>
            ) : (
              <div>{t("order_details.no_products_found")}</div>
            )}
          </div>
          
          {/* My Notes */}
          <div className={"widget-content-inner" + (activeTab === 2 ? " active" : "")}
            style={{display: activeTab === 2 ? 'block' : 'none', direction: i18n.language === 'ar' ? 'rtl' : 'ltr'}}>
            {/* Add note form */}
            <div className="mb-4 p-3 border rounded">
              <h6 className="mb-3">{t("order_details.add_note")}</h6>
              <div className="mb-3">
                <textarea 
                  className="form-control"
                  rows="3"
                  placeholder={t("order_details.note_placeholder")}
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
                {addingNote ? t("order_details.adding_note") : t("order_details.add_note_button")}
              </button>
            </div>
            
            {/* Notes list */}
            <div>
              <h6 className="mb-3">{t("order_details.order_notes")}</h6>
              {notesLoading ? (
                <div className="text-center py-3">{t("order_details.loading_notes")}</div>
              ) : notes.length === 0 ? (
                <div className="alert alert-info" style={{ backgroundColor: '#F1ECE4', borderColor: '#F1ECE4', color: '#000000' }}>
                  {t("order_details.no_notes_yet")}
                </div>
              ) : (
                <div className="notes-list">
                  {notes.map(note => (
                    <div key={note.id} className="note-item mb-3 p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="badge"
                                style={{
                                  ...(note.note_type === 'customer' ? {
                                    backgroundColor: '#F1ECE4',
                                    color: '#000000',
                                    border: '1px solid #F1ECE4',
                                    padding: '0.375rem 0.75rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    lineHeight: '1',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap',
                                    verticalAlign: 'baseline',
                                    borderRadius: '0.375rem'
                                  } : {
                                    backgroundColor: '#492e11',
                                    color: '#ffffff',
                                    border: '1px solid #492e11',
                                    padding: '0.375rem 0.75rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    lineHeight: '1',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap',
                                    verticalAlign: 'baseline',
                                    borderRadius: '0.375rem'
                                  })
                                }}>
                            {note.note_type === 'customer' ? t("order_details.you") : t("order_details.admin")}
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
            style={{display: activeTab === 3 ? 'block' : 'none', direction: i18n.language === 'ar' ? 'rtl' : 'ltr'}}>
            <h6 className="mb-3">{t("order_details.order_status_timeline")}</h6>
            {historyLoading ? (
              <div className="text-center py-3">{t("order_details.loading_status_history")}</div>
            ) : statusHistory.length === 0 ? (
              <div className="alert alert-info" style={{ backgroundColor: '#F1ECE4', borderColor: '#F1ECE4', color: '#000000' }}>
                {t("order_details.no_status_changes")}
              </div>
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
                                ({t("order_details.from")} {formatStatusName(history.old_status)})
                              </small>
                            )}
                          </div>
                          <small className="text-muted">{formatDate(history.created_at)}</small>
                        </div>
                        {history.notes && (
                          <p className="mb-2 text-muted">{history.notes}</p>
                        )}
                        <small className="text-muted">
                          {t("order_details.changed_by")}: {history.changed_by_system ? t("order_details.system") : t("order_details.admin")}
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
            style={{display: activeTab === 4 ? 'block' : 'none', direction: i18n.language === 'ar' ? 'rtl' : 'ltr'}}>
            <ul className="mt_20">
              <li>
                {t("order_details.order_number")} : <span className="fw-7">#{order.id}</span>
              </li>
              <li>
                {t("order_details.date")} : <span className="fw-7">{formatDate(order.placed_at || order.created_at)}</span>
              </li>
              <li>
                {t("order_details.total")} : <span className="fw-7">${parseFloat(order.total || 0).toFixed(2)}</span>
              </li>
              <li>
                {t("order_details.payment_method")} : <span className="fw-7">{order.payment_method || t("order_details.not_available")}</span>
              </li>
              <li>
                {t("order_details.shipping_address")} : <span className="fw-7">{order.shipping_address}</span>
              </li>
              {order.desired_delivery_at && (
                <li>
                  {t("order_details.desired_delivery")} : <span className="fw-7">{formatDate(order.desired_delivery_at)}</span>
                </li>
              )}
              <li>
                {t("order_details.phone")} : <span className="fw-7">{order.customer_phone}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
