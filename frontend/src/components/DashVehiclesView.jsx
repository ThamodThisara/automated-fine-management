import React, { useContext } from "react";
import { Alert, Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export const DashVehiclesView = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [vehicleIdToDelete, setVehicleIdToDelete] = useState("");
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch("/api/v1/vehicle/getallvehicles");
        const data = await res.json();

        if (res.ok) {
          setVehicles(data);
          await fetch("/api/v1/activity/addOfficer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "vehicle-view",
              createdBy: authUser.id,
            }),
          });
        }
      } catch (error) {
        setError(error);
      }
    };
    if (vehicleIdToDelete === "") {
      fetchVehicle();
    }
  }, [vehicleIdToDelete]);

  const getVehicle = async () => {
    try {
      if (vehicleIdToDelete === "") {
        return setError("Fill Serach field");
      }
      const res = await fetch(
        `/api/v1/vehicle/getvehicle/${vehicleIdToDelete}`
      );
      const data = await res.json();
      if (data.success == false) {
        return setError(data.messaage);
      }
      if (res.ok) {
        setVehicles([data]);
        setError("");
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-8 px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Vehicle Management System
          </h1>
          <p className="text-cyan-100 font-medium">View registered vehicles</p>
        </div>

        {/* Search Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-end gap-3">
              <div className="w-full">
                <Label
                  value="Search by Chassis Number"
                  className="block text-sm font-medium text-cyan-700 mb-1"
                />
                <div className="relative">
                  <TextInput
                    id="cNumber"
                    type="text"
                    placeholder="Enter vehicle chassis number"
                    className="w-full pl-10"
                    onChange={(e) => setVehicleIdToDelete(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <Button
                gradientDuoTone="cyanToBlue"
                onClick={getVehicle}
                className="h-[42px] w-full sm:w-auto px-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 pt-2">
            <Alert color="failure" className="border-l-4 border-red-500">
              <span className="font-medium">{error}</span>
            </Alert>
          </div>
        )}

        {/* Vehicles Table */}
        <div className="p-4 md:p-6">
          {vehicles.length > 0 ? (
            <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-auto max-h-[65vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <Table hoverable className="min-w-max">
                  <Table.Head className="bg-teal-600 text-white sticky top-0">
                    <Table.HeadCell className="px-6 py-3 text-black">
                      Vehicle No.
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-black">
                      Chassis No.
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-black">
                      Registered Date
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-black">
                      Owner Name
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-black">
                      Owner NIC
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-black">
                      Owner Email
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-black">
                      Owner Phone
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-black">
                      Vehicle Model
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-gray-200">
                    {vehicles.map((vehicle) => (
                      <Table.Row key={vehicle._id} className="hover:bg-gray-50">
                        <Table.Cell className="px-6 py-4 font-mono font-medium">
                          {vehicle.no}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 font-mono">
                          {vehicle.cNumber}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {new Date(vehicle.dateBrought).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 font-medium">
                          {vehicle.name}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 font-mono">
                          {vehicle.nic}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 text-blue-600 hover:text-blue-800">
                          <a href={`mailto:${vehicle.email}`}>
                            {vehicle.email}
                          </a>
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 hover:text-teal-600">
                          <a href={`tel:${vehicle.phoneNumber}`}>
                            {vehicle.phoneNumber}
                          </a>
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {vehicle.model}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>

              <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Showing {vehicles.length} vehicles
                </span>
                <span className="text-xs text-gray-500">
                  ← Scroll horizontally to view all columns →
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-20 w-20 text-gray-300 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">
                No vehicles found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {vehicleIdToDelete
                  ? "No vehicles match the search criteria"
                  : "Search for vehicles using chassis number"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
