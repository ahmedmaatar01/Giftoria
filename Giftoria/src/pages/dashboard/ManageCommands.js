import React, { useEffect, useState } from "react";
import { Card, Table, Button, Breadcrumb, InputGroup, Form, Row, Col, Modal, Badge, Timeline, Alert, Spinner } from '@themesberg/react-bootstrap';
import { faHome, faSearch, faEye, faEdit, faHistory, faCommentDots, faPlus, faClock, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { BACKEND_URL } from '../../api/config';

const API_URL = `${BACKEND_URL}/api`;
const ADMIN_API = `${API_URL}/admin`;

// Helper function to get auth headers
const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = (user && (user.access_token || user.token || user.accessToken)) || localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const ManageCommands = () => {
    const [commands, setCommands] = useState([]);
  const [unseenCommandIds, setUnseenCommandIds] = useState(new Set());
  const [unseenNotesCommandIds, setUnseenNotesCommandIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedCommand, setSelectedCommand] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [editForm, setEditForm] = useState({
        status: "",
        description: "",
        customer_first_name: "",
        customer_last_name: "",
        customer_email: "",
        customer_phone: "",
        shipping_address: "",
        billing_address: "",
    });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState(null);
    const [editSuccess, setEditSuccess] = useState(null);
    
    // New state for notes and history
    const [notes, setNotes] = useState([]);
    const [statusHistory, setStatusHistory] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [newNoteType, setNewNoteType] = useState("system");
    const [notesLoading, setNotesLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [statusUpdateNotes, setStatusUpdateNotes] = useState("");

    const formatPayment = (method) => {
        if (!method) return "-";
        if (method === "cod") return "Cash on delivery";
        if (method === "online") return "Online payment";
        return method;
    };

    const formatDate = (value) => {
        if (!value) return "-";
        try {
            const d = new Date(value);
            if (isNaN(d)) {
                // Fallback: trim common ISO format to minutes and replace 'T' with space
                const s = String(value);
                return s.replace('T', ' ').slice(0, 16);
            }
            const pad = (n) => String(n).padStart(2, '0');
            const yyyy = d.getFullYear();
            const mm = pad(d.getMonth() + 1);
            const dd = pad(d.getDate());
            const hh = pad(d.getHours());
            const min = pad(d.getMinutes());
            return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
        } catch (e) {
            return String(value);
        }
    };

    // New functions for notes and status history
  const fetchNotes = async (commandId) => {
    setNotesLoading(true);
    try {
      const res = await axios.get(`${API_URL}/commands/${commandId}/notes`, {
        headers: getAuthHeaders()
      });
      const list = res.data?.notes || [];
      setNotes(list);
      return list;
    } catch (err) {
      console.error('Error fetching notes:', err);
      return [];
    } finally {
      setNotesLoading(false);
    }
  };

    const fetchStatusHistory = async (commandId) => {
        setHistoryLoading(true);
        try {
            const res = await axios.get(`${API_URL}/commands/${commandId}/status-history`, {
                headers: getAuthHeaders()
            });
            setStatusHistory(res.data.history);
        } catch (err) {
            console.error('Error fetching status history:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

  // Fetch unseen summary to drive indicators
  const fetchUnseenSummary = async () => {
    try {
      const res = await axios.get(`${ADMIN_API}/notifications/unseen`, { headers: getAuthHeaders() });
      const { commands = [], order_notes = [] } = res.data || {};
      const unseenCmdIds = new Set(commands.map(c => c.id));
      const unseenNotesByCmd = new Set(order_notes.map(n => n.command_id).filter(Boolean));
      setUnseenCommandIds(unseenCmdIds);
      setUnseenNotesCommandIds(unseenNotesByCmd);
    } catch (e) {
      // ignore
    }
  };

    const addNote = async () => {
        if (!newNote.trim() || !selectedCommand) return;
        
        // Console log to check admin authentication status
        console.log('=== Admin Add Note Debug ===');
        
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = (user && (user.access_token || user.token || user.accessToken)) || localStorage.getItem('access_token');
        
        console.log('User from localStorage:', user);
        console.log('Token found:', token ? 'YES' : 'NO');
        console.log('Token value (first 20 chars):', token ? token.substring(0, 20) + '...' : 'null');
        console.log('User role:', user.role || 'undefined');
        console.log('Selected Command:', selectedCommand);
        console.log('New Note Content:', newNote);
        console.log('Note Type:', newNoteType);
        console.log('API URL:', `${API_URL}/commands/${selectedCommand.id}/notes`);
        
        if (!token) {
            console.error('❌ No authentication token found!');
            alert('Authentication required. Please login again.');
            return;
        }
        
        try {
            const response = await axios.post(`${API_URL}/commands/${selectedCommand.id}/notes`, {
                content: newNote,
                note_type: newNoteType,
                is_visible_to_customer: newNoteType !== 'admin',
                admin_id: user.id || 1 // Use actual admin ID from user context
            }, {
                headers: getAuthHeaders()
            });
            
            console.log('✅ Note added successfully:', response.data);
            setNewNote("");
            fetchNotes(selectedCommand.id);
        } catch (err) {
            console.error('❌ Error adding note:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);
            console.error('Error headers:', err.response?.headers);
        }
    };

    const updateStatusWithHistory = async () => {
        if (!selectedCommand) return;
        
        setEditLoading(true);
        try {
            await axios.put(`${API_URL}/commands/${selectedCommand.id}/status`, {
                status: editForm.status,
                notes: statusUpdateNotes,
                admin_id: 1 // Replace with actual admin ID
            }, {
                headers: getAuthHeaders()
            });
            
            // Refresh commands list
            const res = await axios.get(`${API_URL}/commands`, {
                headers: getAuthHeaders()
            });
            const refreshed = Array.isArray(res.data)
              ? res.data
              : (res.data?.data || res.data?.commands || []);
            setCommands(refreshed);
            
            setEditSuccess("Status updated successfully!");
            setStatusUpdateNotes("");
            
            // If status history modal is open, refresh it
            if (showHistoryModal) {
                fetchStatusHistory(selectedCommand.id);
            }
        } catch (err) {
            setEditError("Failed to update status");
            console.error('Error updating status:', err);
        } finally {
            setEditLoading(false);
        }
    };

  const openNotesModal = async (command) => {
    setSelectedCommand(command);
    setShowNotesModal(true);
    // Fetch notes and get list immediately
    const currentNotes = await fetchNotes(command.id);
    // Mark unseen ones as seen
    try {
      const unseenForCommand = currentNotes.filter(n => !n.seen_by_admin);
      if (unseenForCommand.length) {
        await Promise.all(unseenForCommand.map(n => axios.post(`${ADMIN_API}/notifications/order-notes/${n.id}/seen`, {}, { headers: getAuthHeaders() })));
        // Re-fetch to reflect updates
        await fetchNotes(command.id);
      }
    } catch (e) {
      // ignore errors marking as seen
    } finally {
      setUnseenNotesCommandIds(prev => {
        const next = new Set([...prev]);
        next.delete(command.id);
        return next;
      });
      try { window.dispatchEvent(new Event('admin-notifications-updated')); } catch (_) {}
    }
  };

  const openHistoryModal = (command) => {
        setSelectedCommand(command);
        setShowHistoryModal(true);
        fetchStatusHistory(command.id);
    };

  // Open details and mark command as seen
  const openDetailsModal = async (command) => {
    setSelectedCommand(command);
    setShowModal(true);
    setDetailsLoading(true);

    try {
      const res = await axios.get(`${API_URL}/commands/${command.id}/details`, {
        headers: getAuthHeaders()
      });
      setSelectedCommand(res.data || command);
    } catch (err) {
      console.error('Error fetching command details:', err);
    } finally {
      setDetailsLoading(false);
    }

    if (unseenCommandIds.has(command.id)) {
      try {
        await axios.post(`${ADMIN_API}/notifications/commands/${command.id}/seen`, {}, { headers: getAuthHeaders() });
      } catch (e) {
        // ignore
      } finally {
        setUnseenCommandIds(prev => {
          const next = new Set([...prev]);
          next.delete(command.id);
          return next;
        });
        try { window.dispatchEvent(new Event('admin-notifications-updated')); } catch (_) {}
      }
    }
  };

    const getStatusBadgeVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'warning';
            case 'confirmed': return 'info';
            case 'processing': return 'primary';
            case 'shipped': return 'secondary';
            case 'out_for_delivery': return 'info';
            case 'delivered': return 'success';
            case 'cancelled': return 'danger';
            case 'refunded': return 'dark';
            default: return 'secondary';
        }
    };

    useEffect(() => {
    let mounted = true;
    const fetchCommands = async () => {
        try {
          const res = await axios.get(`${API_URL}/commands`, {
            headers: getAuthHeaders()
          });
          const list = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.commands || []);
          if (mounted) setCommands(list);
        } catch (err) {
          console.error('Error fetching commands:', err);
          if (err.response?.status === 401) {
            console.error('Authentication failed - please login again');
          }
        } finally {
          if (mounted) setLoading(false);
        }
      };
    fetchCommands();
    fetchUnseenSummary();
    const interval = setInterval(fetchUnseenSummary, 60000);
    return () => { clearInterval(interval); mounted = false; };
    }, []);

   // Sort newest -> oldest by placed_at (fallback created_at/id), then filter
const toTime = (v) => {
  if (!v) return 0;
  const d = new Date(v);
  return isNaN(d) ? 0 : d.getTime();
};

const sortedCommands = Array.isArray(commands)
  ? [...commands].sort((a, b) => {
      const tb = toTime(b?.placed_at || b?.created_at);
      const ta = toTime(a?.placed_at || a?.created_at);
      if (tb !== ta) return tb - ta; // newer first
      const bid = Number(b?.id) || 0;
      const aid = Number(a?.id) || 0;
      return bid - aid; // tie-breaker by id desc
    })
  : [];

const filteredCommands = sortedCommands.filter(cmd => {
  const searchLower = search.toLowerCase();

  const matchesSearch =
    cmd.name?.toLowerCase().includes(searchLower) ||
    cmd.description?.toLowerCase().includes(searchLower) ||
    cmd.customer_first_name?.toLowerCase().includes(searchLower) ||
    cmd.customer_last_name?.toLowerCase().includes(searchLower) ||
    cmd.customer_phone?.toLowerCase().includes(searchLower);

  const matchesStatus = filterStatus
    ? cmd.status?.toLowerCase() === filterStatus.toLowerCase()
    : true;

  return matchesSearch && matchesStatus;
});



    return (
        <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
            <div className="d-block mb-4 mb-md-0">
                <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                    <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                    <Breadcrumb.Item>Giftoria</Breadcrumb.Item>
                    <Breadcrumb.Item active>Commands</Breadcrumb.Item>
                </Breadcrumb>
                <h4>Commands</h4>
                <p className="mb-0">All system commands.</p>
            </div>
        </div>
        <div className="table-settings mb-4">
            <Row className="justify-content-between align-items-center">
                <Col xs={8} md={6} lg={3} xl={4}>
                    <InputGroup>
                        <InputGroup.Text>
                            <FontAwesomeIcon icon={faSearch} />
                        </InputGroup.Text>
                        <Form.Control type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
                    </InputGroup>
                    
                </Col>
                <Col xs={12} md={4} lg={3}>
  <Form.Select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
  >
    <option value="">All Statuses</option>
    <option value="pending">Pending</option>
    <option value="processing">Processing</option>
    <option value="completed">Completed</option>
    <option value="cancelled">Cancelled</option>
  </Form.Select>
</Col>

            </Row>
        </div>
        <Card border="light" className="shadow-sm">
            <Card.Header>
                <h5>Commands</h5>
            </Card.Header>
            <Card.Body>
                <Table responsive className="align-items-center table-flush">
                    <thead className="thead-light">
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Gift Card</th>
                            <th>Placed At</th>
                            <th>Payment</th>
                            <th>Customer Phone</th>
                            <th>Desired Delivery</th>
                      
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCommands.map(cmd => (
                            <tr key={cmd.id}>
                                <td>{cmd.name}</td>
                                <td>
                                    {cmd.status}
                                </td>
                                <td>{cmd.total}</td>
                                <td>
                                    {cmd.has_gift_card ? (
                                        <span className="text-success" title="Gift card included">
                                            🎁 {cmd.gift_card_is_custom ? 'Custom' : 'Template'}
                                        </span>
                                    ) : (
                                        <span className="text-muted">—</span>
                                    )}
                                </td>
                                <td>{formatDate(cmd.placed_at)}</td>
                                <td>{formatPayment(cmd.payment_method)}</td>
                                <td>{cmd.customer_phone || '-'}</td>
                                <td>{formatDate(cmd.desired_delivery_at)}</td>
                                <td>
                  <Button variant="primary" size="sm" className="me-1 mb-1 position-relative" onClick={() => openDetailsModal(cmd)}>
                    <FontAwesomeIcon icon={faEye} /> Details
                    {unseenCommandIds.has(cmd.id) && (
                      <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                        <span className="visually-hidden">Unseen</span>
                      </span>
                    )}
                  </Button>
                                    <Button variant="warning" size="sm" className="me-1 mb-1" onClick={() => {
                                        setSelectedCommand(cmd);
                                        setEditForm({
                                            status: cmd.status || "",
                                            description: cmd.description || "",
                                            customer_first_name: cmd.customer_first_name || "",
                                            customer_last_name: cmd.customer_last_name || "",
                                            customer_email: cmd.customer_email || "",
                                            customer_phone: cmd.customer_phone || "",
                                            shipping_address: cmd.shipping_address || "",
                                            billing_address: cmd.billing_address || "",
                                        });
                                        setEditError(null);
                                        setEditSuccess(null);
                                        setShowEditModal(true);
                                    }}>
                                        <FontAwesomeIcon icon={faEdit} /> Manage
                                    </Button>
                  <Button variant="info" size="sm" className="me-1 mb-1 position-relative" onClick={() => openNotesModal(cmd)}>
                    <FontAwesomeIcon icon={faCommentDots} /> Notes
                    {unseenNotesCommandIds.has(cmd.id) && (
                      <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                        <span className="visually-hidden">Unseen notes</span>
                      </span>
                    )}
                  </Button>
                                    <Button variant="secondary" size="sm" className="mb-1" onClick={() => openHistoryModal(cmd)}>
                                        <FontAwesomeIcon icon={faHistory} /> History
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {loading && <div>Loading...</div>}
            </Card.Body>
        </Card>

        {/* Modal for command details */}
        {showModal && selectedCommand && (
  <div
    className="modal show fade"
    style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
    tabIndex="-1"
  >
    <div className="modal-dialog modal-xl modal-dialog-centered">
      <div className="modal-content  shadow-lg rounded-4 overflow-hidden">
        
        {/* HEADER */}
        <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="modal-title fw-bold mb-0">
            🧾 Command Details
          </h5>
          <button
            type="button"
            className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              fontSize: "1.2rem",
              lineHeight: "1",
              border: "none",
            }}
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body p-4 bg-light">
          {detailsLoading && (
            <div className="mb-3 d-flex align-items-center gap-2 text-primary">
              <Spinner animation="border" size="sm" />
              <span>Loading command details...</span>
            </div>
          )}

          {/* General Info */}
          <h6 className="fw-semibold mb-3 text-primary">General Info</h6>
          <table className="table table-striped table-hover table-bordered align-middle bg-white rounded">
            <tbody>
              <tr><th className="w-25">Name</th><td>{selectedCommand.name}</td></tr>
              <tr><th>Status</th><td><span className="badge bg-info">{selectedCommand.status}</span></td></tr>
              <tr><th>Total</th><td><b>{selectedCommand.total} DT</b></td></tr>
              <tr><th>Placed At</th><td>{formatDate(selectedCommand.placed_at)}</td></tr>
              <tr><th>Source</th><td>{selectedCommand.source}</td></tr>
              <tr><th>Payment Method</th><td>{formatPayment(selectedCommand.payment_method)}</td></tr>
              <tr><th>Desired Delivery</th><td>{formatDate(selectedCommand.desired_delivery_at)}</td></tr>
              <tr><th>Note</th><td>{selectedCommand.description || "—"}</td></tr>
            </tbody>
          </table>

          {/* Customer Info */}
          <h6 className="fw-semibold mb-3 mt-5 text-primary">Customer Info</h6>
          <table className="table table-striped table-hover table-bordered align-middle bg-white rounded">
            <tbody>
              <tr><th>First Name</th><td>{selectedCommand.customer_first_name}</td></tr>
              <tr><th>Last Name</th><td>{selectedCommand.customer_last_name}</td></tr>
              <tr><th>Email</th><td>{selectedCommand.customer_email}</td></tr>
              <tr><th>Phone</th><td>{selectedCommand.customer_phone}</td></tr>
              <tr><th>Shipping Address</th><td>{selectedCommand.shipping_address}</td></tr>
              <tr><th>Billing Address</th><td>{selectedCommand.billing_address}</td></tr>
            </tbody>
          </table>

          {/* Gift Card Info */}
          {selectedCommand.has_gift_card && (
            <>
              <h6 className="fw-semibold mb-3 mt-5 text-primary">🎁 Gift Card Details</h6>
              <table className="table table-striped table-hover table-bordered align-middle bg-white rounded">
                <tbody>
                  <tr>
                    <th className="w-25">Gift Card Type</th>
                    <td>
                      {selectedCommand.gift_card_is_custom ? (
                        <span className="badge bg-warning">Custom Design</span>
                      ) : (
                        <span className="badge bg-info">Template Design</span>
                      )}
                    </td>
                  </tr>
                  {!selectedCommand.gift_card_is_custom && selectedCommand.gift_card_template && (
                    <>
                      <tr>
                        <th>Template Name</th>
                        <td>{selectedCommand.gift_card_template.name}</td>
                      </tr>
                      <tr>
                        <th>Template Image</th>
                        <td>
                          {selectedCommand.gift_card_template && (selectedCommand.gift_card_template.image_url || selectedCommand.gift_card_template.image) ? (
                            <img 
                              src={
                                selectedCommand.gift_card_template.image_url || 
                                (selectedCommand.gift_card_template.image 
                                  ? `${BACKEND_URL}/storage/${selectedCommand.gift_card_template.image}` 
                                  : '')
                              } 
                              alt={selectedCommand.gift_card_template.name}
                              className="img-thumbnail"
                              style={{ maxWidth: '150px', maxHeight: '100px' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'inline';
                              }}
                            />
                          ) : null}
                          <span 
                            className="text-muted" 
                            style={{ display: selectedCommand.gift_card_template && (selectedCommand.gift_card_template.image_url || selectedCommand.gift_card_template.image) ? 'none' : 'inline' }}
                          >
                            No image available
                          </span>
                        </td>
                      </tr>
                    </>
                  )}
                  {selectedCommand.gift_card_message && (
                    <tr>
                      <th>Custom Message</th>
                      <td style={{ whiteSpace: 'pre-wrap' }}>{selectedCommand.gift_card_message}</td>
                    </tr>
                  )}
                  {selectedCommand.gift_card_signature && (
                    <tr>
                      <th>Signature</th>
                      <td>
                        {selectedCommand.gift_card_signature_type === 'image' ? (
                          <div>
                            <img 
                              src={
                                selectedCommand.gift_card_signature_url || 
                                `${BACKEND_URL}/storage/${selectedCommand.gift_card_signature}`
                              }
                              alt="Customer Signature"
                              className="img-thumbnail"
                              style={{ 
                                maxWidth: '300px', 
                                maxHeight: '100px',
                                backgroundColor: '#fff',
                                padding: '8px'
                              }}
                              onError={(e) => {
                                console.log('Signature image failed to load:', e.target.src);
                                e.target.style.display = 'none';
                                const fallback = document.createElement('div');
                                fallback.textContent = 'Signature image not available';
                                fallback.className = 'text-muted fst-italic';
                                e.target.parentNode.appendChild(fallback);
                              }}
                            />
                            <div className="mt-2">
                              <small className="text-muted">
                                <i className="fas fa-signature me-1"></i>
                                Drawn signature
                              </small>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span style={{ 
                              fontStyle: 'italic', 
                              fontSize: '1.1em',
                              display: 'inline-block',
                              padding: '8px 12px',
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #dee2e6',
                              borderRadius: '6px'
                            }}>
                              — {selectedCommand.gift_card_signature}
                            </span>
                            <div className="mt-2">
                              <small className="text-muted">
                                <i className="fas fa-pen me-1"></i>
                                Text signature
                              </small>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Tag Info */}
          {selectedCommand.has_tag && (
            <>
              <h6 className="fw-semibold mb-3 mt-5 text-primary">🏷️ Tag Details</h6>
              <table className="table table-striped table-hover table-bordered align-middle bg-white rounded">
                <tbody>
                  <tr>
                    <th className="w-25">Tag Type</th>
                    <td><span className="badge bg-info">Template Tag</span></td>
                  </tr>
                  {selectedCommand.tag_template && (
                    <>
                      <tr>
                        <th>Template Name</th>
                        <td>{selectedCommand.tag_template.name}</td>
                      </tr>
                      <tr>
                        <th>Template Image</th>
                        <td>
                          {selectedCommand.tag_template && (selectedCommand.tag_template.image_url || selectedCommand.tag_template.image) ? (
                            <img
                              src={
                                selectedCommand.tag_template.image_url ||
                                (selectedCommand.tag_template.image
                                  ? `${BACKEND_URL}/storage/${selectedCommand.tag_template.image}`
                                  : '')
                              }
                              alt={selectedCommand.tag_template.name}
                              className="img-thumbnail"
                              style={{ maxWidth: '150px', maxHeight: '100px' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'inline';
                              }}
                            />
                          ) : null}
                          <span
                            className="text-muted"
                            style={{ display: selectedCommand.tag_template && (selectedCommand.tag_template.image_url || selectedCommand.tag_template.image) ? 'none' : 'inline' }}
                          >
                            No image available
                          </span>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Products */}
          <h6 className="fw-semibold mb-3 mt-5 text-primary">Products</h6>
          {selectedCommand.command_products && selectedCommand.command_products.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle bg-white rounded">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Line Total</th>
                    <th>Custom Fields</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCommand.command_products.map((cp, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{cp.product?.name || cp.product_id}</td>
                      <td>{cp.quantity}</td>
                      <td>{cp.unit_price}</td>
                      <td><b>{cp.line_total}</b></td>
                      <td>
                        {Array.isArray(cp.custom_fields) && cp.custom_fields.length > 0 ? (
                          <table className="table table-sm mb-0 ">
                            <tbody>
                              {cp.custom_fields.map((cf, i) => (
                                <tr key={i}>
                                  <th className="bg-light w-50">
                                    {typeof cf.name === 'object' 
                                      ? (cf.name.ar || cf.name.en) 
                                      : cf.name}
                                  </th>
                                  <td>{cf.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <span className="text-muted">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted fst-italic">No products found</p>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-footer bg-white">
          <Button
            variant="secondary"
            className="rounded-pill px-4"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  </div>
)}


        {/* Modal for managing/editing command */}
        {showEditModal && selectedCommand && (
  <div
    className="modal show fade"
    style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
    tabIndex="-1"
  >
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content  shadow-lg rounded-4 overflow-hidden">
        
        {/* HEADER */}
        <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="modal-title fw-bold mb-0">
            🛠️ Manage Command
          </h5>
          <button
            type="button"
            className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              fontSize: "1.2rem",
              lineHeight: "1",
              border: "none",
            }}
            onClick={() => setShowEditModal(false)}
          >
            &times;
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body bg-light p-4">
          {editError && (
            <div className="alert alert-danger shadow-sm rounded-3 py-2 px-3">
              ❌ {editError}
            </div>
          )}
          {editSuccess && (
            <div className="alert alert-success shadow-sm rounded-3 py-2 px-3">
              ✅ {editSuccess}
            </div>
          )}

          <Form onSubmit={(e) => e.preventDefault()} className="mt-3">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-primary">Status</Form.Label>
                  <Form.Select
                    className="rounded-3  shadow-sm"
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                  >
                    <option value="">Select status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-primary">Status Change Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    className="rounded-3  shadow-sm"
                    value={statusUpdateNotes}
                    onChange={(e) => setStatusUpdateNotes(e.target.value)}
                    placeholder="Add a note about this status change..."
                  />
                  <Form.Text className="text-muted">
                    This note will be added to the status history.
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-primary">Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    className="rounded-3  shadow-sm"
                    placeholder="Add a note..."
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-primary">Customer First Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="rounded-3  shadow-sm"
                    value={editForm.customer_first_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, customer_first_name: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-primary">Customer Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="rounded-3  shadow-sm"
                    value={editForm.customer_last_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, customer_last_name: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-primary">Customer Email</Form.Label>
                  <Form.Control
                    type="email"
                    className="rounded-3  shadow-sm"
                    value={editForm.customer_email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, customer_email: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-primary">Customer Phone</Form.Label>
                  <Form.Control
                    type="text"
                    className="rounded-3  shadow-sm"
                    value={editForm.customer_phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, customer_phone: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-primary">Shipping Address</Form.Label>
                  <Form.Control
                    type="text"
                    className="rounded-3  shadow-sm"
                    value={editForm.shipping_address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, shipping_address: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-primary">Billing Address</Form.Label>
                  <Form.Control
                    type="text"
                    className="rounded-3  shadow-sm"
                    value={editForm.billing_address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, billing_address: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>

        {/* FOOTER */}
        <div className="modal-footer bg-white d-flex justify-content-end">
          <Button
            variant="secondary"
            className="rounded-pill px-4"
            onClick={() => setShowEditModal(false)}
            disabled={editLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="rounded-pill px-4 ms-2"
            disabled={editLoading}
            onClick={async () => {
              try {
                setEditLoading(true);
                setEditError(null);
                setEditSuccess(null);
                
                // Update basic command info
                const res = await axios.put(`${API_URL}/commands/${selectedCommand.id}`, editForm, {
                    headers: getAuthHeaders()
                });
                const updated = res.data;
                
                // If status changed, update with history tracking
                if (editForm.status !== selectedCommand.status && editForm.status) {
                  await updateStatusWithHistory();
                }
                
                setCommands((prev) =>
                  prev.map((c) => (c.id === updated.id ? updated : c))
                );
                setSelectedCommand(updated);
                setEditSuccess("Updated successfully");
                setStatusUpdateNotes("");
                setShowEditModal(false);
              } catch (err) {
                const msg =
                  err.response?.data?.message || "Update failed";
                const validation = err.response?.data?.errors
                  ? Object.values(err.response.data.errors)
                      .flat()
                      .join(", ")
                  : "";
                setEditError(validation ? `${msg}: ${validation}` : msg);
              } finally {
                setEditLoading(false);
              }
            }}
          >
            {editLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Notes Modal */}
        {showNotesModal && selectedCommand && (
          <div
            className="modal show fade"
            style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content  shadow-lg rounded-4 overflow-hidden">
                
                {/* HEADER */}
                <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="modal-title fw-bold mb-0">
                    <FontAwesomeIcon icon={faCommentDots} className="me-2" />
                    Order Notes - #{selectedCommand.id}
                  </h5>
                  <button
                    type="button"
                    className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      fontSize: "1.2rem",
                      lineHeight: "1",
                      border: "none",
                    }}
                    onClick={() => setShowNotesModal(false)}
                  >
                    &times;
                  </button>
                </div>
                
                {/* BODY */}
                <div className="modal-body p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  {/* Add new note */}
                  <Card className="mb-4  shadow-sm">
                    <Card.Header className="bg-light ">
                      <FontAwesomeIcon icon={faPlus} className="me-2 text-primary" />
                      <strong>Add New Note</strong>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Note Content</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Enter your note here..."
                          className="rounded-3  shadow-sm"
                        />
                      </Form.Group>
                      <Button 
                        variant="primary" 
                        onClick={addNote}
                        disabled={!newNote.trim()}
                        className="rounded-pill px-4"
                      >
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Add Note
                      </Button>
                    </Card.Body>
                  </Card>

                  {/* Notes list */}
                  <Card className=" shadow-sm">
                    <Card.Header className="bg-light ">
                      <strong>All Notes</strong>
                    </Card.Header>
                    <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {notesLoading ? (
                        <div className="text-center py-3">
                          <Spinner animation="border" size="sm" />
                          <p className="mt-2 mb-0">Loading notes...</p>
                        </div>
                      ) : notes.length === 0 ? (
                        <Alert variant="info" className=" bg-light">
                          No notes found for this order.
                        </Alert>
                      ) : (
                        notes.map(note => (
                          <Card key={note.id} className="mb-3  shadow-sm">
                            <Card.Body className="py-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center">
                                  <FontAwesomeIcon 
                                    icon={note.note_type === 'customer' ? faUser : faUserTie} 
                                    className="me-2" 
                                  />
                                  <Badge bg={
                                    note.note_type === 'customer' ? 'primary' : 
                                    note.note_type === 'admin' ? 'warning' : 'secondary'
                                  }>
                                    {note.note_type.toUpperCase()}
                                  </Badge>
                                  {!note.is_visible_to_customer && (
                                    <Badge bg="danger" className="ms-2">Internal</Badge>
                                  )}
                                </div>
                                <small className="text-muted">
                                  <FontAwesomeIcon icon={faClock} className="me-1" />
                                  {formatDate(note.created_at)}
                                </small>
                              </div>
                              <p className="mb-1">{note.content}</p>
                              <small className="text-muted">
                                By: {note.user ? `${note.user.name} (Customer)` : 
                                     note.admin ? `${note.admin.name} (Admin)` : 'System'}
                              </small>
                            </Card.Body>
                          </Card>
                        ))
                      )}
                    </Card.Body>
                  </Card>
                </div>
                
                {/* FOOTER */}
                <div className="modal-footer bg-white d-flex justify-content-end">
                  <Button 
                    variant="secondary" 
                    className="rounded-pill px-4"
                    onClick={() => setShowNotesModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status History Modal */}
        {showHistoryModal && selectedCommand && (
          <div
            className="modal show fade"
            style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content  shadow-lg rounded-4 overflow-hidden">
                
                {/* HEADER */}
                <div className="modal-header bg-secondary text-white d-flex justify-content-between align-items-center">
                  <h5 className="modal-title fw-bold mb-0">
                    <FontAwesomeIcon icon={faHistory} className="me-2" />
                    Status History - #{selectedCommand.id}
                  </h5>
                  <button
                    type="button"
                    className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      fontSize: "1.2rem",
                      lineHeight: "1",
                      border: "none",
                    }}
                    onClick={() => setShowHistoryModal(false)}
                  >
                    &times;
                  </button>
                </div>
                
                {/* BODY */}
                <div className="modal-body p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  <Card className="mb-4  shadow-sm">
                    <Card.Header className="bg-light  d-flex justify-content-between align-items-center">
                      <strong>Current Status</strong>
                      <Badge bg={getStatusBadgeVariant(selectedCommand.status)} className="fs-6">
                        {selectedCommand.status}
                      </Badge>
                    </Card.Header>
                  </Card>

                  <Card className=" shadow-sm">
                    <Card.Header className="bg-light ">
                      <strong>Status Timeline</strong>
                    </Card.Header>
                    <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {historyLoading ? (
                        <div className="text-center py-3">
                          <Spinner animation="border" size="sm" />
                          <p className="mt-2 mb-0">Loading history...</p>
                        </div>
                      ) : statusHistory.length === 0 ? (
                        <Alert variant="info" className=" bg-light">
                          No status changes recorded yet.
                        </Alert>
                      ) : (
                        <div className="timeline">
                          {statusHistory.map((history, index) => (
                            <div key={history.id} className="timeline-item d-flex mb-4">
                              <div className="timeline-marker me-3">
                                <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                                  index === 0 ? 'bg-primary' : 'bg-secondary'
                                }`} style={{ width: '30px', height: '30px' }}>
                                  <FontAwesomeIcon icon={faClock} className="text-white" size="sm" />
                                </div>
                              </div>
                              <div className="timeline-content flex-grow-1">
                                <Card className={` shadow-sm ${index === 0 ? 'border-primary' : ''}`}>
                                  <Card.Body className="py-3">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                      <div>
                                        <strong>Status Changed:</strong>
                                        {history.old_status && (
                                          <Badge bg="secondary" className="ms-2 me-1">
                                            {history.old_status}
                                          </Badge>
                                        )}
                                        <span className="mx-1">→</span>
                                        <Badge bg={getStatusBadgeVariant(history.new_status)} className="me-2">
                                          {history.new_status}
                                        </Badge>
                                      </div>
                                      <small className="text-muted">
                                        {formatDate(history.created_at)}
                                      </small>
                                    </div>
                                    {history.notes && (
                                      <p className="mb-2 text-muted">{history.notes}</p>
                                    )}
                                    <small className="text-muted">
                                      Changed by: {history.changed_by_system ? 'System' : 
                                                 history.changed_by ? history.changed_by.name : 'Unknown'}
                                    </small>
                                  </Card.Body>
                                </Card>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </div>
                
                {/* FOOTER */}
                <div className="modal-footer bg-white d-flex justify-content-end">
                  <Button 
                    variant="secondary" 
                    className="rounded-pill px-4"
                    onClick={() => setShowHistoryModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        </>
    );
};

export default ManageCommands;
