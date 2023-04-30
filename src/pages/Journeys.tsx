import ReactPaginate from 'react-paginate';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

import { Journey } from '../types/types';

export default function Journeys(props: any) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(0);

  useEffect(() => {
    if (search) {
      handleSearch();
    } else {
      fetchJourneys();
    }
  }, [pageNo]);

  const fetchJourneys = async () => {
    const response = await fetch(
      `http://localhost:8000/journeys?pageNo=${pageNo}&limit=${props.limit}`,
    );
    const data = await response.json();
    setJourneys(data.journeys);
    setTotal(data.total);
  };

  const pageCount = Math.ceil(total / props.limit);

  const handleClick = (event: any) => {
    const newOffset = (event.selected * props.limit) % total;
    setItemOffset(newOffset);
    setPageNo(event.selected);
  };

  const handleSearch = () => {
    const fetchSearchJourneys = async (search: string) => {
      const response = await fetch(
        `http://localhost:8000/journeys/search?pageNo=${pageNo}&limit=${props.limit}&string=${search}`,
      );
      const result = await response.json();
      setJourneys(result.searchJourneys);
      setTotal(result.total);
    };
    fetchSearchJourneys(search);
  };

  const handleClear = () => {
    fetchJourneys();
    setSearch('');
  };

  return (
    <>
      <Container>
        <br />
        {journeys.length === 0 && search ? (
          <div>
            <p className="fs-3 m-4 text-center">
              No Journeys found by "{search}" criteria
            </p>
          </div>
        ) : journeys.length > 0 && search ? (
          <div>
            <p className="fs-3 m-4 text-center">
              Jurneys found by "{search}" criteria
            </p>
            <p className="fs-5 text-center">Total: {total} journeys</p>
          </div>
        ) : (
          <div>
            <p className="fs-3 m-3 text-center">
              All Journeys in Helsinki Area in May and June 2021
            </p>
            <p className="fs-5 text-center">Total: {total} journeys</p>
          </div>
        )}

        <br />

        <Form onSubmit={handleSearch}>
          <InputGroup className="mb-3">
            <Form.Control
              className="shadow-none form-control"
              type="text"
              placeholder="Search departure/return station..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value.toLowerCase())
              }
            />
            <Button variant="warning" onClick={handleSearch}>
              🔍 Search
            </Button>
            <Button
              variant="outline-warning"
              style={{ color: 'green' }}
              onClick={handleClear}
            >
              Clear
            </Button>
          </InputGroup>
        </Form>
        <br />

        <Table bordered>
          <thead>
            <tr>
              <th>Departure Station</th>
              <th>Return Station</th>
              <th>Distance (km)</th>
              <th>Duration (min)</th>
            </tr>
          </thead>
          <tbody>
            {journeys.map((journey, i) => {
              return (
                <tr key={i}>
                  <td>{journey.DepartureStationName}</td>
                  <td>{journey.ReturnStationName}</td>
                  <td>{journey.CoveredDistance / 1000}</td>
                  <td>{(journey.Duration / 60).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <br />

        <ReactPaginate
          previousLabel={'< Previous'}
          nextLabel={'Next >'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={4}
          renderOnZeroPageCount={null}
          onPageChange={handleClick}
          containerClassName={'pagination justify-content-center'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          activeClassName={'active'}
        />
      </Container>
    </>
  );
}
