import React, { useEffect, useState } from "react";
import { Card, Table, Button, Form, Modal, Row, Col, InputGroup } from '@themesberg/react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', parent_id: '', show_menu: false });

  // Defensive: always ensure form is never null/undefined and all fields are strings/bools
  const safeForm = form && typeof form === 'object' ? {
    name: form.name ?? '',
    slug: form.slug ?? '',
    description: form.description ?? '',
    parent_id: form.parent_id ?? '',
    show_menu: !!form.show_menu,
    id: form.id
  } : { name: '', slug: '', description: '', parent_id: '', show_menu: false, id: undefined };

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
    axios.get(`${API_URL}/categories`).then(res => setCategories(res.data)).finally(() => setLoading(false));
  }, []);

  const handleShowModal = (cat = null) => {
    if (cat && typeof cat === 'object') {
      setForm({
        name: cat.name ?? '',
        slug: cat.slug ?? '',
        description: cat.description ?? '',
        parent_id: cat.parent_id ?? '',
        show_menu: !!cat.show_menu,
        id: cat.id
      });
      setIsEdit(true);
    } else {
      setForm({ name: '', slug: '', description: '', parent_id: '', show_menu: false });
      setIsEdit(false);
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.put(`${API_URL}/categories/${form.id}`, form);
      } else {
        await axios.post(`${API_URL}/categories`, form);
      }
      setShowModal(false);
      setLoading(true);
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
    } catch {}
  };

  if (form == null) {
    // This should never happen, but if it does, log for debugging
    console.error('form is null!');
  }
  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Header>
        <h5>Categories</h5>
        <Button size="sm" onClick={() => handleShowModal()}>+ New Category</Button>
      </Card.Header>
      <Card.Body>
        <Table responsive>
          <thead>
            <tr><th>Name</th><th>Slug</th><th>Parent</th><th>Show Menu</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.slug}</td>
                <td>{cat.parent ? cat.parent.name : ''}</td>
                <td>{cat.show_menu ? 'Yes' : 'No'}</td>
                <td><Button size="sm" onClick={() => handleShowModal(cat)}>Edit</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{isEdit ? 'Edit' : 'New'} Category</Modal.Title></Modal.Header>
        <Modal.Body>
          {safeForm && typeof safeForm === 'object' ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={safeForm.name || ''} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Slug</Form.Label>
                <Form.Control name="slug" value={safeForm.slug || ''} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" value={safeForm.description || ''} onChange={handleChange} as="textarea" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Parent Category</Form.Label>
                <Form.Select name="parent_id" value={safeForm.parent_id || ''} onChange={handleChange}>
                  <option value="">None</option>
                  {categories.filter(c => c.id !== safeForm.id).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="Show in Menu" name="show_menu" checked={safeForm.show_menu} onChange={handleChange} />
              </Form.Group>
            </Form>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'}</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default ManageCategory;
