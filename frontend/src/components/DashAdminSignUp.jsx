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
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { HiInformationCircle } from "react-icons/hi";

export default function DashAdminSignUp() {
  const [formData, setFormData] = useState({ role: "admin" });
  const { authUser } = useContext(AuthContext);
  const [passwardError, setPasswardError] = useState(false);

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [stations, setStations] = useState({});
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
            setFormData({ ...formData, profilePicture: downloadURL });
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
  const handlePasswordDataChange = (e) => {
    const value = e.target.value;

    const hasNumber = /[0-9]/.test(value);
    const hasSymbol = /[^A-Za-z0-9]/.test(value); // Any character not a letter or number

    if (value.length < 8 || !hasNumber || !hasSymbol) {
      setPasswardError(true);
    } else {
      setFormData({ ...formData, [e.target.id]: value });
      setPasswardError(false);
    }
  };

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        await fetch("/api/v1/activity/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "admin-create",
            createdBy: authUser.id,
          }),
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with decorative elements */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-center relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white relative z-10">
            Admin Registration
          </h2>
          <p className="text-blue-100 mt-2 relative z-10">
            Join our law enforcement team
          </p>
        </div>

        {/* Registration Form */}
        <div className="p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  placeholder="John Doe"
                  required
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleTextboxDataChange}
                />
              </div>

              {/* ID */}
              <div>
                <Label
                  value="Admin ID"
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
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handlePasswordDataChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 8 characters with numbers and symbols
                </p>
                {passwardError && (
                  <Alert color="failure" icon={HiInformationCircle}>
                    <span className="font-medium">
                      Minimum 8 characters with numbers and symbols
                    </span>{" "}
                    Change a few things up and try submitting again.
                  </Alert>
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
                  type="email"
                  placeholder="john.doe@police.gov"
                  required
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleTextboxDataChange}
                />
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
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleTextboxDataChange}
                />
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
                  type="number"
                  value={formData.phoneNumber}
                  required
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handlePhoneNumberDataChange}
                  maxLength={10}
                />
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
                    stations.data?.value.map((s, index) => (
                      <option key={index}>{s.name}</option>
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
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <FileInput
                    id="file-upload-helper-text"
                    type="file"
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <Button
                    type="button"
                    gradientDuoTone="purpleToBlue"
                    size="sm"
                    outline
                    onClick={handleUploadImage}
                    className="transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {imageUploadProgress > 0 ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Uploading ({imageUploadProgress}%)
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Upload Image
                      </span>
                    )}
                  </Button>
                </div>
                {imageUploadError && (
                  <Alert color="failure" className="mt-3">
                    {imageUploadError}
                  </Alert>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                gradientDuoTone="tealToBlue"
                className="w-full py-3 font-medium text-lg transition-all hover:scale-[1.01] active:scale-95"
                disabled={imageUploadProgress >= 1 && imageUploadProgress <= 99}
              >
                {imageUploadProgress >= 1 && imageUploadProgress <= 99 ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : (
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
                    Register Admin
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
