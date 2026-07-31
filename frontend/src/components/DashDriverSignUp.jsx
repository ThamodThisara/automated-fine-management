import React, { useContext, useState } from "react";
import {
  Button,
  Checkbox,
  Label,
  TextInput,
  Datepicker,
  Select,
  FileInput,
  Alert,
} from "flowbite-react";
import { AuthContext } from "../context/AuthContext";
import { HiInformationCircle } from "react-icons/hi";
import { validateField } from "../utils/validators.js";

export const DashDriverSignUp = () => {
  const { authUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ role: "driver" });

  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState(null);

  const handleTextboxDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePhoneNumberDataChange = (e) => {
    if (e.target.value.length > 10) {
      return;
    }
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Always store the value; format feedback is shown inline via validateField.
  const handlePasswordDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const hasInvalidFields = () =>
    validateField("nic", formData.nic) ||
    validateField("phoneNumber", formData.phoneNumber) ||
    validateField("email", formData.email) ||
    validateField("password", formData.password);

  // Only surfaces feedback (red border + message) after a submit attempt.
  const invalid = (field) => submitted && validateField(field, formData?.[field]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasInvalidFields()) {
      return;
    }
    try {
      // Send the whole form (text fields + the selected image) as multipart/form-data
      // so the backend can store the picture locally with multer.
      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        body.append(key, value)
      );
      if (file) body.append("profilePicture", file);

      const res = await fetch(`/api/v1/auth/signup`, {
        method: "POST",
        body,
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({
          type: "failure",
          message: data.message || "Failed to register driver.",
        });
        return;
      }

      await fetch("/api/v1/activity/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "driver-create",
          createdBy: authUser._id,
        }),
      });
      setStatus({
        type: "success",
        message: typeof data === "string" ? data : "Driver registered successfully.",
      });
      e.target.reset();
      setFormData({ role: "driver" });
      setFile(null);
      setSubmitted(false);
    } catch (error) {
      console.log(error);
      setStatus({ type: "failure", message: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Driver Registration
          </h2>
          <p className="mt-2 text-teal-100">
            Complete your professional driver profile
          </p>
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {status && (
              <Alert color={status.type === "success" ? "success" : "failure"}>
                <span className="font-medium">{status.message}</span>
              </Alert>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Column */}
              <div className="space-y-5">
                <div>
                  <Label
                    htmlFor="name"
                    value="Full Name"
                    className="block mb-2 font-medium text-gray-700"
                  />
                  <TextInput
                    id="name"
                    type="text"
                    placeholder="Thamod Thisara"
                    required
                    shadow
                    className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    onChange={handleTextboxDataChange}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    value="Password"
                    className="block mb-2 font-medium text-gray-700"
                  />
                  <TextInput
                    id="password"
                    type="password"
                    required
                    shadow
                    className={
                      invalid("password")
                        ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    }
                    onChange={handlePasswordDataChange}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 8 characters with uppercase, lowercase, a number, and a symbol
                  </p>

                  {invalid("password") && (
                    <p className="mt-1 text-xs text-red-600">
                      {invalid("password")}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    value="Email Address"
                    className="block mb-2 font-medium text-gray-700"
                  />
                  <TextInput
                    id="email"
                    type="text"
                    placeholder="thamod.thisara@example.com"
                    required
                    shadow
                    className={
                      invalid("email")
                        ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    }
                    onChange={handleTextboxDataChange}
                  />
                  {invalid("email") && (
                    <p className="mt-1 text-xs text-red-600">
                      {invalid("email")}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                      htmlFor="address"
                      value="Address"
                      className="block mb-2 font-medium text-gray-700"
                  />
                  <TextInput
                      id="address"
                      type="text"
                      required
                      shadow
                      className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      onChange={handleTextboxDataChange}
                  />
                </div>
              </div>

              {/* Identification Column */}
              <div className="space-y-5">
                <div>
                  <Label
                    htmlFor="nic"
                    value="NIC Number"
                    className="block mb-2 font-medium text-gray-700"
                  />
                  <TextInput
                    id="nic"
                    type="text"
                    placeholder="123456789V"
                    required
                    shadow
                    className={
                      invalid("nic")
                        ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    }
                    onChange={handleTextboxDataChange}
                  />
                  {invalid("nic") && (
                    <p className="mt-1 text-xs text-red-600">{invalid("nic")}</p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="dob"
                    value="Date of Birth"
                    className="block mb-2 font-medium text-gray-700"
                  />
                  <Datepicker
                    id="dob"
                    onSelectedDateChanged={(date) => {
                      const dob =
                        date.getFullYear() +
                        "-" +
                        (date.getMonth() + 1) +
                        "-" +
                        date.getDate();
                      setFormData({ ...formData, dob });
                    }}
                    className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="phoneNumber"
                    value="Phone Number"
                    className="block mb-2 font-medium text-gray-700 mt-10"
                  />
                  <TextInput
                    id="phoneNumber"
                    type="text"
                    inputMode="numeric"
                    value={formData.phoneNumber || ""}
                    placeholder="0771234567"
                    required
                    shadow
                    className={
                      invalid("phoneNumber")
                        ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    }
                    onChange={handlePhoneNumberDataChange}
                    maxLength={10}
                  />
                  {invalid("phoneNumber") && (
                    <p className="mt-1 text-xs text-red-600">
                      {invalid("phoneNumber")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="vType"
                  value="Vehicle Type"
                  className="block mb-2 font-medium text-gray-700"
                />
                <Select
                  id="vType"
                  required
                  onChange={handleTextboxDataChange}
                  className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option>Select Vehicle Type</option>
                  <option>Heavy</option>
                  <option>Semi</option>
                  <option>Normal</option>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="model"
                  value="Vehicle Model"
                  className="block mb-2 font-medium text-gray-700"
                />
                <Select
                  id="model"
                  required
                  onChange={handleTextboxDataChange}
                  className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option>Select Vehicle Model</option>
                  <option>Car</option>
                  <option>Van</option>
                  <option>Bus</option>
                </Select>
              </div>
            </div>

            {/* Profile Picture Upload */}
            <div>
              <Label
                value="Profile Picture"
                className="block mb-2 font-medium text-gray-700"
              />
              <FileInput
                id="file-upload-helper-text"
                type="file"
                accept="image/*"
                className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                gradientDuoTone="tealToBlue"
                className="w-full py-3 font-medium text-lg transition-all hover:scale-[1.01] active:scale-95"
              >
                Register Driver
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
