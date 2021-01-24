import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from 'components/PrivateRoute';

import { Layout } from 'antd';

// Pages
import LandingPage from 'pages/LandingPage';
import RegisterPage from 'pages/RegisterPage';
import LoginPage from 'pages/LoginPage';
import DashboardPage from 'pages/DashboardPage';
import CreateReminderPage from 'pages/CreateReminderPage';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout>
      <Header style={{ color: '#fff', fontWeight: 800, fontSize: '36px' }}>
        <a href='/' style={{ float: 'left' }}>
          Pillminder
        </a>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div
          style={{
            minHeight: '100vh',
            padding: '24px',
            backgroundColor: '#fff',
          }}
        >
          <Router>
            <Switch>
              <Route exact path='/' component={LandingPage} />
              <Route exact path='/register' component={RegisterPage} />
              <Route exact path='/login' component={LoginPage} />
              <PrivateRoute exact path='/dashboard' component={DashboardPage} />
              <PrivateRoute
                exact
                path='/new-reminder'
                component={CreateReminderPage}
              />
            </Switch>
          </Router>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Created 2021</Footer>
    </Layout>
  );
}

export default App;
