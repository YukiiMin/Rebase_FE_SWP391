"use client"

import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Sidebar from "../../components/layout/Sidebar"
import MainNav from "../../components/layout/MainNav"
import {
  Users,
  Syringe,
  Calendar,
  DollarSign,
  ArrowRight,
  LayoutDashboard,
  TrendingUp,
  ShieldCheck,
  Activity,
  Package,
  AlertCircle,
  Download,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { useTranslation } from "react-i18next"
import { Progress } from "../../components/ui/progress"
import { Skeleton } from "../../components/ui/skeleton"
import { Alert, AlertDescription } from "../../components/ui/alert"

function Dashboard() {
  const api = "http://localhost:8080"
  const token = localStorage.getItem("token")
  const [loading, setLoading] = useState(true)
  const [accountError, setAccountError] = useState("")
  const [userList, setUserList] = useState([])
  const [staffList, setStaffList] = useState([])
  const [vaccineError, setVaccineError] = useState("")
  const [vaccineList, setVaccineList] = useState([])
  const [comboError, setComboError] = useState("")
  const [comboList, setComboList] = useState([])
  const [topVaccine, setTopVaccine] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([getAccount(), getVaccine(), getCombo()])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const getAccount = async () => {
    try {
      const response = await fetch(`${api}/users/getAllUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error("Failed to get accounts")
      }
      const data = await response.json()
      const users = data.result.filter((account) => account.roleName === "USER")
      const staffs = data.result.filter((account) => account.roleName === "STAFF")
      setUserList(users)
      setStaffList(staffs)
    } catch (err) {
      setAccountError(err.message)
    }
  }

  const getVaccine = async () => {
    try {
      const response = await fetch(`${api}/vaccine/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error("Failed to get vaccines")
      }
      const data = await response.json()
      setVaccineList(data.result)

      // Set a mock top vaccine for demonstration
      if (data.result && data.result.length > 0) {
        const mockTopVaccine = {
          ...data.result[0],
          salesCount: 156,
          percentageGrowth: 12.5,
          stockPercentage: 75,
        }
        setTopVaccine(mockTopVaccine)
      }
    } catch (err) {
      setVaccineError(err.message)
    }
  }

  const getCombo = async () => {
    try {
      const response = await fetch(`${api}/vaccine/get/comboDetail`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error("Failed to get combos")
      }
      const data = await response.json()
      const groupedCombos = groupCombos(data.result)
      setComboList(groupedCombos)
    } catch (err) {
      setComboError(err.message)
    }
  }

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
          vaccines: [],
        }
      }
      grouped[combo.comboId].vaccines.push({
        name: combo.vaccineName,
        manufacturer: combo.manufacturer,
        dose: combo.dose,
      })
    })
    return Object.values(grouped)
  }

  const getRandomUsers = (users, count) => {
    if (!users || users.length === 0) return []
    const shuffled = [...users].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, users.length))
  }

  const getRandomStaffs = (staffs, count) => {
    if (!staffs || staffs.length === 0) return []
    const shuffled = [...staffs].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, users.length))
  }

  const getRandomVaccines = (vaccines, count) => {
    if (!vaccines || vaccines.length === 0) return []
    const shuffled = [...vaccines].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, vaccines.length))
  }

  const getRandomCombos = (combos, count) => {
    if (!combos || combos.length === 0) return []
    const shuffled = [...combos].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, combos.length))
  }

  const randomUser = getRandomUsers(userList, 4)
  const randomStaff = getRandomStaffs(staffList, 4)
  const randomVaccine = getRandomVaccines(vaccineList, 3)
  const randomCombo = getRandomCombos(comboList, 3)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNav isAdmin={true} />
        <div className="flex h-[calc(100vh-64px)]">
          <div className="w-64 flex-shrink-0">
            <Sidebar />
          </div>
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 mb-8">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-48" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Skeleton className="h-80 md:col-span-3 w-full rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
              </div>

              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </main>
        </div>
      </div>
    )
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <LayoutDashboard className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{t("admin.dashboard.title")}</h1>
                  <p className="text-sm text-gray-500">Welcome back, Admin</p>
                </div>
              </div>
              <div className="hidden md:flex gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title={t("admin.dashboard.totalAccounts")}
                value={userList.length + staffList.length + 1}
                icon={<Users className="h-6 w-6 text-blue-500" />}
                color="bg-blue-50"
                trend="+5.2%"
                trendUp={true}
              />
              <StatCard
                title={t("admin.dashboard.totalVaccines")}
                value={vaccineList.length || 0}
                icon={<Syringe className="h-6 w-6 text-green-500" />}
                color="bg-green-50"
                trend="+2.4%"
                trendUp={true}
              />
              <StatCard
                title={t("admin.dashboard.totalBookings")}
                value={520}
                icon={<Calendar className="h-6 w-6 text-amber-500" />}
                color="bg-amber-50"
                trend="+12.8%"
                trendUp={true}
              />
              <StatCard
                title={t("admin.dashboard.totalSales")}
                value="$50,000"
                icon={<DollarSign className="h-6 w-6 text-red-500" />}
                color="bg-red-50"
                trend="+8.3%"
                trendUp={true}
              />
            </div>

            {/* Users & Staff Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {t("admin.dashboard.registeredAccounts")}
                      </CardTitle>
                    </div>
                    <Link
                      to="/Admin/ManageAccount"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                    >
                      {t("admin.dashboard.manageAccounts")}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-50">
                        <TableHead className="w-20 font-medium text-gray-600">#</TableHead>
                        <TableHead className="min-w-[200px] font-medium text-gray-600">{t("admin.account.fullName")}</TableHead>
                        <TableHead className="min-w-[150px] font-medium text-gray-600">{t("admin.account.username")}</TableHead>
                        <TableHead className="min-w-[200px] font-medium text-gray-600">{t("admin.account.email")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userList.length > 0 ? (
                        randomUser.map((user, index) => (
                          <TableRow key={user.accountId} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                            <TableCell className="text-gray-600">{user.username}</TableCell>
                            <TableCell className="text-gray-600">{user.email}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <AlertCircle className="h-8 w-8 mb-2 text-gray-400" />
                              <p>{accountError || t("admin.dashboard.noData")}</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 py-3 px-6">
                  <p className="text-sm text-gray-500">Total users: {userList.length}</p>
                </CardFooter>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {t("admin.dashboard.staffTable")}
                      </CardTitle>
                    </div>
                    <Link
                      to="/Admin/WorkSchedule"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                    >
                      {t("admin.dashboard.scheduling")}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-50">
                        <TableHead className="w-20 font-medium text-gray-600">{t("admin.vaccine.id")}</TableHead>
                        <TableHead className="min-w-[200px] font-medium text-gray-600">{t("admin.account.fullName")}</TableHead>
                        <TableHead className="min-w-[200px] font-medium text-gray-600">{t("admin.account.email")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffList.length > 0 ? (
                        randomStaff.map((user) => (
                          <TableRow key={user.accountId} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{user.accountId}</TableCell>
                            <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                            <TableCell className="text-gray-600">{user.email}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <AlertCircle className="h-8 w-8 mb-2 text-gray-400" />
                              <p>{accountError || t("admin.dashboard.noData")}</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 py-3 px-6">
                  <p className="text-sm text-gray-500">Total staff: {staffList.length}</p>
                </CardFooter>
              </Card>
            </div>

            {/* Vaccine Table */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="md:col-span-3 border border-gray-200 shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Syringe className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {t("admin.dashboard.vaccineInventory")}
                      </CardTitle>
                    </div>
                    <Link
                      to="/Admin/ManageVaccine"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                    >
                      {t("admin.dashboard.manageVaccines")}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-50">
                        <TableHead className="w-20 font-medium text-gray-600">{t("admin.vaccine.id")}</TableHead>
                        <TableHead className="min-w-[200px] font-medium text-gray-600">{t("admin.vaccine.vaccineName")}</TableHead>
                        <TableHead className="w-32 font-medium text-gray-600">{t("admin.vaccine.quantity")}</TableHead>
                        <TableHead className="w-32 font-medium text-gray-600">{t("admin.vaccine.unitPrice")}</TableHead>
                        <TableHead className="w-32 font-medium text-gray-600">{t("admin.vaccine.salePrice")}</TableHead>
                        <TableHead className="w-32 font-medium text-gray-600">{t("admin.vaccine.status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vaccineList.length > 0 ? (
                        randomVaccine.map((vaccine) => (
                          <TableRow key={vaccine.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{vaccine.id}</TableCell>
                            <TableCell>{vaccine.name}</TableCell>
                            <TableCell>{vaccine.quantity}</TableCell>
                            <TableCell>${vaccine.unitPrice.toFixed(2)}</TableCell>
                            <TableCell>${vaccine.salePrice.toFixed(2)}</TableCell>
                            <TableCell>
                              {vaccine.quantity > 0 ? (
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                  In Stock
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                                  Out of Stock
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <AlertCircle className="h-8 w-8 mb-2 text-gray-400" />
                              <p>{vaccineError || t("admin.dashboard.noData")}</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 py-3 px-6">
                  <p className="text-sm text-gray-500">Total vaccines: {vaccineList.length}</p>
                </CardFooter>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {t("admin.dashboard.topVaccine")}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {topVaccine ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-800">{topVaccine.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{topVaccine.manufacturer}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{topVaccine.salesCount}</p>
                          <p className="text-xs text-gray-500">Units Sold</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">+{topVaccine.percentageGrowth}%</p>
                          <p className="text-xs text-gray-500">Growth</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-amber-600">${topVaccine.salePrice}</p>
                          <p className="text-xs text-gray-500">Price</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Stock Level</span>
                          <span className="text-gray-500">{topVaccine.stockPercentage}%</span>
                        </div>
                        <Progress value={topVaccine.stockPercentage} className="h-2" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                      <Activity className="h-8 w-8 mb-2 text-gray-400" />
                      <p>{t("admin.dashboard.noData")}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Combo Table */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-500" />
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {t("admin.dashboard.comboTable")}
                    </CardTitle>
                  </div>
                  <Link
                    to="/Admin/ManageCombo"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                  >
                    {t("admin.dashboard.manageCombos")}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-50">
                      <TableHead className="w-20 font-medium text-gray-600">{t("admin.combo.id")}</TableHead>
                      <TableHead className="min-w-[200px] font-medium text-gray-600">{t("admin.combo.comboName")}</TableHead>
                      <TableHead className="w-32 font-medium text-gray-600">{t("admin.combo.comboCategory")}</TableHead>
                      <TableHead className="min-w-[300px] font-medium text-gray-600">{t("admin.combo.includedVaccine")}</TableHead>
                      <TableHead className="w-32 font-medium text-gray-600">{t("admin.combo.saleOff")}</TableHead>
                      <TableHead className="w-32 font-medium text-gray-600">{t("admin.combo.totalPrice")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comboList.length > 0 ? (
                      randomCombo.map((combo) => (
                        <TableRow key={combo.comboId} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{combo.comboId}</TableCell>
                          <TableCell>{combo.comboName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${
                              combo.comboCategory === "kids" 
                                ? "bg-blue-100 text-blue-800 border-blue-200" 
                                : "bg-green-100 text-green-800 border-green-200"
                            }`}>
                              {combo.comboCategory || "Standard"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {combo.vaccines.map((vaccine, idx) => (
                                <div key={idx} className="text-sm">
                                  {vaccine.name}{" "}
                                  <span className="text-xs text-gray-500">
                                    ({vaccine.dose} dose{vaccine.dose > 1 ? "s" : ""})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                              {combo.saleOff}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-blue-600">${combo.total}</span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <AlertCircle className="h-8 w-8 mb-2 text-gray-400" />
                            <p>{comboError || t("admin.dashboard.noData")}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 py-3 px-6">
                <p className="text-sm text-gray-500">Total combos: {comboList.length}</p>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon, color, trend, trendUp }) => {
  return (
    <Card className={`${color} border-none shadow-sm`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-600 mt-1">{title}</p>
          </div>
          <div className="rounded-full p-3 bg-white/80 shadow-sm">{icon}</div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center">
            <span className={`text-xs font-medium ${trendUp ? "text-green-600" : "text-red-600"}`}>{trend}</span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Dashboard

