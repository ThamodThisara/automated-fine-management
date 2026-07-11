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

const DashOfficerUpdate = () => {
  const [formData, setFormData] = useState({ role: "officer" });
  const { authUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [passwardError, setPasswardError] = useState(false);

  const navigate = useNavigate();

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
            setImageUrl(downloadURL);
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

  const handleSearchId = (e) => {
    setSearchId(e.target.value);
  };

  const handleSearchUser = async () => {
    try {
      const res = await fetch(`/api/v1/user/getofficer/${searchId}`);

      if (!res.ok) {
        return;
      } else {
        const data = await res.json();

        if (data.role == "officer") {
          setUser(data);
        }
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

    if (imageUploadProgress) {
      console.log("Please wait for uploading image");
      return;
    }
    try {
      const res = await fetch(`/api/v1/user/update/${searchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
            action: "officer-update",
            createdBy: authUser.id,
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
            Officer Profile Update
          </h2>
          <p className="text-blue-100 mt-2 relative z-10">
            Update officer information
          </p>
        </div>

        {/* Search Section */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-blue-50 p-4 rounded-lg">
            <div className="w-full">
              <Label
                value="Search by Officer ID"
                className="block text-sm font-medium text-gray-700 mb-1"
              />
              <div className="relative">
                <TextInput
                  id="id"
                  type="text"
                  required
                  className="w-full pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleSearchId}
                  placeholder="Enter officer ID"
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
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <Button
                  type="button"
                  gradientDuoTone="purpleToBlue"
                  size="sm"
                  outline
                  onClick={handleUploadImage}
                  className="mt-4 transition-all hover:scale-[1.02] active:scale-95"
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
                      Upload New Photo
                    </span>
                  )}
                </Button>
                {imageUploadError && (
                  <Alert color="failure" className="mt-3">
                    {imageUploadError}
                  </Alert>
                )}
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
                    placeholder="John Doe"
                    required
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={user?.name || ""}
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
                    defaultValue={user?.id || ""}
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
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={handlePasswordDataChange}
                  />
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
                    defaultValue={user?.email || ""}
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
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={user?.nic || ""}
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
                    type="number"
                    placeholder="0771234567"
                    value={formData.phoneNumber}
                    required
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={user?.phoneNumber || ""}
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
                  disabled={
                    imageUploadProgress >= 1 && imageUploadProgress <= 99
                  }
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
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Update Officer
                    </span>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashOfficerUpdate;
