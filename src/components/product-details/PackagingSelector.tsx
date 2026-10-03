interface PackagingSelectorProps {
  packagings: string[];
  selectedPackaging: string;
  onChange: (packaging: string) => void;
}

function PackagingSelector({
  packagings,
  selectedPackaging,
  onChange,
}: PackagingSelectorProps) {
  if (packagings.length === 0) {
    return null;
  }

  const getPackagingLabel = (
    packaging: string
  ) => {
    switch (packaging) {
      case "Plastic Box":
        return "Regular";

      case "Cardboard Box":
        return "Cardboard Boxes";

      case "Glass Jar":
        return "Glass Jars";

      default:
        return packaging;
    }
  };

  return (
    <div className="mt-3">

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {packagings.map((packaging) => {
          const isSelected =
            packaging === selectedPackaging;

          return (
            <button
              key={packaging}
              type="button"
              onClick={() => onChange(packaging)}
              aria-pressed={isSelected}
              className={`
                rounded-xl
                border
                px-3
                py-3
                text-left
                transition-all
                duration-200
                ${
                  isSelected
                    ? "border-[#B5697A] bg-[#FBEEF1]"
                    : "border-[#EFE3D2] bg-white hover:border-[#D9C7B8] hover:bg-[#FFFCF7]"
                }
              `}
            >
              <span
                className={`
                  block text-xs
                  ${
                    isSelected
                      ? "text-[#B5697A]"
                      : "text-[#2C2C2C]"
                  }
                `}
              >
                {getPackagingLabel(packaging)}
              </span>

              <span className="mt-1 block text-[10px] text-[#8B7A6C]">
                Select packaging
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PackagingSelector;