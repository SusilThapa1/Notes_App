import { useContext, useEffect, useRef, useState } from "react";
import {
  deleteProfile,
  updateUser,
  uploadProfile,
} from "../../../Services/userService";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const { token, user, setUser, userDetails, setUserDetails } =
    useContext(AuthContext);
  const [secretValue, setSecretValue] = useState("");
  const [secretShow, setSecretShow] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditDetails, setIsEditDetails] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [userData, setUserData] = useState({
    _id: "",
    username: "",
    email: "",
    gender: "",
    phone: "",
  });

  useEffect(() => {
    if (userDetails) {
      setUserData({
        _id: userDetails._id || "",
        username: userDetails.username || "",
        email: userDetails.email || "",
        gender: userDetails.gender || "",
        phone: userDetails.phone || "",
      });
    }
  }, [userDetails]);

  const fileInputRef = useRef(null);

  // Function to fetch the user details
  const imageHandler = (e) => {
    setProfileImage(e.target.files[0]);
    setIsEditing(true);
  };

  const navigate = useNavigate();
  const superSecret = import.meta.env.VITE_SECRET_VALUE;
  const secretNav = import.meta.env.VITE_ADMINLOGIN_ROUTE;

  const handleSecretChange = (e) => {
    const secret = e.target.value;
    setSecretValue(secret);
  };

  const showSecret = () => {
    setSecretShow(!secretShow);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const proceed = () => {
    console.log("Clicked Go", secretValue, superSecret);
    if (secretValue === superSecret) {
      navigate(secretNav);
    } else {
      toast.error("Invalid secret key. Try again !");
    }
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
          JSON.stringify({ id: updatedUser._id, username: updatedUser.usename })
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

    try {
      const res = await updateUser(userDetails._id, userData);
      if (res.success) {
        setUserData(res.data);
        setUserDetails((prev) => ({
          ...prev,
          username: userData.username,
          email: userData.email,
          gender: userData.gender,
          phone: userData.phone,
        }));
        toast.success(res.message);

        localStorage.setItem(
          "user",
          JSON.stringify({ id: userData._id, username: userData.username })
        );

        setIsEditDetails(false);
      } else {
        toast.error("Failed to update details!");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong while updating."
      );
      console.error(error);
    }
  };

  useEffect(() => {
    if (showImageModal && !profileImage && !userDetails?.profilepath) {
      toast.info("No profile image. Please upload!");
      setShowImageModal(false);
    }
  }, [showImageModal, profileImage, userDetails]);

  if (!token) {
    return (
      <div
        className={`flex flex-col justify-center items-center gap-5 mt-24 text-center  font-bold ${
          secretValue === superSecret ? "text-green-600 " : "text-red-600"
        }`}
      >
        <img src="/prof.webp" alt="Profile" className="w-40 h-40" />
        <h1 className="text-2xl">
          Please sign up or sign in to view your profile details.
        </h1>
        <p>Only admins are allowed</p>
        <form
          onSubmit={proceed}
          className="flex justify-center items-center gap-10 w-[40%]"
        >
          <div
            className={`flex justify-between items-center p-2 border-2 ${
              secretValue === superSecret
                ? "text-green-600 border-green-600"
                : "border-red-500 text-red-600"
            }   shadow-lg rounded-lg w-full`}
          >
            <input
              onChange={handleSecretChange}
              name="secret"
              type={`${secretShow ? "text" : "password"}`}
              placeholder="Type secret key"
              className="bg-transparent   outline-slate-200 w-full "
            />

            <span onClick={showSecret}>
              {secretShow ? (
                <LuEye title="hide" />
              ) : (
                <LuEyeClosed title="show" />
              )}
            </span>
          </div>
          <button
            type="submit"
            className={`flex justify-between items-center p-2 min-w-max   ${
              secretValue === superSecret
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white hidden"
            }   shadow-lg rounded-lg`}
          >
            <p>Good to Go</p>
            <img src="/happy.gif" alt="." className="w-10" />
          </button>
        </form>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="text-center text-gray-500 mt-20">
        Loading admin profile...
      </div>
    );
  }
  return (
    <div className="flex flex-col  h-[calc(100vh - 100px)] justify-center items-center gap-5 mt-20 px-5 md:px-10 lg:px-20  w-full ">
      <h1 className="  text-xl font-medium ">Your Profile </h1>
      <div className="flex flex-col md:flex-row min-h-max  justify-cebter items-center gap-5 md:gap-20 w-[85vw] md:w-[95%] lg:w-[90%] border-2 md:border-white  shadow-lg p-2 md:py-10 lg:py-14 rounded-lg">
        <div className="flex flex-col justify-center items-center md:border-r-2 border-gray-300 md:pr-[-20px] md:w-[60%] lg:w-[50%]">
          <div className="flex flex-col justify-center items-center gap-5 font-medium">
            <div
              onClick={() => setShowImageModal(true)}
              className={`cursor-pointer ${
                profileImage || userDetails?.profilepath
                  ? "hover:shadow-[0px_2px_20px_12px_rgba(120,_180,_200,_0.5)] border-[3px] hover-supported:hover:border-dotted border-blue-400"
                  : ""
              }   rounded-full  transition-all duration-500`}
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

            <div className="flex gap-4 justify-center items-center text-[12px] md:text-[1.2vw]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-blue-500 text-white rounded hover-supported:hover:bg-blue-600"
              >
                {profileImage || userDetails?.profilepath
                  ? "Change Profile Image"
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
                  className="px-3 py-2 bg-green-500 hover-supported:hover:bg-green-600 disabled:opacity-50  shadow-lg rounded"
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
                  className="px-3 py-2 bg-red-500 text-white rounded hover-supported:hover:bg-red-600"
                >
                  Delete Profile
                </button>
              )}
            </div>

            <input
              id="profile"
              name="image"
              type="file"
              accept="image/*,.webp,.avif"
              onChange={imageHandler}
              hidden
            />
          </div>
        </div>

        {/* conditional render for user details or edit details */}

        {userDetails && isEditDetails ? (
          <form
            onSubmit={handleSubmit}
            className="flex text-sm items-start flex-col gap-3 font-medium md:text-[1.2vw] w-full md:p-2"
          >
            <div className="flex justify-center items-center gap-2">
              <label htmlFor="username" className="text-gray-800 font-medium  ">
                Username:
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={userData.username}
                onChange={handleChange}
                className="rounded-md border-2 border-gray-400 px-2 w-full bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="email" className="text-gray-800 font-medium  g">
                Email:
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={userData.email} // Bind input to userData, not userDetails
                onChange={handleChange}
                className="rounded-md border-2 border-gray-400 px-1 w-full  bg-transparent"
              />
            </div>
            <div className="flex  items-center w-full gap-3 py-2 md:gap-10">
              <h1 className="text-gray-800 font-medium ">Gender :</h1>
              <div className="flex justify-center items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  id="male"
                  checked={userData.gender === "male"} // Bind checked to userData
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
                  checked={userData.gender === "female"} // Bind checked to userData
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
                  checked={userData.gender === "others"} // Bind checked to userData
                  onChange={handleChange}
                  className="cursor-pointer"
                  aria-label="Other"
                />
                <label htmlFor="others" className="cursor-pointer">
                  Others
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="phone" className="text-gray-800 font-medium  ">
                Phone number:
              </label>
              <div className="flex items-center gap-2 rounded-md border-2 border-gray-400 px-2  bg-transparent">
                <div className="flex justify-center items-center">
                  <img src="/Nepal-Flag-icon.png" alt="+977" className="w-6" />

                  <span>+977 </span>
                </div>
                <input
                  type="number"
                  name="phone"
                  id="phone"
                  placeholder="Your phone number"
                  className="appearance-none bg-transparent w-full  outline-slate-200"
                  aria-label="Phone"
                  value={userData.phone} // Bind input to userData, not userDetails
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mx-auto flex justify-between items-center w-full text-white">
              <button
                onClick={() => setIsEditDetails(false)}
                className="bg-red-500 px-5 py-2  rounded-md hover-supported:hover:bg-red-600"
              >
                Cancel Edit
              </button>
              <button
                type="submit"
                className="bg-green-600 px-3 py-2 rounded-md hover-supported:hover:bg-green-500"
              >
                Save Details
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start flex-col gap-5 font-medium text-[12px] md:text-[1.2vw] md:p-2">
            <div className="flex gap-2">
              <h1 className="text-gray-800 font-medium ">Username:</h1>
              <p className="text-gray-700">{userDetails.username}</p>
            </div>
            <div className="flex gap-2">
              <h1 className="text-gray-800 font-medium ">Email:</h1>
              <p className="text-gray-700">{userDetails.email}</p>
            </div>
            <div className="flex gap-2">
              <h1 className="text-gray-800 font-medium ">Gender:</h1>
              <p className="capitalize text-gray-700">
                {userDetails.gender || "Not specified"}
              </p>
            </div>
            <div className="flex gap-2">
              <h1 className="text-gray-800 font-medium ">Phone number:</h1>
              <p className="text-gray-700">{userDetails.phone || "N/A"}</p>
            </div>
            <div
              onClick={() => setIsEditDetails(true)}
              className="bg-green-600 px-3 py-2 rounded-md text-center text-white hover-supported:hover:bg-green-500 mx-auto w-full"
            >
              <button>Edit details</button>
            </div>
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

export default AdminProfile;
