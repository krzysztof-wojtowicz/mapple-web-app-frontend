const ShowProfile = ({ user }) => {
  const profile_picture =
    "https://res.cloudinary.com/dcwp4g10w/image/upload/w_150,h_150,c_fill,r_max/" +
    user.profile_picture.url.split("/")[6] +
    "/" +
    user.profile_picture.url.split("/")[7] +
    "/" +
    user.profile_picture.url.split("/")[8];

  return (
    <div className="flex justify-center my-4">
      <div className="flex flex-col items-center gap-y-1 bg-white dark:bg-zinc-800 shadow-lg rounded-lg py-4 px-10 w-3/5">
        <img
          className="w-max rounded-full"
          src={profile_picture}
          alt="profile"
        ></img>
        <h3 className="text-2xl font-bold text-center">{`${user.name} ${user.surname}`}</h3>
      </div>
    </div>
  );
};

export default ShowProfile;
