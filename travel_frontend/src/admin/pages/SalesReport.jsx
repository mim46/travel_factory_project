import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaFilePdf } from "react-icons/fa";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SalesReport() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalBookings: 0,
    totalAmount: 0,
    totalPersons: 0
  });

  const fromDate = searchParams.get('from');
  const toDate = searchParams.get('to');

  useEffect(() => {
    fetchSalesData();
  }, [fromDate, toDate]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const allBookings = await response.json();

        // Filter bookings by date range
        const filtered = allBookings.filter(booking => {
          const bookingDate = new Date(booking.created_at);
          const from = new Date(fromDate);
          const to = new Date(toDate);
          to.setHours(23, 59, 59, 999);

          return bookingDate >= from && bookingDate <= to &&
            (booking.status === 'confirmed' || booking.status === 'pending');
        });

        setBookings(filtered);

        // Calculate summary
        const totalAmount = filtered.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);
        const totalPersons = filtered.reduce((sum, b) => sum + parseInt(b.persons || 0), 0);

        setSummary({
          totalBookings: filtered.length,
          totalAmount: totalAmount,
          totalPersons: totalPersons
        });
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
      alert('Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Sales Report', 14, 20);

    // Date Range
    doc.setFontSize(11);
    doc.text(`From: ${new Date(fromDate).toLocaleDateString()} to ${new Date(toDate).toLocaleDateString()}`, 14, 30);

    // Summary
    doc.setFontSize(10);
    doc.text(`Total Bookings: ${summary.totalBookings}`, 14, 40);
    doc.text(`Total Revenue: ৳${summary.totalAmount.toLocaleString()}`, 14, 46);
    doc.text(`Total Persons: ${summary.totalPersons}`, 14, 52);

    // Table
    const tableData = bookings.map(booking => [
      `#${booking.user_id}`,
      `#${booking.id}`,
      booking.name,
      booking.package?.title || 'N/A',
      new Date(booking.created_at).toLocaleDateString(),
      booking.persons.toString(),
      `৳${Number(booking.total_price).toLocaleString()}`,
      booking.status,
      booking.payment_status
    ]);

    autoTable(doc, {
      startY: 60,
      head: [['User ID', 'Booking ID', 'Customer', 'Package', 'Date', 'Persons', 'Amount', 'Status', 'Payment']],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Add total at the end
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL REVENUE: ৳${summary.totalAmount.toLocaleString()}`, 14, finalY);

    // Save PDF
    doc.save(`sales-report-${fromDate}-to-${toDate}.pdf`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/reports')}
            className="text-blue-600 hover:text-blue-800 font-semibold transition"
          >
            ← Back
          </button>
          <div>
            <h2 className="text-3xl font-bold text-[#1C7DA2]">Sales Report</h2>
            <p className="text-gray-600 mt-1">
              <FaCalendarAlt className="inline mr-2" />
              From {new Date(fromDate).toLocaleDateString()} to {new Date(toDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition font-semibold shadow-lg"
        >
          Download PDF
        </button>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h3 className="text-xl font-bold">Booking Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">User ID</th>
                <th className="p-3 text-left">Booking ID</th>
                <th className="p-3 text-left">Customer Name</th>
                <th className="p-3 text-left">Package</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Persons</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-500">
                    No bookings found in this date range
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-sm text-gray-600">#{booking.user_id}</td>
                    <td className="p-3 font-mono text-sm text-blue-600 font-semibold">#{booking.id}</td>
                    <td className="p-3 font-semibold">{booking.name}</td>
                    <td className="p-3">{booking.package?.title || 'N/A'}</td>
                    <td className="p-3">{new Date(booking.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-center">{booking.persons}</td>
                    <td className="p-3 text-right font-bold text-green-600">৳{Number(booking.total_price).toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.payment_status === 'paid' || booking.payment_status === 'completed' ? 'bg-green-100 text-green-700' :
                        booking.payment_status === 'partially_paid' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {booking.payment_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {bookings.length > 0 && (
              <tfoot className="bg-gray-50 font-bold">
                <tr>
                  <td colSpan="6" className="p-3 text-right">TOTAL:</td>
                  <td className="p-3 text-right text-green-600 text-lg">
                    ৳{summary.totalAmount.toLocaleString()}
                  </td>
                  <td colSpan="2" className="p-3"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
