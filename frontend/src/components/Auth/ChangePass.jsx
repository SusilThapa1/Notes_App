import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
const ChangePass = () => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="flex flex-col gap-5 justify-center items-center h-screen-minus-64 w-full">
      <h1 className="font-semibold text-lg text-center text-green-700">
        Please enter your old and new passwords below
      </h1>
      <div className="bg-transparent border-2 border-gray-200 shadow-[0_5px_10px_rgb(0,0,0,0.2)] rounded-lg w-[90%] md:w-[60%] p-5 ">
        <form className="flex flex-col justify-center items-start w-full gap-3 font-mono">
          <label htmlFor="oldpass">Old Password</label>
          <input
            type={showPass ? "text" : "password"}
            name="oldpass"
            id="oldpass"
            className="w-full outline-none bg-transparent p-2 border-2 border-x-yellow-50 rounded-lg shadow-md"
          />
          <label htmlFor="newpass">New Password</label>
          <input
            type={showPass ? "text" : "password"}
            name="newpass"
            id="newpass"
            className="w-full outline-none bg-transparent p-2 border-2 border-x-yellow-50 rounded-lg shadow-md"
          />
          <label htmlFor="confirmpass">Re-type New Password</label>
          <input
            type={showPass ? "text" : "password"}
            name="confirmpass"
            id="confirmpass"
            className="w-full outline-none bg-transparent p-2 border-2 border-x-yellow-50 rounded-lg shadow-md"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show"
              checked={showPass}
              onChange={(e) => setShowPass(e.target.checked)}
              className="w-5 h-5 accent-green-600    rounded-md shadow-xl  focus:outline-none"
            />
            <label
              htmlFor="show"
              className={`${showPass ? "text-green-600" : ""}`}
            >
              Show password
            </label>
          </div>
          <div className=" flex w-full justify-between items-center">
            <Link className="text-blue-500 hover:underline ">
              Forgot password?
            </Link>
            <button className="outline-none bg-transparent py-2 px-3 border-2 border-gray-200 rounded-lg shadow-md">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePass;
