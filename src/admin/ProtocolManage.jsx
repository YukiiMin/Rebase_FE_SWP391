import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AddProtocol from "../components/AddProtocol";
import Navigation from "../components/Navbar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Plus, FileText, Trash, ClipboardList } from "lucide-react";

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
    <>
      <Navigation />
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-content">
          <div className="admin-header flex justify-between items-center">
            <h1 className="admin-title flex items-center gap-2">
              <ClipboardList size={24} className="text-blue-600" />
              Protocol Management
            </h1>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setIsOpen(true)}
            >
              <Plus size={16} />
              Add New Protocol
            </Button>
          </div>

          {isOpen && (
            <AddProtocol
              setIsOpen={setIsOpen}
              open={isOpen}
              onAddedProtocol={handleProtocolAdded}
            />
          )}

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Protocol Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Total Doses</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProtocols.length > 0 ? (
                  currentProtocols.map((protocol) => (
                    <TableRow key={protocol.protocolId}>
                      <TableCell>{protocol.protocolId}</TableCell>
                      <TableCell className="font-medium">{protocol.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{protocol.description}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {protocol.details?.length || 0} doses
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Button 
                            variant="outline"
                            size="sm" 
                            className="flex items-center justify-center gap-1 w-full py-1"
                          >
                            <FileText size={14} />
                            View Details
                          </Button>
                          <Button 
                            variant="destructive"
                            size="sm" 
                            className="flex items-center justify-center gap-1 w-full py-1"
                          >
                            <Trash size={14} />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      No protocols found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {/* Custom Pagination */}
            {totalPages > 0 && (
              <div className="flex items-center justify-center mt-6">
                <nav className="flex items-center space-x-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-1"
                  >
                    First
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1"
                  >
                    &laquo; Prev
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      // Show limited page numbers
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="px-3 py-1"
                          >
                            {pageNum}
                          </Button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum}>...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1"
                  >
                    Next &raquo;
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1"
                  >
                    Last
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default ProtocolManage; 