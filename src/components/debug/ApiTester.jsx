import React, { useState } from 'react';
import { Button } from '../ui/button';
import { apiService } from '../../api';

/**
 * A debug component to test various API calls and compare their responses
 * This can help identify issues with specific APIs
 */
function ApiTester() {
    const [userResponse, setUserResponse] = useState(null);
    const [directResponse, setDirectResponse] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Test the user API via apiService
    const testUserApi = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            console.log("Testing users API with apiService...");
            const response = await apiService.users.getAll();
            console.log("User API response:", response);
            setUserResponse(response);
        } catch (err) {
            console.error("Error testing user API:", err);
            setErrorMessage(`User API Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    // Test direct fetch to the same endpoint
    const testDirectFetch = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            console.log("Testing direct fetch to user API...");
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/users/getAllUser", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Direct fetch response:", data);
            setDirectResponse(data);
        } catch (err) {
            console.error("Error with direct fetch:", err);
            setErrorMessage(`Direct Fetch Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    // Test a different API
    const testScheduleApi = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            console.log("Testing schedule API with apiService...");
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const formattedStartDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
            const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
            const formattedEndDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${lastDay}`;
            
            const response = await apiService.working.getSchedules(formattedStartDate, formattedEndDate);
            console.log("Schedule API response:", response);
            setUserResponse(response);
        } catch (err) {
            console.error("Error testing schedule API:", err);
            setErrorMessage(`Schedule API Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white space-y-4">
            <h2 className="text-lg font-semibold">API Tester</h2>
            
            <div className="space-y-2">
                <div className="flex gap-4">
                    <Button 
                        onClick={testUserApi} 
                        disabled={loading}
                        variant="outline" 
                        className="w-full"
                    >
                        Test User API
                    </Button>
                    
                    <Button 
                        onClick={testDirectFetch} 
                        disabled={loading}
                        variant="outline" 
                        className="w-full"
                    >
                        Test Direct Fetch
                    </Button>
                    
                    <Button 
                        onClick={testScheduleApi} 
                        disabled={loading}
                        variant="outline" 
                        className="w-full"
                    >
                        Test Schedule API
                    </Button>
                </div>
                
                {loading && <p className="text-blue-500">Loading...</p>}
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="border p-4 rounded-lg">
                        <h3 className="font-medium mb-2">API Service Response:</h3>
                        <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-60">
                            {userResponse ? JSON.stringify(userResponse, null, 2) : 'No data yet'}
                        </pre>
                    </div>
                    
                    <div className="border p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Direct Fetch Response:</h3>
                        <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-60">
                            {directResponse ? JSON.stringify(directResponse, null, 2) : 'No data yet'}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApiTester; 