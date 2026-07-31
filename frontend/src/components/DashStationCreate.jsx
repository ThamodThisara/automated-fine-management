import React, { useContext, useState } from "react";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import { AuthContext } from "../context/AuthContext";
import {validateField} from "../utils/validators.js";

export const DashStationCreate = () => {
  const { authUser } = useContext(AuthContext);
  // const [submitted, setSubmitted] = useState(true);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState(null);

  // const hasInvalidFields = () =>
  //     validateField("phoneNumber", formData.phoneNumber) ||
  //     validateField("email", formData.email);
  //
  // const invalid = (field) => submitted && validateField(field, formData?.[field]);


  const handleTextboxDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setSubmitted(true);
    // if (hasInvalidFields()) {
    //   return;
    // }
    try {
      const res = await fetch("/api/v1/station/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "failure", message: data.message || "Failed to create station" });
        return;
      }

      await fetch("/api/v1/activity/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "station-create",
          createdBy: authUser._id,
        }),
      });
      setStatus({ type: "success", message: "Station added successfully." });
      e.target.reset();
      setFormData({});
      // setSubmitted(false);
    } catch (error) {
      console.log(error);
      setStatus({ type: "failure", message: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-2">
            Add Police Station
          </h2>
          <p className="text-gray-600">
            Register a new station with its contact details
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <form className="p-6 sm:p-8 space-y-6" onSubmit={handleSubmit}>
            {status && (
              <Alert color={status.type === "success" ? "success" : "failure"}>
                <span className="font-medium">{status.type === "success" ? "Success!" : "Error!"}</span> {status.message}
              </Alert>
            )}

            {/* Station Name */}
            <div>
              <Label
                htmlFor="station"
                value="Station Name"
                className="block text-sm font-medium text-gray-700 mb-2"
              />
              <TextInput
                id="station"
                type="text"
                required
                shadow
                className="w-full border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                onChange={handleTextboxDataChange}
                placeholder="e.g., Colombo Central"
              />
            </div>

            {/* Email */}
            <div>
              <Label
                htmlFor="email"
                value="Station Email"
                className="block text-sm font-medium text-gray-700 mb-2"
              />
              <TextInput
                id="email"
                type="text"
                required
                shadow
                className="w-full border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                // className={
                //   invalid("email")
                //       ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                //       : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                // }
                onChange={handleTextboxDataChange}
                placeholder="e.g., central@police.lk"
              />
              {/*{invalid("email") && (*/}
              {/*    <p className="mt-1 text-xs text-red-600">*/}
              {/*      {invalid("email")}*/}
              {/*    </p>*/}
              {/*)}*/}
            </div>

            {/* Phone */}
            <div>
              <Label
                htmlFor="phone"
                value="Station Phone Number"
                className="block text-sm font-medium text-gray-700 mb-2"
              />
              <TextInput
                id="phoneNumber"
                type="text"
                required
                shadow
                className="w-full border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                // className={
                //   invalid("phoneNumber")
                //       ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                //       : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                // }
                onChange={handleTextboxDataChange}
                placeholder="e.g., 0112345678"
              />
              {/*{invalid("phoneNumber") && (*/}
              {/*    <p className="mt-1 text-xs text-red-600">*/}
              {/*      {invalid("phoneNumber")}*/}
              {/*    </p>*/}
              {/*)}*/}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                gradientDuoTone="redToOrange"
                className="w-full py-3 font-medium text-lg transition-all hover:scale-[1.01] active:scale-95"
              >
                Add Station
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
