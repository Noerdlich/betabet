import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cipher translator', () => {
  render(<App />);
  const headingElement = screen.getByText(/Alphabet Cipher/i);
  expect(headingElement).toBeInTheDocument();
});
