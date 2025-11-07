import React, { useState, useEffect } from 'react';
import { Col, Row, Nav, Card, Button, Table, Container, Modal, Form, Alert, Image, Spinner } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';

const GiftCardModal = ({ show, onHide, giftCard, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    signing: '',
    is_active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (giftCard) {
      setFormData({
        title: giftCard.title || '',
        description: giftCard.description || '',
        signing: giftCard.signing || '',
        is_active: giftCard.is_active !== undefined ? giftCard.is_active : true
      });
      setImagePreview(giftCard.image_url);
    } else {
      setFormData({
        title: '',
        description: '',
        signing: '',
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
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    if (imageFile) {
      submitData.append('image', imageFile);
    }
    onSave(submitData, giftCard?.id);
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
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Signing</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="signing"
                  value={formData.signing}
                  onChange={handleInputChange}
                  placeholder="e.g. Happy Holidays!"
                  isInvalid={!!errors.signing}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.signing}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  label="Active"
                />
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
      const response = await fetch('/api/gift-cards');
      const result = await response.json();
      
      if (result.success) {
        setGiftCards(result.data);
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

  const handleSave = async (formData, giftCardId) => {
    try {
      setIsLoading(true);
      const url = giftCardId ? `/api/gift-cards/${giftCardId}` : '/api/gift-cards';
      const method = giftCardId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        showAlert(
          giftCardId ? 'Gift card updated successfully' : 'Gift card created successfully',
          'success'
        );
        setShowModal(false);
        fetchGiftCards();
      } else {
        showAlert(result.message || 'Operation failed', 'danger');
      }
    } catch (error) {
      console.error('Error saving gift card:', error);
      showAlert('Error saving gift card', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (giftCardId) => {
    if (!window.confirm('Are you sure you want to delete this gift card?')) {
      return;
    }

    try {
      const response = await fetch(`/api/gift-cards/${giftCardId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        showAlert('Gift card deleted successfully', 'success');
        fetchGiftCards();
      } else {
        showAlert(result.message || 'Failed to delete gift card', 'danger');
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
                    <th className="border-bottom">Title</th>
                    <th className="border-bottom">Description</th>
                    <th className="border-bottom">Signing</th>
                    <th className="border-bottom">Status</th>
                    <th className="border-bottom">Products</th>
                    <th className="border-bottom">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {giftCards.length > 0 ? (
                    giftCards.map((giftCard) => (
                      <tr key={giftCard.id}>
                        <td>
                          {giftCard.image_url ? (
                            <Image 
                              src={giftCard.image_url} 
                              alt={giftCard.title}
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
                              <span className="fw-normal">{giftCard.title}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="fw-normal">
                            {giftCard.description ? 
                              (giftCard.description.length > 50 ? 
                                giftCard.description.substring(0, 50) + '...' : 
                                giftCard.description
                              ) : '-'
                            }
                          </span>
                        </td>
                        <td>
                          <span className="fw-normal">
                            {giftCard.signing || '-'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${giftCard.is_active ? 'success' : 'secondary'}`}>
                            {giftCard.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <span className="fw-normal">
                            {giftCard.products ? giftCard.products.length : 0} products
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
                      <td colSpan="7" className="text-center py-4">
                        <div className="text-muted">
                          <FontAwesomeIcon icon={faUpload} size="3x" className="mb-3" />
                          <p>No gift cards found. Create your first gift card to get started.</p>
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