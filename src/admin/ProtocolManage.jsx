import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Row, Table, Pagination } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import AddProtocol from "../components/AddProtocol";

function ProtocolManage() {
  const [protocols, setProtocols] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const apiUrl = "http://localhost:8080/vaccine/protocols";
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProtocols = protocols && protocols.length > 0 
    ? protocols.slice(indexOfFirstItem, indexOfLastItem) 
    : [];
  const totalPages = Math.ceil(protocols.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  const pagination = (
    <Pagination>
      <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
      {paginationItems}
      <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
    </Pagination>
  );

  useEffect(() => {
    fetchProtocols();
  }, []);

  const fetchProtocols = async () => {
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setProtocols(data.result);
      } else {
        console.error("Failed to fetch protocols:", response.status);
      }
    } catch (err) {
      console.error("Error fetching protocols:", err);
    }
  };

  const handleProtocolAdded = (newProtocol) => {
    if (newProtocol) {
      setProtocols([newProtocol, ...protocols]);
    } else {
      fetchProtocols();
    }
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Row>
        <Sidebar />
        <Col lg={10}>
          <Container className="py-4">
            <Row className="mb-4 align-items-center">
              <Col>
                <h1 className="text-primary">Protocol Management</h1>
              </Col>
              <Col className="text-end">
                <Button variant="primary" onClick={() => setIsOpen(true)}>
                  Add New Protocol
                </Button>
              </Col>
            </Row>

            {isOpen && (
              <AddProtocol
                setIsOpen={setIsOpen}
                open={isOpen}
                onAddedProtocol={handleProtocolAdded}
              />
            )}

            <hr className="mb-4" />

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Protocol Name</th>
                  <th>Description</th>
                  <th>Total Doses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProtocols.length > 0 ? (
                  currentProtocols.map((protocol) => (
                    <tr key={protocol.protocolId}>
                      <td>{protocol.protocolId}</td>
                      <td>{protocol.name}</td>
                      <td>{protocol.description}</td>
                      <td>
                        <Badge bg="info">{protocol.details?.length || 0} doses</Badge>
                      </td>
                      <td>
                        <Button variant="info" size="sm" className="me-2">
                          View Details
                        </Button>
                        <Button variant="danger" size="sm">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">No protocols found</td>
                  </tr>
                )}
              </tbody>
            </Table>
            
            {pagination}
          </Container>
        </Col>
      </Row>
    </div>
  );
}

export default ProtocolManage; 