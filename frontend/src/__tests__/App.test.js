import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders feedback form heading', () => {
  render(<App />);
  expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
});