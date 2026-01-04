import React, { useEffect, useState } from "react";
import { Card, Table, Button, Breadcrumb, InputGroup, Form, Row, Col, Modal, Badge, Spinner } from '@themesberg/react-bootstrap';
import { faHome, faSearch, faEye, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = (user && (user.access_token || user.token || user.accessToken)) || localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [commands, setCommands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userCommands, setUserCommands] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all users (you may need a dedicated endpoint; using /users or a custom admin endpoint)
                // For now, we'll aggregate from commands to get users
                const cmdRes = await axios.get(`${API_URL}/commands`, { headers: getAuthHeaders() });
                const cmdList = Array.isArray(cmdRes.data) ? cmdRes.data : [];
                setCommands(cmdList);

                // Extract unique users from commands
                const userMap = new Map();
                cmdList.forEach(cmd => {
                    if (cmd.user_id && cmd.user) {
                        if (!userMap.has(cmd.user_id)) {
                            userMap.set(cmd.user_id, {
                                id: cmd.user_id,
                                name: cmd.user.name || 'N/A',
                                email: cmd.user.email || 'N/A',
                                country: cmd.user.country || '',
                                address: cmd.user.address || '',
                                commandCount: 0
                            });
                        }
                        userMap.get(cmd.user_id).commandCount += 1;
                    }
                });

                setUsers(Array.from(userMap.values()));
            } catch (err) {
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredUsers = users.filter(u => {
        const searchLower = search.toLowerCase();
        return (
            u.name?.toLowerCase().includes(searchLower) ||
            u.email?.toLowerCase().includes(searchLower)
        );
    });

    const openUserDetails = (user) => {
        setSelectedUser(user);
        const userCmds = commands.filter(cmd => cmd.user_id === user.id);
        setUserCommands(userCmds);
        setShowModal(true);
    };

    const formatDate = (value) => {
        if (!value) return "-";
        try {
            const d = new Date(value);
            if (isNaN(d)) return String(value).replace('T', ' ').slice(0, 16);
            const pad = (n) => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        } catch {
            return String(value);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-md-0">
                    <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active>Manage Users</Breadcrumb.Item>
                    </Breadcrumb>
                    <h4>Manage Users</h4>
                    <p className="mb-0">View all registered users and their command history.</p>
                </div>
            </div>

            <div className="table-settings mb-4">
                <Row className="justify-content-between align-items-center">
                    <Col xs={8} md={6} lg={4}>
                        <InputGroup>
                            <InputGroup.Text>
                                <FontAwesomeIcon icon={faSearch} />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Search by name or email"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </div>

            <Card border="light" className="shadow-sm">
                <Card.Header>
                    <h5>Users</h5>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" />
                            <p className="mt-2">Loading users...</p>
                        </div>
                    ) : (
                        <Table responsive className="align-items-center table-flush">
                            <thead className="thead-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Country</th>
                                    <th>Address</th>
                                    <th>Commands</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted">No users found</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td>
                                                <FontAwesomeIcon icon={faEnvelope} className="me-2 text-muted" />
                                                {user.email}
                                            </td>
                                            <td>{user.country || '—'}</td>
                                            <td>
                                                {user.address ? (
                                                    <>
                                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-muted" />
                                                        {user.address}
                                                    </>
                                                ) : '—'}
                                            </td>
                                            <td>
                                                <Badge bg="primary" pill>{user.commandCount}</Badge>
                                            </td>
                                            <td>
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    onClick={() => openUserDetails(user)}
                                                >
                                                    <FontAwesomeIcon icon={faEye} /> View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* User Details Modal */}
            {showModal && selectedUser && (
                <div
                    className="modal show fade"
                    style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title fw-bold">User Details</h5>
                                <button
                                    type="button"
                                    className="btn btn-light btn-sm rounded-circle"
                                    style={{ width: "32px", height: "32px", fontSize: "1.2rem", lineHeight: "1" }}
                                    onClick={() => setShowModal(false)}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body p-4 bg-light">
                                <h6 className="fw-semibold mb-3 text-primary">User Information</h6>
                                <table className="table table-striped table-bordered bg-white rounded">
                                    <tbody>
                                        <tr><th className="w-25">ID</th><td>{selectedUser.id}</td></tr>
                                        <tr><th>Name</th><td>{selectedUser.name}</td></tr>
                                        <tr><th>Email</th><td>{selectedUser.email}</td></tr>
                                        <tr><th>Country</th><td>{selectedUser.country || '—'}</td></tr>
                                        <tr><th>Address</th><td>{selectedUser.address || '—'}</td></tr>
                                        <tr><th>Total Commands</th><td><Badge bg="primary">{selectedUser.commandCount}</Badge></td></tr>
                                    </tbody>
                                </table>

                                <h6 className="fw-semibold mb-3 mt-4 text-primary">Command History</h6>
                                {userCommands.length === 0 ? (
                                    <p className="text-muted">No commands found.</p>
                                ) : (
                                    <Table striped bordered hover responsive className="bg-white">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>#</th>
                                                <th>Order ID</th>
                                                <th>Status</th>
                                                <th>Total</th>
                                                <th>Placed At</th>
                                                <th>Delivery Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userCommands.map((cmd, idx) => (
                                                <tr key={cmd.id}>
                                                    <td>{idx + 1}</td>
                                                    <td>#{cmd.id}</td>
                                                    <td>
                                                        <Badge bg={
                                                            cmd.status === 'delivered' ? 'success' :
                                                            cmd.status === 'pending' ? 'warning' :
                                                            cmd.status === 'cancelled' ? 'danger' : 'secondary'
                                                        }>
                                                            {cmd.status}
                                                        </Badge>
                                                    </td>
                                                    <td>{cmd.total} DT</td>
                                                    <td>{formatDate(cmd.placed_at)}</td>
                                                    <td>{formatDate(cmd.desired_delivery_at)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </div>
                            <div className="modal-footer bg-white">
                                <Button variant="secondary" className="rounded-pill px-4" onClick={() => setShowModal(false)}>
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

export default ManageUsers;
