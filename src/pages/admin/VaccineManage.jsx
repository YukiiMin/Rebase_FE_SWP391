import React, { useEffect, useState } from "react"
import Sidebar from "../../components/layout/Sidebar"
import MainNav from "../../components/layout/MainNav"
import AddVaccine from "../../components/layout/AddVaccine"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import {
  Search,
  Plus,
  Edit,
  Trash,
  FileText,
  Filter,
  Syringe,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  AlertCircle,
  Loader2,
  ArrowUpDown,
  Eye,
  RefreshCw,
  X,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Skeleton } from "../../components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose 
} from "../../components/ui/dialog"
import { Separator } from "../../components/ui/separator"
import apiService from "../../api/apiService"
import { useNavigate } from "react-router-dom"

function VaccineManage() {
  const [vaccines, setVaccines] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const [isOpen, setIsOpen] = useState(false)
  const [searchName, setSearchName] = useState("")
  const [searchManufacturer, setSearchManufacturer] = useState("")
  const [sortOption, setSortOption] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState("")
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedVaccine, setSelectedVaccine] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingVaccine, setDeletingVaccine] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingVaccine, setEditingVaccine] = useState(null)

  const [protocolDialogOpen, setProtocolDialogOpen] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState(null)
  const [protocolLoading, setProtocolLoading] = useState(false)
  const [protocolError, setProtocolError] = useState("")

  useEffect(() => {
    fetchVaccine()
  }, [])

  const fetchVaccine = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await apiService.vaccine.getAll()
      const vaccinesData = response.data.result || []
      
      // Thêm trường isActive nếu không có trong API response
      const processedVaccines = vaccinesData.map(vaccine => ({
        ...vaccine,
        // Nếu API đã có trường status thì sử dụng nó, nếu không thì mặc định là active
        isActive: vaccine.status === 'ACTIVE' || vaccine.status === true || vaccine.isActive === true || true
      }))
      
      setVaccines(processedVaccines)
    } catch (err) {
      console.error("Error fetching vaccines:", err)
      setError("Failed to fetch vaccines: " + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    await fetchVaccine()
    setTimeout(() => {
      setIsRefreshing(false)
    }, 500)
  }

  const searchVaccine = () => {
    let filtered = vaccines.filter((vaccine) => {
      const sName = vaccine.name?.toLowerCase().includes(searchName.toLowerCase()) || !searchName
      const sManufacturer =
        vaccine.manufacturer?.toLowerCase().includes(searchManufacturer.toLowerCase()) || !searchManufacturer
      return sName && sManufacturer
    })

    if (sortOption) {
      filtered = [...filtered].sort((a, b) => {
        if (sortOption === "quantityAsc") return a.quantity - b.quantity
        if (sortOption === "unitPriceAsc") return a.unitPrice - b.unitPrice
        if (sortOption === "salePriceAsc") return a.salePrice - b.salePrice
        if (sortOption === "quantityDes") return b.quantity - a.quantity
        if (sortOption === "unitPriceDes") return b.unitPrice - a.unitPrice
        if (sortOption === "salePriceDes") return b.salePrice - a.salePrice
        return 0
      })
    }
    return filtered
  }

  const filteredVaccines = searchVaccine()
  const indexOfLastItems = currentPage * itemsPerPage
  const indexOfFirstItems = indexOfLastItems - itemsPerPage
  const currentVaccines = filteredVaccines.slice(indexOfFirstItems, indexOfLastItems)
  const totalPages = Math.ceil(filteredVaccines.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleVaccineAdded = (newVaccine) => {
    if (newVaccine) {
      setVaccines([newVaccine, ...vaccines])
    } else {
      fetchVaccine()
    }
  }

  const handleViewDetails = (vaccine) => {
    setSelectedVaccine(vaccine)
    setViewDialogOpen(true)
  }

  const handleViewProtocol = async (vaccineId) => {
    try {
      setProtocolLoading(true)
      setProtocolError("")
      
      // Gọi API để lấy thông tin protocol của vaccine
      const response = await apiService.vaccine.getProtocolDoseByVaccine(vaccineId)
      
      if (response.data && response.data.result) {
        setSelectedProtocol(response.data.result)
        setProtocolDialogOpen(true)
      } else {
        setProtocolError("Protocol data not available for this vaccine")
      }
    } catch (err) {
      console.error("Error fetching protocol details:", err)
      setProtocolError("Failed to fetch protocol details: " + (err.response?.data?.message || err.message))
    } finally {
      setProtocolLoading(false)
    }
  }

  const handleEditVaccine = (vaccine) => {
    setEditingVaccine(vaccine)
    setEditDialogOpen(true)
  }

  const handleToggleStatus = (vaccine) => {
    setDeletingVaccine(vaccine)
    setDeleteDialogOpen(true)
  }

  const confirmToggleStatus = async () => {
    if (!deletingVaccine) return
    
    setIsDeleting(true)
    try {
      if (deletingVaccine.isActive) {
        await apiService.vaccine.deactivateVaccine(deletingVaccine.id)
      } else {
        await apiService.vaccine.activateVaccine(deletingVaccine.id)
      }
      
      setVaccines(vaccines.map(v => 
        v.id === deletingVaccine.id 
          ? {...v, isActive: !v.isActive} 
          : v
      ))
      setDeleteDialogOpen(false)
    } catch (err) {
      console.error("Error updating vaccine status:", err)
      setError("Failed to update vaccine status: " + (err.response?.data?.message || err.message))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateVaccine = (updatedVaccine) => {
    setVaccines(vaccines.map(vaccine => 
      vaccine.id === updatedVaccine.id ? updatedVaccine : vaccine
    ))
    setEditDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav isAdmin={true} />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Syringe className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{t("admin.vaccine.title")}</h1>
                  <p className="text-sm text-gray-500">Manage your vaccine inventory</p>
                </div>
              </div>
              <div className="flex gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={refreshData} disabled={isRefreshing}>
                        {isRefreshing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button 
                  onClick={() => setIsOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  {t("admin.vaccine.addVaccine")}
                </Button>
              </div>
            </div>

            {isOpen && <AddVaccine setIsOpen={setIsOpen} open={isOpen} onAdded={handleVaccineAdded} />}

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card className="mb-6 border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("admin.vaccine.vaccineName")}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder={t("admin.vaccine.searchPlaceholder")}
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="pl-9 h-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("admin.vaccine.manufacturer")}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder={t("admin.vaccine.manufacturer")}
                        value={searchManufacturer}
                        onChange={(e) => setSearchManufacturer(e.target.value)}
                        className="pl-9 h-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("admin.vaccine.sortBy")}</label>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full h-10 pl-9 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">---{t("admin.vaccine.sortBy")}---</option>
                        <option value="quantityAsc">{t("admin.vaccine.quantityAsc")}</option>
                        <option value="quantityDes">{t("admin.vaccine.quantityDes")}</option>
                        <option value="unitPriceAsc">{t("admin.vaccine.unitPriceAsc")}</option>
                        <option value="unitPriceDes">{t("admin.vaccine.unitPriceDes")}</option>
                        <option value="salePriceAsc">{t("admin.vaccine.salePriceAsc")}</option>
                        <option value="salePriceDes">{t("admin.vaccine.salePriceDes")}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-lg font-semibold text-gray-800">Vaccine List</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading vaccines...</p>
                  </div>
                ) : currentVaccines.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-gray-50">
                          <TableHead className="w-20 font-medium text-gray-600">{t("admin.vaccine.id")}</TableHead>
                          <TableHead className="min-w-[200px] font-medium text-gray-600">
                            {t("admin.vaccine.vaccineName")}
                          </TableHead>
                          <TableHead className="min-w-[200px] font-medium text-gray-600">
                            {t("admin.vaccine.manufacturer")}
                          </TableHead>
                          <TableHead className="w-32 font-medium text-gray-600">
                            <div className="flex items-center">
                              {t("admin.vaccine.quantity")}
                              <ArrowUpDown className="ml-1 h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead className="w-32 font-medium text-gray-600">
                            <div className="flex items-center">
                              {t("admin.vaccine.unitPrice")}
                              <ArrowUpDown className="ml-1 h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead className="w-32 font-medium text-gray-600">
                            <div className="flex items-center">
                              {t("admin.vaccine.salePrice")}
                              <ArrowUpDown className="ml-1 h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead className="w-32 font-medium text-gray-600">Inventory Status</TableHead>
                          <TableHead className="w-32 font-medium text-gray-600">Active Status</TableHead>
                          <TableHead className="w-20 font-medium text-gray-600 text-right">
                            {t("admin.vaccine.actions")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentVaccines.map((vaccine) => (
                          <TableRow key={vaccine.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{vaccine.id}</TableCell>
                            <TableCell>{vaccine.name}</TableCell>
                            <TableCell>{vaccine.manufacturer}</TableCell>
                            <TableCell>{vaccine.quantity}</TableCell>
                            <TableCell>${vaccine.unitPrice?.toFixed(2)}</TableCell>
                            <TableCell>${vaccine.salePrice?.toFixed(2)}</TableCell>
                            <TableCell>
                              {vaccine.quantity > 0 ? (
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                  {t("admin.vaccine.inStock")}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                                  {t("admin.vaccine.outOfStock")}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {vaccine.isActive ? (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[160px]">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="flex items-center"
                                    onClick={() => handleViewDetails(vaccine)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="flex items-center"
                                    onClick={() => handleViewProtocol(vaccine.id)}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Protocol
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="flex items-center"
                                    onClick={() => handleEditVaccine(vaccine)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className={`flex items-center ${vaccine.isActive ? "text-red-600" : "text-green-600"}`}
                                    onClick={() => handleToggleStatus(vaccine)}
                                  >
                                    {vaccine.isActive ? (
                                      <>
                                        <AlertCircle className="mr-2 h-4 w-4" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Activate
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Syringe className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Vaccines Found</h3>
                    <p className="text-gray-500">
                      No vaccines found matching your criteria.
                    </p>
                  </div>
                )}
              </CardContent>
              {!loading && currentVaccines.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Showing <span className="font-medium">{indexOfFirstItems + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(indexOfLastItems, filteredVaccines.length)}</span> of{" "}
                      <span className="font-medium">{filteredVaccines.length}</span> vaccines
                    </p>

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
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Syringe className="h-5 w-5 text-blue-600" />
              Vaccine Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedVaccine && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">ID</h4>
                  <p>{selectedVaccine.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Status</h4>
                  <div className="mt-1">
                    {selectedVaccine.quantity > 0 ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500">Vaccine Name</h4>
                <p className="font-medium text-lg">{selectedVaccine.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Manufacturer</h4>
                  <p>{selectedVaccine.manufacturer}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Category</h4>
                  <p>{selectedVaccine.categoryName || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-md">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Quantity</h4>
                  <p className="font-semibold">{selectedVaccine.quantity} units</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Unit Price</h4>
                  <p className="font-semibold">${selectedVaccine.unitPrice?.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Sale Price</h4>
                  <p className="font-semibold text-blue-600">${selectedVaccine.salePrice?.toFixed(2)}</p>
                </div>
              </div>

              {selectedVaccine.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Description</h4>
                  <p className="text-sm text-gray-600">{selectedVaccine.description}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={() => handleEditVaccine(selectedVaccine)}>Edit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-blue-600">
              {deletingVaccine?.isActive ? "Deactivate" : "Activate"} Vaccine
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {deletingVaccine?.isActive ? "deactivate" : "activate"} this vaccine?
            </DialogDescription>
          </DialogHeader>
          
          {deletingVaccine && (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="font-medium">{deletingVaccine.name}</p>
              <p className="text-sm text-gray-600">ID: {deletingVaccine.id}</p>
              <p className="text-sm text-gray-600">Manufacturer: {deletingVaccine.manufacturer}</p>
              <p className="text-sm text-gray-600">
                Current status: <span className={deletingVaccine.isActive ? "text-green-600" : "text-red-600"}>
                  {deletingVaccine.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>Cancel</Button>
            </DialogClose>
            <Button 
              variant={deletingVaccine?.isActive ? "destructive" : "default"}
              onClick={confirmToggleStatus}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {deletingVaccine?.isActive ? "Deactivate" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Vaccine
            </DialogTitle>
          </DialogHeader>
          
          {editingVaccine && (
            <div className="py-2">
              <p className="text-center text-gray-500">
                Edit functionality would be implemented here, using the apiService.vaccine.update API.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => setEditDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={protocolDialogOpen} onOpenChange={setProtocolDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Vaccine Protocol Details</span>
              <Button
                variant="ghost" 
                size="icon"
                onClick={() => setProtocolDialogOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {protocolLoading ? (
            <div className="py-6 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
            </div>
          ) : protocolError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>{protocolError}</AlertDescription>
            </Alert>
          ) : selectedProtocol ? (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Vaccine ID</h3>
                  <p className="mt-1">{selectedProtocol.vaccineId || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Vaccine Name</h3>
                  <p className="mt-1 font-medium">{selectedProtocol.vaccineName || "N/A"}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Dose Schedule</h3>
                <div className="space-y-3">
                  {selectedProtocol.doses && selectedProtocol.doses.length > 0 ? (
                    selectedProtocol.doses.map((dose, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-blue-50">
                            Dose {dose.doseNumber || index + 1}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {dose.intervalDays === 0 
                              ? "Starting dose" 
                              : `+${dose.intervalDays} days after previous dose`}
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
              No protocol data available for this vaccine
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setProtocolDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default VaccineManage

