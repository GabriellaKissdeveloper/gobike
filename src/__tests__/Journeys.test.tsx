import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Journeys from '../pages/Journeys';
import journeysMock from '../utils/journeys.json';
import userEvent from '@testing-library/user-event';

const server = setupServer(
  rest.get('http://localhost:8000/journeys', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(journeysMock));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  act(() => render(<Journeys stations={journeysMock} pageNo={1} limit={20} />));
});

describe('test List journeys page', () => {
  test('fetch journeys', async () => {
    expect(
      screen.getByText('All Journeys in Helsinki Area in May and June 2021'),
    ).toBeInTheDocument();
    expect(journeysMock).toHaveLength(5);
  });

  test('Page has a title and table', () => {
    const name = screen.getByText(
      'All Journeys in Helsinki Area in May and June 2021',
    );
    expect(name).toBeInTheDocument();
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  test('able to type into the search field and click search button', () => {
    const inputField = screen.getByPlaceholderText(
      'Search departure/return station...',
    );
    expect(inputField).toBeInTheDocument();
    act(() => {
      userEvent.type(inputField, 'Töölöntulli');
    });
    expect(inputField).toHaveValue('töölöntulli');

    const searchBtn = screen.getByRole('button', { name: '🔍 Search' });
    expect(searchBtn).not.toBeDisabled();
    userEvent.click(searchBtn);

    const clearBtn = screen.getByRole('button', { name: 'Clear' });
    expect(clearBtn).not.toBeDisabled();
    act(() => {
      userEvent.click(clearBtn);
    });
    expect(inputField).toHaveValue('');
  });
});
