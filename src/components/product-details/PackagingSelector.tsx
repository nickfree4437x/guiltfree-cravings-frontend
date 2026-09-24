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

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8B7A6C]">
          Packaging
        </h2>

        <span className="text-[11px] text-[#8B7A6C]">
          {selectedPackaging}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {packagings.map((packaging) => {
          const isSelected =
            packaging === selectedPackaging;

          return (
            <button
              key={packaging}
              type="button"
              onClick={() =>
                onChange(packaging)
              }
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
                    ? "border-[#B5697A] bg-[#FBEEF1] shadow-sm"
                    : "border-[#EFE3D2] bg-white hover:border-[#D9C7B8] hover:bg-[#FFFCF7]"
                }
              `}
            >
              <span
                className={`
                  block text-xs font-medium
                  ${
                    isSelected
                      ? "text-[#B5697A]"
                      : "text-[#2C2C2C]"
                  }
                `}
              >
                {packaging}
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