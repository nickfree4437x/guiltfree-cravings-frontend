function ProfileHeader() {
  return (
    <div className="mx-auto mt-4 max-w-2xl text-center sm:mt-6">

      {/* Heading */}
      <h1
        className="
          text-[20px] sm:text-[24px] md:text-[28px] font-semibold tracking-wide text-[#C9788B] mb-2 leading-snug md:whitespace-nowrap
        "
      >
        My Account
      </h1>

      {/* Description */}
      <p
        className="
          text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-relaxed tracking-wide max-w-[580px] mx-auto text-gray-600
        "
      >
        Manage your details for a smoother and easier shopping experience.
      </p>
    </div>
  );
}

export default ProfileHeader;