import React, { useContext, useEffect, useState } from "react";
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

const DashOfficerSignUp = () => {
  const [formData, setFormData] = useState({ role: "officer" });
  const { authUser } = useContext(AuthContext);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState(null);

  const [file, setFile] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchValues = async () => {
      await fetch("/api/v1/station/getall")
        .then((res) => res.json())
        .then((data) => setStations(data));
    };
    fetchValues();
  }, []);

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

  // Blocks submit while any format-validated field holds an invalid value.
  const hasInvalidFields = () =>
    validateField("nic", formData.nic) ||
    validateField("phoneNumber", formData.phoneNumber) ||
    validateField("email", formData.email) ||
    validateField("password", formData.password);

  // Only surfaces feedback (red border + message) after a submit attempt.
  const invalid = (field) => submitted && validateField(field, formData?.[field]);

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasInvalidFields()) {
      return;
    }
    try {
      // Send the whole form (text fields + the selected image) as multipart/form-data.
      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        body.append(key, value)
      );
      if (file) body.append("profilePicture", file);

      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        body,
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({
          type: "failure",
          message: data.message || "Failed to register officer.",
        });
        return;
      }

      await fetch("/api/v1/activity/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "officer-create",
          createdBy: authUser._id,
        }),
      });
      setStatus({
        type: "success",
        message: typeof data === "string" ? data : "Officer registered successfully.",
      });
      e.target.reset();
      setFormData({ role: "officer" });
      setFile(null);
      setSubmitted(false);
    } catch (error) {
      console.log(error);
      setStatus({ type: "failure", message: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with decorative elements */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-center relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white relative z-10">
            Officer Registration
          </h2>
          <p className="text-blue-100 mt-2 relative z-10">
            Join our law enforcement team
          </p>
        </div>

        {/* Registration Form */}
        <div className="p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {status && (
              <Alert color={status.type === "success" ? "success" : "failure"}>
                <span className="font-medium">{status.message}</span>
              </Alert>
            )}
            {/* Grid layout for form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <Label
                  value="Full Name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                />
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Thamod Thisara"
                  required
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleTextboxDataChange}
                />
              </div>

              {/* ID */}
              <div>
                <Label
                  value="Officer ID"
                  className="block text-sm font-medium text-gray-700 mb-1"
                />
                <TextInput
                  id="id"
                  type="text"
                  placeholder="OF-12345"
                  required
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleTextboxDataChange}
                />
              </div>

              {/* Password */}
              <div>
                <Label
                  value="Password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                />
                <TextInput
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  className={
                    invalid("password")
                      ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

              {/* Email */}
              <div>
                <Label
                  value="Email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                />
                <TextInput
                  id="email"
                  type="text"
                  placeholder="thamod.thisara@police.gov"
                  required
                  className={
                    invalid("email")
                      ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }
                  onChange={handleTextboxDataChange}
                />
                {invalid("email") && (
                  <p className="mt-1 text-xs text-red-600">
                    {invalid("email")}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <Label
                  value="Date of Birth"
                  className="block text-sm font-medium text-gray-700 mb-1"
                />
                <Datepicker
                  onSelectedDateChanged={(date) => {
                    const dob =
                      date.getFullYear() +
                      "-" +
                      (date.getMonth() + 1) +
                      "-" +
                      date.getDate();
                    setFormData({ ...formData, dob });
                  }}
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* NIC Number */}
              <div>
                <Label
                  value="NIC Number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                />
                <TextInput
                  id="nic"
                  type="text"
                  placeholder="123456789V"
                  required
                  className={
                    invalid("nic")
                      ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }
                  onChange={handleTextboxDataChange}
                />
                {invalid("nic") && (
                  <p className="mt-1 text-xs text-red-600">{invalid("nic")}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <Label
                  value="Phone Number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                />
                <TextInput
                  id="phoneNumber"
                  placeholder="0771234567"
                  type="text"
                  inputMode="numeric"
                  value={formData.phoneNumber || ""}
                  required
                  className={
                    invalid("phoneNumber")
                      ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

              {/* Police Station */}
              <div>
                <Label
                  value="Police Station"
                  className="block text-sm font-medium text-gray-700 mb-1"
                />
                <Select
                  id="pStation"
                  required
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleTextboxDataChange}
                >
                  <option>Select Police Station</option>
                  {stations &&
                    stations.map((s, index) => (
                      <option key={index}>{s.station}</option>
                    ))}
                </Select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <Label
                  value="Address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                />
                <TextInput
                  id="address"
                  type="text"
                  placeholder="Enter your full address"
                  required
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleTextboxDataChange}
                />
              </div>

              {/* Profile Picture */}
              <div className="md:col-span-2">
                <Label
                  value="Profile Picture"
                  className="block text-sm font-medium text-gray-700 mb-1"
                />
                <FileInput
                  id="file-upload-helper-text"
                  type="file"
                  accept="image/*"
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                gradientDuoTone="tealToBlue"
                className="w-full py-3 font-medium text-lg transition-all hover:scale-[1.01] active:scale-95"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Register Officer
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashOfficerSignUp;
