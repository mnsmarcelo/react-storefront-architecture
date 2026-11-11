// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import {
  Button,
  Form,
  Input,
  Checkbox,
  LockOutlined,
  UserOutlined,
  Card,
} from '@react-storefront-architecture/ui';
import { useAuth } from '@react-storefront-architecture/auth';
import { Link } from 'react-router-dom';

export function App() {
  const { setUser } = useAuth();
  const onFinish = (values: any) => {
    console.log('Dados do login:', values);

    setUser({
      id: '123',
      name: 'Usuário de Teste',
      email: 'teste@empresa.com',
      permissions: ['CARD_READ', 'CARD_CREATE'],
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 360, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Por favor, insira seu e-mail!' },
              { type: 'email', message: 'Por favor, insira um e-mail válido!' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="email"
              autoComplete="email"
              aria-label="E-mail"
              placeholder="E-mail"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Por favor, insira sua senha!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Senha"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Lembrar de mim</Checkbox>
              </Form.Item>
              <Link to="/esqueci-senha">Esqueceu a senha?</Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default App;
