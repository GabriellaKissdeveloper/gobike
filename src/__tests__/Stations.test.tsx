import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Stations from '../pages/Stations';
import stationsMock from '../utils/stations.json';
import userEvent from '@testing-library/user-event';

const server = setupServer(
  rest.get('http://localhost:8000/stations', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(stationsMock));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  act(() =>
    render(
      <Stations
        stations={stationsMock}
        pageNo={1}
        limit={20}
        total={stationsMock.length}
      />,
    ),
  );
}, 1000000);

describe('test List stations page', () => {
  test('fetch stations', () => {
    expect(
      screen.getByText('All City Bike Stations in Helsinki Area'),
    ).toBeInTheDocument();
    expect(stationsMock).toHaveLength(5);
  });

  test('Page has a title and table', () => {
    const name = screen.getByText('All City Bike Stations in Helsinki Area');
    expect(name).toBeInTheDocument();
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  test('able to type into the search field and click search button', () => {
    const inputField = screen.getByPlaceholderText(
      'Search station/city/address...',
    );
    expect(inputField).toBeInTheDocument();
    act(() => {
      userEvent.type(inputField, 'Kaivopuisto');
    });
    expect(inputField).toHaveValue('kaivopuisto');

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
