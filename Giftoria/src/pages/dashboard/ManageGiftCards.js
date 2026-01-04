import React, { useState, useEffect } from 'react';
import { Col, Row, Nav, Card, Button, Table, Container, Modal, Form, Alert, Image, Spinner } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const GiftCardModal = ({ show, onHide, giftCard, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    is_active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (giftCard) {
      setFormData({
        name: giftCard.name || '',
        name_ar: giftCard.name_ar || '',
        is_active: giftCard.is_active !== undefined ? giftCard.is_active : true
      });
      setImagePreview(giftCard.image ? `http://localhost:8000/storage/${giftCard.image}` : null);
    } else {
      setFormData({
        name: '',
        name_ar: '',
        is_active: true
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setErrors({});
  }, [giftCard, show]);

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
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, imageFile, giftCard?.id);
  };

  return (
    <Modal as={Modal.Dialog} centered show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="h4">
          {giftCard ? 'Edit Gift Card' : 'Create New Gift Card'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Gift Card Template Name (English) *</Form.Label>
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
                <Form.Text className="text-muted">
                  English name that customers will see when selecting gift cards.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Gift Card Template Name (Arabic)</Form.Label>
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
                <Form.Text className="text-muted">
                  Arabic name for Arabic-speaking customers (optional).
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
                <Form.Text className="text-muted">
                  Only active templates will be available for customers to select.
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Gift Card Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Form.Text className="text-muted">
                  Upload an image for the gift card (JPEG, PNG, GIF)
                </Form.Text>
              </Form.Group>

              {imagePreview && (
                <div className="text-center">
                  <Image 
                    src={imagePreview} 
                    alt="Gift Card Preview" 
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
                {giftCard ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              giftCard ? 'Update Gift Card' : 'Create Gift Card'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default function ManageGiftCards() {
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGiftCard, setSelectedGiftCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const fetchGiftCards = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/gift-cards`);
      
      if (response.data.success) {
        setGiftCards(response.data.data);
      } else {
        showAlert('Failed to fetch gift cards', 'danger');
      }
    } catch (error) {
      console.error('Error fetching gift cards:', error);
      showAlert('Error fetching gift cards', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 5000);
  };

  const handleCreateNew = () => {
    setSelectedGiftCard(null);
    setShowModal(true);
  };

  const handleEdit = (giftCard) => {
    setSelectedGiftCard(giftCard);
    setShowModal(true);
  };

  const handleSave = async (formData, imageFile, giftCardId) => {
    try {
      setIsLoading(true);
      let cardId = null;

      // Step 1: Create or update gift card data (without image)
      const giftCardData = {
        name: formData.name,
        name_ar: formData.name_ar,
        is_active: formData.is_active
      };

      if (giftCardId) {
        await axios.put(`${API_URL}/gift-cards/${giftCardId}`, giftCardData);
        cardId = giftCardId;
      } else {
        const giftCardRes = await axios.post(`${API_URL}/gift-cards`, giftCardData);
        cardId = giftCardRes.data.data.id;
      }

      // Step 2: Handle image upload separately if there's an image
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        imageFormData.append('name', formData.name);
        imageFormData.append('name_ar', formData.name_ar);
        imageFormData.append('is_active', formData.is_active ? '1' : '0');

        // Update gift card with image
        await axios.post(`${API_URL}/gift-cards/${cardId}?_method=PUT`, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      showAlert(
        giftCardId ? 'Gift card updated successfully' : 'Gift card created successfully',
        'success'
      );
      setShowModal(false);
      fetchGiftCards();
    } catch (error) {
      console.error('Error saving gift card:', error);
      showAlert(error.response?.data?.message || 'Error saving gift card', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (giftCardId) => {
    if (!window.confirm('Are you sure you want to delete this gift card?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/gift-cards/${giftCardId}`);
      
      if (response.data.success) {
        showAlert('Gift card deleted successfully', 'success');
        fetchGiftCards();
      } else {
        showAlert(response.data.message || 'Failed to delete gift card', 'danger');
      }
    } catch (error) {
      console.error('Error deleting gift card:', error);
      showAlert('Error deleting gift card', 'danger');
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

  return (
    <Container fluid className="py-4">
      <Row>
        <Col xs={12} className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="h4 mb-1">Gift Cards Management</h3>
              <p className="mb-0">Manage gift cards that can be attached to products</p>
            </div>
            <Button variant="primary" onClick={handleCreateNew}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Create New Gift Card
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

      <Row>
        <Col xs={12}>
          <Card border="light" className="table-wrapper table-responsive shadow-sm">
            <Card.Body className="pt-0">
              <Table hover className="user-table align-items-center">
                <thead>
                  <tr>
                    <th className="border-bottom">Image</th>
                    <th className="border-bottom">Template Names</th>
                    <th className="border-bottom">Status</th>
                    <th className="border-bottom">Selections</th>
                    <th className="border-bottom">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {giftCards.length > 0 ? (
                    giftCards.map((giftCard) => (
                      <tr key={giftCard.id}>
                        <td>
                          {giftCard.image ? (
                            <Image 
                              src={`http://localhost:8000/storage/${giftCard.image}`} 
                              alt={giftCard.name}
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
                        <td>
                          <div className="d-flex align-items-center">
                            <div>
                              <div className="fw-normal">{giftCard.name}</div>
                              {giftCard.name_ar && (
                                <div className="text-muted small" dir="rtl" style={{ fontSize: '0.95em', fontWeight: 500 }}>
                                  {giftCard.name_ar}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge bg-${giftCard.is_active ? 'success' : 'secondary'}`}>
                            {giftCard.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <span className="fw-normal">
                            {giftCard.selections ? giftCard.selections.length : 0} customer selections
                          </span>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleEdit(giftCard)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDelete(giftCard.id)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <div className="text-muted">
                          <FontAwesomeIcon icon={faUpload} size="3x" className="mb-3" />
                          <p>No gift card templates found. Create your first template to get started.</p>
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

      <GiftCardModal
        show={showModal}
        onHide={() => setShowModal(false)}
        giftCard={selectedGiftCard}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </Container>
  );
}