import React, { useEffect, useState } from "react";
import { Card, Table, Button, Breadcrumb, InputGroup, Form, Row, Col, Modal, Badge, Spinner } from '@themesberg/react-bootstrap';
import { faHome, faSearch, faEye, faUserShield, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/admin';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = (user && (user.access_token || user.token || user.accessToken)) || localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const ManageAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', is_super: '' });
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/admins`, { headers: getAuthHeaders() });
            setAdmins(res.data);
        } catch (err) {
            setError('Failed to fetch admins');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError("");
        try {
            await axios.post(`${API_URL}/admins`, newAdmin, { headers: getAuthHeaders() });
            setShowModal(false);
            setNewAdmin({ name: '', email: '', password: '', is_super: '' });
            fetchAdmins();
        } catch (err) {
            setError('Failed to create admin');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this admin?')) return;
        try {
            await axios.delete(`${API_URL}/admins/${id}`, { headers: getAuthHeaders() });
            fetchAdmins();
        } catch (err) {
            setError('Failed to delete admin');
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-md-0">
                    <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active>Manage Admins</Breadcrumb.Item>
                    </Breadcrumb>
                    <h4>Manage Admins</h4>
                    <p className="mb-0">View, create, and delete admin accounts.</p>
                </div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" /> New Admin
                </Button>
            </div>
            <Card border="light" className="shadow-sm">
                <Card.Header>
                    <h5>Admins</h5>
                </Card.Header>
                <Card.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {loading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" />
                            <p className="mt-2">Loading admins...</p>
                        </div>
                    ) : (
                        <Table responsive className="align-items-center table-flush">
                            <thead className="thead-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    {/* <th>Is Super</th> */}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">No admins found</td>
                                    </tr>
                                ) : (
                                    admins.map(admin => (
                                        <tr key={admin.id}>
                                            <td>{admin.id}</td>
                                            <td>{admin.name}</td>
                                            <td>{admin.email}</td>
                                            {/* <td>{admin.is_super ?? '—'}</td> */}
                                            <td>
                                                {admin.is_super === 7 ? (
                                                    <Badge bg="secondary">Super Admin</Badge>
                                                ) : (
                                                    <Button variant="danger" size="sm" onClick={() => handleDelete(admin.id)}>
                                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
            {/* Create Admin Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>New Admin</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreate}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control required type="email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control required type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} />
                        </Form.Group>
                        {/*
                        <Form.Group className="mb-3">
                            <Form.Label>Is Super (optional)</Form.Label>
                            <Form.Control type="number" min="0" max="9" value={newAdmin.is_super} onChange={e => setNewAdmin({ ...newAdmin, is_super: e.target.value })} />
                        </Form.Group>
                        */}
                        {error && <div className="alert alert-danger">{error}</div>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default ManageAdmins;
