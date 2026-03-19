import { render } from '@testing-library/react';

import ReactStorefrontArchitectureUi from './ui';

describe('ReactStorefrontArchitectureUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactStorefrontArchitectureUi />);
    expect(baseElement).toBeTruthy();
  });
});
