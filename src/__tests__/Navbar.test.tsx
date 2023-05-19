import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import NavBar from '../components/NavBar';

beforeEach(() => {
  render(<NavBar />);
});

test('Navbar has a logo and company name', () => {
  const name = screen.getByText('GoBIKE');
  expect(name).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', '/images/logo.jpg');
});

test('Navbar has three links', () => {
  expect(screen.getByRole('link', { name: 'List Journeys' })).toHaveAttribute(
    'href',
    '/journeys',
  );
  expect(
    screen.getByRole('link', { name: 'List Stations', hidden: true }),
  ).toHaveAttribute('href', '/stations');
  expect(
    screen.getByRole('link', { name: 'New Station/Journey' }),
  ).toHaveAttribute('href', '/new');
});
