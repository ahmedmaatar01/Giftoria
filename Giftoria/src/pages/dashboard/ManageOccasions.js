import React, { useEffect, useState } from "react";
import { Card, Table, Button, Form, Modal, Row, Col, InputGroup, Image, Dropdown, ButtonGroup, Breadcrumb } from '@themesberg/react-bootstrap';
import { faEdit, faTrashAlt, faHome, faSearch, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const ManageOccasions = () => {
  const [occasions, setOccasions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    name: '',
    arabic_name: '',
    slug: '',
    description: '',
    arabic_description: '',
    show_menu: false,
    featured_image: null,
    category_ids: [],
    existing_featured_image: ''
  });

  const safeForm = form && typeof form === 'object' ? {
    name: form.name ?? '',
    arabic_name: form.arabic_name ?? '',
    slug: form.slug ?? '',
    description: form.description ?? '',
    arabic_description: form.arabic_description ?? '',
    show_menu: !!form.show_menu,
    featured_image: form.featured_image ?? null,
    category_ids: Array.isArray(form.category_ids) ? form.category_ids : [],
    existing_featured_image: form.existing_featured_image ?? '',
    id: form.id
  } : {
    name: '', arabic_name: '', slug: '', description: '', arabic_description:'', show_menu: false, featured_image: null, category_ids: [], existing_featured_image: '', id: undefined
  };

  const handleChange = e => {
    const { name, type, value, checked, files } = e.target;
    if (type === 'file') {
      if (name === 'featured_image') setForm(f => ({ ...f, [name]: files[0] }));
    } else if (name === 'category_ids') {
      const options = Array.from(e.target.selectedOptions).map(o => o.value);
      setForm(f => ({ ...f, category_ids: options }));
    } else {
      setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [occRes, catRes] = await Promise.all([
          axios.get(`${API_URL}/occasions`),
          axios.get(`${API_URL}/categories`)
        ]);
        setOccasions(occRes.data);
        setCategories(catRes.data);
      } catch (e) {
        console.error('Error fetching data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleShowModal = (occ = null) => {
    if (occ && typeof occ === 'object') {
      setForm({
        id: occ.id,
        name: occ.name ?? '',
        arabic_name: occ.arabic_name ?? '',
        slug: occ.slug ?? '',
        description: occ.description ?? '',
        arabic_description: occ.arabic_description ?? '', 
        show_menu: !!occ.show_menu,
        featured_image: null,
        category_ids: Array.isArray(occ.categories) ? occ.categories.map(c => String(c.id)) : [],
        existing_featured_image: occ.featured_image || (occ.images && occ.images.find(i => i.is_featured)?.image_path) || ''
      });
      setIsEdit(true);
    } else {
      setForm({ name: '', arabic_name: '', slug: '', description: '', show_menu: false, featured_image: null, category_ids: [], existing_featured_image: '' });
      setIsEdit(false);
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      let occasionId = null;
      const payload = {
        name: safeForm.name,
        arabic_name: safeForm.arabic_name,
        slug: safeForm.slug,
        description: safeForm.description,
        arabic_description: safeForm.arabic_description,
        show_menu: Boolean(safeForm.show_menu),
        category_ids: safeForm.category_ids.map(id => Number(id))
      };

      if (isEdit) {
        await axios.put(`${API_URL}/occasions/${safeForm.id}`, payload);
        occasionId = safeForm.id;
      } else {
        const res = await axios.post(`${API_URL}/occasions`, payload);
        occasionId = res.data.id;
      }

      if (safeForm.featured_image) {
        const formData = new FormData();
        formData.append('featured_image', safeForm.featured_image);
        formData.append('name', safeForm.name);
        formData.append('arabic_name', safeForm.arabic_name);
        formData.append('slug', safeForm.slug);
        formData.append('description', safeForm.description);
        formData.append('arabic_description', safeForm.arabic_description);
        formData.append('show_menu', Boolean(safeForm.show_menu) ? '1' : '0');
        // Keep categories as is (already synced in JSON step)
        await axios.post(`${API_URL}/occasions/${occasionId}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setShowModal(false);
      setLoading(true);
      const occRes = await axios.get(`${API_URL}/occasions`);
      setOccasions(occRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error saving occasion:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/occasions/${id}`);
      setOccasions(prev => prev.filter(o => o.id !== id));
    } catch (error) {
      console.error('Error deleting occasion:', error);
    }
  };

  const filteredOccasions = Array.isArray(occasions) ? occasions.filter(occ => {
    const term = search.toLowerCase();
    const name = (occ.name || '').toLowerCase();
    const arName = (occ.arabic_name || '').toLowerCase();
    const desc = (occ.description || '').toLowerCase();
    return name.includes(term) || arName.includes(term) || desc.includes(term);
  }) : [];

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Volt</Breadcrumb.Item>
            <Breadcrumb.Item active>Occasions</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Occasions</h4>
          <p className="mb-0">Manage your occasions and link them to categories.</p>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <ButtonGroup>
            <Button variant="primary" size="sm" onClick={() => handleShowModal()}>+ New Occasion</Button>
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
              <Form.Control type="text" placeholder="Search occasions..." value={search} onChange={e => setSearch(e.target.value)} />
            </InputGroup>
          </Col>
        </Row>
      </div>

      <Card border="light" className="shadow-sm mb-4">
        <Card.Header>
          <h5>Occasions</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive className="align-items-center table-flush">
            <thead className="thead-light">
              <tr>
                <th>Name</th>
                <th>Arabic Name</th>
                <th>Slug</th>
                <th>Show Menu</th>
                <th>Image</th>
                <th>Categories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOccasions.map(occ => (
                <tr key={occ.id}>
                  <td>{occ.name}</td>
                  <td>{occ.arabic_name}</td>
                  <td>{occ.slug}</td>
                  <td>{occ.show_menu ? 'Yes' : 'No'}</td>
                  <td>
                    {occ.featured_image || (occ.images && occ.images.length > 0) ? (
                      <Image 
                        src={`http://localhost:8000/storage/${occ.featured_image || occ.images.find(i => i.is_featured)?.image_path || occ.images[0]?.image_path}`} 
                        alt="Occasion image" 
                        width={40} 
                        rounded 
                      />
                    ) : (
                      <span className="text-muted">No image</span>
                    )}
                  </td>
                  <td>{Array.isArray(occ.categories) ? occ.categories.map(c => c.name).join(', ') : ''}</td>
                  <td>
                    <Dropdown as={ButtonGroup}>
                      <Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
                        <span className="icon icon-sm">
                          <FontAwesomeIcon icon={faEllipsisV} className="icon-dark" />
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleShowModal(occ)}>
                          <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                        </Dropdown.Item>
                        <Dropdown.Item className="text-danger" onClick={() => handleDelete(occ.id)}>
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
          <Modal.Title>{isEdit ? 'Edit' : 'New'} Occasion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control name="name" value={safeForm.name} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Arabic Name</Form.Label>
                  <Form.Control name="arabic_name" value={safeForm.arabic_name} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Slug</Form.Label>
                  <Form.Control name="slug" value={safeForm.slug} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check type="checkbox" label="Show in Menu" name="show_menu" checked={safeForm.show_menu} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={safeForm.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Arabic Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="arabic_description"
                  value={safeForm.arabic_description}
                  onChange={handleChange}
                  placeholder="الوصف بالعربية"
                />
              </Form.Group>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Categories</Form.Label>
                  <Form.Select multiple name="category_ids" value={safeForm.category_ids} onChange={handleChange}>
                    {categories.map(cat => (
                      <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">Hold Ctrl (Cmd on Mac) to select multiple categories</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <hr />
            <h6>Image</h6>
            <Form.Group className="mb-3">
              <Form.Label>Occasion Image</Form.Label>
              <Form.Control type="file" name="featured_image" onChange={handleChange} accept="image/*" />
              <Form.Text className="text-muted">Upload an image (JPEG, PNG, JPG, GIF - Max 2MB)</Form.Text>
              {safeForm.existing_featured_image && (
                <div className="mt-2">
                  <small className="text-muted">Current image:</small>
                  <br />
                  <Image src={`http://localhost:8000/storage/${safeForm.existing_featured_image}`} alt="Current" width={100} rounded className="mt-1" />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageOccasions;
