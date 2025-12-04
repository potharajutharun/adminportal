import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { BsTwitterX } from "react-icons/bs";
import SocialButton from "./SocialButton";
import { oauthRedirect } from "../lib/apis/authApi";

function Sociallogins() {
  return (
    <div className="mt-6 grid gap-3">
      <SocialButton
        label="Continue with Google"
        onClick={() => oauthRedirect("google")}
        icon={<FcGoogle className="text-2xl" />}
        className="border hover:underline"
      />
      <SocialButton
        label="Continue with Facebook"
        onClick={() => oauthRedirect("facebook")}
        icon={<SiFacebook className=" text-blue-900 text-2xl" />}
        className="border hover:underline "
      />
      <SocialButton
        label="Continue with X (Twitter)"
        onClick={() => oauthRedirect("x")}
        icon={<BsTwitterX className="text-xl" />}
        className="border hover:underline"
      />
    </div>
  );
}

export default Sociallogins;
