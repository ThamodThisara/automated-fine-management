import React, { useContext, useState } from "react";
import {
  Button,
  Checkbox,
  Label,
  TextInput,
  Datepicker,
  Select,
} from "flowbite-react";
import { AuthContext } from "../context/AuthContext";
import { HiInformationCircle } from "react-icons/hi";

export const DashVehicleSignUp = () => {
  const { authUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({});

  const handleTextboxDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePhoneNumberDataChange = (e) => {
    if (e.target.value.length > 10) {
      e.target.value = formData.phoneNumber;
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    try {
      const res = await fetch("/api/v1/vehicle/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(res);

      if (res.ok) {
        await fetch("/api/v1/activity/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "vehicle-create",
            createdBy: authUser.id,
          }),
        });
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(formData);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 mb-2">
            Vehicle Registration
          </h2>
          <p className="text-gray-600">Register new vehicle in the system</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
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
                    onChange={handleTextboxDataChange}
                    placeholder="ABC-1234"
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
                    onChange={handleTextboxDataChange}
                    placeholder="MH1234567890"
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
                    onChange={handleTextboxDataChange}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
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
                    onChange={handlePhoneNumberDataChange}
                    placeholder="0771234567"
                    maxLength={10}
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
                    onChange={handleTextboxDataChange}
                    placeholder="john@example.com"
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
                    <option>Select Vehicle Model</option>
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
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm0 4h6v2H7V9zm0 4h6v2H7v-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Register Vehicle
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
