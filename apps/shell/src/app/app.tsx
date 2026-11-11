import * as React from 'react';
import NxWelcome from './nx-welcome';
import { Link, Route, Routes } from 'react-router-dom';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { AuthProvider, RequireAuth } from '@react-storefront-architecture/auth';
import { Breadcrumb, Layout, Menu, theme } from '@react-storefront-architecture/ui';
import './app.module.css';
const { Header, Content, Footer } = Layout;
const Login = React.lazy(() => loadRemote('login/Module') as any);


export function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <AuthProvider>
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: 1,
                label: <Link to="/">Home</Link>,
              },
              {
                key: 2,
                label: <Link to="/login">Login</Link>,
              },
            ]}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Content style={{ padding: '0 48px' }}>
          <Breadcrumb
            style={{ margin: '16px 0' }}
            items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
          />
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              padding: 24,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <NxWelcome title="shell" />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </Content>
        <React.Suspense fallback={null}></React.Suspense>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2026 Created by Ant UED
        </Footer>
      </Layout>
    </AuthProvider>
  );
}

export default App;
