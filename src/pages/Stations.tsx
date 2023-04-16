import ReactPaginate from 'react-paginate';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

import { Station } from '../types/types';

export default function Stations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [itemOffset, setItemOffset] = useState(0);
  let limit: number = 10;

  useEffect(() => {
    fetchStations();
  }, [itemOffset]);

  const fetchStations = async () => {
    const response = await fetch(`http://localhost:8000/stations`);
    const data = await response.json();
    setStations(data.stations);
  };

  const endOffset = itemOffset + limit;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const pageCount = Math.ceil(stations.length / limit);
  const currentStations = stations.slice(itemOffset, endOffset);

  const handleClick = (event: any) => {
    const newOffset = (event.selected * limit) % stations.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`,
    );
    setItemOffset(newOffset);
  };

  return (
    <>
      <Container>
        <br />
        <p className="fs-3 m-4 text-center">
          All City Bike Stations in Helsinki Area
        </p>
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
            {currentStations.map((station, i) => {
              return (
                <tr key={i}>
                  <td>{station.id}</td>
                  <td>{station.name}</td>
                  <td>{station.city !== ' ' ? station.city : 'Helsinki'}</td>
                  <td>{station.address}</td>
                  <td>{station.capacity}</td>
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
