import { useContext, useEffect, useRef, useState } from "react";
import {
  deleteProfile,
  updateUser,
  uploadProfile,
} from "../../../Services/userService";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AdminProfile = () => {
  const { token, user, setUser, userDetails, setUserDetails } =
    useContext(AuthContext);
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
          JSON.stringify({ id: updateUser._id, username: updateUser.usename })
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
        toast.error("Failed to update details !");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col justify-center items-center gap-5 mt-24 text-center">
        <img src="/prof.webp" alt="Profile" className="w-40 h-40" />
        <p className="text-red-600 font-bold">
          Please log in to view your profile details.
        </p>
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
    <div className="flex flex-col justify-center items-center gap-5  scroll-container overflow-scroll mt-24 px-5 md:px-10 lg:px-20 mb-20 ">
      <div className="flex flex-col justify-center items-center">
        <form className="flex flex-col justify-center items-center gap-5 font-semibold">
          <div
            onClick={() => setShowImageModal(true)}
            className="cursor-pointer hover:opacity-80 border-2 rounded-full border-green-600 shadow-md"
          >
            <img
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : userDetails?.profilepath || "/prof.webp"
              }
              alt="Profile"
              className="rounded-full w-32 h-32 object-cover"
            />
          </div>

          <div className="flex gap-4 justify-center items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Change Profile Image
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
                className="px-3 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 shadow-md rounded"
              >
                Save Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={handleProfileDelete}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
        </form>
      </div>

      {/* conditional render for user details or edit details */}

      {userDetails && isEditDetails ? (
        <form
          onSubmit={handleSubmit}
          className="flex  items-start  flex-col gap-5 font-semibold"
        >
          <div className="flex gap-2">
            <label htmlFor="username" className="text-green-600">
              Username:
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={userData.username}
              onChange={handleChange}
              className="rounded-md border-2 border-green-700 p-2  bg-transparent"
            />
          </div>
          <div className="flex gap-2">
            <label htmlFor="email" className="text-green-600">
              Email:
            </label>
            <input
              type="text"
              name="email"
              id="email"
              value={userData.email} // Bind input to userData, not userDetails
              onChange={handleChange}
              className="rounded-md border-2 border-green-700 p-2  bg-transparent"
            />
          </div>
          <div className="flex gap-5 py-2 md:gap-10">
            <h1 className="text-green-600">Gender :</h1>
            <div>
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
            <div>
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
            <div>
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
          <div className="flex gap-2">
            <label htmlFor="phone" className="text-green-600">
              Phone number:
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Your phone number"
              className="appearance-none rounded-md border-2 border-green-700 p-2  bg-transparent"
              aria-label="Phone"
              value={userData.phone} // Bind input to userData, not userDetails
              onChange={handleChange}
            />
          </div>
          <div className="mx-auto flex justify-between items-center w-full text-white">
            <button
              onClick={() => setIsEditDetails(false)}
              className="bg-red-500 px-5 py-2  rounded-md hover:bg-red-600"
            >
              Cancel Edit
            </button>
            <button
              type="submit"
              className="bg-green-600 px-3 py-2 rounded-md hover:bg-green-500"
            >
              Save Details
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-start flex-col gap-5 text-lg font-semibold">
          <div className="flex gap-2">
            <h1 className="text-green-600">Username:</h1>
            <p>{userDetails.username}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="text-green-600">Email address:</h1>
            <p>{userDetails.email}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="text-green-600">Gender:</h1>
            <p className="capitalize">
              {userDetails.gender || "Not specified"}
            </p>
          </div>
          <div className="flex gap-2">
            <h1 className="text-green-600">Phone number:</h1>
            <p>{userDetails.phone || "N/A"}</p>
          </div>
          <div
            onClick={() => setIsEditDetails(true)}
            className="bg-green-600 px-3 py-2 rounded-md text-center text-white hover:bg-green-500 mx-auto w-full"
          >
            <button>Edit details</button>
          </div>
        </div>
      )}
      {/* modal to view profile image */}
      {showImageModal && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50  "
        >
          <div className="relative   rounded-lg p-1 flex justify-center items-center  ">
            <img
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : userDetails?.profilepath || "/prof.webp"
              }
              alt="Full Profile"
              className=" object-cover rounded-lg "
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
