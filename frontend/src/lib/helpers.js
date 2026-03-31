export const getAvatar = (user) =>
  user.profilePicture ||
  `https://ui-avatars.com/api/?name=${user.fullname}&background=random`;

export const formatTime = (date) =>
  new Date(date).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
