import React, { useState } from 'react';
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronRightIcon, XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";

const UpcomingVaccines = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  const upcomingVaccines = [
    {
      id: 1,
      name: "Vắc xin sởi",
      date: "15/08/2023",
      status: "Sắp tới",
      type: "Vắc xin đơn giá",
      description: "Vắc-xin phòng bệnh sởi, liều tiêm thứ 1",
      facility: "Trung tâm Y tế Quận 1",
      doctor: "BS. Nguyễn Văn A",
      notes: "Cần đến sớm 15 phút để làm thủ tục"
    },
    {
      id: 2,
      name: "Vắc xin 5 trong 1",
      date: "10/09/2023",
      status: "Sắp tới",
      type: "Vắc xin tổng hợp",
      description: "Vắc-xin phòng bệnh bạch hầu, ho gà, uốn ván, bại liệt và Hib",
      facility: "Bệnh viện Nhi Đồng 1",
      doctor: "BS. Trần Thị B",
      notes: "Liều tiêm thứ 2 theo lịch"
    },
    {
      id: 3,
      name: "Vắc xin cúm",
      date: "05/10/2023",
      status: "Sắp tới",
      type: "Vắc xin đơn giá",
      description: "Vắc-xin phòng bệnh cúm mùa",
      facility: "Phòng khám Đa khoa Quốc tế",
      doctor: "BS. Lê Văn C",
      notes: "Tiêm hàng năm để phòng bệnh cúm"
    }
  ];

  const showVaccineDetails = (vaccine) => {
    setSelectedVaccine(vaccine);
    setIsModalOpen(true);
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Lịch tiêm sắp tới</h2>
        
        <div className="space-y-4">
          {upcomingVaccines.map(vaccine => (
            <div 
              key={vaccine.id} 
              className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              onClick={() => showVaccineDetails(vaccine)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{vaccine.name}</h3>
                  <p className="text-gray-600">Ngày tiêm dự kiến: {vaccine.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    {vaccine.status}
                  </Badge>
                  <ChevronRightIcon className="h-5 w-5 text-blue-500" />
                </div>
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Ngày tiêm dự kiến</label>
                    <p className="px-3 py-2 border rounded bg-gray-50">{selectedVaccine.date}</p>
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
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Mô tả</label>
                  <p className="px-3 py-2 border rounded bg-gray-50">{selectedVaccine.description}</p>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Ghi chú</label>
                  <p className="px-3 py-2 border rounded bg-gray-50">{selectedVaccine.notes}</p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button className="mt-2">
                Xác nhận lịch tiêm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UpcomingVaccines; 