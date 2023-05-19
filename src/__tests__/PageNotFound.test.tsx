import { render, screen } from '@testing-library/react';
import PageNotFound from '../pages/PageNotFound';

test('Invalid route renders 404 page', () => {
  render(<PageNotFound />);
  const notfoundText = screen.getByText('Ooops, something went wrong!');
  expect(notfoundText).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute(
    'src',
    '/images/404pagenotfound.jpg',
  );
  expect(
    screen.getByRole('button', { name: 'Back to stations' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Back to journeys' }),
  ).toBeInTheDocument();
});
