import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cipher translator', () => {
  render(<App />);
  const headingElement = screen.getByText(/Alphabet v1.1/i);
  expect(headingElement).toBeInTheDocument();
});
