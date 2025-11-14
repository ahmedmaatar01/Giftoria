import React, { useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";
import { BACKEND_URL } from "../../api/config";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(AuthContext);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/admin/login`, { email, password });
            const { user, access_token } = response.data || {};
            const userWithToken = access_token ? { ...user, access_token } : user;
            // Persist user and token
            setUser(userWithToken);
            localStorage.setItem("user", JSON.stringify(userWithToken));
            if (access_token) localStorage.setItem("access_token", access_token);
            // Go to dashboard overview
            history.push(Routes.DashboardOverview.path);
        } catch (err) {
            if (err.response) console.error('Admin login error response:', err.response.data);
            else console.error('Admin login error:', err);
            const apiErr = err?.response?.data;
            setError(apiErr?.error || apiErr?.message || 'Invalid admin credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
                <Container>
 
                    <Row className="justify-content-center form-bg-image mt-5" style={{ backgroundImage: `url(${BgImage})` }}>
                        <Col xs={12} className="d-flex align-items-center justify-content-center">
                            <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                                <div className="text-center text-md-center mb-4 mt-md-0">
                                    <h3 className="mb-0">Admin sign in</h3>
                                </div>
                                {error && (
                                    <div className="alert alert-danger" role="alert">{error}</div>
                                )}
                                <Form className="mt-4" onSubmit={handleSubmit}>
                                    <Form.Group id="email" className="mb-4">
                                        <Form.Label>Email</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faEnvelope} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                autoFocus
                                                required
                                                type="email"
                                                placeholder="admin@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group id="password" className="mb-4">
                                        <Form.Label>Password</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faUnlockAlt} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                required
                                                type="password"
                                                placeholder="Your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <Form.Check type="checkbox">
                                            <FormCheck.Input id="rememberMe" className="me-2" />
                                            <FormCheck.Label htmlFor="rememberMe" className="mb-0">Remember me</FormCheck.Label>
                                        </Form.Check>
                                        <Card.Link className="small text-end">Lost password?</Card.Link>
                                    </div>

                                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                                        {loading ? 'Signing in…' : 'Sign in as Admin'}
                                    </Button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    );
};

export default AdminLogin;
