import {
  Button,
  Label,
  Select,
  TextInput,
  Spinner,
  Alert,
} from "flowbite-react";
import { useEffect, useState, useContext } from "react";
import {
  FiDownload,
  FiFileText,
  FiPrinter,
  FiSearch,
  FiUser,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

export default function DashReport() {
  const [stations, setStations] = useState([]);
  const [oIds, setOIds] = useState([]);
  const [formData, setFormData] = useState({});
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { authUser } = useContext(AuthContext);

  const fetchValues = async () => {
    try {
      const res = await fetch("/api/v1/station/getall");
      const data = await res.json();
      setStations(data);
    } catch (err) {
      setError("Failed to load police stations");
    }
  };

  const fetchOfficers = async () => {
    try {
      const res = await fetch("/api/v1/user/getallofficers");
      const data = await res.json();
      setOIds(data);
    } catch (err) {
      setError("Failed to load officer data");
    }
  };

  useEffect(() => {
    fetchValues();
    fetchOfficers();
  }, []);

  const generatePDF = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert filters to query string
      const queryParams = new URLSearchParams();
      for (const key in formData) {
        if (formData[key]) {
          queryParams.append(key, formData[key]);
        }
      }

      // Make API request
      const response = await fetch(
        `/api/v1/fine/pdf?${queryParams.toString()}`
      );

      if (!response.ok) {
        // Surface the backend's real reason (e.g. "No fines found with the
        // specified filters") instead of a bare "Not Found".
        let message = "Failed to generate report. Please try again.";
        try {
          const errorBody = await response.json();
          if (errorBody?.message) message = errorBody.message;
        } catch {
          // Non-JSON error body — keep the generic message.
        }
        throw new Error(message);
      }

      // Create blob URL for viewing
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setSuccess("Report generated successfully!");
      await fetch("/api/v1/activity/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "report-generate",
          createdBy: authUser._id,
        }),
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError(error.message || "Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute(
      "download",
      `fine_report_${new Date().toISOString().slice(0, 10)}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    setSuccess("Download started!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Fines Management System
          </h1>
          <h2 className="text-xl text-blue-600 mt-2">
            Generate Custom Reports
          </h2>
        </div>

        {/* Filter Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiSearch className="text-blue-500" /> Search Filters
          </h3>

          {error && (
            <Alert color="failure" className="mb-4">
              {error}
            </Alert>
          )}

          {success && (
            <Alert color="success" className="mb-4">
              {success}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Officer ID */}
            <div>
              <Label
                htmlFor="officer"
                value="Officer ID"
                className="flex items-center gap-1"
              >
                <FiUser className="text-blue-500" /> Officer
              </Label>
              <Select
                id="officer"
                onChange={(e) =>
                  setFormData({ ...formData, pId: e.target.value })
                }
                value={formData.pId || ""}
                className="mt-1"
              >
                <option value="">All Officers</option>
                {oIds?.map((s, index) => (
                  <option value={s.id} key={index}>
                    {s.id}
                  </option>
                ))}
              </Select>
            </div>

            {/* Driver NIC */}
            <div>
              <Label
                htmlFor="driver"
                value="Driver NIC"
                className="flex items-center gap-1"
              >
                <FiUser className="text-blue-500" /> Driver
              </Label>
              <TextInput
                id="driver"
                type="text"
                placeholder="Driver NIC"
                value={formData.dNic || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dNic: e.target.value })
                }
                className="mt-1"
              />
            </div>

            {/* Vehicle No */}
            <div>
              <Label
                htmlFor="vehicle"
                value="Vehicle Number"
                className="flex items-center gap-1"
              >
                <FiUsers className="text-blue-500" /> Vehicle
              </Label>
              <TextInput
                id="vehicle"
                type="text"
                placeholder="Vehicle No"
                value={formData.vNo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, vNo: e.target.value })
                }
                className="mt-1"
              />
            </div>

            {/* Police Station */}
            <div>
              <Label
                htmlFor="station"
                value="Police Station"
                className="flex items-center gap-1"
              >
                <FiUsers className="text-blue-500" /> Station
              </Label>
              <Select
                id="station"
                onChange={(e) =>
                  setFormData({ ...formData, pStation: e.target.value })
                }
                value={formData.pStation || ""}
                className="mt-1"
              >
                <option value="">All Stations</option>
                {stations?.map((s, index) => (
                  <option value={s.station} key={index}>
                    {s.station}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* From Date */}
            <div>
              <Label
                htmlFor="fromDate"
                value="From Date"
                className="flex items-center gap-1"
              >
                <FiCalendar className="text-blue-500" /> From Date
              </Label>
              <TextInput
                id="fromDate"
                type="date"
                value={formData.fromDate || ""}
                max={formData.toDate || undefined}
                onChange={(e) =>
                  setFormData({ ...formData, fromDate: e.target.value })
                }
                className="mt-1"
              />
            </div>

            {/* To Date */}
            <div>
              <Label
                htmlFor="toDate"
                value="To Date"
                className="flex items-center gap-1"
              >
                <FiCalendar className="text-blue-500" /> To Date
              </Label>
              <TextInput
                id="toDate"
                type="date"
                value={formData.toDate || ""}
                min={formData.fromDate || undefined}
                onChange={(e) =>
                  setFormData({ ...formData, toDate: e.target.value })
                }
                className="mt-1"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-3">
              <Button
                gradientMonochrome="info"
                onClick={generatePDF}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FiFileText className="mr-2" />
                    Generate Report
                  </>
                )}
              </Button>

              {pdfUrl && (
                <Button
                  gradientMonochrome="success"
                  onClick={downloadPDF}
                  className="flex-1"
                >
                  <FiDownload className="mr-2" />
                  Download PDF
                </Button>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Leave any filter blank to include all values. Leave both dates blank
            to cover all dates, or set only one for an open-ended range.
          </p>
        </div>

        {/* PDF Viewer Section */}
        {pdfUrl && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 flex justify-between items-center">
              <span className="font-medium text-white flex items-center gap-2">
                <FiPrinter /> Report Preview
              </span>
              <div className="flex gap-2">
                <Button
                  size="xs"
                  color="light"
                  onClick={() => window.open(pdfUrl, "_blank")}
                >
                  Open Fullscreen
                </Button>
                <Button
                  size="xs"
                  gradientMonochrome="success"
                  onClick={downloadPDF}
                >
                  <FiDownload className="mr-1" /> Download
                </Button>
              </div>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
            <iframe
              src={pdfUrl}
              className="w-full h-[600px] border-0"
              title="Fine Report PDF"
            />
          </div>
        )}
      </div>
    </div>
  );
}
