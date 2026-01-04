
import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog, faEnvelopeOpen, faSearch, faSignOutAlt, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { Row, Col, Nav, Form, Image, Navbar, Dropdown, Container, ListGroup, InputGroup } from '@themesberg/react-bootstrap';

import Profile3 from "../assets/img/team/profile-picture-3.jpg";
import { Routes } from '../routes';
import axios from 'axios';


const API_URL = 'http://localhost:8000/api/admin';

const getAuthHeaders = () => {
  const stored = JSON.parse(localStorage.getItem('user'));
  const token = (stored && (stored.access_token || stored.token || stored.accessToken)) || localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default (props) => {
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [notifications, setNotifications] = useState([]); // unified list
  const [fetchError, setFetchError] = useState(null);
  const history = useHistory();
  const { logout, user } = useContext(AuthContext);
  const unseenCount = notifications.filter(n => !n.read).length;

  // Fetch unseen commands & notes
  const fetchNotifications = async () => {
    setLoadingNotifs(true);
    setFetchError(null);
    try {
      const res = await axios.get(`${API_URL}/notifications/unseen`, { headers: getAuthHeaders() });
      const { commands = [], order_notes = [] } = res.data || {};

      const mappedCommands = commands.map(cmd => ({
        id: `command-${cmd.id}`,
        type: 'command',
        itemId: cmd.id,
        sender: 'Order',
        image: Profile3,
        time: cmd.created_at || '',
        message: `New order #${cmd.id} pending review`,
        read: false,
        link: `/commands/${cmd.id}`
      }));

      const mappedNotes = order_notes.map(note => ({
        id: `note-${note.id}`,
        type: 'note',
        itemId: note.id,
        sender: 'Order Note',
        image: Profile3,
        time: note.created_at || '',
        message: (note.content || note.note || 'New note')?.slice(0, 80),
        read: false,
        link: `/commands/${note.command_id || ''}`
      }));

      setNotifications([...mappedCommands, ...mappedNotes].sort((a,b) => (a.time < b.time ? 1 : -1))); // latest first
    } catch (e) {
      setFetchError('Failed to load notifications');
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every minute
    const handler = () => fetchNotifications();
    window.addEventListener('admin-notifications-updated', handler);
    return () => {
      clearInterval(interval);
      window.removeEventListener('admin-notifications-updated', handler);
    };
  }, []);

  // Do not auto-mark as read from navbar; marking happens in Manage Commands views


  const Notification = (props) => {
    const { sender, image, time, message, read = false } = props;
    const readClassName = read ? "" : "text-danger";
    const handleClick = (e) => {
      e.preventDefault();
      history.push(Routes.ManageCommands.path);
    };
    return (
      <ListGroup.Item action onClick={handleClick} className="border-bottom border-light">
        <Row className="align-items-center">
          <Col className="col-auto">
            <Image src={image} className="user-avatar lg-avatar rounded-circle" />
          </Col>
          <Col className="ps-0 ms--2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 mb-0 text-small">{sender}</h4>
              </div>
              <div className="text-end">
                <small className={readClassName}>{time}</small>
              </div>
            </div>
            <p className="font-small mt-1 mb-0">{message}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center">
      
          </div>
          <Nav className="align-items-center">
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="text-dark icon-notifications me-lg-3">
                <span className="icon icon-sm">
                  <FontAwesomeIcon icon={faBell} className="bell-shake" />
                  {unseenCount > 0 ? <span className="icon-badge rounded-circle unread-notifications" /> : null}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-center mt-2 py-0">
                <ListGroup className="list-group-flush">
                  <Nav.Link href="#" className="text-center text-primary fw-bold border-bottom border-light py-3">
                    Notifications {unseenCount > 0 ? `(${unseenCount} new)` : ''}
                  </Nav.Link>
                  {loadingNotifs && (
                    <ListGroup.Item className="text-center py-3">Loading...</ListGroup.Item>
                  )}
                  {fetchError && !loadingNotifs && (
                    <ListGroup.Item className="text-center text-danger py-3">{fetchError}</ListGroup.Item>
                  )}
                  {!loadingNotifs && !fetchError && notifications.length === 0 && (
                    <ListGroup.Item className="text-center py-3 text-muted">No new notifications</ListGroup.Item>
                  )}
                  {!loadingNotifs && !fetchError && notifications.map(n => <Notification key={`notification-${n.id}`} {...n} />)}

                  <Dropdown.Item className="text-center text-primary fw-bold py-3" onClick={() => history.push(Routes.ManageCommands.path)}>
                    View all
                  </Dropdown.Item>
                </ListGroup>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <Image src={Profile3} className="user-avatar md-avatar rounded-circle" />
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">{user?.name || "Admin"}</span>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                <Dropdown.Item className="fw-bold" onClick={() => history.push('/settings')}>
('/login'); 
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
