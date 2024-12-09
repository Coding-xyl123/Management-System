"use client";

import Link from "next/link";
import React, { FC } from "react";
import { BiSearch } from "react-icons/bi";
import Image from "next/image";

type Props = {};

const Hero: FC<Props> = () => {
  return (
    <div className="w-full 1000px:flex items-center">
      <div className="absolute top-[100px]:top-[unset] 1500px: h-[700px] 1500px::w-[600px] 1100px:w-[600px] h-[50vh] w-[50vh] hero_animation row-auto">
        <Image
          src="../assests/banner-img-1.png"
          alt="hero"
          className="object-contain 1500px: max-w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]"
          layout="fill"
        />
      </div>
      <div className="1000px: w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]">
        <h2 className="dark: text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[70px] font-[600] font-Josefin py-2 1000px:leading-[75px] 1500px:w-[80%]">
          Welcome to the Management System
        </h2>
        <br />
        <p className="dark: text-[#edfff4] text-[#000000c7]  font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[78%]">
          We provide you with the best management system to manage your
          employees, projects, and tasks. Our system is easy to use and provides
          you with the best experience.
        </p>
        <br />
        <br />
        <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] h-[50px] bg-transparent relative">
          <input
            type="search"
            placeholder="Search for anything"
            className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e]  dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin"
          />
          <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-50[px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]">
            <BiSearch className="text-white" size={30} />
          </div>
        </div>
        <br />
        <br />
        <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] flex items-center">
          <Image
            src="https://edmy-react.hibootstrap.com/images/banner/client-3.jpg"
            alt=""
            className="rounded-full"
            width={50}
            height={50}
          />
          <Image
            src="https://edmy-react.hibootstrap.com/images/banner/client-1.jpg"
            alt=""
            className="rounded-full ml-[-20px]"
            width={50}
            height={50}
          />
          <Image
            src="https://edmy-react.hibootstrap.com/images/banner/client-2.jpg"
            alt=""
            className="rounded-full ml-[-20px]"
            width={50}
            height={50}
          />
          <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[18px] font-[600]">
            and many more...{" "}
            <Link
              href="/courses"
              className="dark:text-[#46e256] text-[crimson]"
            ></Link>{" "}
          </p>
        </div>
        <br />
        <br />
      </div>
    </div>
  );
};

export default Hero;
