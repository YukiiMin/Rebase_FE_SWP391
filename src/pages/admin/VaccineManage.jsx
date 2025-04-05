"use client"

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

function VaccineManage() {
  const [vaccines, setVaccines] = useState([])
  const [loading, setLoading] = useState(true)
  const apiUrl = "http://localhost:8080/vaccine/get"
  const token = localStorage.getItem("token")
  const { t } = useTranslation()

  const [isOpen, setIsOpen] = useState(false)
  const [searchName, setSearchName] = useState("")
  const [searchManufacturer, setSearchManufacturer] = useState("")
  const [sortOption, setSortOption] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchVaccine()
  }, [])

  const fetchVaccine = async () => {
    setLoading(true)
    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setVaccines(data.result || [])
      } else {
        setError("Failed to fetch vaccines. Please try again later.")
      }
    } catch (err) {
      setError("An error occurred while fetching vaccines.")
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

  // Pagination
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

            {/* Search and Filters */}
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

            {/* Vaccines Table */}
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
                          <TableHead className="w-32 font-medium text-gray-600">{t("admin.vaccine.status")}</TableHead>
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
                            <TableCell>${vaccine.unitPrice.toFixed(2)}</TableCell>
                            <TableCell>${vaccine.salePrice.toFixed(2)}</TableCell>
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
                                  <DropdownMenuItem className="flex items-center">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Protocol
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="flex items-center text-red-600">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
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
    </div>
  )
}

export default VaccineManage

