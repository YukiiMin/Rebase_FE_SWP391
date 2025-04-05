import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiService } from "../../api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import { Loader2, Plus, Trash } from "lucide-react";

function AddProtocol({ open, setIsOpen, onAddedProtocol }) {
  const [protocolDetails, setProtocolDetails] = useState([
    { doseNumber: 1, intervalDays: 0 }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validation = Yup.object({
    name: Yup.string().required("Protocol name is required"),
    description: Yup.string().required("Protocol description is required").min(10, "Description must be at least 10 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
    validationSchema: validation,
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAddDose = () => {
    const lastDose = protocolDetails[protocolDetails.length - 1];
    setProtocolDetails([
      ...protocolDetails,
      { doseNumber: lastDose.doseNumber + 1, intervalDays: 0 }
    ]);
  };

  const handleRemoveDose = (index) => {
    if (protocolDetails.length > 1) {
      const updatedDetails = [...protocolDetails];
      updatedDetails.splice(index, 1);
      
      // Renumber the doseNumbers
      const renumbered = updatedDetails.map((detail, idx) => ({
        ...detail,
        doseNumber: idx + 1
      }));
      
      setProtocolDetails(renumbered);
    }
  };

  const handleDoseChange = (index, field, value) => {
    const updatedDetails = [...protocolDetails];
    updatedDetails[index][field] = value;
    setProtocolDetails(updatedDetails);
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setError("");
    try {
      const protocolData = {
        name: values.name,
        description: values.description,
        details: protocolDetails
      };

      const response = await apiService.vaccine.addProtocol(protocolData);
      
      console.log("Protocol added successfully:", response.data);
      handleClose();
      onAddedProtocol(response.data.result);
    } catch (err) {
      setError(`Error adding protocol: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Protocol</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Protocol Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter protocol name (e.g., 'Standard 3-dose')"
              value={formik.values.name}
              onChange={formik.handleChange}
              className={formik.touched.name && formik.errors.name ? "border-red-500" : ""}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-500">{formik.errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter protocol description"
              rows={2}
              value={formik.values.description}
              onChange={formik.handleChange}
              className={formik.touched.description && formik.errors.description ? "border-red-500" : ""}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-red-500">{formik.errors.description}</p>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Dose Details</h3>
            <Button 
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddDose}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Dose
            </Button>
          </div>
          
          <div className="space-y-4">
            {protocolDetails.map((detail, index) => (
              <div key={index} className="grid grid-cols-[1fr_2fr_auto] gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor={`doseNumber-${index}`}>Dose Number</Label>
                  <Input
                    id={`doseNumber-${index}`}
                    type="number"
                    value={detail.doseNumber}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`intervalDays-${index}`}>Interval Days</Label>
                  <Input
                    id={`intervalDays-${index}`}
                    type="number"
                    min="0"
                    placeholder="Enter interval in days"
                    value={detail.intervalDays}
                    onChange={(e) => handleDoseChange(index, 'intervalDays', parseInt(e.target.value) || 0)}
                  />
                  {index === 0 && (
                    <p className="text-xs text-gray-500">
                      First dose interval is typically 0 (from start date)
                    </p>
                  )}
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDose(index)}
                  disabled={protocolDetails.length <= 1}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Protocol
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddProtocol; 