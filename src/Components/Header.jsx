import React from "react";
import { Link } from "react-router-dom";
function Header({text , path}){
    return(
        <div className="bg-blue-500 text-white xl:h-[70px] lg:h-[70px] md:h-[70px] sm:h-[70px] h-[40px] flex justify-between items-center">
        <div>
            <h1 className="sm:text-[2xl] md:text-[30px] lg:text-[32px] xl:text-[32px] px-3 font-semibold">Islamic Desk</h1>
        </div>
        <div className="flex justify-center items-center mr-5">
            <Link to={path} className="lg:text-[20px] sm:text-[15px] md:text-[20px] xl:text-[20px] text-[6px] lg:py-5 md:py-5 xl:py-5 lg:h-[30px] xl:h-[30px] sm:h-[20px] h-[14px] md:h-[30px] flex justify-center items-center px-4 bg-blue-900">{text}</Link>
        </div>
        </div>
    )
}

export default Header;