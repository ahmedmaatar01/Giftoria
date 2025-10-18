import React, { useEffect, useState } from "react";
import { Card, Table, Button, Form, Modal, Row, Col, InputGroup, Image, Dropdown, ButtonGroup, Breadcrumb } from '@themesberg/react-bootstrap';
import { faEdit, faTrashAlt, faEye, faHome, faSearch, faEllipsisV, faCog, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    slug: '', 
    description: '', 
    parent_id: '', 
    show_menu: false,
    featured_image: null,
  existing_featured_image: ''
  });

  // Defensive: always ensure form is never null/undefined and all fields are strings/bools
  const safeForm = form && typeof form === 'object' ? {
    name: form.name ?? '',
    slug: form.slug ?? '',
    description: form.description ?? '',
    parent_id: form.parent_id ?? '',
    show_menu: !!form.show_menu,
    featured_image: form.featured_image ?? null,
  existing_featured_image: form.existing_featured_image ?? '',
    id: form.id
  } : { 
    name: '', 
    slug: '', 
    description: '', 
    parent_id: '', 
    show_menu: false, 
    featured_image: null,
    images: [],
    existing_featured_image: '',
    existing_images: [],
    id: undefined 
  };

  // Unified change handler for all fields
  const handleChange = e => {
    const { name, type, value, checked, files } = e.target;
    if (type === 'file') {
      if (name === 'featured_image') {
        setForm(f => ({ ...f, [name]: files[0] }));
      }
    } else {
      setForm(f => ({
        ...f,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleShowModal = (cat = null) => {
    if (cat && typeof cat === 'object') {
      setForm({
        name: cat.name ?? '',
        slug: cat.slug ?? '',
        description: cat.description ?? '',
        parent_id: cat.parent_id ?? '',
        show_menu: !!cat.show_menu,
        featured_image: null,
  existing_featured_image: cat.featured_image || (cat.images && cat.images.find(i => i.is_featured)?.image_path) || '',
        id: cat.id
      });
      setIsEdit(true);
    } else {
      setForm({ 
        name: '', 
        slug: '', 
        description: '', 
        parent_id: '', 
        show_menu: false,
        featured_image: null,
  existing_featured_image: ''
      });
      setIsEdit(false);
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      let categoryId = null;
      
      // Prepare data with proper boolean conversion
      const categoryData = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        parent_id: form.parent_id || null,
        show_menu: Boolean(form.show_menu) // Ensure it's always a boolean
      };
      
      // 1. Create or update category (without images)
      if (isEdit) {
        await axios.put(`${API_URL}/categories/${form.id}`, categoryData);
        categoryId = form.id;
      } else {
        const categoryRes = await axios.post(`${API_URL}/categories`, categoryData);
        categoryId = categoryRes.data.id;
      }

      // 2. Handle image uploads using FormData for multipart/form-data
      const formData = new FormData();
      let hasImages = false;

      if (form.featured_image) {
        formData.append('featured_image', form.featured_image);
        hasImages = true;
      }



      // Add other fields to FormData for consistency with proper boolean
      if (hasImages) {
        formData.append('name', form.name);
        formData.append('slug', form.slug);
        formData.append('description', form.description);
        formData.append('parent_id', form.parent_id || '');
        formData.append('show_menu', Boolean(form.show_menu) ? '1' : '0');
        // Update category with image
        await axios.post(`${API_URL}/categories/${categoryId}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowModal(false);
      setLoading(true);
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error saving category:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/categories/${id}`);
      setCategories(categories => categories.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Filter categories by search
  const filteredCategories = Array.isArray(categories) ? categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(search.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  }) : [];

  if (form == null) {
    // This should never happen, but if it does, log for debugging
    console.error('form is null!');
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Volt</Breadcrumb.Item>
            <Breadcrumb.Item active>Categories</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Categories</h4>
          <p className="mb-0">Manage your product categories.</p>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <ButtonGroup>
            <Button variant="primary" size="sm" onClick={() => handleShowModal()}>+ New Category</Button>
            <Button variant="outline-primary" size="sm">Export</Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="table-settings mb-4">
        <Row className="justify-content-between align-items-center">
          <Col xs={8} md={6} lg={4} xl={5}>
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <Form.Control 
                type="text" 
                placeholder="Search categories..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </InputGroup>
          </Col>
        </Row>
      </div>

      <Card border="light" className="shadow-sm mb-4">
        <Card.Header>
          <h5>Categories</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive className="align-items-center table-flush">
            <thead className="thead-light">
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Parent</th>
                <th>Show Menu</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(cat => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>{cat.slug}</td>
                  <td>{cat.parent ? cat.parent.name : ''}</td>
                  <td>{cat.show_menu ? 'Yes' : 'No'}</td>
                  <td>
                    {cat.featured_image || (cat.images && cat.images.length > 0) ? (
                      <Image 
                        src={`http://localhost:8000/storage/${cat.featured_image || cat.images.find(i => i.is_featured)?.image_path || cat.images[0]?.image_path}`} 
                        alt="Category image" 
                        width={40} 
                        rounded 
                      />
                    ) : (
                      <span className="text-muted">No image</span>
                    )}
                  </td>
                  <td>
                    <Dropdown as={ButtonGroup}>
                      <Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
                        <span className="icon icon-sm">
                          <FontAwesomeIcon icon={faEllipsisV} className="icon-dark" />
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleShowModal(cat)}>
                          <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                        </Dropdown.Item>
                        <Dropdown.Item className="text-danger" onClick={() => handleDelete(cat.id)}>
                          <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {loading && <div>Loading...</div>}
        </Card.Body>
      </Card>
      
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit' : 'New'} Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {safeForm && typeof safeForm === 'object' ? (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="name" value={safeForm.name || ''} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Slug</Form.Label>
                    <Form.Control name="slug" value={safeForm.slug || ''} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" value={safeForm.description || ''} onChange={handleChange} as="textarea" rows={3} />
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Parent Category</Form.Label>
                    <Form.Select name="parent_id" value={safeForm.parent_id || ''} onChange={handleChange}>
                      <option value="">None</option>
                      {categories.filter(c => c.id !== safeForm.id).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox" 
                      label="Show in Menu" 
                      name="show_menu" 
                      checked={safeForm.show_menu} 
                      onChange={handleChange} 
                    />
                  </Form.Group>
                </Col>
              </Row>

              <hr />
              <h6>Image</h6>
              <Form.Group className="mb-3">
                <Form.Label>Category Image</Form.Label>
                <Form.Control 
                  type="file" 
                  name="featured_image" 
                  onChange={handleChange} 
                  accept="image/*"
                />
                <Form.Text className="text-muted">
                  Upload an image for this category (JPEG, PNG, JPG, GIF - Max 2MB)
                </Form.Text>
                {safeForm.existing_featured_image && (
                  <div className="mt-2">
                    <small className="text-muted">Current image:</small>
                    <br />
                    <Image 
                      src={`http://localhost:8000/storage/${safeForm.existing_featured_image}`} 
                      alt="Current" 
                      width={100} 
                      rounded 
                      className="mt-1"
                    />
                  </div>
                )}
              </Form.Group>
            </Form>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageCategory;
