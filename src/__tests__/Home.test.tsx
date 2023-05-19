import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';

test('Home page renders successfully', () => {
  render(<Home />);
  const welcomeText = screen.getByText(/city bikes are shared-use/i);
  expect(welcomeText).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', '/images/bikes.jpg');
});
