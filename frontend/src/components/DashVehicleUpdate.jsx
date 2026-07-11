import React, { useContext, useState } from "react";
import {
  Button,
  Checkbox,
  Label,
  TextInput,
  Datepicker,
  Select,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const DashVehicleUpdate = () => {
  const { authUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({});

  const [searchId, setSearchId] = useState(null);
  const [vehicle, setVehicle] = useState(null);

  const navigate = useNavigate();

  const handleTextboxDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSearchId = (e) => {
    setSearchId(e.target.value);
  };

  const handlePhoneNumberDataChange = (e) => {
    if (e.target.value.length > 10) {
      e.target.value = formData.phoneNumber;
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSearchVehicle = async (req, res) => {
    try {
      const res = await fetch(`/api/v1/vehicle/getvehicle/${searchId}`);

      if (!res.ok) {
        return;
      } else {
        const data = await res.json();
        setVehicle(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      console.log("There are no changes");
      return;
    }

    try {
      const res = await fetch(`/api/v1/vehicle/updatevehicle/${searchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data);
      } else {
        console.log("Update is success");
        await fetch("/api/v1/activity/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "vehicle-update",
            createdBy: authUser.id,
          }),
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("error here");
    }
  };

  console.log(searchId);
  console.log(formData);
  console.log(vehicle);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 mb-2">
            Vehicle Update
          </h2>
          <p className="text-gray-600">
            Update vehicle information in the system
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full">
              <Label
                htmlFor="cNumber"
                value="Search by Chassis Number"
                className="block text-sm font-medium text-gray-700 mb-1"
              />
              <div className="relative">
                <TextInput
                  id="cNumber"
                  type="text"
                  required
                  shadow
                  className="w-full pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleSearchId}
                  placeholder="Enter chassis number"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
            <div className="w-full sm:w-auto">
              <Button
                type="button"
                gradientDuoTone="blueToCyan"
                className="w-full sm:w-auto h-[42px] px-6 flex items-center justify-center mt-6"
                onClick={handleSearchVehicle}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {vehicle && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {vehicle.no}
              </h3>
              <p className="text-blue-100">{vehicle.model}</p>
            </div>

            <form className="p-6 sm:p-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                  <div>
                    <Label
                      htmlFor="no"
                      value="Vehicle Number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <TextInput
                      id="no"
                      type="text"
                      required
                      shadow
                      className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      defaultValue={vehicle?.no || ""}
                      onChange={handleTextboxDataChange}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="cNumber"
                      value="Chassis Number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <TextInput
                      id="cNumber"
                      type="text"
                      required
                      shadow
                      className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      defaultValue={vehicle?.cNumber || ""}
                      onChange={handleTextboxDataChange}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="date"
                      value="Date of Acquisition"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <Datepicker
                      id="date"
                      defaultDate={new Date(vehicle.dateBrought)}
                      onSelectedDateChanged={(date) => {
                        const dateBrought =
                          date.getFullYear() +
                          "-" +
                          (date.getMonth() + 1) +
                          "-" +
                          date.getDate();
                        setFormData({ ...formData, dateBrought });
                      }}
                      className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      value="Email Address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <TextInput
                      id="email"
                      type="email"
                      required
                      shadow
                      className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      defaultValue={vehicle?.email || ""}
                      onChange={handleTextboxDataChange}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <div>
                    <Label
                      htmlFor="name"
                      value="Owner Name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <TextInput
                      id="name"
                      type="text"
                      required
                      shadow
                      className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      defaultValue={vehicle?.name || ""}
                      onChange={handleTextboxDataChange}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="nic"
                      value="Owner's NIC"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <TextInput
                      id="nic"
                      type="text"
                      required
                      shadow
                      className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      defaultValue={vehicle?.nic || ""}
                      onChange={handleTextboxDataChange}
                      placeholder="123456789V"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phoneNumber"
                      value="Phone Number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <TextInput
                      id="phoneNumber"
                      type="number"
                      value={formData.phoneNumber}
                      required
                      shadow
                      className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      defaultValue={vehicle?.phoneNumber || ""}
                      onChange={handlePhoneNumberDataChange}
                      placeholder="0771234567"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="model"
                      value="Vehicle Model"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <Select
                      id="model"
                      required
                      className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      onChange={handleTextboxDataChange}
                    >
                      <option>
                        {vehicle?.model || "Select Vehicle Model"}
                      </option>
                      <option>Car</option>
                      <option>Van</option>
                      <option>Bus</option>
                      <option>Motorcycle</option>
                      <option>Truck</option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  gradientDuoTone="tealToBlue"
                  className="w-full py-3 font-medium text-lg transition-all hover:scale-[1.01] active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Update Vehicle
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
