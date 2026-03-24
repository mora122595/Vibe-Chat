import React from "react";
import useThemeStore from "../stores/UseThemeStore";
import { Send, ImagePlus } from "lucide-react";

const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

const valeria =
  "https://res.cloudinary.com/du5jeewxn/image/upload/v1774316742/vale_j6dqaa.jpg";

const eduardo =
  "https://res.cloudinary.com/du5jeewxn/image/upload/v1773278798/4a3d618e-7a4f-4275-b965-ea927bf973f8_fxdlt3.jpg";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going? 👋", senderName: "Eduardo Mora" },
  {
    id: 2,
    content: "Pretty good! Just vibing 😎",
    receiverName: "Valeria Mtz",
  },
  {
    id: 3,
    content: "Nice! Any plans for the weekend?",
    senderName: "Eduardo Mora",
  },
  {
    id: 4,
    content: "Thinking about a road trip 🚗",
    receiverName: "Valeria Mtz",
  },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex flex-col lg:flex-row lg:h-full p-6 gap-6">
      {/* Left - themes 2/3 */}
      <div className="flex-[2] overflow-y-auto order-1 max-h-80 lg:max-h-full">
        <h1 className="text-2xl font-bold mb-6">Theme Settings</h1>
        <p className="mb-6 text-md">Choose your favorite theme for VibeChat</p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 items-center pl-1 pr-1">
          {THEMES.map((t) => (
            <div
              key={t}
              className={`border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline outline-2 outline-offset-2 cursor-pointer transition-all
              ${theme === t ? "outline-base-content" : "outline-transparent"}`}
              onClick={() => setTheme(t)}
            >
              <div
                className="bg-base-100 text-base-content w-full font-sans"
                data-theme={t}
              >
                <div className="grid grid-cols-5 grid-rows-3">
                  <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
                  <div className="bg-base-300 col-start-1 row-start-3"></div>
                  <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                    <div className="font-bold text-sm">{t}</div>
                    <div className="flex flex-wrap gap-1">
                      {[
                        "bg-primary",
                        "bg-secondary",
                        "bg-accent",
                        "bg-neutral",
                      ].map((color) => (
                        <div
                          key={color}
                          className={`${color} flex aspect-square w-5 items-center justify-center rounded lg:w-6`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-[1] order-2 border-t lg:border-t-0 lg:border-l border-base-300 pt-6 lg:pt-0 lg:pl-10 lg:pr-6">
        <h1 className="text-2xl font-bold mb-6 text-center">PREVIEW</h1>
        <div>
          <div className="bg-base-200 rounded-xl p-6 w-full">
            <div className="flex flex-col justify-start items-start">
              <div className="flex items-center gap-3">
                <img
                  src={valeria}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="avatar"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">
                    {PREVIEW_MESSAGES[1].receiverName}
                  </p>
                  <p className="text-sm">Online</p>
                </div>
              </div>
            </div>

            <div className="divider"></div>
            <div className="chat chat-start w-full ">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src={eduardo}
                  ></img>
                </div>
              </div>
              <div className="chat-header">
                {PREVIEW_MESSAGES[0].senderName}
              </div>
              <div className="chat-bubble">{PREVIEW_MESSAGES[0].content}</div>
              <div className="chat-footer opacity-50">12:40</div>
            </div>
            <div className="chat chat-end w-full">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="Tailwind CSS chat bubble component" src={valeria} />
                </div>
              </div>
              <div className="chat-header">
                {PREVIEW_MESSAGES[1].receiverName}
              </div>
              <div className="chat-bubble">{PREVIEW_MESSAGES[1].content}</div>
              <div className="chat-footer opacity-50">12:46</div>
            </div>
            <div className="chat chat-start w-full ">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="Tailwind CSS chat bubble component" src={eduardo} />
                </div>
              </div>
              <div className="chat-header">
                {PREVIEW_MESSAGES[2].senderName}
              </div>
              <div className="chat-bubble">{PREVIEW_MESSAGES[2].content}</div>
              <div className="chat-footer opacity-50">12:47</div>
            </div>
            <div className="chat chat-end w-full">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="Tailwind CSS chat bubble component" src={valeria} />
                </div>
              </div>
              <div className="chat-header">
                {PREVIEW_MESSAGES[3].receiverName}
              </div>
              <div className="chat-bubble">{PREVIEW_MESSAGES[3].content}</div>
              <div className="chat-footer opacity-50">12:47</div>
            </div>
            <div className="flex items-center gap-2 mt-4 p-2 bg-base-300 rounded-xl">
              <button className="btn btn-neutral btn-sm btn-square pointer-events-none">
                <ImagePlus className="size-4" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="input input-bordered w-full input-sm pointer-events-none"
                readOnly
              />
              <button className="btn btn-primary btn-sm btn-circle pointer-events-none">
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
