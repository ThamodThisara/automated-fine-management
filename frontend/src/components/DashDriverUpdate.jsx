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

export const DashDriverUpdate = () => {
  const [formData, setFormData] = useState();
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

  const handleSearchUser = async (req, res) => {
    try {
      const res = await fetch(`/api/v1/user/getuser/${searchId}`);

      if (!res.ok) {
        return;
      } else {
        const data = await res.json();

        if (data.role == "driver") {
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
            action: "driver-update",
            createdBy: authUser.id,
          }),
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("error here");
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
                value="Driver ID"
                className="block text-sm font-medium text-gray-700 mb-1"
              />
              <TextInput
                id="id"
                type="text"
                required
                shadow
                className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10"
                onChange={handleSearchId}
                placeholder="Enter driver ID"
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
              <p className="text-cyan-100">{user.id}</p>
            </div>

            {/* Form Fields */}
            <form className="p-6 sm:p-8" onSubmit={handleSubmit}>
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
                      placeholder="John Doe"
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
                      className="border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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

                  <div>
                    <Label
                      htmlFor="email"
                      value="Email Address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    />
                    <TextInput
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      required
                      shadow
                      className="border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      defaultValue={user?.email || ""}
                      onChange={handleTextboxDataChange}
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
                      required
                      shadow
                      className="border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      defaultValue={user?.phoneNumber || ""}
                      onChange={handlePhoneNumberDataChange}
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="id"
                      value="Driver ID"
                      className="block mb-1 font-medium text-gray-700"
                    />
                    <TextInput
                      id="id"
                      type="text"
                      required
                      shadow
                      className="border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      defaultValue={user?.id || ""}
                      onChange={handleTextboxDataChange}
                    />
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
                      className="border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      defaultValue={user?.nic || ""}
                      onChange={handleTextboxDataChange}
                    />
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
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <FileInput
                    id="file-upload-helper-text"
                    type="file"
                    className="w-full border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <Button
                    type="button"
                    gradientDuoTone="cyanToBlue"
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
                            strokeWidth="2"
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

              {/* Submit Button */}
              <div className="mt-8">
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
                      Updating Profile...
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
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Update Driver Profile
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
