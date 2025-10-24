import React, { useEffect, useState } from "react";
import { Card, Table, Button, Image, Dropdown, ButtonGroup, Col, Row, Form, Breadcrumb, InputGroup } from '@themesberg/react-bootstrap';
import { faEdit, faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCog, faHome, faSearch, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import ProductModal from './ProductModal';

const API_URL = 'http://localhost:8000/api';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalForm, setModalForm] = useState({ name: '', arabic_name: '', description: '', price: '', stock: '', category_id: '', featured_image: null, images: [] });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/products`);
                setProducts(res.data);
            } catch (err) {
                // handle error
            } finally {
                setLoading(false);
            }
        };
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/categories`);
                setCategories(res.data);
            } catch (err) {
                // handle error
            }
        };
        fetchProducts();
        fetchCategories();
    }, []);

    const handleCreate = () => {
        setModalForm({ name: '', arabic_name: '', description: '', price: '', stock: '', category_id: '', featured_image: null, images: [], featured: false,     lead_time: '' });
        setIsEdit(false);
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setModalForm({
            id: product.id,
            name: product.name || '',
            arabic_name: product.arabic_name || '',
            description: product.description || '',
            price: product.price || '',
            stock: product.stock || '',
            category_id: product.category_id || '',
            featured_image: null,
            images: [],
            featured: product.featured || false,     
            lead_time: product.lead_time || '',  
            existing_featured_image: product.images && product.images.find(i => i.is_featured)?.image_path || '',
            existing_images: product.images ? product.images.filter(i => !i.is_featured).map(i => i.image_path) : []
        });
        setIsEdit(true);
        setShowModal(true);
    };

    const handleModalSubmit = async () => {
        try {
            // 1. Create or update product (without images)
            let productId = null;
            let productRes;
            if (isEdit) {
                productRes = await axios.put(`${API_URL}/products/${modalForm.id}`, {
                    name: modalForm.name,
                    arabic_name: modalForm.arabic_name,
                    description: modalForm.description,
                    price: modalForm.price,
                    stock: modalForm.stock,
                    category_id: modalForm.category_id,
                    featured: modalForm.featured,     
                    lead_time: modalForm.lead_time 
                });
                productId = modalForm.id;
            } else {
                productRes = await axios.post(`${API_URL}/products`, {
                    name: modalForm.name,
                    arabic_name: modalForm.arabic_name,
                    description: modalForm.description,
                    price: modalForm.price,
                    stock: modalForm.stock,
                    category_id: modalForm.category_id,
                    featured: modalForm.featured,     
                    lead_time: modalForm.lead_time  
                });
                productId = productRes.data.id;
            }
            // 2. Upload featured image if present
            if (modalForm.featured_image) {
                const featuredForm = new FormData();
                featuredForm.append('images[]', modalForm.featured_image);
                featuredForm.append('is_featured[]', true);
                await axios.post(`${API_URL}/products/${productId}/images`, featuredForm, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            // 3. Upload other images if present
            if (modalForm.images && modalForm.images.length > 0) {
                const imgForm = new FormData();
                Array.from(modalForm.images).forEach(img => {
                    imgForm.append('images[]', img);
                    imgForm.append('is_featured[]', false);
                });
                await axios.post(`${API_URL}/products/${productId}/images`, imgForm, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            setShowModal(false);
            setLoading(true);
            const res = await axios.get(`${API_URL}/products`);
            setProducts(res.data);
        } catch (err) {
            // handle error
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/products/${id}`);
            setProducts(products => products.filter(p => p.id !== id));
        } catch (err) {
            // handle error
        }
    };

    // Filter products by search, guard against non-array
    const filteredProducts = Array.isArray(products) ? products.filter(prod => {
        const matchesSearch = prod.name.toLowerCase().includes(search.toLowerCase()) ||
            (prod.category && prod.category.name.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = selectedCategory === "" || (prod.category && prod.category.id === selectedCategory);
        return matchesSearch && matchesCategory;
    }) : [];

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-md-0">
                    <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                        <Breadcrumb.Item>Volt</Breadcrumb.Item>
                        <Breadcrumb.Item active>Products</Breadcrumb.Item>
                    </Breadcrumb>
                    <h4>Products</h4>
                    <p className="mb-0">Your Products.</p>
                </div>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <ButtonGroup>
                        <Button variant="primary" size="sm" onClick={handleCreate}>+ New Product</Button>
                        <Button variant="outline-primary" size="sm">Share</Button>
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
                            <Form.Control type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
                        </InputGroup>
                    </Col>

                    <Col xs={12} md={4} xl={3} className="ps-md-0 text-end mt-2 mt-md-0 align-items-center d-flex gap-2">
                        <Form.Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value === "" ? "" : Number(e.target.value))}>
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Form.Select>
                        <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-0 mt-1">
                                <span className="icon icon-sm icon-gray">
                                    <FontAwesomeIcon icon={faCog} />
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-xs dropdown-menu-right">
                                <Dropdown.Item className="fw-bold text-dark">Show</Dropdown.Item>
                                <Dropdown.Item className="d-flex fw-bold">
                                    10 <span className="icon icon-small ms-auto"><FontAwesomeIcon icon={faCheck} /></span>
                                </Dropdown.Item>
                                <Dropdown.Item className="fw-bold">20</Dropdown.Item>
                                <Dropdown.Item className="fw-bold">30</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </div>
            <Card border="light" className="shadow-sm">
                <Card.Header>
                    <h5>Products</h5>
                </Card.Header>
                <Card.Body>
                    <Table responsive className="align-items-center table-flush">
                    <thead className="thead-light">
  <tr>
    <th>Name</th>
    <th>Arabic Name</th>
    <th>Category</th>
    <th>Price</th>
    <th>Lead Time</th> {/* 4 */}
    <th>Featured</th> {/* 5 */}
    <th>Stock</th>
    <th>Image</th>
    <th>Actions</th>
  </tr>
</thead>

<tbody>
  {filteredProducts.map(prod => (
    <tr key={prod.id}>
      <td>{prod.name}</td>
      <td>{prod.arabic_name || ''}</td>
      <td>{prod.category ? prod.category.name : ''}</td>
      <td>{prod.price}</td>
      <td>{prod.lead_time}</td> {/* Lead Time */}
      <td>
        {prod.featured ? (
          <span className="badge bg-success">Featured</span>
        ) : (
          <span className="badge bg-secondary">Normal</span>
        )}
      </td> {/* Featured */}
      <td>{prod.stock}</td>
      <td>
        {prod.images && prod.images.length > 0 ? (
          <Image
            src={`http://localhost:8000${prod.images.find(i => i.is_featured)?.image_path || prod.images[0].image_path}`}
            alt="img"
            width={40}
            rounded
          />
        ) : (
          ''
        )}
      </td>
      <td>
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle
            as={Button}
            split
            variant="link"
            className="text-dark m-0 p-0"
          >
            <span className="icon icon-sm">
              <FontAwesomeIcon icon={faEllipsisV} className="icon-dark" />
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleEdit(prod)}>
              <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
            </Dropdown.Item>
            <Dropdown.Item
              className="text-danger"
              onClick={() => handleDelete(prod.id)}
            >
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
            <ProductModal show={showModal} onHide={() => setShowModal(false)} onSubmit={handleModalSubmit} form={modalForm} setForm={setModalForm} isEdit={isEdit} />
        </>
    );
};

export default ManageProducts;
