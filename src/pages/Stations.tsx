import ReactPaginate from 'react-paginate';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

import { Station } from '../types/types';

export default function Stations(props: any) {
  const [stations, setStations] = useState<Station[]>([]);
  const [searchStations, setSearchStations] = useState<Station[]>([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(0);

  useEffect(() => {
    fetchStations();
  }, [pageNo]);

  const fetchStations = async () => {
    const response = await fetch(
      `http://localhost:8000/stations?pageNo=${pageNo}&limit=${props.limit}`,
    );
    const data = await response.json();
    setStations(data.stations);
    setTotal(data.total);
  };

  const pageCount = Math.ceil(total / props.limit);

  const handleClick = (event: any) => {
    const newOffset = (event.selected * props.limit) % stations.length;
    setItemOffset(newOffset);
    setPageNo(event.selected);
  };

  const handleSearch = () => {
    const fetchSearchStations = async (search: string) => {
      const response = await fetch(
        `http://localhost:8000/stations/search?string=${search}`,
      );
      const result = await response.json();
      setSearchStations(result.searchStations);
      setTotal(0);
    };
    fetchSearchStations(search);
  };

  const handleClear = () => {
    fetchStations();
    setSearchStations([]);
    setSearch('');
  };

  return (
    <>
      <Container>
        <br />
        {searchStations.length === 0 && search ? (
          <div>
            <p className="fs-3 m-4 text-center">
              No Stations found by "{search}" criteria
            </p>
          </div>
        ) : searchStations.length > 0 ? (
          <div>
            <p className="fs-3 m-4 text-center">
              City Bike Stations found by "{search}" criteria
            </p>
            <p className="fs-5 text-center">
              Total: {searchStations.length} stations
            </p>
          </div>
        ) : (
          <div>
            <p className="fs-3 m-4 text-center">
              All City Bike Stations in Helsinki Area
            </p>
            <p className="fs-5 text-center">Total: {total} stations</p>
          </div>
        )}

        <br />

        <Form onSubmit={handleSearch}>
          <InputGroup className="mb-3">
            <Form.Control
              className="shadow-none form-control"
              type="text"
              placeholder="Search station/city/address..."
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
              <th>ID</th>
              <th>Station Name</th>
              <th>City</th>
              <th>Address</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody>
            {searchStations.length > 0
              ? searchStations.map((station, i) => {
                  return (
                    <tr key={i}>
                      <Link to={`/stations/station/${station.ID}`}>
                        <td>{station.ID}</td>
                      </Link>

                      <td>{station.Nimi}</td>
                      <td>
                        {station.Kaupunki !== ' '
                          ? station.Kaupunki
                          : 'Helsinki'}
                      </td>
                      <td>{station.Osoite}</td>
                      <td>{station.Kapasiteet}</td>
                    </tr>
                  );
                })
              : stations.map((station, i) => {
                  return (
                    <tr key={i}>
                      <Link to={`/stations/station/${station.ID}`}>
                        <td>
                          <span className="pt-2 align-middle">
                            {station.ID}
                          </span>
                        </td>
                      </Link>
                      <td>{station.Nimi}</td>
                      <td>
                        {station.Kaupunki !== ' '
                          ? station.Kaupunki
                          : 'Helsinki'}
                      </td>
                      <td>{station.Osoite}</td>
                      <td>{station.Kapasiteet}</td>
                    </tr>
                  );
                })}
          </tbody>
        </Table>
        <br />
        {searchStations.length > 20 || total ? (
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
        ) : (
          ''
        )}
      </Container>
    </>
  );
}
