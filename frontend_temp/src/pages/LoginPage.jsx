import { MessageCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import useAuthStore from "../stores/UseAuthStore";

const IMAGES = [
  "https://res.cloudinary.com/du5jeewxn/image/upload/v1773279241/a03cd5de-8ecc-4e76-ab95-ca647bc95a79_kyhhnr.jpg",
  "https://res.cloudinary.com/du5jeewxn/image/upload/v1773278813/f17b68c0-0106-45d4-b843-dbe402081bc4_zpbrn9.jpg",
  "https://res.cloudinary.com/du5jeewxn/image/upload/v1773278817/5ee1f0a6-0413-43a5-9ecc-caef78ae2a5a_z51zrq.jpg",
  "https://res.cloudinary.com/du5jeewxn/image/upload/v1774304147/tonin_bdag9b.jpg",
  "https://res.cloudinary.com/du5jeewxn/image/upload/v1773278836/fee8aab6-0cc7-4335-8154-dff0c145340f_agd8el.jpg",
  "https://res.cloudinary.com/du5jeewxn/image/upload/v1773278834/297109a2-451e-4f3f-a78b-2de12310c4a4_se74ai.jpg",
  "https://res.cloudinary.com/du5jeewxn/image/upload/v1773278825/823207d2-75fd-4fb2-b1c6-a20a160123de_wovq8p.jpg",
  "https://res.cloudinary.com/du5jeewxn/image/upload/v1773278820/8220395d-d176-4d37-919a-3de25dac777a_uzpxkh.jpg",
  "https://res.cloudinary.com/du5jeewxn/image/upload/v1773278798/4a3d618e-7a4f-4275-b965-ea927bf973f8_fxdlt3.jpg",
];

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { isloginIn, loginIn } = useAuthStore();

  const manageLogin = async () => {
    await loginIn(user.email, user.password);
  };

  return (
    <div className="flex h-full items-center justify-center">
      {/* Left side */}
      <div className="flex flex-1 flex-col items-center justify-center h-full px-8">
        {/* Logo */}
        <div className="flex flex-row items-center justify-center gap-2 mb-4">
          <MessageCircle className="size-8 text-primary" />
          <p className="font-bold text-base">VibeChat</p>
        </div>

        {/* Header */}
        <div className="mb-4 flex items-center flex-col justify-center">
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="text-base text-base-content/60 mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-sm space-y-3">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full pl-10"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full pl-10"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <button
                type="button"
                disabled={isloginIn}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              className="btn btn-primary w-2/3 transition-all duration-200 hover:shadow-lg hover:scale-105 hover:bg-primary hover:border-primary"
              onClick={manageLogin}
              disabled={isloginIn}
            >
              Log In
            </button>
          </div>

          <p className="text-center text-sm  pt-1">
            Don't have an account?{" "}
            <a href="/signup" className="link link-secondary">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-base-200 h-full gap-6">
        <div className="text-center text-sm mb-4">
          <p className="text text-3xl font-bold">Nice to See You Again!</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {IMAGES.map((url, i) => (
            <img
              key={i}
              src={url}
              className="w-28 h-28 rounded-2xl object-cover"
            />
          ))}
        </div>
        <div className="text-center  mt-4">
          <p className="text-lg text-base-content/60 w-full mx-auto">
            Your crew is waiting for you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
