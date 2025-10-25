"use client";

import { useContextElement } from "@/context/Context";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function OrderDetails() {
  const { user, authToken } = useContextElement();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!orderId || !authToken) return;
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/api/commands/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
          },
        });
        if (!res.ok) throw new Error("Failed to fetch order details");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, authToken]);

  if (loading) {
    return <div className="py-5 text-center">Loading order details...</div>;
  }
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  if (!order) {
    return <div className="alert alert-warning">Order not found.</div>;
  }

  // Helper: format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Helper: get order status badge
  const getStatusBadgeClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "completed":
        return "badge bg-success";
      case "pending":
        return "badge bg-warning";
      case "cancelled":
        return "badge bg-danger";
      case "processing":
        return "badge bg-info";
      default:
        return "badge bg-secondary";
    }
  };

  // Tab content
  const tabTitles = ["Order History", "Item Details", "Courier", "Receiver"];

  return (
    <div className="wd-form-order">
      <div className="order-head">
        <div className="content">
          <div className={getStatusBadgeClass(order.status)}>{order.status || "Pending"}</div>
          <h6 className="mt-8 fw-5">Order #{order.id}</h6>
        </div>
      </div>
      <div className="tf-grid-layout md-col-2 gap-15">
        <div className="item">
          <div className="text-2 text_black-2">Customer</div>
          <div className="text-2 mt_4 fw-6">{order.customer_first_name} {order.customer_last_name}</div>
        </div>
        <div className="item">
          <div className="text-2 text_black-2">Email</div>
          <div className="text-2 mt_4 fw-6">{order.customer_email}</div>
        </div>
        <div className="item">
          <div className="text-2 text_black-2">Placed At</div>
          <div className="text-2 mt_4 fw-6">{formatDate(order.placed_at || order.created_at)}</div>
        </div>
        <div className="item">
          <div className="text-2 text_black-2">Shipping Address</div>
          <div className="text-2 mt_4 fw-6">{order.shipping_address}</div>
        </div>
      </div>
      <div className="widget-tabs style-has-border widget-order-tab">
        <ul className="widget-menu-tab">
          {tabTitles.map((title, idx) => (
            <li
              key={title}
              className={"item-title" + (activeTab === idx ? " active" : "")}
              onClick={() => setActiveTab(idx)}
              style={{cursor:'pointer'}}
            >
              <span className="inner">{title}</span>
            </li>
          ))}
        </ul>
        <div className="widget-content-tab">
          {/* Order History */}
          <div className={"widget-content-inner" + (activeTab === 0 ? " active" : "")}
            style={{display: activeTab === 0 ? 'block' : 'none'}}>
            <div className="widget-timeline">
              <ul className="timeline">
                <li>
                  <div className="timeline-badge success" />
                  <div className="timeline-box">
                    <div className="text-2 fw-6">Order Placed</div>
                    <span>{formatDate(order.placed_at || order.created_at)}</span>
                  </div>
                </li>
                {/* Add more timeline events if you have them in your backend */}
              </ul>
            </div>
          </div>
          {/* Item Details */}
          <div className={"widget-content-inner" + (activeTab === 1 ? " active" : "")}
            style={{display: activeTab === 1 ? 'block' : 'none'}}>
            {order.products && order.products.length > 0 ? (
              <>
                {order.products.map((product) => (
                  <div key={product.id} className="order-head mb-3">
                    <div className="content">
                      <div className="text-2 fw-6">{product.name}</div>
                      <div className="mt_4">
                        <span className="fw-6">Price :</span> ${parseFloat(product.pivot?.unit_price || product.price || 0).toFixed(2)}
                      </div>
                      <div className="mt_4">
                        <span className="fw-6">Quantity :</span> {product.pivot?.quantity || 1}
                      </div>
                      {/* Custom fields if any */}
                      {product.pivot?.custom_fields && Array.isArray(JSON.parse(product.pivot.custom_fields)) && (
                        <div className="mt_4">
                          <span className="fw-6">Custom Fields:</span>
                          <ul>
                            {JSON.parse(product.pivot.custom_fields).map((cf, idx) => (
                              <li key={idx}>{cf.name}: {cf.value}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <ul>
                  <li className="d-flex justify-content-between text-2">
                    <span>Total Price</span>
                    <span className="fw-6">${parseFloat(order.total || 0).toFixed(2)}</span>
                  </li>
                  <li className="d-flex justify-content-between text-2 mt_8">
                    <span>Payment Method</span>
                    <span className="fw-6">{order.payment_method || 'N/A'}</span>
                  </li>
                </ul>
              </>
            ) : (
              <div>No products found in this order.</div>
            )}
          </div>
          {/* Courier */}
          <div className={"widget-content-inner" + (activeTab === 2 ? " active" : "")}
            style={{display: activeTab === 2 ? 'block' : 'none'}}>
            <p>
              {/* You can add courier/tracking info here if available in your backend */}
              No courier information available.
            </p>
          </div>
          {/* Receiver */}
          <div className={"widget-content-inner" + (activeTab === 3 ? " active" : "")}
            style={{display: activeTab === 3 ? 'block' : 'none'}}>
            <ul className="mt_20">
              <li>
                Order Number : <span className="fw-7">#{order.id}</span>
              </li>
              <li>
                Date : <span className="fw-7">{formatDate(order.placed_at || order.created_at)}</span>
              </li>
              <li>
                Total : <span className="fw-7">${parseFloat(order.total || 0).toFixed(2)}</span>
              </li>
              <li>
                Payment Method : <span className="fw-7">{order.payment_method || 'N/A'}</span>
              </li>
              <li>
                Shipping Address : <span className="fw-7">{order.shipping_address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
