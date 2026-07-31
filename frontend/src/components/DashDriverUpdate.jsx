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

export const DashDriverUpdate = () => {
  const [formData, setFormData] = useState();
  const { authUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState(null);
  const [searchError, setSearchError] = useState(null);

  // Shows a local preview of the newly-picked image; the file itself is uploaded on submit.
  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setImageUrl(selected ? URL.createObjectURL(selected) : null);
  };

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
    validateField("nic", formData?.nic) ||
    validateField("phoneNumber", formData?.phoneNumber) ||
    validateField("email", formData?.email) ||
    validateField("password", formData?.password);

  // Only surfaces feedback (red border + message) after a submit attempt.
  const invalid = (field) => submitted && validateField(field, formData?.[field]);

  const handleSearchId = (e) => {
    setSearchId(e.target.value);
  };

  const handleSearchUser = async () => {
    setUser(null);
    setStatus(null);
    if (!searchId) {
      return setSearchError("Enter a driver NIC to search.");
    }
    try {
      const res = await fetch(`/api/v1/user/getuser/${searchId}`);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        setSearchError(data.message || "Driver not found.");
        return;
      }

      if (data.role !== "driver") {
        setSearchError("No driver found with this NIC.");
        return;
      }

      setSearchError(null);
      setUser(data);
    } catch (error) {
      setSearchError("Something went wrong. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasInvalidFields()) {
      return;
    }
    if ((!formData || Object.keys(formData).length === 0) && !file) {
      console.log("There are no changes");
      return;
    }

    try {
      // Send changed text fields + any newly-selected image as multipart/form-data.
      const body = new FormData();
      Object.entries(formData || {}).forEach(([key, value]) =>
        body.append(key, value)
      );
      if (file) body.append("profilePicture", file);

      const res = await fetch(`/api/v1/user/update/${user._id}`, {
        method: "PUT",
        body,
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({
          type: "failure",
          message: data.message || "Failed to update driver.",
        });
        return;
      }

      await fetch("/api/v1/activity/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "driver-update",
          createdBy: authUser._id,
        }),
      });
      setUser(data);
      setStatus({ type: "success", message: "Driver updated successfully." });
      setFormData({});
      setFile(null);
      setImageUrl(null);
      setSubmitted(false);
    } catch (error) {
      console.log("error here");
      setStatus({ type: "failure", message: "Something went wrong. Please try again." });
    }
  };

  console.log(user);
  console.log(formData);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 mb-2">
            Driver Profile Update
          </h2>
          <p className="text-gray-600">
            Update driver information in the system
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full">
              <Label
                value="Driver NIC"
                className="block text-sm font-medium text-gray-700 mb-1"
              />
              <TextInput
                id="nic"
                type="text"
                required
                shadow
                className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10"
                onChange={handleSearchId}
                placeholder="Enter driver NIC"
              />
            </div>
            <div className="w-full sm:w-auto mt-6 sm:mt-6">
              <Button
                type="button"
                className="w-full h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                onClick={handleSearchUser}
              >
                Search
              </Button>
            </div>
          </div>
          {searchError && (
            <div className="mt-4">
              <Alert color="failure">
                <span className="font-medium">{searchError}</span>
              </Alert>
            </div>
          )}
        </div>

        {/* Form Section */}
        {user && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Profile Picture Section */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-center">
              <div className="relative mx-auto w-32 h-32">
                <img
                  className="rounded-full border-4 border-white shadow-lg w-full h-full object-cover"
                  src={imageUrl || user.profilePicture}
                  alt="Driver profile"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                  <label
                    htmlFor="file-upload-helper-text"
                    className="cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-cyan-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </label>
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {user.name}
              </h3>
              <p className="text-cyan-100">{user.nic}</p>
            </div>

            {/* Form Fields */}
            <form className="p-6 sm:p-8" onSubmit={handleSubmit}>
              {status && (
                <div className="mb-6">
                  <Alert color={status.type === "success" ? "success" : "failure"}>
                    <span className="font-medium">{status.message}</span>
                  </Alert>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                  <div>
                    <Label
                      htmlFor="name"
                      value="Full Name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <TextInput
                      id="name"
                      type="text"
                      placeholder="Thamod Thisara"
                      required
                      shadow
                      className="border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      defaultValue={user?.name || ""}
                      onChange={handleTextboxDataChange}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="password"
                      value="Password (Leave blank to keep current)"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <TextInput
                      id="password"
                      type="password"
                      shadow
                      className={
                        invalid("password")
                          ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      }
                      onChange={handlePasswordDataChange}
                    />
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
                      className="block text-sm font-medium text-gray-700 mb-1"
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
                          : "border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      }
                      defaultValue={user?.email || ""}
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
                      htmlFor="phoneNumber"
                      value="Phone Number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <TextInput
                      id="phoneNumber"
                      type="text"
                      inputMode="numeric"
                      required
                      shadow
                      className={
                        invalid("phoneNumber")
                          ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      }
                      defaultValue={user?.phoneNumber || ""}
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

                {/* Right Column */}
                <div className="space-y-5">
                  <div>
                    <Label
                      htmlFor="nic"
                      value="NIC Number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <TextInput
                      id="nic"
                      type="text"
                      required
                      shadow
                      className={
                        invalid("nic")
                          ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      }
                      defaultValue={user?.nic || ""}
                      onChange={handleTextboxDataChange}
                    />
                    {invalid("nic") && (
                      <p className="mt-1 text-xs text-red-600">
                        {invalid("nic")}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="dob"
                      value="Date of Birth"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <Datepicker
                      id="dob"
                      defaultDate={new Date(user.dob)}
                      onSelectedDateChanged={(date) => {
                        const dob =
                          date.getFullYear() +
                          "-" +
                          (date.getMonth() + 1) +
                          "-" +
                          date.getDate();
                        setFormData({ ...formData, dob });
                      }}
                      className="border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="address"
                      value="Address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <TextInput
                      id="address"
                      type="text"
                      required
                      shadow
                      className="border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      defaultValue={user?.address || ""}
                      onChange={handleTextboxDataChange}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="vType"
                      value="Vehicle Type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <Select
                      id="vType"
                      required
                      className="border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      onChange={handleTextboxDataChange}
                    >
                      <option>{user?.vType || "Select Vehicle Type"}</option>
                      <option>Large</option>
                      <option>Small</option>
                      <option>Medium</option>
                    </Select>
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
                      className="border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      onChange={handleTextboxDataChange}
                    >
                      <option>{user?.model || "Select Vehicle Model"}</option>
                      <option>Car</option>
                      <option>Van</option>
                      <option>Bus</option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="mt-6">
                <Label
                  value="Update Profile Picture"
                  className="block text-sm font-medium text-gray-700 mb-2"
                />
                <FileInput
                  id="file-upload-helper-text"
                  type="file"
                  accept="image/*"
                  className="w-full border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8">
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
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Update Driver Profile
                  </span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
