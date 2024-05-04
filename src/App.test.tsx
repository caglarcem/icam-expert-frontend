import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

test('should render "ICAM Expert" title', () => {
  render(<App />);
  const linkElement = screen.getByText(/ICAM Expert/i);
  expect(linkElement).toBeInTheDocument();
});
