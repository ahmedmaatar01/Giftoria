import React, { useEffect, useState } from "react";
import { Card, Table, Breadcrumb, Spinner, Badge } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { BACKEND_URL } from "../../api/config";

const API_URL = `${BACKEND_URL}/api`;
const ADMIN_API = `${API_URL}/admin`;

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

  useEffect(() => {
    axios
      .get(`${ADMIN_API}/payments`, { headers: getAuthHeaders() })
      .then((res) => setPayments(res.data))
      .catch((err) => console.error("Error loading payments", err))
      .finally(() => setLoading(false));
  }, []);

  const badgeVariant = (status) => {
    switch (status) {
      case "success": return "success";
      case "pending": return "warning";
      case "failed": return "danger";
      default: return "secondary";
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <Breadcrumb className="breadcrumb-dark breadcrumb-transparent">
          <Breadcrumb.Item>
            <FontAwesomeIcon icon={faHome} />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Giftoria</Breadcrumb.Item>
          <Breadcrumb.Item active>Payments</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Card border="light" className="shadow-sm">
        <Card.Header>
          <h5>Payments</h5>
        </Card.Header>

        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table responsive className="align-items-center table-flush">
              <thead className="thead-light">
                <tr>
                  <th>ID</th>
                  <th>Command</th>
                  <th>Gateway</th>
                  <th>Transaction</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Test</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>#{p.command_id}</td>
                    <td>{p.gateway}</td>
                    <td>{p.transaction_number || "-"}</td>
                    <td>
                      <Badge bg={badgeVariant(p.transaction_status)}>
                        {p.transaction_status}
                      </Badge>
                    </td>
                    <td>
                      <b>{p.amount} DT</b>
                    </td>
                    <td>{p.is_test ? "Yes" : "No"}</td>
                    <td>{new Date(p.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default ManagePayments;
