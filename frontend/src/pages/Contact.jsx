import React, { useEffect, useState } from "react";
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
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

export const Contact = () => {
  const [formData, setFormData] = useState({});
  const [stations, setStations] = useState({});
  const [stationEmail, setStationEmail] = useState("");
  const [stationNumber, setStationNumber] = useState("");

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchValues = async () => {
      await fetch("/api/v1/static//getstaticvalue/station")
        .then((res) => res.json())
        .then((data) => setStations(data));
    };
    fetchValues();
  }, []);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Plese select the image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(0);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(0);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(0);
    }
  };

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
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/complain/complainadd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(res);

      if (res.ok) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStationSelect = async (e) => {
    const result = await stations.data.value.find(
      (item) => item.name === e.target.value
    );
    if (e.target.value !== "Stations") {
      setStationEmail(result.email);
      setStationNumber(result.phone);
    } else {
      setStationEmail("Stations");
      setStationNumber("Phone");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-7xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-teal-100 dark:border-gray-700">
        {/* Header with decorative gradient */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-800 dark:to-cyan-800 py-8 px-6 text-center">
          <h2 className="font-bold text-3xl sm:text-4xl text-white">
            Complaint and Contact
          </h2>
          <p className="mt-2 text-teal-100 dark:text-teal-200">
            We're here to help with your concerns
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-10">
          {/* Complaint Form Section */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-xl p-6 md:p-8 shadow-inner">
            <div className="text-center mb-8">
              <h3 className="font-bold text-2xl sm:text-3xl text-teal-700 dark:text-teal-300 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mr-2"
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
                Complaint Form
              </h3>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Form Fields */}
              {[
                {
                  id: "name",
                  label: "Name",
                  type: "text",
                  placeholder: "Enter your name",
                },
                {
                  id: "phoneNumber",
                  label: "Phone Number",
                  type: "tel",
                  placeholder: "Enter your phone number",
                },
                {
                  id: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "name@example.com",
                },
              ].map((field) => (
                <div key={field.id}>
                  <Label
                    htmlFor={field.id}
                    value={field.label}
                    className="text-cyan-700 dark:text-cyan-300 font-medium mb-2 flex items-center"
                  />
                  <TextInput
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    required
                    className="w-full rounded-lg border-cyan-200 dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-600 dark:text-white transition-all duration-300"
                    onChange={handleTextboxDataChange}
                  />
                </div>
              ))}

              {/* Complaint Textarea */}
              <div>
                <Label
                  htmlFor="complain"
                  value="Complaint Details"
                  className="text-cyan-700 dark:text-cyan-300 font-medium mb-2 flex items-center"
                />
                <textarea
                  id="complain"
                  rows="5"
                  className="block w-full p-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 rounded-lg border border-cyan-200 dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                  placeholder="Describe your complaint in detail..."
                  onChange={handleTextboxDataChange}
                ></textarea>
              </div>

              {/* Image Upload */}
              <div>
                <Label
                  value="Upload Evidence"
                  className="text-cyan-700 dark:text-cyan-300 font-medium mb-2 flex items-center"
                />
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <FileInput
                    id="file-upload"
                    helperText="Upload relevant images (JPG, PNG, max 5MB)"
                    className="w-full rounded-lg border-cyan-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 transition-all duration-300"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <Button
                    type="button"
                    gradientDuoTone="purpleToBlue"
                    size="md"
                    pill
                    onClick={handleUploadImage}
                    className="w-full sm:w-auto transition-all duration-300 transform hover:scale-105"
                  >
                    Upload Image
                  </Button>
                </div>
                {imageUploadProgress > 0 && imageUploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-600">
                    <div
                      className="bg-cyan-600 h-2.5 rounded-full"
                      style={{ width: `${imageUploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {imageUploadError && (
                <Alert color="failure" className="mt-2">
                  <span className="font-medium">Error!</span> {imageUploadError}
                </Alert>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={
                    imageUploadProgress > 0 && imageUploadProgress < 100
                  }
                  gradientDuoTone="tealToBlue"
                  className="w-full py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  {imageUploadProgress > 0 && imageUploadProgress < 100 ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading ({imageUploadProgress}%)
                    </span>
                  ) : (
                    "Submit Complaint"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Contact Information Section */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-xl p-6 md:p-8 shadow-inner">
            <div className="text-center mb-8">
              <h3 className="font-bold text-2xl sm:text-3xl text-teal-700 dark:text-teal-300 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Contact Information
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              {/* Police Station Select */}
              <div>
                <Label
                  htmlFor="station"
                  value="Select Police Station"
                  className="text-cyan-700 dark:text-cyan-300 font-medium mb-2 flex items-center"
                />
                <Select
                  id="station"
                  required
                  className="w-full rounded-lg border-cyan-200 dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-600 dark:text-white transition-all duration-300"
                  onChange={(e) => handleStationSelect(e)}
                >
                  <option className="text-gray-400">Select Station</option>
                  {stations &&
                    stations.data?.value.map((s, index) => (
                      <option
                        key={index}
                        className="text-gray-900 dark:text-white"
                      >
                        {s.name}
                      </option>
                    ))}
                </Select>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                {[
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                    title: "Police Station Email",
                    value: stationEmail || "Select station to view email",
                    color:
                      "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    ),
                    title: "Police Station Phone",
                    value: stationNumber || "Select station to view phone",
                    color:
                      "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`${item.color} p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md`}
                  >
                    <div className="flex items-center mb-2">
                      <div className="p-2 rounded-full bg-white dark:bg-gray-700 mr-3">
                        {item.icon}
                      </div>
                      <h4 className="font-semibold">{item.title}</h4>
                    </div>
                    <p className="pl-11">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Emergency Contact */}
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded-lg border-l-4 border-red-500 dark:border-red-400">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600 dark:text-red-300 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h4 className="font-bold text-red-800 dark:text-red-200">
                    Emergency Contact
                  </h4>
                </div>
                <p className="mt-2 text-red-700 dark:text-red-300 pl-9">
                  Call 119 for immediate police assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
