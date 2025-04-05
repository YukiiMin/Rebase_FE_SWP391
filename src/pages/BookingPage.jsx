"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { motion } from "framer-motion"
import React from "react"
import { apiService } from "../api"

// Lucide icons
import { UserIcon, SyringeIcon, PackageIcon, CalendarIcon, ShoppingCart, Plus, Loader2 } from "lucide-react"

// Components
import MainNav from "../components/layout/MainNav"
import Footer from "../components/layout/Footer"
import AddChild from "../components/layout/AddChild"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Checkbox } from "../components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Alert, AlertDescription } from "../components/ui/alert"

// Utils
import TokenUtils from "../utils/TokenUtils"
import { cn } from "../lib/utils"

function BookingPage() {
  const token = TokenUtils.getToken()
  const decodedToken = TokenUtils.decodeToken(token)

  const navigate = useNavigate()
  const [vaccinesList, setVaccinesList] = useState([]) //List vaccine to show to user
  const [comboList, setComboList] = useState([]) //List combo to show to user
  const [childs, setChilds] = useState([]) //List of user's children

  const [selectedVaccine, setSelectedVaccine] = useState([]) //List of user chosen vaccine
  const [selectedCombo, setSelectedCombo] = useState([]) //List of user chosen combo

  const [isSubmitting, setIsSubmitting] = useState(false) // Track form submission state

  const [bookingError, setBookingError] = useState("")

  const [type, setType] = useState("single")

  const [isOpen, setIsOpen] = useState(false)

  const [pageLoading, setPageLoading] = useState(true)
  const [apiErrors, setApiErrors] = useState({
    vaccines: false,
    combos: false,
    children: false,
  })

  const validation = Yup.object({
    childId: Yup.number().required("Please select a child for vaccination."),
    appointmentDate: Yup.date().required("Please select a vaccination date."),
    payment: Yup.string().required("Please select your payment method"),
  })

  const formik = useFormik({
    initialValues: {
      childId: "",
      appointmentDate: "",
      payment: "credit",
    },
    onSubmit: (values) => {
      handleSubmit(values)
    },
    validationSchema: validation,
  })

  //User must login to use this feature
  useEffect(() => {
    if (!TokenUtils.isLoggedIn()) {
      navigate("/Login")
      console.log("You must login to use this feature")
      return
    }

    const loadData = async () => {
      setPageLoading(true)

      try {
        await Promise.all([getChild(), getVaccines(), getCombo()])
      } catch (error) {
        console.error("Error loading initial data:", error)
      } finally {
        setPageLoading(false)
      }
    }

    loadData()
  }, [navigate])

  // Near the top of the component after useState declarations
  useEffect(() => {
    // Debug token information
    console.log("Token valid:", TokenUtils.isLoggedIn())
    if (TokenUtils.isLoggedIn()) {
      const userInfo = TokenUtils.getUserInfo()
      console.log("User ID:", userInfo?.userId)
      console.log("User role:", userInfo?.role)
      console.log("Token expiry:", new Date(userInfo?.exp * 1000).toISOString())
    }
  }, [])

  //Get list of single Vaccine
  const getVaccines = async () => {
    try {
      setApiErrors((prev) => ({ ...prev, vaccines: false }))
      
      const response = await apiService.vaccine.getAll();
      console.log("Vaccine API response status:", response.status)

      const data = response.data;
      console.log("Vaccine data received:", data)
      
      if (data && data.result) {
        setVaccinesList(data.result)
      } else {
        console.error("Invalid vaccine data structure:", data)
        setVaccinesList([])
        setApiErrors((prev) => ({ ...prev, vaccines: true }))
      }
    } catch (err) {
      console.error("Vaccine API error:", err)
      setVaccinesList([])
      setApiErrors((prev) => ({ ...prev, vaccines: true }))
    }
  }

  //Get list of Combo Vaccine
  const getCombo = async () => {
    try {
      setApiErrors((prev) => ({ ...prev, combos: false }))
      
      const response = await apiService.vaccine.getComboDetails();
      console.log("Combo API response status:", response.status)

      const data = response.data;
      console.log("Combo data received:", data)
      
      if (data && data.result) {
        const groupedCombos = groupCombos(data.result)
        setComboList(groupedCombos)
      } else {
        console.error("Invalid combo data structure:", data)
        setComboList([])
        setApiErrors((prev) => ({ ...prev, combos: true }))
      }
    } catch (err) {
      console.error("Combo API error:", err)
      setComboList([])
      setApiErrors((prev) => ({ ...prev, combos: true }))
    }
  }

  //Get account's children
  const getChild = async () => {
    try {
      setApiErrors((prev) => ({ ...prev, children: false }))
      const userInfo = TokenUtils.getUserInfo()
      const accountId = userInfo?.userId

      // Log account ID for debugging
      console.log("Fetching children for account ID:", accountId)

      const response = await apiService.users.getChildren(accountId);

      // Log response status
      console.log("Children API response status:", response.status)

      const data = response.data;
      console.log("Raw children API response:", data)
      
      // Check the structure of the data to ensure we're handling it correctly
      if (data && data.result) {
        // The structure might be different than expected
        // It could be data.result directly instead of data.result.children
        let childrenData = Array.isArray(data.result) ? data.result : data.result.children ? data.result.children : []

        console.log("Processed children data:", childrenData)

        // Ensure each child has valid properties
        childrenData = childrenData.map((child) => {
          // Ensure we have at least an ID and a name for display
          const validChild = {
            ...child,
            id: child.id || child.childId || Math.floor(Math.random() * 10000) + 1,
            name:
              child.name ||
              (child.firstName && child.lastName
                ? `${child.firstName} ${child.lastName}`
                : `Child ${child.id || child.childId || "Unknown"}`),
          }
          return validChild
        })

        setChilds(childrenData)

        if (childrenData.length === 0) {
          setBookingError("No children found. Please add a child.")
        } else {
          setBookingError("")
        }
      } else {
        console.error("Invalid children data structure:", data)
        setBookingError("Could not load children data. Please try again.")
        setApiErrors((prev) => ({ ...prev, children: true }))
      }
    } catch (err) {
      console.log(err)
      setBookingError("Could not load children data. Please try again.")
      setApiErrors((prev) => ({ ...prev, children: true }))
    }
  }

  //Get the new child to the top of the list
  const handleChildAdd = (newChild) => {
    if (newChild) {
      setChilds([newChild, ...childs])
    } else {
      getChild()
    }
  }

  //Group vaccine with the same comboId
  const groupCombos = (combosData) => {
    const grouped = {}
    combosData.forEach((combo) => {
      if (!grouped[combo.comboId]) {
        grouped[combo.comboId] = {
          comboId: combo.comboId,
          comboName: combo.comboName,
          description: combo.description,
          comboCategory: combo.comboCategory,
          saleOff: combo.saleOff,
          total: combo.total,
          vaccines: [], // Initialize vaccines array
        }
      }
      grouped[combo.comboId].vaccines.push(combo.vaccineName)
    })
    // Convert grouped object to array
    return Object.values(grouped)
  }

  //Change list depend on type (single or combo)
  const handleTypeChange = (value) => {
    setType(value)
  }

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      if (type === "single" && selectedVaccine.length === 0) {
        setBookingError("Please choose at least 1 vaccine to proceed!")
        return
      }

      if (type === "combo" && selectedCombo.length === 0) {
        setBookingError("Please choose at least 1 combo to proceed!")
        return
      }

      await createBooking(values)
    } catch (error) {
      setBookingError(error.message || "An error occurred during submission")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Create booking first
  const createBooking = async (values) => {
    const response = await apiService.bookings.create(values.childId, {
      appointmentDate: values.appointmentDate,
      status: "PENDING",
    });

    const bookingData = response.data;
    console.log(bookingData);

    if (!bookingData || !bookingData.result || !bookingData.result.bookingId) {
      throw new Error("Invalid booking response from server");
    }

    const bookingId = bookingData.result.bookingId;
    await createOrder(values, bookingId);
  }

  //Create order with bookingId
  const createOrder = async (values, bookingId) => {
    const response = await apiService.orders.create(bookingId, {
      orderDate: new Date().toISOString(),
    });

    const orderData = response.data;
    console.log(orderData);

    if (!orderData || !orderData.result || !orderData.result.id) {
      throw new Error("Invalid order response from server");
    }

    const orderId = orderData.result.id;
    await addDetail(values, orderId);
  }

  //Add vaccine detail to order
  const addDetail = async (values, orderId) => {
    if (type === "single") {
      for (const v of selectedVaccine) {
        await apiService.orders.addDetail(orderId, v.vaccine.id, {
          quantity: v.quantity,
          totalPrice: v.quantity * v.vaccine.salePrice,
        });
      }
    } else if (type === "combo") {
      // Handle combo vaccines here
      for (const combo of selectedCombo) {
        // Add combo to order
        await apiService.orders.addCombo(orderId, combo.comboId);
      }
    }

    // Find the selected child by its ID, and make sure we're using the right property
    const selectedChildId = Number.parseInt(values.childId);
    const selectedChild = childs.find((child) => child.id === selectedChildId || child.childId === selectedChildId);
    console.log("Selected child:", selectedChild, "Child ID:", values.childId);

    if (!selectedChild) {
      throw new Error("Selected child not found. Please try again.");
    }

    navigate("/Transaction", {
      state: {
        selectedVaccine: selectedVaccine,
        selectedCombo: selectedCombo,
        child: selectedChild,
        appointmentDate: values.appointmentDate,
        payment: values.payment,
        type: type,
        orderId: orderId,
      },
    });
  }

  // Optimize vaccine selection handling
  const handleVaccineSelection = React.useCallback((vaccine) => {
    setSelectedVaccine((prevSelected) => {
      const existingIndex = prevSelected.findIndex((v) => v.vaccine.id === vaccine.id)
      if (existingIndex !== -1) {
        // Remove vaccine if already selected
        return prevSelected.filter((_, index) => index !== existingIndex)
      }
      // Add new vaccine with quantity 1
      return [...prevSelected, { vaccine, quantity: 1 }]
    })
  }, []) // Empty dependency array since we're using functional updates

  // Update vaccine quantity
  const updateVaccineQuantity = React.useCallback((vaccineId, newQuantity) => {
    if (newQuantity < 1) return // Prevent negative quantities
    setSelectedVaccine((prevSelected) => 
      prevSelected.map((item) => 
        item.vaccine.id === vaccineId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }, [])

  // Optimize combo selection handling
  const handleComboSelection = React.useCallback((combo) => {
    setSelectedCombo((prevSelected) => {
      const existingIndex = prevSelected.findIndex((c) => c.comboId === combo.comboId)
      if (existingIndex !== -1) {
        // Remove combo if already selected
        return prevSelected.filter((_, index) => index !== existingIndex)
      }
      // Add new combo
      return [...prevSelected, combo]
    })
  }, []) // Empty dependency array since we're using functional updates

  // Memoize the filtered vaccines list
  const filteredVaccinesList = React.useMemo(() => {
    return vaccinesList.filter(vaccine => vaccine.quantity > 0)
  }, [vaccinesList])

  // Memoize the filtered combo list
  const filteredComboList = React.useMemo(() => {
    return comboList.filter(combo => combo.vaccines && combo.vaccines.length > 0)
  }, [comboList])

  // Replace the vaccine selection rendering with this updated version
  const renderVaccineItem = React.useCallback((vaccine) => {
    const isSelected = selectedVaccine.some((v) => v.vaccine.id === vaccine.id)
    return (
      <div
        key={vaccine.id}
        className={cn(
          "p-4 rounded-lg border transition-all",
          isSelected
            ? "border-blue-300 bg-blue-50 shadow-sm"
            : "border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleVaccineSelection(vaccine)}
              className="h-5 w-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <div>
              <p className="font-medium text-gray-900 text-lg">{vaccine.name}</p>
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Manufacturer:</span>
                  <span className="text-sm text-gray-600">{vaccine.manufacturer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Category:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {vaccine.categoryName || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex flex-col items-end gap-1">
              <p className="font-semibold text-blue-700 bg-blue-50 px-4 py-2 rounded-full text-base border border-blue-200">
                {formatCurrency(vaccine.salePrice)}
              </p>
              {isSelected && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Quantity:</label>
                    <Input
                      type="number"
                      min="1"
                      max={vaccine.quantity || 999}
                      value={selectedVaccine.find(v => v.vaccine.id === vaccine.id)?.quantity || 1}
                      onChange={(e) => updateVaccineQuantity(vaccine.id, parseInt(e.target.value))}
                      className="w-20 text-center"
                    />
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }, [selectedVaccine, handleVaccineSelection, updateVaccineQuantity])

  // Replace the combo selection rendering with this optimized version
  const renderComboItem = React.useCallback((combo) => {
    const isSelected = selectedCombo.some((c) => c.comboId === combo.comboId)
    return (
      <div
        key={combo.comboId}
        className={cn(
          "p-4 rounded-lg border transition-all",
          isSelected
            ? "border-blue-300 bg-blue-50 shadow-sm"
            : "border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleComboSelection(combo)}
              className="mt-1 h-5 w-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <div>
              <p className="font-medium text-gray-900 text-lg">{combo.comboName}</p>
              <p className="text-sm text-gray-600 mt-2">{combo.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {combo.vaccines.map((vaccine, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"
                  >
                    {vaccine}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="text-right">
            {combo.saleOff > 0 && (
              <div className="line-through text-sm text-gray-500">
                {formatCurrency(combo.total)}
              </div>
            )}
            <div className="font-semibold text-blue-700 bg-blue-50 px-4 py-2 rounded-full text-base border border-blue-200 mt-1">
              {formatCurrency(combo.total * (1 - combo.saleOff / 100))}
            </div>
            {combo.saleOff > 0 && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-2 border border-green-200">
                Save {combo.saleOff}%
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }, [selectedCombo, handleComboSelection])

  // Format currency
  const formatCurrency = (price) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price)
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  // Handle child selection
  const [selectedChild, setSelectedChild] = useState([])
  const [child, setChild] = useState(null)

  // Only handle child selection via the dropdown
  const handleSelectChange = (value) => {
    // Only update if value exists and is different from current value
    if (value && formik.values.childId !== value) {
      formik.setFieldValue("childId", value)

      // Find and set the selected child once
      const childId = Number.parseInt(value)
      const selectedChild = childs.find((child) => child.id === childId || child.childId === childId)

      if (selectedChild) {
        setChild(selectedChild)
        setSelectedChild([selectedChild])
      }
    }
  }

  const handleRemoveChild = (id) => {
    setSelectedChild(selectedChild.filter((child) => child.id !== id))
    setChild(null)
    formik.setFieldValue("childId", "")
  }

  const handleAddAnotherChild = () => {
    setIsOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <MainNav />
      <div className="mx-auto w-full max-w-5xl px-4 py-6 space-y-8 flex-1">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 tracking-tight">Schedule Your Vaccination</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Choose from our wide range of vaccines and vaccination packages to keep your child protected.
          </p>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10"
          >
            <Card className="rounded-xl border-2 border-blue-300 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-600 text-white border-b-2 border-blue-400 py-5">
                <CardTitle className="flex items-center text-white">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Select Child
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-10 bg-white">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-grow">
                    <Select name="childId" value={formik.values.childId} onValueChange={handleSelectChange}>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-12 text-base hover:border-blue-400 transition-colors shadow-sm">
                        <SelectValue placeholder="Select a child" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-lg">
                        {childs.length > 0 ? (
                          childs.map((child) => {
                            const childId = (
                              child.id ||
                              child.childId ||
                              Math.floor(Math.random() * 10000) + 1
                            ).toString()
                            const childName =
                              child.name ||
                              (child.firstName && child.lastName
                                ? `${child.firstName} ${child.lastName}`
                                : "Child " + childId)

                            return (
                              <SelectItem
                                key={`child-${childId}`}
                                value={childId}
                                className="text-gray-900 hover:bg-blue-50 py-3 cursor-pointer text-base"
                              >
                                {childName}
                              </SelectItem>
                            )
                          })
                        ) : (
                          <SelectItem value="no-child" disabled className="text-gray-500">
                            No children found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {formik.touched.childId && formik.errors.childId && (
                      <p className="text-sm text-red-500 mt-1">{formik.errors.childId}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 transition-all h-12 text-base font-medium shadow-sm"
                    onClick={() => setIsOpen(true)}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Child
                  </Button>
                  {isOpen && <AddChild setIsOpen={setIsOpen} open={isOpen} onAdded={() => handleChildAdd()} />}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {pageLoading ? (
          <div className="text-center py-16">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-6 text-gray-600">Loading booking information...</p>
          </div>
        ) : (
          <>
            {(apiErrors.vaccines || apiErrors.combos || apiErrors.children) && (
              <Alert variant="destructive" className="mb-10">
                <AlertDescription>
                  There was an error loading some data. Please refresh the page or try again later.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full mb-10"
              >
                <Tabs value={type} onValueChange={handleTypeChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-blue-100/70 p-1.5 gap-3 rounded-lg mb-8 max-w-md mx-auto shadow-sm">
                    <TabsTrigger
                      value="single"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 text-base transition-all"
                    >
                      <SyringeIcon className="w-5 h-5 mr-2" />
                      Single Vaccines
                    </TabsTrigger>
                    <TabsTrigger
                      value="combo"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 text-base transition-all"
                    >
                      <PackageIcon className="w-5 h-5 mr-2" />
                      Combo Packages
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="single" className="mt-6">
                    <Card className="rounded-xl border-2 border-blue-300 shadow-lg overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-600 text-white border-b-2 border-blue-400 py-5">
                        <CardTitle className="flex items-center text-white">
                          <SyringeIcon className="w-5 h-5 mr-2" />
                          Select Individual Vaccines
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 md:p-10 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-lg font-medium mb-6 text-blue-900 flex items-center">
                              <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                                1
                              </span>
                              Available Vaccines
                            </h3>
                            {vaccinesList.length > 0 ? (
                              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-50">
                                {filteredVaccinesList.map(renderVaccineItem)}
                              </div>
                            ) : (
                              <div className="text-center py-8 border rounded-lg bg-gray-50">
                                <p className="text-gray-500">No vaccine data found</p>
                              </div>
                            )}
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-6 text-blue-900 flex items-center">
                              <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                                2
                              </span>
                              Your Selected Vaccines
                            </h3>
                            {selectedVaccine.length > 0 ? (
                              <div className="space-y-5">
                                {selectedVaccine.map((v) => (
                                  <motion.div
                                    key={v.vaccine.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-6 rounded-xl border-2 border-blue-300 bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium text-gray-900 text-lg">{v.vaccine.name}</p>
                                        <p className="text-sm text-gray-600 mt-2">Quantity: {v.quantity}</p>
                                      </div>
                                      <p className="font-semibold text-blue-700 bg-white px-4 py-2 rounded-full text-base border border-blue-200">
                                        {formatCurrency(v.vaccine.salePrice * v.quantity)}
                                      </p>
                                    </div>
                                  </motion.div>
                                ))}
                                <div className="mt-6 p-5 border-t border-blue-200">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-900">Total:</span>
                                    <span className="font-semibold text-blue-600">
                                      {formatCurrency(
                                        selectedVaccine.reduce(
                                          (total, v) => total + v.vaccine.salePrice * v.quantity,
                                          0,
                                        ),
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8 border rounded-lg bg-gray-50">
                                <p className="text-gray-500">No vaccines selected</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="combo" className="mt-6">
                    <Card className="rounded-xl border-2 border-blue-300 shadow-lg overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-600 text-white border-b-2 border-blue-400 py-5">
                        <CardTitle className="flex items-center text-white">
                          <PackageIcon className="w-5 h-5 mr-2" />
                          Select Vaccine Combos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 md:p-10 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div>
                            <h3 className="text-lg font-medium mb-6 text-blue-900 flex items-center">
                              <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                                1
                              </span>
                              Available Combos
                            </h3>
                            {comboList.length > 0 ? (
                              <div className="space-y-5">
                                {filteredComboList.map(renderComboItem)}
                              </div>
                            ) : (
                              <div className="text-center py-8 border rounded-lg bg-gray-50">
                                <p className="text-gray-500">No combo packages found</p>
                              </div>
                            )}
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-6 text-blue-900 flex items-center">
                              <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                                2
                              </span>
                              Your Selected Combos
                            </h3>
                            {selectedCombo.length > 0 ? (
                              <div className="space-y-5">
                                {selectedCombo.map((combo) => (
                                  <motion.div
                                    key={combo.comboId}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-6 rounded-xl border-2 border-blue-300 bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
                                  >
                                    <h4 className="font-medium text-gray-900 text-lg">{combo.comboName}</h4>
                                    <p className="text-sm text-gray-600 mt-2">{combo.description}</p>

                                    <div className="mt-4">
                                      <div className="text-sm text-gray-600">Included vaccines:</div>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {combo.vaccines.map((vaccine, idx) => (
                                          <span
                                            key={idx}
                                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white text-blue-700 border border-blue-200"
                                          >
                                            {vaccine}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Price:</span>
                                      <div className="text-right">
                                        {combo.saleOff > 0 && (
                                          <div className="line-through text-sm text-gray-500">
                                            {formatCurrency(combo.total)}
                                          </div>
                                        )}
                                        <div className="font-semibold text-blue-700 bg-white px-4 py-2 rounded-full text-base border border-blue-200">
                                          {formatCurrency(combo.total * (1 - combo.saleOff / 100))}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                                <div className="mt-6 p-5 border-t border-blue-200">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-900">Total:</span>
                                    <span className="font-semibold text-blue-600">
                                      {formatCurrency(
                                        selectedCombo.reduce(
                                          (total, combo) => total + combo.total * (1 - combo.saleOff / 100),
                                          0,
                                        ),
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8 border rounded-lg bg-gray-50">
                                <p className="text-gray-500">No combo packages selected</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-10"
              >
                <Card className="rounded-xl border-2 border-blue-300 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-600 text-white border-b-2 border-blue-400 py-5">
                    <CardTitle className="flex items-center text-white">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      Appointment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 md:p-10 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Vaccination Date
                        </label>
                        <Input
                          type="date"
                          id="appointmentDate"
                          name="appointmentDate"
                          value={formik.values.appointmentDate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full border-2 ${
                            formik.touched.appointmentDate && formik.errors.appointmentDate
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500"
                          } rounded-lg pl-4 pr-4 py-3 h-12 text-base shadow-sm`}
                          min={new Date().toISOString().split("T")[0]}
                        />
                        {formik.touched.appointmentDate && formik.errors.appointmentDate && (
                          <p className="mt-2 text-sm text-red-500">{formik.errors.appointmentDate}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {bookingError && (
                <Alert variant="destructive" className="mb-10">
                  <AlertDescription>{bookingError}</AlertDescription>
                </Alert>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex justify-end pt-8"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || !formik.isValid || (!selectedVaccine.length && !selectedCombo.length)}
                  className="w-full mt-8 px-12 py-7 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Continue to Checkout
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </>
        )}
      </div>
      <Footer className="mt-20" />
    </div>
  )
}

export default BookingPage

