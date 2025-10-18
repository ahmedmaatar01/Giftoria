import React, { useEffect, useState } from "react";
import { Card, Table, Button, Form, Modal, Row, Col } from '@themesberg/react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const ManageCustomField = () => {
  const [fields, setFields] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ category_id: '', name: '', type: 'text', options: '', is_required: false, affects_price: false, price_type: '', price_value: '' });

  // Unified change handler for all fields
  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/custom-fields`).then(res => setFields(res.data));
    axios.get(`${API_URL}/categories`).then(res => setCategories(res.data)).finally(() => setLoading(false));
  }, []);

  const handleShowModal = (field = null) => {
    if (field) {
      setForm({ ...field, options: Array.isArray(field.options) ? field.options.join(',') : (field.options || '') });
      setIsEdit(true);
    } else {
      setForm({ category_id: '', name: '', type: 'text', options: '', is_required: false, affects_price: false, price_type: '', price_value: '' });
      setIsEdit(false);
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const submitData = { ...form, options: form.options ? form.options.split(',').map(o => o.trim()) : [] };
      if (isEdit) {
        await axios.put(`${API_URL}/custom-fields/${form.id}`, submitData);
      } else {
        await axios.post(`${API_URL}/custom-fields`, submitData);
      }
      setShowModal(false);
      setLoading(true);
      const res = await axios.get(`${API_URL}/custom-fields`);
      setFields(res.data);
    } catch {}
  };

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Header>
        <h5>Custom Fields</h5>
        <Button size="sm" onClick={() => handleShowModal()}>+ New Field</Button>
      </Card.Header>
      <Card.Body>
        <Table responsive>
          <thead>
            <tr><th>Name</th><th>Type</th><th>Category</th><th>Required</th><th>Affects Price</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {fields.map(field => (
              <tr key={field.id}>
                <td>{field.name}</td>
                <td>{field.type}</td>
                <td>{categories.find(c => c.id === field.category_id)?.name || ''}</td>
                <td>{field.is_required ? 'Yes' : 'No'}</td>
                <td>{field.affects_price ? 'Yes' : 'No'}</td>
                <td>
                  <Button size="sm" onClick={() => handleShowModal(field)} className="me-2">Edit</Button>
                  <Button size="sm" variant="danger" onClick={async () => {
                    if(window.confirm('Are you sure you want to delete this custom field?')) {
                      try {
                        await axios.delete(`${API_URL}/custom-fields/${field.id}`);
                        setFields(fields => fields.filter(f => f.id !== field.id));
                      } catch (err) {
                        alert('Failed to delete custom field.');
                      }
                    }
                  }}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{isEdit ? 'Edit' : 'New'} Custom Field</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category_id" value={form.category_id || ''} onChange={handleChange} required>
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={form.type} onChange={handleChange}>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Select</option>
                <option value="checkbox">Checkbox</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Options (comma separated)</Form.Label>
              <Form.Control name="options" value={form.options} onChange={handleChange} disabled={form.type !== 'select'} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Required" name="is_required" checked={form.is_required} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Affects Price" name="affects_price" checked={form.affects_price} onChange={handleChange} />
            </Form.Group>
            {form.affects_price && (
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Price Type</Form.Label>
                    <Form.Select name="price_type" value={form.price_type} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="fixed">Fixed</option>
                      <option value="percent">Percent</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Price Value</Form.Label>
                    <Form.Control name="price_value" value={form.price_value} onChange={handleChange} type="number" step="0.01" />
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'}</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default ManageCustomField;
