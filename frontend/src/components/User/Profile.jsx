import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  deleteProfile,
  updateUser,
  uploadProfile,
} from "../../../Services/userService";
import { AuthContext } from "../Context/AuthContext";
import {
  MdOutlineChangeCircle,
  MdOutlineDelete,
  MdVerified,
} from "react-icons/md";
import { emailRegex } from "../../../Validator/validator";
import { useAlerts } from "../../../Utils/alertHelper";
import Loader from "../Loader/Loader";
import { HiOutlineTrash } from "react-icons/hi";
import { IoSaveOutline } from "react-icons/io5";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const Profile = () => {
  const { showConfirm } = useAlerts();
  const {
    userDetails,
    setUserDetails,
    setUserSession,
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

  const fileInputRef = useRef(null);
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

  const imageHandler = (e) => {
    setProfileImage(e.target.files[0]);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // ------------------ Upload Profile Image ------------------
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

        // Update context state

        setUserDetails((prev) => ({ ...prev, profilepath, profilename }));

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

  // ------------------ Delete Profile Image ------------------
  const handleProfileDelete = async () => {
    const response = await showConfirm({
      title: "Are you sure, you want to delete profile image?",
      text: "You won't be able to revert this!",
    });

    if (!response.isConfirmed) return;
    if (!userDetails?.profilepath) {
      toast.info("No profile image to delete!");
      return;
    }

    try {
      const res = await deleteProfile(userData._id);
      if (res?.success) {
        const updatedUser = {
          ...userDetails,
          profilepath: null,
          profilename: null,
        };
        setUserDetails(updatedUser);
        setUserSession(updatedUser);
        toast.success("Profile image deleted!");
      } else {
        toast.error(res.message || "Could not delete image");
      }
    } catch (err) {
      console.error("Profile delete error:", err);
      toast.error("Server error while deleting profile image");
    }
  };

  // ------------------ Update User Details ------------------
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
        // Update context state
        setUserDetails((prev) => ({ ...prev, ...res.data }));

        toast.success(res.message);
        setIsEditDetails(false);
      } else {
        toast.error("Failed to update details!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // ------------------ Modal check ------------------
  useEffect(() => {
    if (showImageModal && !profileImage && !userDetails?.profilepath) {
      toast.info("No profile image. Please upload!");
      setShowImageModal(false);
    }
  }, [showImageModal, profileImage, userDetails]);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-5 px-5 md:px-10 lg:px-20 w-full">
      <h1 className="text-xl font-medium text-textLight dark:text-textDark">
        Your Profile
      </h1>

      <div className="flex flex-col md:flex-row min-h-max justify-center items-center gap-5 md:gap-20 w-[75vw] md:w-[90%] lg:w-[60%] border border-yellow-50 dark:border-gray-800 dark:bg-gray-900 shadow-lg p-2 md:py-10 lg:py-14 rounded-2xl">
        {/* ------------------ Profile Image ------------------ */}
        <div className="flex flex-col justify-center items-center md:border-r-2 border-gray-300 dark:border-gray-600 md:pr-[-20px] md:w-[60%] lg:w-[45%]">
          <div className="flex flex-col justify-center items-center gap-5 font-medium">
            <div
              onClick={() => setShowImageModal(true)}
              className={`cursor-pointer rounded-full border-[4px] transition-all duration-500 ${
                profileImage || userDetails?.profilepath
                  ? "shadow-lg border-[#6aaa4c] dark:border-darkGreen border-dotted"
                  : ""
              }`}
            >
              <img
                loading="lazy"
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : userDetails?.profilepath
                    ? `${
                        import.meta.env.VITE_API_FILE_URL +
                        userDetails?.profilepath
                      }`
                    : "/profile.png"
                }
                alt="Profile"
                title="view profile image"
                className="rounded-full w-32 h-32 md:w-44 md:h-44 object-cover object-center"
              />
            </div>

            <div className="flex gap-4 justify-center items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 border border-editOutlineText text-editOutlineText px-2 py-1 rounded-md text-sm hover-supported:hover:bg-editNormal hover-supported:hover:text-white hover-supported:hover:border-editNormal transition"
              >
                {profileImage || userDetails?.profilepath ? (
                  <>
                    {" "}
                    <MdOutlineChangeCircle /> Change Profile
                  </>
                ) : (
                  <>
                    {" "}
                    <MdOutlineDelete />
                    Upload Profile
                  </>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={imageHandler}
                hidden
              />

              {isEditing ? (
                <button
                  onClick={handleProfileUpload}
                  disabled={!profileImage}
                  className="flex items-center gap-1 border border-lightGreen dark:border-darkGreen text-lightGreen dark:text-darkGreen px-2 py-1 rounded-md text-sm hover-supported:hover:bg-lightGreen dark:hover-supported:hover:bg-darkGreen hover-supported:hover:text-white transition"
                >
                  <IoSaveOutline /> Save profile
                </button>
              ) : (
                <button
                  type="button"
                  hidden={
                    (profileImage && !userDetails?.profilepath) ||
                    !(profileImage || userDetails?.profilepath)
                  }
                  onClick={handleProfileDelete}
                  className="flex items-center gap-1 border border-deleteOutlineText text-deleteOutlineText px-2 py-1 rounded-md text-sm hover-supported:hover:bg-deleteNormal hover-supported:hover:text-white hover-supported:hover:border-deleteNormal transition"
                >
                  <HiOutlineTrash /> Delete Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ------------------ User Details ------------------ */}
        {userDetails && isEditDetails ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-start gap-3 font-medium text-sm w-full md:w-[50%] md:p-2"
          >
            <div className="flex justify-center items-center gap-2 w-full">
              <label
                htmlFor="username"
                className="text-textLight dark:text-textDark font-medium"
              >
                Name:
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={userData.username}
                onChange={handleChange}
                className="rounded-md border-2 border-gray-400 dark:border-gray-600 p-2 w-full bg-transparent dark:bg-gray-700 dark:text-gray-200"
              />
            </div>

            <div className="flex items-center gap-2 w-full">
              <label
                htmlFor="email"
                className="text-textLight dark:text-textDark font-medium"
              >
                Email:
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={userData.email}
                onChange={handleChange}
                className="rounded-md border-2 border-gray-400 dark:border-gray-600 px-1 py-2 w-full bg-transparent dark:bg-gray-700 dark:text-gray-200"
              />
            </div>

            <div className="flex items-center w-full gap-1 py-2 md:gap-5">
              <h1 className="text-textLight dark:text-textDark font-medium min-w-max">
                Gender:
              </h1>
              {["male", "female", "others"].map((g) => (
                <div key={g} className="flex justify-center items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    id={g}
                    checked={userData.gender === g}
                    onChange={handleChange}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor={g}
                    className="cursor-pointer capitalize text-textLight dark:text-textDark"
                  >
                    {g}
                  </label>
                </div>
              ))}
            </div>

            <div className="mx-auto flex justify-between items-center w-full gap-3">
              {/* Back Button */}
              <button
                onClick={() => setIsEditDetails(false)}
                className="  dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md 
               border border-gray-300 dark:border-gray-600 
               hover:bg-gray-400 hover:text-textDark dark:hover:bg-gray-600 
               transition-colors shadow-sm"
              >
                Back
              </button>

              {/* Update Button */}
              <button
                type="submit"
                className="border border-editOutlineText text-editOutlineText px-2 py-1 rounded-md hover-supported:hover:bg-editNormal hover-supported:hover:text-white hover-supported:hover:border-editNormal transition-colors "
              >
                Update
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start md:justify-center flex-col gap-5 font-medium text-sm  md:p-2 w-full md:w-auto px-5">
            <div className="flex gap-2">
              <h1 className="text-textLight dark:text-textDark font-medium">
                Name:
              </h1>
              <p className="text-subTextLight dark:text-subTextDark">
                {userDetails?.username}
              </p>
            </div>
            <div className="flex gap-2">
              <h1 className="text-textLight dark:text-textDark font-medium">
                Email:
              </h1>
              <p className="text-subTextLight dark:text-subTextDark">
                {userDetails?.email}
              </p>
            </div>
            <div className="flex gap-2">
              <h1 className="text-textLight dark:text-textDark font-medium">
                Gender:
              </h1>
              <p className="capitalize text-subTextLight dark:text-subTextDark">
                {userDetails?.gender || "Not specified"}
              </p>
            </div>
            <div className="flex gap-2">
              <h1 className="text-textLight dark:text-textDark font-medium">
                Account status:
              </h1>
              <div className="text-subTextLight dark:text-subTextDark">
                {userDetails?.isAccountVerified ? (
                  <p className="flex justify-center items-center gap-3">
                    <span>Verified</span>
                    <MdVerified className="text-lightGreen dark:text-darkGreen md:text-[20px]" />
                  </p>
                ) : (
                  "Not verified"
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <h1 className="text-textLight dark:text-textDark font-medium">
                Role:
              </h1>
              <p className="text-subTextLight dark:text-subTextDark capitalize">
                {userDetails?.role}
              </p>
            </div>

            <button
              onClick={() => setIsEditDetails(true)}
              className="flex justify-center items-center gap-1 border border-editOutlineText text-editOutlineText px-2 py-1 rounded-md text-sm hover-supported:hover:bg-editNormal hover-supported:hover:text-white hover-supported:hover:border-editNormal transition w-full mx-auto"
            >
              <HiOutlinePencilSquare />
              Edit
            </button>
          </div>
        )}
      </div>

      {/* ------------------ Modal to view profile image ------------------ */}
      {showImageModal && (profileImage || userDetails?.profilepath) && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex justify-center items-center z-50"
        >
          <div className="relative rounded-lg p-1 flex h-screen justify-center items-center w-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-1 right-1 bg-deleteNormal hover:bg-deleteHover px-2 text-white z-50 rounded transition-colors"
            >
              X
            </button>
            <img
              loading="lazy"
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : userDetails?.profilepath
                  ? `${
                      import.meta.env.VITE_API_FILE_URL +
                      userDetails.profilepath
                    }`
                  : "/profile.png"
              }
              alt="Full Profile"
              className="object-contain w-auto h-[90%] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
