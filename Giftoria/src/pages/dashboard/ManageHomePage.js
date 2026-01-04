import React, { useEffect, useState } from "react";
import { Card, Table, Button, Form, Modal, Row, Col, InputGroup, Image, Breadcrumb, ButtonGroup, Dropdown } from '@themesberg/react-bootstrap';
import { faEdit, faHome, faSearch, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { BACKEND_URL } from '../../api/config';

const API_URL = `${BACKEND_URL}/api`;

const ManageHomePage = () => {
  const [homeDetail, setHomeDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    hero_type: 'image',
    hero_media: null,
    hero_title_en: '',
    hero_title_ar: ''
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchHomeDetail = async () => {
      try {
        // Get the first home page detail (if any)
        const res = await axios.get(`${API_URL}/home-page-details`);
        setHomeDetail(res.data);
        if (res.data && res.data !== null) {
          setForm({
            hero_type: res.data.hero_type || 'image',
            hero_media: null,
            hero_title_en: res.data.hero_title_en || '',
            hero_title_ar: res.data.hero_title_ar || ''
          });
          setIsEdit(true);
        } else {
          setForm({
            hero_type: 'image',
            hero_media: null,
            hero_title_en: '',
            hero_title_ar: ''
          });
          setIsEdit(false);
        }
      } catch (error) {
        setHomeDetail(null);
        setForm({
          hero_type: 'image',
          hero_media: null,
          hero_title_en: '',
          hero_title_ar: ''
        });
        setIsEdit(false);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeDetail();
  }, []);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm(f => ({ ...f, [name]: files && files.length > 0 ? files[0] : null }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      // Always use FormData
      const payload = new FormData();
      payload.append('hero_type', form.hero_type || 'image');
      payload.append('hero_title_en', form.hero_title_en || '');
      payload.append('hero_title_ar', form.hero_title_ar || '');
      if (form.hero_media instanceof File) {
        payload.append('hero_media', form.hero_media);
      }
      if (isEdit && homeDetail && homeDetail.id) {
        await axios.post(`${API_URL}/home-page-details/${homeDetail.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
          params: { _method: 'PUT' }
        });
      } else {
        await axios.post(`${API_URL}/home-page-details`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      setLoading(true);
      // Fetch the first home page detail (if any)
      const res = await axios.get(`${API_URL}/home-page-details`);
      setHomeDetail(Array.isArray(res.data) ? res.data[0] : res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Giftoria</Breadcrumb.Item>
            <Breadcrumb.Item active>Home Page</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Home Page Content</h4>
          <p className="mb-0">Manage your home page hero section.</p>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <ButtonGroup>
            <Button variant="primary" size="sm" onClick={handleShowModal}>{homeDetail ? 'Edit' : 'Add'} Home Content</Button>
          </ButtonGroup>
        </div>
      </div>

      <Card border="light" className="shadow-sm mb-4">
        <Card.Header>
          <h5>Hero Section</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div>Loading...</div>
          ) : homeDetail ? (
            <Table responsive className="align-items-center table-flush">
              <thead className="thead-light">
                <tr>
                  <th>Type</th>
                  <th>Media</th>
                  <th>Title (EN)</th>
                  <th>Title (AR)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{homeDetail.hero_type}</td>
                  <td>
                    {homeDetail.hero_type === 'image' && homeDetail.hero_media ? (
                      <Image src={typeof homeDetail.hero_media === 'string' ? `${BACKEND_URL}/storage/${homeDetail.hero_media}` : ''} alt="Hero" width={80} rounded />
                    ) : homeDetail.hero_type === 'video' && homeDetail.hero_media ? (
                      <video width="120" controls src={typeof homeDetail.hero_media === 'string' ? `${BACKEND_URL}/storage/${homeDetail.hero_media}` : ''} />
                    ) : (
                      <span className="text-muted">No media</span>
                    )}
                  </td>
                  <td>{homeDetail.hero_title_en}</td>
                  <td dir="rtl">{homeDetail.hero_title_ar}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={handleShowModal}>
                      <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <div>No home page content found.</div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit' : 'Add'} Home Page Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hero Title (English)</Form.Label>
                  <Form.Control name="hero_title_en" value={form.hero_title_en || ''} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hero Title (Arabic)</Form.Label>
                  <Form.Control name="hero_title_ar" value={form.hero_title_ar || ''} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Hero Type</Form.Label>
              <Form.Select name="hero_type" value={form.hero_type || 'image'} onChange={handleChange}>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hero Media ({form.hero_type === 'image' ? 'Image' : 'Video'})</Form.Label>
              <Form.Control type="file" name="hero_media" onChange={handleChange} accept={form.hero_type === 'image' ? 'image/*' : 'video/*'} />
              {homeDetail && homeDetail.hero_media && (
                <div className="mt-2">
                  <small className="text-muted">Current media:</small>
                  <br />
                  {form.hero_type === 'image' ? (
                    <Image src={`${BACKEND_URL}/storage/${homeDetail.hero_media}`} alt="Current" width={100} rounded className="mt-1" />
                  ) : (
                    <video width="120" controls src={`${BACKEND_URL}/storage/${homeDetail.hero_media}`} />
                  )}
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

export default ManageHomePage;
