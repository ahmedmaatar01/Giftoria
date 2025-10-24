import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from '@themesberg/react-bootstrap';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const API_URL = 'http://localhost:8000/api';

const ProductModal = ({ show, onHide, onSubmit, form, setForm, isEdit }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (show) {
      axios.get(`${API_URL}/categories`).then(res => setCategories(res.data));
    }
  }, [show]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleDescriptionChange = (content) => {
    setForm(f => ({ ...f, description: content }));
  };

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image'
  ];

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? 'Edit Product' : 'Create Product'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={form.name || ''} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Arabic Name</Form.Label>
            <Form.Control
              name="arabic_name"
              value={form.arabic_name || ''}
              onChange={handleChange}
              placeholder="اسم المنتج بالعربية"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <ReactQuill 
              theme="snow"
              value={form.description || ''} 
              onChange={handleDescriptionChange}
              modules={modules}
              formats={formats}
              style={{ height: '200px', marginBottom: '100px' }}
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control name="price" value={form.price || ''} onChange={handleChange} type="number" step="0.01" required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control name="stock" value={form.stock || ''} onChange={handleChange} type="number" required />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select name="category_id" value={form.category_id || ''} onChange={handleChange} required>
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="featured">
          <Form.Check
            type="checkbox"
            label="Featured Product"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="lead_time">
          <Form.Label>Lead Time</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. 2 days for preparation"
            value={form.lead_time}
            onChange={(e) => setForm({ ...form, lead_time: e.target.value })}
          />
        </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Featured Image</Form.Label>
            <Form.Control name="featured_image" type="file" accept="image/*" onChange={e => {
              const files = e?.target?.files;
              if (files && typeof files === 'object' && typeof files.length === 'number') {
                setForm(f => ({ ...f, featured_image: files.length > 0 ? files[0] : null }));
              } else {
                setForm(f => ({ ...f, featured_image: null }));
              }
            }} />
            {isEdit && form.existing_featured_image && (
              <div style={{marginTop:8}}>
                <img src={`http://localhost:8000${form.existing_featured_image}`} alt="Featured Preview" style={{maxWidth:100, maxHeight:100, borderRadius:8}} />
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Other Images</Form.Label>
            <Form.Control name="images" type="file" multiple accept="image/*" onChange={e => {
              const files = e?.target?.files;
              if (files && typeof files === 'object' && typeof files.length === 'number') {
                setForm(f => ({ ...f, images: files.length > 0 ? files : [] }));
              } else {
                setForm(f => ({ ...f, images: [] }));
              }
            }} />
            {isEdit && form.existing_images && form.existing_images.length > 0 && (
              <div style={{marginTop:8, display:'flex', gap:8, flexWrap:'wrap'}}>
                {form.existing_images.map((img, idx) => (
                  <img key={idx} src={`http://localhost:8000${img}`} alt={`Preview ${idx+1}`} style={{maxWidth:80, maxHeight:80, borderRadius:6}} />
                ))}
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={onSubmit}>{isEdit ? 'Update' : 'Create'}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
