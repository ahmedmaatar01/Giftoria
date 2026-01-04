import React, { useContext, useState } from "react";
import { Col, Row, Button, Dropdown, Card, Form, InputGroup, Alert } from '@themesberg/react-bootstrap';
import { AuthContext } from "../context/AuthContext";
import { updateAdmin, changeAdminPassword } from "../api/auth";

import Profile3 from "../assets/img/team/profile-picture-3.jpg";


export default () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveMsg(""); setSaveErr(""); setSaving(true);
    try {
      const payload = {};
      if (name && name !== user?.name) payload.name = name;
      if (email && email !== user?.email) payload.email = email;
      const res = await updateAdmin(payload);
      const updatedUser = { ...user, ...res.user };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSaveMsg(res.message || 'Profile updated successfully');
    } catch (err) {
      const msg = err?.message || err?.error || 'Failed to update profile';
      setSaveErr(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg(""); setPwdErr(""); setPwdSaving(true);
    try {
      const res = await changeAdminPassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirm
      });
      setPwdMsg(res.message || 'Password changed successfully');
      setCurrentPassword(""); setNewPassword(""); setNewPasswordConfirm("");
    } catch (err) {
      const msg = err?.message || err?.error || 'Failed to change password';
      setPwdErr(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <>

      <Row>
        <Col xs={12} xl={12}>
          <Card border="light" className="bg-white shadow-sm mb-4 mt-5">
            <Card.Body>
              <h5 className="mb-4">Profile</h5>
              {saveMsg && <Alert variant="success">{saveMsg}</Alert>}
              {saveErr && <Alert variant="danger">{saveErr}</Alert>}
              <Form onSubmit={handleSaveProfile}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control required type="text" placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control required type="email" placeholder="admin@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-3">
                  <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Change Password</h5>
              {pwdMsg && <Alert variant="success">{pwdMsg}</Alert>}
              {pwdErr && <Alert variant="danger">{pwdErr}</Alert>}
              <Form onSubmit={handleChangePassword}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="currentPassword">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control required type="password" placeholder="Current password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="newPassword">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control required type="password" placeholder="New password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="newPasswordConfirm">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control required type="password" placeholder="Confirm new password" value={newPasswordConfirm} onChange={(e)=>setNewPasswordConfirm(e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-3">
                  <Button variant="primary" type="submit" disabled={pwdSaving}>{pwdSaving ? 'Updating…' : 'Update Password'}</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>


      </Row>
    </>
  );
};
