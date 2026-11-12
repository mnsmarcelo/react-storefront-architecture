import { initializeKeycloak } from '@react-storefront-architecture/auth';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';

async function bootstrap() {
  await initializeKeycloak();
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
  );
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
}
bootstrap().catch((error) => {
  console.error('Falha ao inicializar autenticação', error);
  const container = document.getElementById('root');
  if (container)
    container.textContent =
      'Não foi possível conectar ao serviço de autenticação. Recarregue a página para tentar novamente.';
});
