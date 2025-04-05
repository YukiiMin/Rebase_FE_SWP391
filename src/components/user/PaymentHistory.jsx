import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { Badge } from "../ui/badge";

const PaymentHistory = () => {
  const payments = [
    {
      id: "INV-2023-001",
      date: "20/06/2023",
      service: "Vắc xin 6 trong 1",
      amount: "1,200,000đ",
      status: "Đã thanh toán"
    },
    {
      id: "INV-2023-002",
      date: "15/07/2023",
      service: "Vắc xin viêm gan B",
      amount: "750,000đ",
      status: "Đã thanh toán"
    },
    {
      id: "INV-2023-003",
      date: "10/08/2023",
      service: "Vắc xin sởi",
      amount: "500,000đ",
      status: "Đã thanh toán"
    }
  ];

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử thanh toán</h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Mã hóa đơn</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Dịch vụ</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map(payment => (
                <TableRow key={payment.id} className="border-b">
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.service}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>
                    <Badge variant="success" className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory; 