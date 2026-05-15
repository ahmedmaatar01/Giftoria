import React, { useState, useEffect } from 'react';
import { Col, Row, Nav, Card, Button, Table, Container, Modal, Form, Alert, Image, Spinner } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { BACKEND_URL } from '../../api/config';

const API_URL = `${BACKEND_URL}/api`;


const TagModal = ({ show, onHide, tag, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    is_active: true,
    occasion_id: ''
  });
  const [occasions, setOccasions] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const res = await axios.get(`${API_URL}/occasions`);
        console.log("Fetched occasions response:", res.data);

        // ✅ Adapt this line depending on your API response structure
        // Example 1: if backend returns { success: true, data: [...] }
        if (Array.isArray(res.data.data)) {
          setOccasions(res.data.data);
        }
        // Example 2: if backend returns just [...]
        else if (Array.isArray(res.data)) {
          setOccasions(res.data);
        } else {
          console.warn("Unexpected response format:", res.data);
        }
      } catch (err) {
        console.error('Error fetching occasions:', err);
      }
    };

    fetchOccasions();
  }, []);

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name || '',
        name_ar: tag.name_ar || '',
        is_active: tag.is_active !== undefined ? tag.is_active : true,
        occasion_id: tag.occasion_id || ''
      });
      setImagePreview(tag.image ? `${BACKEND_URL}/storage/${tag.image}` : null);
    } else {
      setFormData({
        name: '',
        name_ar: '',
        is_active: true,
        occasion_id: ''
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setErrors({});
  }, [tag, show]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, imageFile, tag?.id);
  };

  return (
    <Modal as={Modal.Dialog} centered show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="h4">
          {tag ? 'Edit Tag' : 'Create New Tag'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tag Template Name (English) *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Birthday Card, Holiday Card"
                  required
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tag Template Name (Arabic)</Form.Label>
                <Form.Control
                  type="text"
                  name="name_ar"
                  value={formData.name_ar}
                  onChange={handleInputChange}
                  placeholder="مثال: بطاقة عيد ميلاد، بطاقة العطلة"
                  isInvalid={!!errors.name_ar}
                  dir="rtl"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name_ar}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Occasion</Form.Label>
                <Form.Select
                  name="occasion_id"
                  value={formData.occasion_id}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Occasion --</option>
                  {occasions.map((occ) => (
                    <option key={occ.id} value={occ.id}>
                      {occ.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Select the occasion this Tag belongs to.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  label="Active Template"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tag Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>

              {imagePreview && (
                <div className="text-center">
                  <Image
                    src={imagePreview}
                    alt="Tag Preview"
                    style={{ maxWidth: '200px', maxHeight: '150px' }}
                    thumbnail
                  />
                </div>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {tag ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              tag ? 'Update Tag' : 'Create Tag'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};


export default function ManageTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [occasions, setOccasions] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState("");


  const fetchOccasions = async () => {
    try {
      const res = await axios.get(`${API_URL}/occasions`);
      if (Array.isArray(res.data.data)) {
        setOccasions(res.data.data);
      } else if (Array.isArray(res.data)) {
        setOccasions(res.data);
      } else {
        console.warn("Unexpected response format:", res.data);
      }
    } catch (err) {
      console.error('Error fetching occasions:', err);
    }
  };
  
  useEffect(() => {
    fetchTags();
    fetchOccasions();

  }, []);
const getOccasionName = (id) => {
  const occasion = occasions.find((o) => o.id === id);
  return occasion ? occasion.name : "—";
};

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tags`);
      
      if (response.data.success) {
        setTags(response.data.data);
      } else {
        showAlert('Failed to fetch tags', 'danger');
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      showAlert('Error fetching tags', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 5000);
  };

  const handleCreateNew = () => {
    setSelectedTag(null);
    setShowModal(true);
  };

  const handleEdit = (tag) => {
    setSelectedTag(tag);
    setShowModal(true);
  };

  const handleSave = async (formData, imageFile, tagId) => {
    try {
      setIsLoading(true);
      let newTagId = null;

      // Step 1: Create or update Tag data (without image)
      const tagData = {
        name: formData.name,
        name_ar: formData.name_ar,
        is_active: formData.is_active,
        occasion_id: formData.occasion_id
      };

      if (tagId) {
        await axios.put(`${API_URL}/tags/${tagId}`, tagData);
        newTagId = tagId;
      } else {
        const tagRes = await axios.post(`${API_URL}/tags`, tagData);
        newTagId = tagRes.data.data.id;
      }

      // Step 2: Handle image upload separately if there's an image
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        imageFormData.append('name', formData.name);
        imageFormData.append('name_ar', formData.name_ar);
        imageFormData.append('is_active', formData.is_active ? '1' : '0');
        imageFormData.append('occasion_id', formData.occasion_id);


        // Update Tag with image
        await axios.post(`${API_URL}/tags/${newTagId}?_method=PUT`, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      showAlert(
        tagId ? 'Tag updated successfully' : 'Tag created successfully',
        'success'
      );
      setShowModal(false);
      fetchTags();
    } catch (error) {
      console.error('Error saving Tag:', error);
      showAlert(error.response?.data?.message || 'Error saving Tag', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tagId) => {
    if (!window.confirm('Are you sure you want to delete this Tag?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/tags/${tagId}`);
      
      if (response.data.success) {
        showAlert('Tag deleted successfully', 'success');
        fetchTags();
      } else {
        showAlert(response.data.message || 'Failed to delete Tag', 'danger');
      }
    } catch (error) {
      console.error('Error deleting Tag:', error);
      showAlert('Error deleting Tag', 'danger');
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }
  const filteredTags = selectedOccasion
  ? tags.filter((g) => String(g.occasion_id) === String(selectedOccasion))
  : tags;


  return (
    <Container fluid className="py-4">
      <Row>
        <Col xs={12} className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="h4 mb-1">Tags Management</h3>
              <p className="mb-0">Manage tags that can be attached to products</p>
            </div>
            <Button variant="primary" onClick={handleCreateNew}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Create New Tag
            </Button>
          </div>
        </Col>
      </Row>

      {alert.show && (
        <Row className="mb-4">
          <Col xs={12}>
            <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false, message: '', variant: 'success' })}>
              {alert.message}
            </Alert>
          </Col>
        </Row>
      )}
  <Row className="mb-3">
  <Col md={4}>
    <Form.Select
      value={selectedOccasion}
      onChange={(e) => setSelectedOccasion(e.target.value)}
    >
      <option value="">-- All Occasions --</option>
      {occasions.map((occ) => (
        <option key={occ.id} value={occ.id}>
          {occ.name}
        </option>
      ))}
    </Form.Select>
  </Col>
</Row>

      <Row>
        <Col xs={12}>
          <Card border="light" className="table-wrapper table-responsive shadow-sm">
            <Card.Body className="pt-0">
              <Table hover className="user-table align-items-center">
              <thead>
  <tr>
    <th className="border-bottom">Image</th>
    <th className="border-bottom">Template Names</th>
    <th className="border-bottom">Occasion</th>
    <th className="border-bottom">Status</th>
    <th className="border-bottom">Selections</th>
    <th className="border-bottom">Actions</th>
  </tr>
</thead>
<tbody>
  {filteredTags.length > 0 ? (
  filteredTags.map((tag) => (
      <tr key={tag.id}>
        <td>
          {tag.image ? (
            <Image 
              src={`${BACKEND_URL}/storage/${tag.image}`} 
              alt={tag.name}
              style={{ width: '50px', height: '40px', objectFit: 'cover' }}
              rounded
            />
          ) : (
            <div 
              className="bg-light d-flex align-items-center justify-content-center rounded"
              style={{ width: '50px', height: '40px' }}
            >
              <FontAwesomeIcon icon={faUpload} className="text-muted" />
            </div>
          )}
        </td>

        {/* Template Names */}
        <td>
          <div className="d-flex flex-column">
            <span className="fw-normal">{tag.name}</span>
            {tag.name_ar && (
              <span className="text-muted small" dir="rtl" style={{ fontSize: '0.95em' }}>
                {tag.name_ar}
              </span>
            )}
          </div>
        </td>

        {/* ✅ Occasion Column */}
        <td>{getOccasionName(tag.occasion_id)}</td>



        {/* Status */}
        <td>
          <span className={`badge bg-${tag.is_active ? 'success' : 'secondary'}`}>
            {tag.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>

        {/* Selections */}
        <td>
          <span className="fw-normal">
            {tag.selections ? tag.selections.length : 0} customer selections
          </span>
        </td>

        {/* Actions */}
        <td>
          <Button 
            variant="outline-primary" 
            size="sm" 
            className="me-2"
            onClick={() => handleEdit(tag)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={() => handleDelete(tag.id)}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </Button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center py-4">
        <div className="text-muted">
          <FontAwesomeIcon icon={faUpload} size="3x" className="mb-3" />
          <p>No Tag templates found. Create your first template to get started.</p>
        </div>
      </td>
    </tr>
  )}
</tbody>

              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <TagModal
        show={showModal}
        onHide={() => setShowModal(false)}
        tag={selectedTag}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </Container>
  );
}
