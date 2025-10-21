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
                                <td>{cmd.placed_at}</td>
                                <td>{cmd.customer_first_name} {cmd.customer_last_name}</td>
                                <td>{cmd.description}</td>
                                <td>
                                    <Button variant="primary" size="sm" onClick={() => { setSelectedCommand(cmd); setShowModal(true); }}>Details</Button>
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
                                <li><b>Placed At:</b> {selectedCommand.placed_at}</li>
                                <li><b>Source:</b> {selectedCommand.source}</li>
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
        </>
    );
};

export default ManageCommands;
