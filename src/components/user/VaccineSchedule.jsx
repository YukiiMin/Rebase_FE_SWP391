import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ChevronRightIcon, XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";

const VaccineSchedule = () => {
  const [selectedChild, setSelectedChild] = useState("child1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  // Dữ liệu mẫu về tiêm chủng
  const vaccinationData = {
    child1: [
      {
        id: 1,
        name: "Vắc xin 6 trong 1",
        date: "20/06/2023",
        type: "Vắc xin tổng hợp",
        facility: "Bệnh viện Nhi Đồng 1",
        doctor: "BS. Trần Văn A",
        status: "Đã tiêm"
      },
      {
        id: 2,
        name: "Vắc xin viêm gan B",
        date: "15/07/2023",
        type: "Vắc xin đơn giá",
        facility: "Trung tâm Y tế Quận 1",
        doctor: "BS. Lê Thị B",
        status: "Đã tiêm"
      }
    ],
    child2: [
      {
        id: 3,
        name: "Vắc xin sởi",
        date: "10/08/2023",
        type: "Vắc xin đơn giá",
        facility: "Phòng khám Đa khoa Quốc tế",
        doctor: "BS. Phạm Văn C",
        status: "Đã tiêm"
      }
    ]
  };

  const showVaccineDetails = (vaccine) => {
    setSelectedVaccine(vaccine);
    setIsModalOpen(true);
  };

  const childNames = {
    child1: "Nguyễn Văn B",
    child2: "Nguyễn Thị C"
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Lịch tiêm của trẻ</h2>
        
        {/* Child Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Chọn trẻ</label>
          <Select
            value={selectedChild}
            onValueChange={setSelectedChild}
          >
            <SelectTrigger className="w-full md:w-1/3">
              <SelectValue placeholder="Chọn trẻ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="child1">Nguyễn Văn B</SelectItem>
              <SelectItem value="child2">Nguyễn Thị C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Vaccination List */}
        <div className="space-y-4">
          {vaccinationData[selectedChild]?.map(vaccine => (
            <div 
              key={vaccine.id} 
              className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              onClick={() => showVaccineDetails(vaccine)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{vaccine.name}</h3>
                  <p className="text-sm text-gray-600">{vaccine.date} • {vaccine.status}</p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Vaccination Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>{selectedVaccine?.name}</DialogTitle>
              <button 
                className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100"
                onClick={() => setIsModalOpen(false)}
              >
                <XIcon className="h-4 w-4" />
              </button>
            </DialogHeader>
            
            {selectedVaccine && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Ngày tiêm</label>
                  <p className="px-3 py-2 border rounded bg-gray-50">{selectedVaccine.date}</p>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Trẻ được tiêm</label>
                  <p className="px-3 py-2 border rounded bg-gray-50">
                    {childNames[selectedChild]}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Loại vắc xin</label>
                  <p className="px-3 py-2 border rounded bg-gray-50">{selectedVaccine.type}</p>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Cơ sở tiêm</label>
                  <p className="px-3 py-2 border rounded bg-gray-50">{selectedVaccine.facility}</p>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Bác sĩ tiêm</label>
                  <p className="px-3 py-2 border rounded bg-gray-50">{selectedVaccine.doctor}</p>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Trạng thái</label>
                  <p className="px-3 py-2 border rounded bg-gray-50">{selectedVaccine.status}</p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button>
                In phiếu tiêm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default VaccineSchedule; 