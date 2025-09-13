import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminRegister from './components/Auth/AdminRegister';
import AdminLogin from './components/Auth/AdminLogin';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';

const App = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/admin-register" component={AdminRegister} />
                <Route path="/admin-login" component={AdminLogin} />
                <Route path="/admin-dashboard">
                    {user && user.role === 'admin' ? <AdminDashboard /> : <Redirect to="/admin-login" />}
                </Route>
                <Route path="/user-dashboard">
                    {user ? <UserDashboard /> : <Redirect to="/login" />}
                </Route>
                <Redirect from="/" to="/login" />
            </Switch>
        </Router>
    );
};

export default App;