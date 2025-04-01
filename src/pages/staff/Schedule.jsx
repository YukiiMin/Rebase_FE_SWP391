import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/layout/Navbar';
import StaffMenu from '../../components/layout/StaffMenu';
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import { AlertCircle, Calendar as CalendarIcon, Loader2, Clock } from "lucide-react";
import { format } from "date-fns";

function Schedule() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [staffSchedules, setStaffSchedules] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (!token) {
			navigate('/Login');
			return;
		}
		
		fetchSchedule();
	}, [token, navigate, selectedDate]);

	const fetchSchedule = async () => {
		try {
			setLoading(true);
			setError(null);
			
			const formattedDate = format(selectedDate, 'yyyy-MM-dd');
			const response = await fetch(`http://localhost:8080/staff/schedule/${formattedDate}`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				if (response.status === 401 || response.status === 403) {
					localStorage.removeItem('token');
					navigate('/Login');
					return;
				}
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			
			if (data.status !== 200) {
				throw new Error(data.message || 'Failed to fetch schedule');
			}
			
			setStaffSchedules(data.result || []);
		} catch (err) {
			console.error('Error fetching schedule:', err);
			setError(err.message || 'Failed to load schedule. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	// Group schedules by shift
	const groupedSchedules = staffSchedules.reduce((acc, schedule) => {
		const shift = schedule.shift || 'Unknown Shift';
		if (!acc[shift]) {
			acc[shift] = [];
		}
		acc[shift].push(schedule);
		return acc;
	}, {});

	// Prepare shifts in order: Morning, Afternoon, Evening
	const orderedShifts = ['Morning', 'Afternoon', 'Evening'];
	const shiftTabs = orderedShifts.filter(shift => groupedSchedules[shift] && groupedSchedules[shift].length > 0);

	return (
		<div className="min-h-screen bg-gray-50">
			<Navigation />
			<div className="flex">
				<StaffMenu />
				<main className="flex-grow p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-gray-800">Staff Work Schedule</h1>
						<p className="text-gray-600">View the work schedule for staff across different shifts</p>
					</div>
					
					{error && (
						<Alert variant="destructive" className="mb-6">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					
					<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
						{/* Calendar */}
						<Card className="md:col-span-4">
							<CardHeader>
								<CardTitle>Select Date</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col items-center">
									<Calendar
										mode="single"
										selected={selectedDate}
										onSelect={setSelectedDate}
										className="rounded-md border"
									/>
									<div className="mt-4 w-full flex items-center justify-center space-x-2">
										<CalendarIcon className="h-4 w-4 opacity-70" />
										<span className="font-medium">
											{format(selectedDate, 'EEEE, MMMM do, yyyy')}
										</span>
									</div>
									<Button 
										onClick={fetchSchedule} 
										className="mt-4"
									>
										Refresh Schedule
									</Button>
								</div>
							</CardContent>
						</Card>
						
						{/* Schedule Display */}
						<Card className="md:col-span-8">
							<CardHeader>
								<CardTitle>Staff Schedules</CardTitle>
							</CardHeader>
							<CardContent>
								{loading ? (
									<div className="flex items-center justify-center h-64">
										<div className="flex flex-col items-center">
											<Loader2 className="h-8 w-8 animate-spin text-primary" />
											<p className="mt-2 text-gray-500">Loading schedule...</p>
										</div>
									</div>
								) : staffSchedules.length === 0 ? (
									<div className="text-center py-12">
										<p className="text-gray-500">No staff scheduled for {format(selectedDate, 'MMMM do, yyyy')}.</p>
									</div>
								) : shiftTabs.length > 0 ? (
									<Tabs defaultValue={shiftTabs[0]}>
										<TabsList className="grid grid-cols-3">
											{shiftTabs.map(shift => (
												<TabsTrigger key={shift} value={shift}>
													{shift} Shift
												</TabsTrigger>
											))}
										</TabsList>
										
										{shiftTabs.map(shift => (
											<TabsContent key={shift} value={shift}>
												<ScrollArea className="h-[400px]">
													<Table>
														<TableHeader>
															<TableRow>
																<TableHead>Staff Name</TableHead>
																<TableHead>Role</TableHead>
																<TableHead>Time</TableHead>
																<TableHead>Status</TableHead>
															</TableRow>
														</TableHeader>
														<TableBody>
															{groupedSchedules[shift].map((schedule, index) => (
																<TableRow key={index}>
																	<TableCell className="font-medium">
																		{schedule.staffName || 'N/A'}
																	</TableCell>
																	<TableCell>
																		{schedule.role || 'N/A'}
																	</TableCell>
																	<TableCell>
																		<div className="flex items-center">
																			<Clock className="h-4 w-4 mr-1 text-gray-500" />
																			{schedule.startTime} - {schedule.endTime}
																		</div>
																	</TableCell>
																	<TableCell>
																		<span 
																			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																				schedule.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
																				schedule.status === 'ON_LEAVE' ? 'bg-yellow-100 text-yellow-800' :
																				'bg-gray-100 text-gray-800'
																			}`}
																		>
																			{schedule.status || 'N/A'}
																		</span>
																	</TableCell>
																</TableRow>
															))}
														</TableBody>
													</Table>
												</ScrollArea>
											</TabsContent>
										))}
									</Tabs>
								) : (
									<div className="text-center py-12">
										<p className="text-gray-500">No schedule data available for the selected date.</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</main>
			</div>
		</div>
	);
}

export default Schedule;
