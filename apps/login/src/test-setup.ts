// Ant Design uses matchMedia for responsive layouts; jsdom does not implement it.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// The form schedules notifications with MessageChannel, absent from jsdom.
// Use timers so the test environment can dispose pending work without open ports.
Object.defineProperty(globalThis, 'MessageChannel', {
  writable: true,
  value: class {
    port1 = { onmessage: null as (() => void) | null };
    port2 = {
      postMessage: () => setTimeout(() => this.port1.onmessage?.(), 0),
    };
  },
});
