import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

import Home from '../app/page';
import { fetchBTCPrice } from '../services/BTCPrice';

// Mock next-client-cookies
vi.mock('next-client-cookies', () => ({
  useCookies: () => ({
    get: (key: string) => {
      if (key === 'userId') {
        return 'test-user-id';
      }
      return null;
    },
  }),
}));

// Mock the fetchBTCPrice function
vi.mock('../services/BTCPrice', () => ({
  fetchBTCPrice: vi.fn(),
}));


describe('Home', () => {
  beforeEach(() => {
    vi.mocked(fetchBTCPrice).mockResolvedValue(50000)
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the home page with initial state', () => {
    render(<Home />);
    expect(screen.getByText('Can you guess the price of Bitcoin after')).toBeInTheDocument();
    expect(screen.getByText('Up')).toBeInTheDocument();
    expect(screen.getByText('Down')).toBeInTheDocument();
  });

  it('displays the current BTC price', async () => {
    render(<Home />);
    await waitFor(() => expect(screen.getByTestId('btc-price')).toBeInTheDocument());
  });
});
