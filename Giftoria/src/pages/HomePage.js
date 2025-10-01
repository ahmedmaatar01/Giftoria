import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";
import Presentation from "./Presentation";
import DashboardOverview from "./dashboard/DashboardOverview";
import Transactions from "./Transactions";
import BootstrapTables from "./tables/BootstrapTables";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import AdminRegister from "../components/Auth/AdminRegister";
import AdminLogin from "../components/Auth/AdminLogin";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";
import ManageProducts from './dashboard/ManageProducts';
import ManageCategory from './dashboard/ManageCategory';
import ManageCustomField from './dashboard/ManageCustomField';
import ManageCommands from './dashboard/ManageCommands';
import '@fortawesome/fontawesome-free/css/all.min.css';

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => (<> <Preloader show={loaded ? false : true} /> <Component {...props} /> </>)} />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    <Route {...rest} render={props => (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />

        <main className="content">
          <Navbar />
          <Component {...props} />
          <Footer toggleSettings={toggleSettings} showSettings={showSettings} />
        </main>
      </>
    )}
    />
  );
};

export default () => {
  const { user, loading } = useContext(AuthContext);
  console.log('AuthContext user:', user);
  if (loading) return <div>Loading...</div>;
  return (
    <Switch>
      <RouteWithLoader exact path={Routes.Presentation.path} component={Presentation} />
      <RouteWithLoader exact path={Routes.Login.path} component={Login} />
      <RouteWithLoader exact path={Routes.Register.path} component={Register} />
      <RouteWithLoader exact path={Routes.AdminRegister.path} component={AdminRegister} />
      <RouteWithLoader exact path={Routes.AdminLogin.path} component={AdminLogin} />

      <Route
        exact
        path={Routes.DashboardOverview.path}
        render={props =>
          !user ? (
            <Redirect to={Routes.AdminLogin.path} />
          ) : user.role === 'admin' ? (
            <RouteWithSidebar {...props} component={DashboardOverview} />
          ) : (
            <Redirect to={Routes.Presentation.path} />
          )
        }
      />
      <Route
        exact
        path={Routes.Transactions.path}
        render={props =>
          !user ? (
            <Redirect to={Routes.AdminLogin.path} />
          ) : user.role === 'admin' ? (
            <RouteWithSidebar {...props} component={Transactions} />
          ) : (
            <Redirect to={Routes.Presentation.path} />
          )
        }
      />
      <Route
        exact
        path={Routes.ManageProducts.path}
        render={props =>
          !user ? (
            <Redirect to={Routes.AdminLogin.path} />
          ) : user.role === 'admin' ? (
            <RouteWithSidebar {...props} component={ManageProducts} />
          ) : (
            <Redirect to={Routes.Presentation.path} />
          )
        }
      />
      <Route
        exact
        path={Routes.ManageCategory.path}
        render={props =>
          !user ? (
            <Redirect to={Routes.AdminLogin.path} />
          ) : user.role === 'admin' ? (
            <RouteWithSidebar {...props} component={ManageCategory} />
          ) : (
            <Redirect to={Routes.Presentation.path} />
          )
        }
      />
      <Route
        exact
        path={Routes.ManageCustomField.path}
        render={props =>
          !user ? (
            <Redirect to={Routes.AdminLogin.path} />
          ) : user.role === 'admin' ? (
            <RouteWithSidebar {...props} component={ManageCustomField} />
          ) : (
            <Redirect to={Routes.Presentation.path} />
          )
        }
      />
      <Route
        exact
        path={Routes.ManageCommands.path}
        render={props =>
          !user ? (
            <Redirect to={Routes.AdminLogin.path} />
          ) : user.role === 'admin' ? (
            <RouteWithSidebar {...props} component={ManageCommands} />
          ) : (
            <Redirect to={Routes.Presentation.path} />
          )
        }
      />
      <Route
        exact
        path={Routes.BootstrapTables.path}
        render={props =>
          !user ? (
            <Redirect to={Routes.AdminLogin.path} />
          ) : user.role === 'admin' ? (
            <RouteWithSidebar {...props} component={BootstrapTables} />
          ) : (
            <Redirect to={Routes.Presentation.path} />
          )
        }
      />

      <Redirect to={Routes.Presentation.path} />
    </Switch>
  );
};
