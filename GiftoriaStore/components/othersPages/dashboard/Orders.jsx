"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { useTranslation } from "react-i18next";
import { API_BASE_URL_WITH_API } from '../../../utils/config';

export default function Orders() {
  const { user, authToken } = useContextElement();
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL_WITH_API}/users/${user.id}/commands`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.commands || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authToken]);

  const formatDate = (dateString) => {
    if (!dateString) return t("orders_table.not_available");
    const date = new Date(dateString);

    if (i18n.language === 'ar') {
      const monthNames = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'badge bg-success text-white';
      case 'shipped':
      case 'out_for_delivery':
        return 'badge bg-info text-white';
      case 'processing':
        return 'badge bg-primary text-white';
      case 'confirmed':
        return 'badge bg-success text-white';
      case 'pending':
        return 'badge text-white';
      case 'cancelled':
        return 'badge bg-danger text-white';
      default:
        return 'badge bg-secondary text-white';
    }
  };

  const formatStatusName = (status) => {
    if (!status) return 'Pending';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const countItems = (order) => {
    if (!order.products) return 0;
    return order.products.reduce((total, product) => {
      const quantity = product.pivot?.quantity || 1;
      return total + quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="my-account-content account-order">
        <div className="wrap-account-order">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">{t("orders_table.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-account-content account-order">
        <div className="wrap-account-order">
          <div className="alert alert-danger">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="my-account-content account-order">
        <div className="wrap-account-order">
          <div className="alert alert-warning">
            {t("orders_table.login_required")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content account-order">
      <div className="wrap-account-order">
        {orders.length === 0 ? (
          <div className="alert alert-info">
            <strong>{t("orders_table.no_orders_title")}</strong> {t("orders_table.no_orders_message")}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="fw-6">{t("orders_table.order")}</th>
                  <th className="fw-6">{t("orders_table.date")}</th>
                  <th className="fw-6">{t("orders_table.status")}</th>
                  <th className="fw-6">{t("orders_table.total")}</th>
                  <th className="fw-6">{t("orders_table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="tf-order-item">
                    <td>#{order.id}</td>
                    <td>{formatDate(order.placed_at || order.created_at)}</td>
                    <td>
                      <span
                        className={getStatusBadgeClass(order.status)}
                        style={order.status?.toLowerCase() === 'pending' ? { backgroundColor: '#967740' } : {}}
                      >
                        {formatStatusName(order.status)}
                      </span>
                    </td>
                    <td>
                      ${parseFloat(order.total || 0).toFixed(2)} {t("orders_table.for")} {countItems(order)} {t("orders_table.items")}
                    </td>
                    <td>
                      <Link
                        href={`/my-account-orders-details?id=${order.id}`}
                        className="btn btn-dark btn-sm"
                      >
                        {t("orders_table.view_details")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
