import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders the home page hero', () => {
  render(<App />);
  expect(screen.getByText(/discover unique handmade treasure/i)).toBeInTheDocument();
});
