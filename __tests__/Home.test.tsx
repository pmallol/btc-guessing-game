import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

import {useCookies} from 'next-client-cookies';
import Home from '../app/page';

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

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({price: 23000}),
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ score: 0 }),
    });
  });

  it('checks if the cookie "test-user-id" exists', async () => {
    await act(() => {
      render(<Home />)
    });
  
    const cookies = useCookies();
    expect(cookies.get('userId')).toBe('test-user-id');
  });

  it('renders the home page with initial state', async () => {
    await act(() => {
      render(<Home />)
    });

    expect(screen.getByText('Can you guess the price of Bitcoin after')).toBeInTheDocument();
    expect(screen.getByTestId('score')).toBeInTheDocument();
    expect(screen.getByTestId('btc-price')).toBeInTheDocument();
    expect(screen.getByText('▲ Up')).toBeInTheDocument();
    expect(screen.getByText('Down ▼')).toBeInTheDocument();
  });

  it('displays the current BTC price', async () => {
    render(<Home />);

    await waitFor(() => expect(screen.getByTestId('score')).toHaveTextContent('Your Score: 0'));
    await waitFor(() => expect(screen.getByTestId('btc-price')).toBeInTheDocument());
    expect(screen.getByTestId('btc-price')).toHaveTextContent('$23,000.00');
  });

  it('fetches the user score and updates btcPricePrev on button click', async () => {
    const mockInitialPrice = 22000;
    const mockNewPrice = 25100;
    const userScore = 5;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({price: mockInitialPrice}),
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ score: userScore }),
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({price: mockNewPrice}),
    });


    render(<Home />);

    // Simulate button click
    fireEvent.click(screen.getByText('Down ▼'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    // Verify if BTC Price was updated
    await waitFor(() => {
      expect(screen.getByTestId('btc-price')).toBeInTheDocument();
      expect(screen.getByTestId('btc-price')).toHaveTextContent('$25,100.00');
    });

    // Verify score update
    expect(await screen.getByTestId('score')).toHaveTextContent('Your Score: 5');
  });
});
