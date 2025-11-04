import React, { useEffect, useState } from "react";
import { Card, Table, Button, Form, Modal, Row, Col } from '@themesberg/react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const ManageCustomField = () => {
  const [fields, setFields] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const emptyForm = {
    category_id: '',
    name: '',
    name_ar: '',
    type: 'text',
    options_en: '', // comma separated english
    options_ar: '', // comma separated arabic
    is_required: false,
    affects_price: false,
    price_type: '',
    price_value: ''
  };

  const [form, setForm] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [fRes, cRes] = await Promise.all([
        axios.get(`${API_URL}/custom-fields`),
        axios.get(`${API_URL}/categories`)
      ]);
      setFields(fRes.data);
      setCategories(cRes.data);
      setLoading(false);
    };
    load();
  }, []);

  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleShowModal = (field = null) => {
    if (field) {
      // field.options is expected as array of {en,ar}
      const en = Array.isArray(field.options) ? field.options.map(o => o.en || '').join(', ') : '';
      const ar = Array.isArray(field.options) ? field.options.map(o => o.ar || '').join(', ') : '';

      setForm({
        category_id: field.category_id || '',
        name: field.name || '',
        name_ar: field.name_ar || '',
        type: field.type || 'text',
        options_en: en,
        options_ar: ar,
        is_required: !!field.is_required,
        affects_price: !!field.affects_price,
        price_type: field.price_type || '',
        price_value: field.price_value || '',
        id: field.id // keep id for edit
      });
      setIsEdit(true);
    } else {
      setForm(emptyForm);
      setIsEdit(false);
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    // build options only for select type
    let options = [];
    if (form.type === 'select') {
      const enList = form.options_en.split(',').map(s => s.trim()).filter(s => s !== '');
      const arList = form.options_ar.split(',').map(s => s.trim());
      if (enList.length !== arList.length) {
        alert('English and Arabic options count must match.');
        return;
      }
      options = enList.map((en, i) => ({ en, ar: arList[i] || '' }));
    }

    const submitData = {
      category_id: form.category_id,
      name: form.name,
      name_ar: form.name_ar,
      type: form.type,
      options: options,
      is_required: form.is_required,
      affects_price: form.affects_price,
      price_type: form.price_type || null,
      price_value: form.price_value || null
    };

    try {
      if (isEdit && form.id) {
        await axios.put(`${API_URL}/custom-fields/${form.id}`, submitData);
      } else {
        await axios.post(`${API_URL}/custom-fields`, submitData);
      }
      // refresh
      const res = await axios.get(`${API_URL}/custom-fields`);
      setFields(res.data);
      setShowModal(false);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
      alert('Failed to save field.');
    }
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
            <tr><th>Name</th><th>Type</th><th>Category</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {fields.map(field => (
              <tr key={field.id}>
                <td>
                  {field.name}
                  {field.name_ar && <div style={{ fontSize: "12px", color: "#888" }}>{field.name_ar}</div>}
                </td>
                <td>{field.type}</td>
                <td>{categories.find(c => c.id === field.category_id)?.name || ''}</td>
                <td>
                  <Button size="sm" onClick={() => handleShowModal(field)} className="me-2">Edit</Button>
                  <Button size="sm" variant="danger" onClick={async () => {
                    if (!window.confirm('Are you sure?')) return;
                    try {
                      await axios.delete(`${API_URL}/custom-fields/${field.id}`);
                      setFields(prev => prev.filter(f => f.id !== field.id));
                    } catch (err) {
                      alert('Failed to delete');
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
              <Form.Select name="category_id" value={form.category_id} onChange={handleChange}>
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name (EN)</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name (AR)</Form.Label>
              <Form.Control name="name_ar" value={form.name_ar} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={form.type} onChange={handleChange}>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Select</option>
              </Form.Select>

            </Form.Group>

            {form.type === 'select' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Options (English, comma separated)</Form.Label>
                  <Form.Control
                    name="options_en"
                    value={form.options_en}
                    onChange={handleChange}
                    placeholder="Pink, Red, Blue"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Options (Arabic, comma separated)</Form.Label>
                  <Form.Control
                    name="options_ar"
                    value={form.options_ar}
                    onChange={handleChange}
                    placeholder="وردي, أحمر, أزرق"
                  />
                </Form.Group>
              </>
            )}
          {form.type === 'number' && (
  <Form.Group className="mb-3">
    <Form.Label>Default Number Value (optional)</Form.Label>
    <Form.Control
      type="number"
      name="default_value"
      value={form.default_value || ""}
      onChange={handleChange}
      placeholder="Enter default number"
    />
  </Form.Group>
)}

         
            {form.affects_price && (
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Price Type</Form.Label>
                    <Form.Select name="price_type" value={form.price_type} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="fixed">Fixed</option>
                      <option value="percentage">Percentage</option>
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
