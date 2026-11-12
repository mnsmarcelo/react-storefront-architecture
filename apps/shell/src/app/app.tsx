import NxWelcome from './nx-welcome';
import { Link, Route, Routes } from 'react-router-dom';
import {
  AuthProvider,
  RequireAuth,
  useAuth,
} from '@react-storefront-architecture/auth';
import {
  Breadcrumb,
  Button,
  Layout,
  Menu,
  theme,
} from '@react-storefront-architecture/ui';
import './app.module.css';
const { Header, Content, Footer } = Layout;

function ShellContent() {
  const { authenticated, user, login, logout } = useAuth();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
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
          ]}
          style={{ flex: 1, minWidth: 0 }}
        />
        {authenticated ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              color: '#fff',
            }}
          >
            <span>{user?.name || user?.email || 'Minha conta'}</span>
            <Button onClick={logout}>Sair</Button>
          </div>
        ) : (
          <Button type="primary" onClick={login}>
            Entrar
          </Button>
        )}
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
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2026 Created by Ant UED
      </Footer>
    </Layout>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ShellContent />
    </AuthProvider>
  );
}

export default App;
