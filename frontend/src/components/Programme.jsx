import React from "react";
import BIT from "./assets/BIT.png";
import BCA from "./assets/BCA.png";
import BCE from "./assets/BCE.png";
import BBA from "./assets/BBA.png";
import { Link, useParams } from "react-router-dom";

const Programme = () => {
  const { category } = useParams();
  const programs = [
    {
      programme: "Bachelor of Information Technology (BIT)",
      link: `/${category}/bit`,
      image: BIT,
    },
    {
      programme: "Bachelor of Computer Application (BCA)",
      link: `/${category}/bca`,
      image: BCA,
    },
    {
      programme: "Bachelor of Civil Engineering (BCE)",
      link: `/${category}/be-civil`,
      image: BCE,
    },
    {
      programme: "Bachelor of Business Administration (BBA)",
      link: `/${category}/bba `,
      image: BBA,
    },
  ];

  return (
    <div className="mt-24 py-3 mb-10  px-5   flex flex-col justify-center items-center gap-10  md:px-10 lg:px-20">
      <h1 className="text-xl md:text-[2.5vw] text-center font-bold">
        Purbanchal University (BIT, BCA, BE Civil, BBA){" "}
        <span className="capitalize">{category}</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-center py-5">
        {programs.map((program, key) => (
          <div
            key={key}
            className="border border-gray-500 shadow-xl rounded-lg flex flex-col justify-start items-center gap-3 pb-3"
          >
            <img src={program.image} className="object-cover rounded-t-lg" />

            <Link to={program.link} className="text-xl font-bold text-center">
              {program.programme}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programme;
