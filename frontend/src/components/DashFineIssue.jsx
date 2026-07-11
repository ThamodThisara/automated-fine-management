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
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const DashFineIssue = () => {
  const navigate = useNavigate();
  const { authUser } = useContext(AuthContext);
  const [officer, setOfficer] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [rules, setRules] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [driver, setDriver] = useState(null);

  const [formData, setFormData] = useState({
    pId: officer.id,
    pName: officer.name,
    pStation: officer.pStation,
  });

  useEffect(() => {
    const getAllRules = async () => {
      await fetch("/api/v1/violation/getallrules")
        .then((res) => res.json())
        .then((data) => setRules(data));
    };
    getAllRules();
  }, []);

  useEffect(() => {
    const getDriver = async () => {
      await fetch(`/api/v1/user/getuser/${driverId}`)
        .then((res) => res.json())
        .then((data) => {
          setDriver(data);
          setFormData({ ...formData, dName: data.name, email: data.email });
        });
    };
    getDriver();
  }, [driverId]);

  useEffect(() => {
    setFormData({
      ...formData,
      violation: selectedRule?.type,
      charge: selectedRule?.price,
    });
  }, [selectedRule]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/fine/fineissue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(res);

      if (res.ok) {
        await fetch("/api/v1/activity/addOfficer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "fine-issue",
            createdBy: authUser.id,
          }),
        });
        navigate("/officerDashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(formData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-8 px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Traffic Fine Issuance
          </h2>
          <p className="text-cyan-100 font-medium">
            Electronic Traffic Violation Documentation
          </p>
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Driver Information Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Driver Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="dId"
                    value="Driver ID"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  />
                  <TextInput
                    id="dId"
                    type="text"
                    required
                    className="w-full"
                    onChange={(e) => {
                      setDriverId(e.target.value);
                      setFormData({
                        ...formData,
                        [e.target.id]: e.target.value,
                      });
                    }}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="dName"
                    value="Driver Name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  />
                  <TextInput
                    id="dName"
                    type="text"
                    readOnly
                    value={driver?.name || ""}
                    required
                    className="w-full bg-gray-100"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    value="Driver Email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  />
                  <TextInput
                    id="email"
                    type="email"
                    readOnly
                    value={driver?.email || ""}
                    required
                    className="w-full bg-gray-100"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="vNo"
                    value="Vehicle Number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  />
                  <TextInput
                    id="vNo"
                    type="text"
                    required
                    className="w-full"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        [e.target.id]: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Violation Details Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-red-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Violation Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="place"
                    value="Violation Location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  />
                  <TextInput
                    id="place"
                    type="text"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        [e.target.id]: e.target.value,
                      });
                    }}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="violation"
                    value="Violation Type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  />
                  <select
                    id="violation"
                    required
                    onChange={(e) => {
                      setSelectedRule(
                        rules.find((v) => v.type === e.target.value)
                      );
                    }}
                    className="w-full rounded-lg border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 text-gray-700"
                  >
                    <option value="">Select violation type</option>
                    {rules &&
                      rules.map((rule) => (
                        <option key={rule._id} value={rule.type}>
                          {rule.type}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="state"
                    value="Fine Amount (LKR)"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  />
                  <TextInput
                    id="state"
                    type="text"
                    readOnly
                    value={
                      selectedRule?.price
                        ? `Rs. ${selectedRule.price.toLocaleString()}`
                        : ""
                    }
                    className="w-full bg-gray-100 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Officer Information Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-green-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </span>
                Issuing Officer Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="pId"
                    value="Officer ID"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  />
                  <TextInput
                    id="pId"
                    type="text"
                    value={officer?.id}
                    readOnly
                    required
                    className="w-full bg-gray-100"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="pName"
                    value="Officer Name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  />
                  <TextInput
                    id="pName"
                    type="text"
                    readOnly
                    value={officer?.name}
                    required
                    className="w-full bg-gray-100"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="pStation"
                    value="Police Station"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  />
                  <TextInput
                    id="pStation"
                    type="text"
                    readOnly
                    value={officer?.pStation}
                    required
                    className="w-full bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Issue Fine Document
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
