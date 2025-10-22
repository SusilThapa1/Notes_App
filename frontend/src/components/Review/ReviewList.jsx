import { useContext, useState } from "react";
import { MdSend } from "react-icons/md";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoArrowRedoSharp } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  deleteReplyReview,
  deleteReview,
  sendReplyReview,
  editReplyReview,
} from "../../../Services/reviewService";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { showConfirm, showError } from "../../../Utils/alertHelper";

const ReviewList = ({ allReview, setAllReview, getAllReview }) => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "/");
  const navigate = useNavigate();
  const { userDetails } = useContext(AuthContext);
  const isAdmin = userDetails?.role === "admin";

  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [replyReview, setReplyReview] = useState({
    replyText: "",
    date: today,
  });
  const [selectedUserReviewId, setSelectedUserReviewId] = useState(null);
  const [selectedAdminReplyId, setSelectedAdminReplyId] = useState(null);
  const [selectedReplyBox, setSelectedReplyBox] = useState(null);

  const ownReview = allReview.find(
    (user) => user?.userId?._id === userDetails?._id
  );
  const otherReview = allReview.filter(
    (review) => review?.userId?._id !== userDetails?._id
  );

  const handleShowUserAction = (id) =>
    setSelectedUserReviewId((prev) => (prev === id ? null : id));
  const handleShowAdminAction = (id) =>
    setSelectedAdminReplyId((prev) => (prev === id ? null : id));
  const handleReplyBox = (id) =>
    setSelectedReplyBox((prev) => (prev === id ? null : id));
  const handleReplyChange = (e) =>
    setReplyReview((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleReply = async (e, id) => {
    e.preventDefault();
    toast.dismiss();
    if (userDetails?.role !== "admin" || !userDetails?.isAccountVerified) {
      return toast.error("Only verified admins can reply to reviews!");
    }
    if (!replyReview.replyText)
      return toast.error("Please write something on reply box");

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

  const handleReplyEdit = async (e, id) => {
    e.preventDefault();
    toast.dismiss();
    if (!editReplyText.trim()) return toast.error("Reply cannot be empty");

    try {
      const res = await editReplyReview(id, {
        replyText: editReplyText,
        date: today,
      });
      if (res.success) {
        toast.success(res.message);
        setEditingReplyId(null);
        setEditReplyText("");
        getAllReview();
      } else toast.error(res.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (review) => navigate("/", { state: { review } });

  const handleReviewDelete = async (id) => {
    const response = await showConfirm({
      text: "You won't be able to revert this!",
    });
    if (!response.isConfirmed) return;

    try {
      const deleteResponse = await deleteReview(id);
      if (deleteResponse.success) {
        toast.success(deleteResponse.message);
        setAllReview((prev) => prev.filter((review) => review._id !== id));
      } else showError({ text: deleteResponse?.message });
    } catch (error) {
      showError({
        text: error?.response?.data?.message || "Failed to delete review",
      });
      console.error(
        "Error deleting review:",
        error?.response?.data?.message || error.message
      );
    }
  };

  const handleReviewReplyDelete = async (id) => {
    const response = await showConfirm({
      text: "You won't be able to revert this!",
    });
    if (!response.isConfirmed) return;

    try {
      const deleteResponse = await deleteReplyReview(id);
      if (deleteResponse.success) {
        toast.success(deleteResponse.message);
        getAllReview();
      } else showError({ text: deleteResponse?.message });
    } catch (error) {
      showError({
        text: error?.response?.data?.message || "Failed to delete review",
      });
      console.error(
        "Error deleting reply:",
        error?.response?.data?.message || error.message
      );
    }
  };

  const renderReviewCard = (review, isOwn) => (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="relative flex flex-col gap-1 border-t border-gray-400 dark:border-gray-600 pt-4 text-left w-full ">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <img
              loading="lazy"
              src={
                review?.userId?.profilepath
                  ? `${import.meta.env.VITE_API_FILE_URL}${
                      review?.userId?.profilepath
                    }`
                  : "/profile.png"
              }
              alt="profile"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            />
            <h3
              className={`text-md font-semibold ${
                isOwn
                  ? "text-gray-800 dark:text-gray-200"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {review?.userId?.username}
              {isOwn ? " (You)" : ""}
            </h3>
          </div>

          {userDetails?.isAccountVerified &&
            (userDetails?._id === review?.userId?._id || isAdmin) && (
              <HiOutlineDotsVertical
                onClick={() => handleShowUserAction(review._id)}
                size={15}
                className="text-gray-500 dark:text-gray-300"
              />
            )}

          <div
            className={`${
              selectedUserReviewId === review._id ? "" : "hidden"
            } absolute right-5 flex flex-col justify-center items-center gap-3 border border-slate-100 dark:border-gray-600 bg-gray-200 dark:bg-dark p-2 shadow-lg dark:shadow-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-300`}
          >
            <button
              type="button"
              aria-label="edit review"
              onClick={() => {
                setSelectedUserReviewId(null);
                handleEdit(review);
              }}
              className="hover-supported:hover:text-lightGreen active:text-lightGreen"
            >
              Edit review
            </button>
            <button
              type="button"
              aria-label="delete review"
              onClick={() => {
                setSelectedUserReviewId(null);
                handleReviewDelete(review?._id);
              }}
              className="hover-supported:hover:text-red-500 active:text-red-500"
            >
              Delete review
            </button>
          </div>
        </div>

        {/* Date + Stars */}
        <div className="flex items-center gap-5 text-sm text-gray-500 dark:text-gray-400 mt-1">
          <div className="flex items-center gap-1 text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) =>
              star <= review?.rating ? (
                <AiFillStar key={star} size={16} />
              ) : (
                <AiOutlineStar key={star} size={16} />
              )
            )}
          </div>
          <span>{review?.date}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 ml-1 mt-2 pb-3">
          {review?.message}
        </p>

        {/* Admin reply box */}
        {userDetails &&
          isAdmin &&
          userDetails?.isAccountVerified &&
          !review?.reply?.text && (
            <div className="flex flex-col justify-between items-center gap-2 py-5">
              <div
                onClick={() => handleReplyBox(review?._id)}
                className="flex justify-center items-center gap-2 cursor-pointer text-lightGreen"
              >
                <IoArrowRedoSharp />
                <p>reply</p>
              </div>
              <form
                onSubmit={(e) => handleReply(e, review?._id)}
                className={`w-full transition-all duration-500 ${
                  selectedReplyBox === review._id ? "" : "hidden"
                }`}
              >
                <div className="flex flex-col gap-2 items-start p-4 border-2 border-slate-100 dark:border-gray-600 shadow-md dark:shadow-gray-700 rounded-3xl">
                  <div className="flex justify-between items-start gap-4 w-full">
                    <textarea
                      maxLength={200}
                      name="replyText"
                      placeholder="Write review reply here..."
                      value={replyReview.replyText}
                      onChange={handleReplyChange}
                      className="bg-transparent w-full resize-none text-sm text-gray-700 dark:text-gray-200"
                    />
                    <button
                      title="Submit Review Reply"
                      className="text-white bg-lightGreen p-2 rounded-full hover-supported:hover:bg-darkGreen transition duration-200"
                    >
                      <MdSend size={20} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

        {/* Admin reply rendering */}
        {review?.reply && (
          <div className="relative flex flex-col gap-1 px-1 py-4 text-left shadow-sm border border-slate-100 dark:border-gray-700 w-full rounded-md my-5">
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <img
                  loading="lazy"
                  src="/images/desktop.png"
                  alt="profile"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                />
                <h3 className="text-sm md:text-md font-semibold text-lightGreen">
                  Easy Study Zone{" "}
                  {userDetails?.isAccountVerified &&
                    isAdmin &&
                    `(${review?.reply?.repliedBy?.name})`}
                </h3>
              </div>
              <div className="flex justify-center items-center gap-3 text-sm text-gray-500 dark:text-gray-300">
                <span>{review?.reply?.repliedDate}</span>
                {userDetails?.isAccountVerified && isAdmin && (
                  <HiOutlineDotsVertical
                    size={15}
                    onClick={() => handleShowAdminAction(review._id)}
                  />
                )}
                <div
                  className={`${
                    selectedAdminReplyId === review._id ? "" : "hidden"
                  } absolute right-5 flex flex-col justify-center items-center gap-3 border border-slate-100 dark:border-gray-600 bg-gray-200 dark:bg-dark p-2 shadow-lg dark:shadow-gray-700 rounded-lg`}
                >
                  <button
                    type="button"
                    aria-label="edit reply"
                    onClick={() => {
                      setEditReplyText(review?.reply?.text);
                      setSelectedAdminReplyId(null);
                      setEditingReplyId(review._id);
                    }}
                    className="hover-supported:hover:text-lightGreen active:text-lightGreen"
                  >
                    Edit reply
                  </button>
                  <button
                    type="button"
                    aria-label="delete reply"
                    onClick={() => {
                      setSelectedAdminReplyId(null);
                      handleReviewReplyDelete(review?._id);
                    }}
                    className="hover-supported:hover:text-red-500 active:text-red-500"
                  >
                    Delete reply
                  </button>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 ml-1 mt-2">
              {review?.reply?.text}
            </p>

            {/* Edit reply form */}
            {editingReplyId === review._id && (
              <form
                onSubmit={(e) => handleReplyEdit(e, review._id)}
                className="w-full mt-2"
              >
                <div className="flex items-start gap-2 border-2 p-3 rounded-xl border-slate-100 dark:border-gray-600 shadow-md dark:shadow-gray-700">
                  <textarea
                    name="replyText"
                    value={editReplyText}
                    onChange={(e) => setEditReplyText(e.target.value)}
                    maxLength={200}
                    className="w-full resize-none bg-transparent text-sm text-gray-700 dark:text-gray-200"
                  />
                  <button
                    type="submit"
                    className="bg-lightGreen text-white p-2 rounded-full"
                    title="Save edited reply"
                  >
                    <MdSend size={20} />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col p-4 gap-4 border-2 border-slate-100 dark:border-gray-700   rounded-xl max-h-[90vh]  dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 text-left">
        User Reviews ({allReview.length})
      </h2>
      <div className="overflow-y-scroll scroll-container scroll-smooth">
        {ownReview && renderReviewCard(ownReview, true)}
        {otherReview.map((review, index) => (
          <div key={index}>{renderReviewCard(review, false)}</div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
