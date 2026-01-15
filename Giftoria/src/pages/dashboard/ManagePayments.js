import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Breadcrumb,
  Badge,
  Spinner
} from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faHandHoldingUsd } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { BACKEND_URL } from "../../api/config";

const API_URL = `${BACKEND_URL}/api`;

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token =
    (user && (user.access_token || user.token || user.accessToken)) ||
    localStorage.getItem("access_token");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/payments`, {
        headers: getAuthHeaders(),
      });
      setPayments(res.data.data); // because of pagination
    } catch (err) {
      setError("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div>
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
          >
            <Breadcrumb.Item>
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item active>Transactions</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Payments</h4>
          <p className="mb-0">All payment transactions</p>
        </div>
      </div>

      <Card border="light" className="shadow-sm">
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">Loading payments...</p>
            </div>
          ) : (
            <Table responsive className="table-centered table-nowrap mb-0">
              <thead className="thead-light">
                <tr>
                  <th>ID</th>
                  <th>Command</th>
                  <th>Gateway</th>
                  <th>Transaction #</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>{payment.command_id}</td>
                      <td>{payment.gateway}</td>
                      <td>{payment.transaction_number}</td>
                      <td>
                        <Badge
                          bg={
                            payment.transaction_status === "success"
                              ? "success"
                              : payment.transaction_status === "failed"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {payment.transaction_status}
                        </Badge>
                      </td>
                      <td>{payment.amount} TND</td>
                      <td>
                        {payment.is_test ? (
                          <Badge bg="secondary">Test</Badge>
                        ) : (
                          <Badge bg="primary">Live</Badge>
                        )}
                      </td>
                      <td>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default ManagePayments;
