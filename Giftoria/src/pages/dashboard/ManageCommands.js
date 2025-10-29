import React, { useEffect, useState } from "react";
import { Card, Table, Button, Breadcrumb, InputGroup, Form, Row, Col } from '@themesberg/react-bootstrap';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const ManageCommands = () => {
    const [commands, setCommands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedCommand, setSelectedCommand] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
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

    useEffect(() => {
        const fetchCommands = async () => {
            try {
                const res = await axios.get(`${API_URL}/commands`);
                setCommands(res.data);
            } catch (err) {
                // handle error
            } finally {
                setLoading(false);
            }
        };
        fetchCommands();
    }, []);

   // Filter commands by search (name, description, customer name, phone) and status
const filteredCommands = commands.filter(cmd => {
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
                    <Breadcrumb.Item>Volt</Breadcrumb.Item>
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
                            <th>Placed At</th>
                            <th>Payment</th>
                            <th>Customer Phone</th>
                            <th>Desired Delivery</th>
                            <th>Customer</th>
                            <th>Note</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCommands.map(cmd => (
                            <tr key={cmd.id}>
                                <td>{cmd.name}</td>
                                <td>{cmd.status}</td>
                                <td>{cmd.total}</td>
                                <td>{formatDate(cmd.placed_at)}</td>
                                <td>{formatPayment(cmd.payment_method)}</td>
                                <td>{cmd.customer_phone || '-'}</td>
                                <td>{formatDate(cmd.desired_delivery_at)}</td>
                                <td>{cmd.customer_first_name} {cmd.customer_last_name}</td>
                                <td>{cmd.description}</td>
                                <td>
                                    <Button variant="primary" size="sm" className="me-2" onClick={() => { setSelectedCommand(cmd); setShowModal(true); }}>Details</Button>
                                    <Button variant="warning" size="sm" onClick={() => {
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
                                    }}>Manage</Button>
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
      <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
        
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
                          <table className="table table-sm mb-0 border-0">
                            <tbody>
                              {cp.custom_fields.map((cf, i) => (
                                <tr key={i}>
                                  <th className="bg-light w-50">{cf.name}</th>
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
      <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
        
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
                    className="rounded-3 border-0 shadow-sm"
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                  >
                    <option value="">Select status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-primary">Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    className="rounded-3 border-0 shadow-sm"
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
                    className="rounded-3 border-0 shadow-sm"
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
                    className="rounded-3 border-0 shadow-sm"
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
                    className="rounded-3 border-0 shadow-sm"
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
                    className="rounded-3 border-0 shadow-sm"
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
                    className="rounded-3 border-0 shadow-sm"
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
                    className="rounded-3 border-0 shadow-sm"
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
                const res = await axios.put(`${API_URL}/commands/${selectedCommand.id}`, editForm);
                const updated = res.data;
                setCommands((prev) =>
                  prev.map((c) => (c.id === updated.id ? updated : c))
                );
                setSelectedCommand(updated);
                setEditSuccess("Updated successfully");
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

        </>
    );
};

export default ManageCommands;
