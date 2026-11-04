function ProfileLoading() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 sm:py-16 lg:px-8">

      <div className="mx-auto max-w-4xl">
        <div className="mt-10 rounded-3xl border border-[#eadfd3] bg-white p-10 text-center shadow-sm">

          <div
            className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#eadfd3] border-t-[#8b542f]"
            aria-hidden="true"
          />

          <p className="mt-5 text-sm text-slate-600">
            Loading your profile...
          </p>

        </div>

      </div>

    </main>
  );
}

export default ProfileLoading;