import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

import AddNew from '../pages/AddNew';

beforeEach(() => {
  render(<AddNew />);
});

describe('test New Station/Journey page', () => {
  test('Show two buttons for adding new station or new journey form', () => {
    const newstationBtn = screen.getByRole('button', {
      name: 'Add New Station',
    });
    const newjourneyBtn = screen.getByRole('button', {
      name: 'Add New Journey',
    });
    expect(newstationBtn).toBeInTheDocument();
    expect(newjourneyBtn).toBeInTheDocument();
  });

  test('Click Add New Station button renders a form with 13 input fields', () => {
    const newstationBtn = screen.getByRole('button', {
      name: 'Add New Station',
    });
    act(() => {
      userEvent.click(newstationBtn);
    });
    expect(screen.getByText('Add New Station Form')).toBeInTheDocument();
    const columns = screen.getAllByRole('textbox');
    const boxes = screen.getAllByRole('spinbutton');
    expect(columns).toHaveLength(8);
    expect(boxes).toHaveLength(5);
  });

  test('Click Add New Journey button renders a form with 8 input fields', () => {
    const newjourneyBtn = screen.getByRole('button', {
      name: 'Add New Journey',
    });
    act(() => {
      userEvent.click(newjourneyBtn);
    });
    expect(screen.getByText('Add New Journey Form')).toBeInTheDocument();
    const columns = screen.getAllByRole('textbox');
    const boxes = screen.getAllByRole('spinbutton');
    const dates = screen.getAllByLabelText(/Date and Time/);
    expect(columns).toHaveLength(2);
    expect(boxes).toHaveLength(4);
    expect(dates).toHaveLength(2);
  });
});
