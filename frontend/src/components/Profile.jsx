import { useContext, useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loader from "./Loader";
import {
  deleteProfile,
  updateUser,
  uploadProfile,
} from "../../Services/userService";
import { AuthContext } from "./Context/AuthContext";
import { MdVerified } from "react-icons/md";
import { emailRegex } from "../../Validator/validator";

const Profile = () => {
  const {
    user,
    setUser,
    userDetails,
    setUserDetails,
    loading,
    emailChangeVerifyOtp,
  } = useContext(AuthContext);

  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditDetails, setIsEditDetails] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [userData, setUserData] = useState({
    _id: "",
    username: "",
    email: "",
    gender: "",
  });

  useEffect(() => {
    if (userDetails) {
      setUserData({
        _id: userDetails._id || "",
        username: userDetails.username || "",
        email: userDetails.email || "",
        gender: userDetails.gender || "",
      });
    }
  }, [userDetails]);

  const fileInputRef = useRef(null);

  const imageHandler = (e) => {
    setProfileImage(e.target.files[0]);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle the profile image upload
  const handleProfileUpload = async (e) => {
    e.preventDefault();

    if (!profileImage) {
      toast.error("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", profileImage);

    try {
      const res = await uploadProfile(userData._id, formData);
      if (res.success) {
        const { profilepath, profilename } = res.data;

        const updatedUser = {
          ...user,
          profilepath,
          profilename,
        };

        setUser(updatedUser);
        setUserDetails((prev) => ({
          ...prev,
          profilepath,
          profilename,
        }));

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: updatedUser._id,
            username: updatedUser.username,
          })
        );

        toast.success("Profile image updated successfully!");
        setIsEditing(false);
        setProfileImage(null);
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Something went wrong during image upload.");
    }
  };

  // Handle profile image delete
  const handleProfileDelete = async () => {
    const response = await Swal.fire({
      title: "Are you sure you want to delete profile image?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#49bb0f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      width: "400px",
    });

    if (!response.isConfirmed) return;

    //  Check if there's any image first
    if (!userDetails?.profilepath) {
      toast.info("No profile image to delete!");
      return;
    }

    try {
      const res = await deleteProfile(userData._id);

      if (res.success) {
        const updatedUser = {
          ...user,
          profilename: null,
          profilepath: null,
        };

        setUser(updatedUser);
        setUserDetails((prev) => ({
          ...prev,
          profilename: null,
          profilepath: null,
        }));

        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile image deleted!");
      } else {
        toast.error(res.message || "Could not delete image");
      }
    } catch (err) {
      console.error("Profile delete error:", err);
      toast.error("Server error while deleting profile image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(userData.email)) {
      return toast.error("Invalid email format");
    }

    const isEmailChanged =
      userData.email && userDetails?.email !== userData.email;

    if (isEmailChanged) {
      await emailChangeVerifyOtp(userData.email);
      return;
    }

    try {
      const res = await updateUser(userDetails._id, userData);

      if (res.success) {
        setUserData(res.data);
        setUserDetails((prev) => ({
          ...prev,
          username: userData.username,
          email: userData.email,
          gender: userData.gender,
        }));

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: userData._id,
            username: userData.username,
            email: userData?.email,
            role: userDetails?.role,
            account: userDetails?.isAccountVerified
              ? "verified"
              : "not verified",
          })
        );

        toast.success(res.message);
        setIsEditDetails(false);
      } else {
        toast.error("Failed to update details!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error(error);
    }
  };

  useEffect(() => {
    if (showImageModal && !profileImage && !userDetails?.profilepath) {
      toast.info("No profile image. Please upload!");
      setShowImageModal(false);
    }
  }, [showImageModal, profileImage, userDetails]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-5  px-5 md:px-10 lg:px-20  w-full  ">
      <h1 className="  text-xl font-medium ">Your Profile </h1>
      <div className="flex flex-col md:flex-row min-h-max  justify-center items-center gap-5 md:gap-20 w-[85vw] md:w-[90%] lg:w-[80%] border-2 border-slate-100  shadow-lg p-2 md:py-10 lg:py-14 rounded-2xl">
        <div className="flex flex-col justify-center items-center md:border-r-2 border-gray-300 md:pr-[-20px] md:w-[60%] lg:w-[45%]">
          <div className="flex flex-col justify-center items-center gap-5 font-medium">
            <div
              onClick={() => setShowImageModal(true)}
              className={`cursor-pointer rounded-full border-[4px]   transition-all duration-500 ${
                profileImage || userDetails?.profilepath
                  ? "shadow-lg border-[#6aaa4c] border-dotted"
                  : ""
              }`}
            >
              <img
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : userDetails?.profilepath || "/prof.webp"
                }
                alt="Profile"
                title="view profile image"
                className="rounded-full w-32 h-32 md:w-44 md:h-44 object-cover object-center"
              />
            </div>

            <div className="flex gap-4 justify-center items-center ">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-blue-500 text-white rounded hover-supported:hover:bg-blue-600 transition-colors duration-500"
              >
                {profileImage || userDetails?.profilepath
                  ? "Change Profile"
                  : "Upload Profile"}
              </button>

              <input
                ref={fileInputRef}
                name="image"
                type="file"
                accept="image/*,.webp,.avif"
                onChange={imageHandler}
                hidden
              />

              {isEditing ? (
                <button
                  onClick={handleProfileUpload}
                  disabled={!profileImage}
                  className="px-3 py-2 bg-green-500 hover-supported: hover:bg-[#5CAE59] disabled:opacity-50  shadow-lg rounded transition-colors duration-500"
                >
                  Save Profile
                </button>
              ) : (
                <button
                  type="button"
                  hidden={
                    (profileImage && !userDetails?.profilepath) ||
                    !(profileImage || userDetails?.profilepath)
                  }
                  onClick={handleProfileDelete}
                  className="px-3 py-2 bg-red-500 text-white rounded hover-supported:hover:bg-red-600 transition-colors duration-500"
                >
                  Delete Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* conditional render for user details or edit details */}

        {userDetails && isEditDetails ? (
          <form
            onSubmit={handleSubmit}
            className="flex text-sm items-start flex-col gap-3 font-medium md:text-[1.5vw] lg:text-[1.1vw] w-full md:w-[50%]   md:p-2"
          >
            <div className="flex justify-center items-center gap-2  w-full">
              <label htmlFor="username" className="text-gray-800 font-medium">
                Username:
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={userData.username}
                onChange={handleChange}
                className="rounded-md border-2 border-gray-400 p-2  w-full bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2 w-full">
              <label htmlFor="email" className="text-gray-800 font-medium">
                Email:
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={userData.email} // Bind input to userData, not userDetails
                onChange={handleChange}
                className="rounded-md border-2 border-gray-400 px-1 py-2  w-full  bg-transparent"
              />
            </div>
            <div className="flex  items-center w-full gap-1 py-2 md:gap-5">
              <h1 className="text-gray-800 font-medium min-w-max">Gender :</h1>
              <div className="flex justify-center items-center ">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  id="male"
                  checked={userData.gender === "male"}
                  onChange={handleChange}
                  className="cursor-pointer"
                  aria-label="Male"
                />
                <label htmlFor="male" className="cursor-pointer">
                  Male
                </label>
              </div>
              <div className="flex justify-center items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  id="female"
                  checked={userData.gender === "female"}
                  onChange={handleChange}
                  className="cursor-pointer"
                  aria-label="Female"
                />
                <label htmlFor="female" className="cursor-pointer">
                  Female
                </label>
              </div>
              <div className="flex justify-center items-center">
                <input
                  type="radio"
                  name="gender"
                  value="others"
                  id="others"
                  checked={userData.gender === "others"}
                  onChange={handleChange}
                  className="cursor-pointer "
                  aria-label="Other"
                />
                <label htmlFor="others" className="cursor-pointer">
                  Others
                </label>
              </div>
            </div>

            <div className="mx-auto flex justify-between items-center w-full text-white">
              <button
                onClick={() => setIsEditDetails(false)}
                className="bg-red-500 px-5 py-2  rounded-md hover-supported:hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#6aaa4c] px-3 py-2 rounded-md hover-supported:hover:bg-green-500"
              >
                Update
              </button>
            </div>
          </form>
        ) : (
          <div className="flex  items-start md:justify-center flex-col gap-5 font-medium text-[12px] md:text-[1.5vw] lg:text-[1.1vw] md:p-2 w-full md:w-auto px-5">
            <div className="flex gap-2">
              <h1 className="text-gray-800 font-medium ">Username:</h1>
              <p className="text-gray-700">{userDetails?.username}</p>
            </div>
            <div className="flex gap-2">
              <h1 className="text-gray-800 font-medium ">Email:</h1>
              <p className="text-gray-700">{userDetails?.email}</p>
            </div>
            <div className="flex gap-2">
              <h1 className="text-gray-800 font-medium ">Gender:</h1>
              <p className="capitalize text-gray-700">
                {userDetails?.gender || "Not specified"}
              </p>
            </div>
            <div className="flex gap-2">
              <h1 className="text-gray-800 font-medium ">Account status:</h1>
              <div className="text-gray-700">
                {userDetails?.isAccountVerified ? (
                  <p className="flex justify-center items-center gap-3">
                    <span>Verified</span>{" "}
                    <MdVerified className="text-[#6aaa4c] md:text-[20px]" />
                  </p>
                ) : (
                  "Not verified"
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <h1 className="text-gray-800 font-medium ">Role:</h1>
              <p className="text-gray-700 capitalize">{userDetails?.role}</p>
            </div>

            <button
              onClick={() => setIsEditDetails(true)}
              className="bg-[#6aaa4c] px-3 py-2 rounded-md text-center text-white hover-supported:hover:bg-green-600 mx-auto transition-colors duration-500 w-full"
            >
              Edit details
            </button>
          </div>
        )}
      </div>
      {/* modal to view profile image */}
      {showImageModal && (profileImage || userDetails?.profilepath) && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md  flex justify-center items-center z-50  "
        >
          <div className="relative rounded-lg p-1 flex  h-screen justify-center items-center  w-full  ">
            <button className="absolute  top-1 bg-red-600 px-2 right-0 md:right-1 text-white  z-50">
              X
            </button>
            <img
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : userDetails?.profilepath || "/prof.webp"
              }
              alt="Full Profile"
              className=" object-contain  w-auto h-[90%] rounded-lg "
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
