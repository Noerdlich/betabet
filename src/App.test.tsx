import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cipher translator', () => {
  render(<App />);
  const logoElement = screen.getByAltText(/Betabet Logo/i);
  expect(logoElement).toBeInTheDocument();
});
