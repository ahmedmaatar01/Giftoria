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
        cmd.name.toLowerCase().includes(search.toLowerCase()) ||
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
                            <th>Description</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCommands.map(cmd => (
                            <tr key={cmd.id}>
                                <td>{cmd.name}</td>
                                <td>{cmd.description}</td>
                                <td>{cmd.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {loading && <div>Loading...</div>}
            </Card.Body>
        </Card>
        </>
    );
};

export default ManageCommands;
