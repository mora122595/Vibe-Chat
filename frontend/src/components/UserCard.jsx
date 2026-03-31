const UserCard = ({ user }) => (
  <div className="flex gap-4">
    <div className="avatar">
      <div className="size-12 rounded-full ring ring-base-300 ring-offset-2 ring-offset-base-100">
        <img
          alt="profilepic"
          src={
            user.profilePic ||
            `https://ui-avatars.com/api/?name=${user.fullname}&background=random`
          }
        />
      </div>
    </div>
    <div className="flex flex-col">
      <p className="font-bold">{user.fullname}</p>
      <p className="text-sm">{user.email}</p>
    </div>
  </div>
);

export default UserCard;
