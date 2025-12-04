"use client";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface Props {
  toggleConfirmPassword?: boolean;
  setToggleConfirmPassword?: (value: boolean) => void;
}

function PasswordView({ toggleConfirmPassword, setToggleConfirmPassword }: Props) {
  return (
    <div className="absolute inset-y-0 top-5 right-3 flex items-center cursor-pointer">
      {toggleConfirmPassword ? (
       
        <FaRegEye
          className="w-5 h-5"
          onClick={() => setToggleConfirmPassword?.(!toggleConfirmPassword)}
        />
      ) : (
         <FaRegEyeSlash
          className="w-5 h-5"
          onClick={() => setToggleConfirmPassword?.(!toggleConfirmPassword)}
        />
        
      )}
    </div>
  );
}

export default PasswordView;
