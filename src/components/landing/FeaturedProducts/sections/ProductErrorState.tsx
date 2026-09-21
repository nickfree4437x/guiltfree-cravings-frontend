interface ProductErrorStateProps {
  message: string;
}

function ProductErrorState({
  message,
}: ProductErrorStateProps) {
  return (
    <div
      className="
        mx-auto mt-12
        max-w-2xl
        rounded-2xl
        border border-[#E8E1D8]
        bg-white
        px-6 py-12
        text-center
      "
    >
      <h3
        className="
          text-xl
          font-semibold
          text-[#245538]
        "
      >
        Products unavailable
      </h3>

      <p
        className="
          mt-3
          text-xs
          leading-6
          text-slate-500
        "
      >
        {message}
      </p>
    </div>
  );
}

export default ProductErrorState;