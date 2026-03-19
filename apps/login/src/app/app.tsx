// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import NxWelcome from './nx-welcome';
import { ReactStorefrontArchitectureUi } from '@react-storefront-architecture/ui';

export function App() {
  return (
    <div>
      <ReactStorefrontArchitectureUi />
      <NxWelcome title="login" />
    </div>
  );
}

export default App;
