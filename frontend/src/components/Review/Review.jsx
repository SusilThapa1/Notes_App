import { MdSend } from "react-icons/md";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useEffect, useRef, useState, useContext } from "react";
import { toast } from "react-toastify";
import {
  addReview,
  updateReview,
  viewReview,
} from "../../../Services/reviewService";
import ReviewList from "./ReviewList";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Review = ({ existingReview }) => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "/");
  const navigate = useNavigate();
  const reviewFormRef = useRef(null);
  const { userDetails } = useContext(AuthContext);

  const [allReview, setAllReview] = useState([]);
  const [review, setReview] = useState({
    rating: existingReview?.rating || 0,
    message: existingReview?.message || "",
    date: today,
    _id: existingReview?._id || "",
  });

  const [initialReview, setInitialReview] = useState({
    rating: existingReview?.rating || 0,
    message: existingReview?.message || "",
  });

  useEffect(() => {
    if (existingReview && reviewFormRef.current) {
      const newReview = {
        rating: existingReview?.rating || 0,
        message: existingReview?.message || "",
        date: today,
        _id: existingReview?._id || "",
      };
      setReview(newReview);
      setInitialReview({
        rating: newReview.rating,
        message: newReview.message,
      });
      setTimeout(() => {
        reviewFormRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
    }
  }, [existingReview]);

  const handleRating = (star) =>
    setReview((prev) => ({ ...prev, rating: star }));
  const handleChange = (e) =>
    setReview((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleReview = async (e) => {
    e.preventDefault();
    toast.dismiss();
    if (!review.rating || !review.message)
      return toast.error("Please rate and write something!");
    if (!userDetails?.isAccountVerified) navigate("/signin");

    try {
      const res = review._id
        ? await updateReview(review._id, review)
        : await addReview(review);
      if (res.success) {
        toast.success(res.message);
        setReview({ rating: 0, message: "", date: today, _id: "" });
        setInitialReview({ rating: 0, message: "" });
        getAllReview();
      } else toast.error(res.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const getAllReview = async () => {
    try {
      const res = await viewReview();
      if (res.success) setAllReview(res.data);
      else toast.error(res.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    getAllReview();
  }, []);
  const isReviewUnchanged =
    review.rating === initialReview.rating &&
    review.message === initialReview.message;

  return (
    <div ref={reviewFormRef} className="w-full bg-transparent text-center">
      <div className="flex flex-col gap-6 py-10 mx-auto max-w-4xl ">
        <h1 className="text-2xl md:text-3xl text-lightGreen font-bold ">
          Share Your Thoughts and Experience
        </h1>
        <p className="text-subTextLight dark:text-subTextDark text-sm md:text-base">
          Drop a review and let others know what you think about this website!
        </p>

        <form
          onSubmit={handleReview}
          className="w-full dark:bg-gray-900 shadow-md rounded-3xl"
        >
          <div className="flex flex-col gap-2 items-start p-4 border-2 border-slate-100 dark:border-gray-600  rounded-3xl">
            <h1 className="text-subTextLight dark:text-subTextDark text-sm font-medium">
              Rate this website
            </h1>
            <div className="flex gap-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) =>
                star <= review.rating ? (
                  <AiFillStar
                    key={star}
                    size={15}
                    className="cursor-pointer"
                    onClick={() => handleRating(star)}
                  />
                ) : (
                  <AiOutlineStar
                    key={star}
                    size={15}
                    className="cursor-pointer"
                    onClick={() => handleRating(star)}
                  />
                )
              )}
            </div>
            <div className="flex justify-between items-start gap-4 w-full">
              <textarea
                maxLength={200}
                name="message"
                id="review"
                placeholder="Write your review here..."
                value={review.message}
                onChange={handleChange}
                className="bg-transparent w-full resize-none scroll-container text-sm text-textLight dark:text-textDark"
              />
              <button
                title="Submit Review"
                disabled={isReviewUnchanged}
                className={`text-white p-2 rounded-full transition duration-200 ${
                  isReviewUnchanged
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-lightGreen hover-supported:hover:bg-darkGreen"
                }`}
              >
                <MdSend className="text-sm md:text-lg" />
              </button>
            </div>
          </div>
        </form>

        <ReviewList
          allReview={allReview}
          setAllReview={setAllReview}
          getAllReview={getAllReview}
        />
      </div>
    </div>
  );
};

export default Review;
