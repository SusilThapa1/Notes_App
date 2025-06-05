import { MdSend } from "react-icons/md";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { addReview, updateReview } from "../../../Services/reviewService";
import ReviewList from "./ReviewList";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Review = ({ existingReview }) => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "/");
  const navigate = useNavigate();
  const reviewFormRef = useRef(null);
  const { userDetails, token } = useContext(AuthContext);

  const [review, setReview] = useState({
    rating: existingReview.rating || 0,
    message: existingReview.message || "",
    date: today,
    _id: existingReview._id || "",
  });

  useEffect(() => {
    if (existingReview && reviewFormRef.current) {
      setReview({
        rating: existingReview.rating || 0,
        message: existingReview.message || "",
        date: today,
        _id: existingReview._id || "",
      });
      reviewFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [existingReview]);

  const handleRating = (star) => {
    setReview((prev) => ({ ...prev, rating: star }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleReview = async (e) => {
    e.preventDefault();
    toast.dismiss();
    if (!review.rating || !review.message) {
      return toast.error("Please rate first and write something before submit");
    }
    if (!token && !userDetails?.isAccountVerified) {
      return toast.error("Please login or verify your account (if not) !");
    }
    try {
      if (review._id) {
        const res = await updateReview(review._id, review);
        if (res.success) {
          navigate("/", { replace: true });
          toast.success(res?.message);
          setReview({ rating: 0, message: "", date: today, _id: "" });
        } else [toast.error(res?.message)];
      } else {
        const res = await addReview(review);
        if (res.success) {
          toast.success(res?.message);
          setReview({ rating: 0, message: "", date: today });
        } else {
          toast.error(res?.message);
        }
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div
      ref={reviewFormRef}
      className="w-full pb-10 px-5 md:px-10 lg:px-20 bg-transparent text-center"
    >
      <div className="flex flex-col gap-6 py-10 mx-auto max-w-4xl">
        <h1 className="text-2xl md:text-3xl text-[#5CAE59] font-bold">
          Ratings and Reviews
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Drop a review and let others know what you think about this website !
        </p>

        {/* Review Input Form */}

        {
          <form onSubmit={handleReview} className="w-full">
            <div className="flex flex-col gap-2 items-start p-4 border-2 border-slate-100 shadow-md rounded-3xl">
              <h1 className="text-gray-600 text-sm font-medium">
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
                  className="bg-transparent outline-none w-full resize-none text-sm text-gray-700"
                />
                <button
                  title="Submit Review"
                  className="text-white bg-[#5CAE59] p-2 rounded-full hover:bg-[#4e9e4e] transition duration-200"
                >
                  <MdSend className="text-sm md:text-lg" />
                </button>
              </div>
            </div>
          </form>
        }

        {/* Reviews Display */}
        <ReviewList />
      </div>
    </div>
  );
};

export default Review;
