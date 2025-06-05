import { useContext, useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoArrowRedoSharp } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  deleteReview,
  sendReplyReview,
  viewReview,
} from "../../../Services/reviewService";
import { AuthContext } from "../Context/AuthContext";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ReviewList = () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "/");

  const navigate = useNavigate();
  const { userDetails, token } = useContext(AuthContext);
  const isAdmin = userDetails?.role === "admin";

  const [replyReview, setReplyReview] = useState({
    replyText: "",
    date: today,
  });
  const [allReview, setAllReview] = useState([]);
  const [selectedUserReviewId, setSelectedUserReviewId] = useState(null);
  const [selectedAdminReplyId, setSelectedAdminReplyId] = useState(null);
  const [selectedReplyBox, setSelectedReplyBox] = useState(null);

  const handleShowUserAction = (id) => {
    setSelectedUserReviewId((prev) => (prev === id ? null : id));
  };

  const handleShowAdminAction = (id) => {
    setSelectedAdminReplyId((prev) => (prev === id ? null : id));
  };
  const handleReplyBox = (id) => {
    setSelectedReplyBox((prev) => (prev === id ? null : id));
  };

  const getAllReview = async () => {
    try {
      const res = await viewReview();
      if (res.success) {
        // console.log(res?.data);
        setAllReview(res?.data);
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.response?.data?.message);
    }
  };
  useEffect(() => {
    getAllReview();
  }, []);

  const handleReplyChange = (e) => {
    const { name, value } = e.target;
    setReplyReview((prev) => ({ ...prev, [name]: value }));
  };
  const handleReply = async (e, id) => {
    e.preventDefault();
    toast.dismiss();
    if (
      !token ||
      userDetails?.role !== "admin" ||
      !userDetails?.isAccountVerified
    ) {
      return toast.error("Only verified admins can reply to reviews!");
    }

    if (!replyReview.replyText) {
      return toast.error("Please write something on reply box");
    }

    try {
      const res = await sendReplyReview(id, replyReview);
      if (res.success) {
        toast.success(res?.message);
        setReplyReview({ replyText: "", date: today });
        getAllReview();
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
      console.log(err.message);
    }
  };

  const handleEdit = (review) => {
    navigate("/", { state: { review } });
  };

  const handleReviewDelete = async (id) => {
    const response = await Swal.fire({
      title: "Are you sure, you want to delete your review?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#49bb0f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#E2E8F0",
      scrollbarPadding: false,
      customClass: {
        popup: "text-base sm:text-lg md:text-xl",
        title: "text-xl sm:text-2xl md:text-3xl font-semibold",
        confirmButton:
          "text-sm sm:text-base md:text-lg bg-blue-600 text-white px-4 py-2 rounded",
        cancelButton:
          "text-sm sm:text-base md:text-lg bg-gray-400 text-white px-4 py-2 rounded",
      },
    });

    if (!response.isConfirmed) return;

    try {
      const deleteResponse = await deleteReview(id);
      if (deleteResponse.success) {
        toast.success(deleteResponse.message);
        setAllReview((prevReview) =>
          prevReview.filter((review) => review._id !== id)
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete review");
      console.error(
        "Error deleting review:",
        error?.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="flex flex-col p-4 gap-4 border-2 border-slate-100 shadow-md rounded-xl h-[90vh]">
      <h2 className="text-lg font-semibold text-gray-700 text-left">
        User Reviews ({allReview.length})
      </h2>
      {/*  review example */}
      <div className="  overflow-y-scroll scroll-container scroll-smooth">
        {allReview.map((singleReview, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center w-full"
          >
            <div className="relative flex flex-col gap-1 border-t border-gray-400 pt-4 text-left w-full">
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={singleReview.userId.profilepath || "/prof.webp"}
                    alt="profile"
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                  />
                  <h3 className="text-md font-semibold text-gray-800">
                    {singleReview.userId.username}
                  </h3>
                </div>
                {token &&
                  userDetails?.isAccountVerified &&
                  (userDetails?._id === singleReview?.userId?._id ||
                    isAdmin) && (
                    <button
                      type="button"
                      onClick={() => handleShowUserAction(singleReview._id)}
                    >
                      <HiOutlineDotsVertical size={15} />
                    </button>
                  )}

                <div
                  className={`${
                    selectedUserReviewId === singleReview._id ? "" : "hidden"
                  } absolute right-5 flex flex-col justify-center items-center gap-3 border border-slate-100 bg-gray-200 p-2 shadow-lg rounded-lg text-sm text-gray-500`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUserReviewId(null), handleEdit(singleReview);
                    }}
                    className="hover-supported:hover:text-[#5CAE59] active:text-[#5CAE59]"
                  >
                    Edit review
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUserReviewId(null),
                        handleReviewDelete(singleReview?._id);
                    }}
                    className="hover-supported:hover:text-red-500 active:text-red-500"
                  >
                    Delete review
                  </button>
                </div>
              </div>

              {/* Date + Stars */}
              <div className="flex items-center justify-between text-sm text-gray-500 mt-1 ">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) =>
                    star <= singleReview?.rating ? (
                      <AiFillStar key={star} size={16} />
                    ) : (
                      <AiOutlineStar key={star} size={16} />
                    )
                  )}
                </div>
                <span>{singleReview?.date}</span>
              </div>
              <p className="text-sm text-gray-600 ml-1 mt-2">
                {singleReview?.message}
              </p>

              {userDetails &&
                isAdmin &&
                userDetails?.isAccountVerified &&
                !singleReview?.reply?.text && (
                  <div className="flex flex-col justify-between items-center gap-2 py-5">
                    <div
                      onClick={() => handleReplyBox(singleReview?._id)}
                      className="flex justify-center items-center gap-2 cursor-pointer text-green-600"
                    >
                      <IoArrowRedoSharp />
                      <p>reply</p>
                    </div>
                    <form
                      onSubmit={(e) => handleReply(e, singleReview?._id)}
                      className={`w-full transition-all duration-500 ${
                        selectedReplyBox === singleReview._id ? "" : "hidden"
                      }`}
                    >
                      <div className="flex flex-col gap-2 items-start p-4 border-2 border-slate-100 shadow-md rounded-3xl">
                        <div className="flex justify-between items-start gap-4 w-full">
                          <textarea
                            maxLength={200}
                            name="replyText"
                            id="review"
                            placeholder="Write review reply here..."
                            value={replyReview.replyText}
                            onChange={handleReplyChange}
                            className="bg-transparent outline-none w-full resize-none text-sm text-gray-700"
                          />
                          <button
                            title="Submit Review Reply"
                            className="text-white bg-[#5CAE59] p-2 rounded-full hover:bg-[#4e9e4e] transition duration-200"
                          >
                            <MdSend size={20} />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
            </div>

            {/* review reply */}
            {singleReview?.reply && (
              <div className="relative flex flex-col gap-1 px-1  py-4 text-left shadow-sm border border-slate-100 w-full rounded-md my-5">
                <div className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/desktop.png"
                      alt="profile"
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                    />
                    <h3 className=" text-sm md:text-md font-semibold text-green-600">
                      Easy Study Zone{" "}
                      {token &&
                        userDetails?.isAccountVerified &&
                        isAdmin &&
                        `(${singleReview?.reply?.repliedBy?.name})`}
                    </h3>
                  </div>
                  <div className="flex justify-center items-center gap-3 text-sm text-gray-500">
                    <span>{singleReview?.reply?.repliedDate}</span>
                    {token && userDetails?.isAccountVerified && isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleShowAdminAction(singleReview._id)}
                      >
                        <HiOutlineDotsVertical size={15} />
                      </button>
                    )}
                    <div
                      className={`${
                        selectedAdminReplyId === singleReview._id
                          ? ""
                          : "hidden"
                      } absolute right-5 flex flex-col justify-center items-center gap-3 border border-slate-100 bg-gray-200 p-2 shadow-lg rounded-lg`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedAdminReplyId(null)}
                        className="hover-supported:hover:text-[#5CAE59] active:text-[#5CAE59]"
                      >
                        Edit reply
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedAdminReplyId(null)}
                        className="hover-supported:hover:text-red-500 active:text-red-500"
                      >
                        Delete reply
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-2">
                  <p className="text-sm text-gray-600 ml-1 mt-2">
                    {singleReview?.reply?.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
