import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { PlusIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const MyChild = () => {
  const [children, setChildren] = useState([
    {
      id: 1,
      name: "Nguyễn Văn B",
      birthDate: "2020-05-15",
      gender: "Nam",
      weight: 15,
      height: 90,
      isOpen: false
    },
    {
      id: 2,
      name: "Nguyễn Thị C",
      birthDate: "2022-10-10",
      gender: "Nữ",
      weight: 10,
      height: 75,
      isOpen: false
    }
  ]);

  const toggleDetails = (id) => {
    setChildren(children.map(child => 
      child.id === id 
        ? { ...child, isOpen: !child.isOpen } 
        : { ...child, isOpen: false }
    ));
  };

  const handleChange = (id, field, value) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, [field]: value } : child
    ));
  };

  const handleAddChild = () => {
    const newChild = {
      id: children.length + 1,
      name: "Tên trẻ mới",
      birthDate: new Date().toISOString().split('T')[0],
      gender: "Nam",
      weight: 0,
      height: 0,
      isOpen: true
    };
    setChildren([...children, newChild]);
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin trẻ</h2>
        
        <div className="space-y-4">
          {children.map(child => (
            <div key={child.id} className="border rounded-lg overflow-hidden">
              {/* Child Header */}
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleDetails(child.id)}
              >
                <div>
                  <h3 className="font-semibold">{child.name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(child.birthDate).toLocaleDateString('vi-VN')} • {child.gender}
                  </p>
                </div>
                {child.isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </div>
              
              {/* Child Details */}
              {child.isOpen && (
                <div className="p-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Ngày sinh</label>
                      <Input 
                        type="date" 
                        value={child.birthDate}
                        onChange={(e) => handleChange(child.id, 'birthDate', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Giới tính</label>
                      <Select
                        value={child.gender}
                        onValueChange={(value) => handleChange(child.id, 'gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nam">Nam</SelectItem>
                          <SelectItem value="Nữ">Nữ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Cân nặng (kg)</label>
                      <Input 
                        type="number" 
                        value={child.weight}
                        onChange={(e) => handleChange(child.id, 'weight', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Chiều cao (cm)</label>
                      <Input 
                        type="number" 
                        value={child.height}
                        onChange={(e) => handleChange(child.id, 'height', e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                    <Button variant="outline" onClick={() => toggleDetails(child.id)}>
                      Hủy
                    </Button>
                    <Button>Lưu thay đổi</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Button className="mt-6" onClick={handleAddChild}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Thêm trẻ
        </Button>
      </CardContent>
    </Card>
  );
};

export default MyChild; 