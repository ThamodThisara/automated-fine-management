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
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { HiInformationCircle } from "react-icons/hi";
import { validateField } from "../utils/validators.js";

export default function DashAdminUpdate() {
  const [formData, setFormData] = useState({ role: "admin" });
  const { authUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  // Shows a local preview of the newly-picked image; the file itself is uploaded on submit.
  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setImageUrl(selected ? URL.createObjectURL(selected) : null);
  };

  const handleTextboxDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSearchId = (e) => {
    setSearchId(e.target.value);
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

  const handleSearchUser = async () => {
    try {
      const res = await fetch(`/api/v1/user/getadmin/${searchId}`);

      if (!res.ok) {
        return;
      } else {
        const data = await res.json();

        if (data.role == "admin") {
          setUser(data);
        }
      }
    } catch (error) {
      console.log(error);
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
      console.log(res);
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        console.log("error");
      } else {
        console.log("Update is success");
        await fetch("/api/v1/activity/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "Admin-update",
            createdBy: authUser._id,
          }),
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("error here");
    }
  };

  console.log("user", user);
  console.log("form", formData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with decorative elements */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-center relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white relative z-10">
            Admin Profile Update
          </h2>
          <p className="text-blue-100 mt-2 relative z-10">
            Update Admin information
          </p>
        </div>

        {/* Search Section */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-blue-50 p-4 rounded-lg">
            <div className="w-full">
              <Label
                value="Search by Admin NIC"
                className="block text-sm font-medium text-gray-700 mb-1"
              />
              <div className="relative">
                <TextInput
                  id="nic"
                  type="text"
                  required
                  className="w-full pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleSearchId}
                  placeholder="Enter Admin NIC"
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
            <Button
              type="button"
              gradientDuoTone="blueToCyan"
              className="w-full sm:w-auto h-[42px] px-6 flex items-center justify-center mt-6"
              onClick={handleSearchUser}
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

        {/* Update Form */}
        <div className="p-6 sm:p-8">
          {user && (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <img
                    className="rounded-full h-32 w-32 object-cover border-4 border-white shadow-lg"
                    src={imageUrl || user.profilePicture}
                    alt="Profile"
                  />
                  <label
                    htmlFor="file-upload-helper-text"
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
                <FileInput
                  id="file-upload-helper-text"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <p className="mt-3 text-xs text-gray-500">
                  Click the camera icon to choose a new photo
                </p>
              </div>

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
                    defaultValue={user?.name || ""}
                    onChange={handleTextboxDataChange}
                  />
                </div>

                {/* Password */}
                <div>
                  <Label
                    value="Password (Leave blank to keep current)"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  />
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    className={
                      invalid("password")
                        ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }
                    onChange={handlePasswordDataChange}
                  />
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
                    defaultValue={user?.email || ""}
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
                    defaultValue={user?.nic || ""}
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
                    type="text"
                    inputMode="numeric"
                    placeholder="0771234567"
                    required
                    className={
                      invalid("phoneNumber")
                        ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <option>{user?.pStation || "Select Police Station"}</option>
                    <option value="Matara">Matara</option>
                    <option value="Galle">Galle</option>
                    <option value="Colombo">Colombo</option>
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
                    defaultValue={user?.address || ""}
                    onChange={handleTextboxDataChange}
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
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Update Officer
                  </span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
