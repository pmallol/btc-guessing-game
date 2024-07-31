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

vi.spyOn(global, 'fetch').mockImplementation(vi.fn());

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

  it('fetches the user score and updates btcPricePrev on button click', async () => {
    const mockInitialPrice = 22000;
    const mockNewPrice = 22100;
    const userScore = 5;
  
    // Mock fetchBTCPrice
    vi.mocked(fetchBTCPrice).mockResolvedValue(mockInitialPrice)
      .mockResolvedValueOnce(mockNewPrice);

    // Mock fetch for API
    (global.fetch as jest.Mock).mockImplementationOnce(async (url: string | string[]) => {
      if (url.includes('/api/score?userId=test-user-id')) {
        return {
          ok: true,
          json: async () => ({ score: userScore }),
        };
      }
      return {
        ok: true,
        json: async () => ({}),
      };
    });

    render(<Home />);

    // Simulate button click
    fireEvent.click(screen.getByText('Down'));

    expect(fetchBTCPrice).toHaveBeenCalledTimes(2);

    // Verify that fetch call to /api/score was made with correct userId and timestamp
    await waitFor(() => {
      const fetchCalls = (global.fetch as unknown as jest.Mock).mock.calls;
      // console.log('fetchCalls', fetchCalls, fetchCalls[0][0]);
      expect(fetchCalls[0][0]).toBe('/api/score?userId=test-user-id');
      const requestBody = JSON.parse(fetchCalls[1][1].body as string);
      expect(typeof requestBody.timestamp).toBe('number'); // Check if timestamp is a number
      expect(requestBody.guess).toBe(false);
    });
    // Verify if BTC Price was updated
    await waitFor(() => {
      expect(screen.getByTestId('btc-price')).toBeInTheDocument();
      expect(screen.getByTestId('btc-price')).toHaveTextContent(mockNewPrice.toString());
    });

    // Verify score update
    expect(await screen.getByTestId('score')).toHaveTextContent('Score: 5');
  });
});
