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
    const [showModal, setShowModal] = useState(false);
    const [selectedCommand, setSelectedCommand] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
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

    // Filter commands by search
    const filteredCommands = commands.filter(cmd =>
        cmd.name?.toLowerCase().includes(search.toLowerCase()) ||
        (cmd.description && cmd.description.toLowerCase().includes(search.toLowerCase()))
    );

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
            <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Command Details</h5>
                            <Button variant="close" onClick={() => setShowModal(false)}>&times;</Button>
                        </div>
                        <div className="modal-body">
                            <h6>General Info</h6>
                            <ul>
                                <li><b>Name:</b> {selectedCommand.name}</li>
                                <li><b>Status:</b> {selectedCommand.status}</li>
                                <li><b>Total:</b> {selectedCommand.total}</li>
                                <li><b>Placed At:</b> {formatDate(selectedCommand.placed_at)}</li>
                                <li><b>Source:</b> {selectedCommand.source}</li>
                                <li><b>Payment Method:</b> {formatPayment(selectedCommand.payment_method)}</li>
                                <li><b>Desired Delivery:</b> {formatDate(selectedCommand.desired_delivery_at)}</li>
                                <li><b>Note:</b> {selectedCommand.description}</li>
                            </ul>
                            <h6>Customer Info</h6>
                            <ul>
                                <li><b>First Name:</b> {selectedCommand.customer_first_name}</li>
                                <li><b>Last Name:</b> {selectedCommand.customer_last_name}</li>
                                <li><b>Email:</b> {selectedCommand.customer_email}</li>
                                <li><b>Phone:</b> {selectedCommand.customer_phone}</li>
                                <li><b>Shipping Address:</b> {selectedCommand.shipping_address}</li>
                                <li><b>Billing Address:</b> {selectedCommand.billing_address}</li>
                            </ul>
                            <h6>Products</h6>
                            <ul>
                                {selectedCommand.command_products && selectedCommand.command_products.length > 0 ? (
                                    selectedCommand.command_products.map((cp, idx) => (
                                        <li key={idx} style={{ marginBottom: '1em' }}>
                                            <b>Product:</b> {cp.product?.name || cp.product_id}<br />
                                            <b>Quantity:</b> {cp.quantity}<br />
                                            <b>Unit Price:</b> {cp.unit_price}<br />
                                            <b>Line Total:</b> {cp.line_total}<br />
                                            <b>Custom Fields:</b>
                                            <ul>
                                                {Array.isArray(cp.custom_fields) && cp.custom_fields.length > 0 ? (
                                                    cp.custom_fields.map((cf, i) => (
                                                        <li key={i}><b>{cf.name}:</b> {cf.value}</li>
                                                    ))
                                                ) : (<li>None</li>)}
                                            </ul>
                                        </li>
                                    ))
                                ) : (<li>No products</li>)}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Modal for managing/editing command */}
        {showEditModal && selectedCommand && (
            <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Manage Command</h5>
                            <Button variant="close" onClick={() => setShowEditModal(false)}>&times;</Button>
                        </div>
                        <div className="modal-body">
                            {editError && <div className="alert alert-danger">{editError}</div>}
                            {editSuccess && <div className="alert alert-success">{editSuccess}</div>}
                            <Form onSubmit={(e) => { e.preventDefault(); }}>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Status</Form.Label>
                                            <Form.Select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                                                <option value="">Select status</option>
                                                <option value="pending">pending</option>
                                                <option value="processing">processing</option>
                                                <option value="completed">completed</option>
                                                <option value="cancelled">cancelled</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Note</Form.Label>
                                            <Form.Control as="textarea" rows={1} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Customer First Name</Form.Label>
                                            <Form.Control type="text" value={editForm.customer_first_name} onChange={(e) => setEditForm({ ...editForm, customer_first_name: e.target.value })} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Customer Last Name</Form.Label>
                                            <Form.Control type="text" value={editForm.customer_last_name} onChange={(e) => setEditForm({ ...editForm, customer_last_name: e.target.value })} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Customer Email</Form.Label>
                                            <Form.Control type="email" value={editForm.customer_email} onChange={(e) => setEditForm({ ...editForm, customer_email: e.target.value })} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Customer Phone</Form.Label>
                                            <Form.Control type="text" value={editForm.customer_phone} onChange={(e) => setEditForm({ ...editForm, customer_phone: e.target.value })} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Shipping Address</Form.Label>
                                            <Form.Control type="text" value={editForm.shipping_address} onChange={(e) => setEditForm({ ...editForm, shipping_address: e.target.value })} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Billing Address</Form.Label>
                                            <Form.Control type="text" value={editForm.billing_address} onChange={(e) => setEditForm({ ...editForm, billing_address: e.target.value })} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={editLoading}>Cancel</Button>
                            <Button variant="primary" disabled={editLoading} onClick={async () => {
                                try {
                                    setEditLoading(true);
                                    setEditError(null);
                                    setEditSuccess(null);
                                    const res = await axios.put(`${API_URL}/commands/${selectedCommand.id}`, editForm);
                                    const updated = res.data;
                                    setCommands(prev => prev.map(c => c.id === updated.id ? updated : c));
                                    setSelectedCommand(updated);
                                    setEditSuccess('Updated successfully');
                                    setShowEditModal(false);
                                } catch (err) {
                                    const msg = err.response?.data?.message || 'Update failed';
                                    const validation = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : '';
                                    setEditError(validation ? `${msg}: ${validation}` : msg);
                                } finally {
                                    setEditLoading(false);
                                }
                            }}>Save changes</Button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default ManageCommands;
