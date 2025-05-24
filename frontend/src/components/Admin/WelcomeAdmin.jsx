import React, { useContext, useEffect, useState } from "react";
import {
  AiOutlineFileAdd,
  AiOutlineFileText,
  AiOutlineUpload,
} from "react-icons/ai";
import { AuthContext } from "../Context/AuthContext";

const WelcomeAdmin = () => {
  const { user, greeting } = useContext(AuthContext);
  console.log(user);

  return (
    <div className="flex flex-col items-center  scroll-container  w-full text-black py-8    overflow-y-scroll  bg-transparent mx-auto h-[calc(100vh-210px)] md:h-[calc(100vh-60px)]">
      <div className="flex flex-col justify-center items-center gap-2 text-justify md:text-center mb-8">
        <div className="flex flex-col gap-5 justify-center items-center text-[5vw] md:text-3xl text-center font-bold mb-4    text-[#5CAE59]">
          <h1>
            {user?.username
              ? `${greeting}, ${user.username.split(" ")[0]}!`
              : ""}
          </h1>
          <p>Welcome to the Admin Panel</p>
        </div>
        <div className="mx-auto flex flex-col justify-center items-center">
          <p className="text-lg mb-6">
            Manage your programmes, semesters, content, and resources easily and
            efficiently.
          </p>
          <p className="text-lg max-w-lg mb-8">
            As the administrator, you have full control to add new programmes,
            semesters, upload educational resources, and manage notes.
          </p>
        </div>
      </div>

      {/* Admin Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Add Notes Card */}
        <div className=" bg-transparent p-6 rounded-2xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]    flex flex-col items-center justify-center text-center ">
          <AiOutlineFileAdd className="text-blue-500 w-12 h-12 mb-4 " />
          <h3 className="text-xl font-semibold mb-2 text-[#5CAE59]">
            Add Notes
          </h3>
          <p className="text-gray-600">Create and store new notes easily.</p>
        </div>

        {/* Manage Notes Card */}
        <div className=" bg-transparent p-6 rounded-2xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]   flex flex-col items-center justify-center text-center ">
          <AiOutlineFileText className="text-yellow-500 w-12 h-12 mb-4 " />
          <h3 className="text-xl font-semibold mb-2 text-[#5CAE59]">
            Manage Notes
          </h3>
          <p className="text-gray-600">Edit, organize, and delete notes.</p>
        </div>

        {/* Upload Files Card */}
        <div className=" bg-transparent p-6 rounded-2xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]   flex flex-col items-center justify-center text-center ">
          <AiOutlineUpload className="text-red-500 w-12 h-12 mb-4 " />
          <h3 className="text-xl font-semibold mb-2 text-[#5CAE59]">
            Upload Resources Link
          </h3>
          <p className="text-gray-600">
            Upload resources and other learning materials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAdmin;
