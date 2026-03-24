import { User, Mail, CalendarDays, RefreshCcw } from "lucide-react";
import { Image as ImageIcon } from "lucide-react"; // ← rename
import { useState } from "react";
import useAuthStore from "../stores/UseAuthStore";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();

  const [updateUser, setUpdateUser] = useState({
    fullname: authUser.fullname,
    profilePicture: authUser.profilePicture,
    email: authUser.email,
  });

  const date = new Date(authUser.createdAt);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 500; // max width/height in pixels
        let width = img.width;
        let height = img.height;

        // scale down if too large
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // convert to base64 with compression (0.7 = 70% quality)
        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        setUpdateUser({ ...updateUser, profilePicture: compressed });
      };
    };
  };

  return (
    <div className="flex h-full items-center justify-center p-4">
      {/* Left side */}
      {/* Form */}
      <div className="card bg-base-200 p-5 w-full max-w-lg h-auto shadow-2xl">
        <div className="card-body flex flex-col items-center justify-center">
          <div>
            <h1 className="text-3xl font-bold text-center pb-4">
              Edit Your Profile
            </h1>
          </div>
          <div className="form-control">
            <label className="label  py-1"></label>
            <div className="relative flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="profilePicture"
                onChange={handleImage}
              />
              <label
                htmlFor="profilePicture"
                className="cursor-pointer relative group"
              >
                <img
                  src={
                    updateUser.profilePicture ||
                    authUser?.profilePicture ||
                    "/avatar.png"
                  }
                  className="w-36 h-36 rounded-full object-cover border-2 border-primary"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-75 transition-opacity">
                  <div className="flex flex-col items-center gap-1">
                    <ImageIcon className="size-5 text-white" />
                    <p className="text-center px-2 text-white text-md font-medium">
                      Change Profile Picture
                    </p>
                  </div>
                </div>
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Click on the image to change
            </p>
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium flex flex-row items-center justify-center gap-1">
                <User className="size-4" />
                <span className="text-sm">Full Name</span>
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={updateUser.fullname}
                placeholder={authUser?.fullname || ""}
                onChange={(e) =>
                  setUpdateUser({ ...updateUser, fullname: e.target.value })
                }
                className="input input-bordered w-full bg-base-100"
              />
            </div>
          </div>
          <div className="form-control w-full pt-2">
            <div className="flex flex-row items-start gap-2 w-full">
              <div className="flex items-center gap-1">
                <Mail className="size-4 inline-block" />
                <p className="pr-2">Email Address:</p>
                <p className="">{authUser?.email}</p>
              </div>
            </div>
            <div className="pt-5">
              <button
                className="btn w-full btn-primary"
                onClick={() =>
                  updateProfile(updateUser.fullname, updateUser.profilePicture)
                }
                disabled={isUpdatingProfile}
              >
                Save Changes
              </button>
            </div>
          </div>
          <div className="divider"></div>
          <div className="flex flex-col items-start gap-2 w-full">
            <div className="flex  items-center gap-2">
              <CalendarDays className="size-4 inline-block" />
              <p>Member since:</p>
              <p>
                {date.toLocaleString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center  gap-2">
              <RefreshCcw className="size-4 inline-block" />
              <p>Account status:</p>
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              <span className="">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
