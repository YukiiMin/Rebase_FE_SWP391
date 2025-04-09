import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import MainNav from "../../components/layout/MainNav";
import AddProtocol from "../../components/layout/AddProtocol";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Plus, FileText, Trash, ClipboardList, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { apiService } from "../../api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";

function ProtocolManage() {
  const [protocols, setProtocols] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");
  
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
      setLoading(true);
      const response = await apiService.vaccine.getAllProtocols();
      const data = response.data;
      setProtocols(data.result);
    } catch (err) {
      console.error("Error fetching protocols:", err);
      setError("Failed to fetch protocols. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleProtocolAdded = (newProtocol) => {
    if (newProtocol) {
      setProtocols([newProtocol, ...protocols]);
    } else {
      fetchProtocols();
    }
  };

  const handleViewProtocol = async (protocolId) => {
    try {
      setViewLoading(true);
      setViewError("");
      const response = await apiService.vaccine.getProtocolById(protocolId);
      setSelectedProtocol(response.data.result);
      setViewDialogOpen(true);
    } catch (err) {
      console.error("Error fetching protocol details:", err);
      setViewError("Failed to fetch protocol details. Please try again later.");
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MainNav isAdmin={true} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <ClipboardList className="h-8 w-8 text-blue-600" />
                Protocol Management
              </h1>
              <Button 
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
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

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading protocols...</p>
                </div>
              ) : currentProtocols.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">ID</TableHead>
                          <TableHead className="min-w-[200px]">Protocol Name</TableHead>
                          <TableHead className="min-w-[300px]">Description</TableHead>
                          <TableHead className="w-32">Total Doses</TableHead>
                          <TableHead className="w-40">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentProtocols.map((protocol) => (
                          <TableRow key={protocol.protocolId}>
                            <TableCell>{protocol.protocolId}</TableCell>
                            <TableCell className="font-medium">{protocol.name}</TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {protocol.description}
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {protocol.details?.length || 0} doses
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline"
                                  size="sm" 
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() => handleViewProtocol(protocol.protocolId)}
                                >
                                  <FileText className="h-4 w-4" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline"
                                  size="sm" 
                                  className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash className="h-4 w-4" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 0 && (
                    <div className="flex items-center justify-center py-4 border-t border-gray-200">
                      <nav className="flex items-center gap-2">
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
                          Previous
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          {[...Array(totalPages)].map((_, index) => {
                            const pageNum = index + 1;
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
                              return <span key={pageNum} className="px-1">...</span>;
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
                          Next
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
                </>
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <ClipboardList className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Protocols Found</h3>
                  <p className="text-gray-500">
                    Get started by adding your first vaccination protocol.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Protocol Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Protocol Details</span>
              <Button
                variant="ghost" 
                size="icon"
                onClick={() => setViewDialogOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {viewLoading ? (
            <div className="py-6 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
            </div>
          ) : viewError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>{viewError}</AlertDescription>
            </Alert>
          ) : selectedProtocol ? (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Protocol ID</h3>
                  <p className="mt-1">{selectedProtocol.protocolId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1 font-medium">{selectedProtocol.name}</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{selectedProtocol.description}</p>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Dose Schedule</h3>
                <div className="space-y-3">
                  {selectedProtocol.details && selectedProtocol.details.length > 0 ? (
                    selectedProtocol.details.map((detail, index) => (
                      <div key={detail.detailId} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-blue-50">
                            Dose {detail.doseNumber}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {detail.intervalDays === 0 
                              ? "Starting dose" 
                              : `+${detail.intervalDays} days after previous dose`}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No dose details available</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">
              No protocol data available
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProtocolManage; 