interface PackagingSelectorProps {
  packagings: string[];
  selectedPackaging: string;
  onChange: (packaging: string) => void;
}

// ─── Config ───────────────────────────────────────────────
const PACKAGING_LABELS: Record<string, string> = {
  "Plastic Box": "Regular",
  "Cardboard Box": "Cardboard Boxes",
  "Glass Jar": "Glass Jars",
};

const getPackagingLabel = (packaging: string) =>
  PACKAGING_LABELS[packaging] ?? packaging;

// ─── Component ────────────────────────────────────────────
function PackagingSelector({ packagings, selectedPackaging, onChange }: PackagingSelectorProps) {
  if (packagings.length === 0) return null;

  return (
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
      {packagings.map((packaging) => {
        const isSelected = packaging === selectedPackaging;
        return (
          <button
            key={packaging}
            type="button"
            onClick={() => onChange(packaging)}
            aria-pressed={isSelected}
            className={`rounded-xl border px-3 py-3 text-left transition-all duration-200 ${
              isSelected
                ? "border-[#B5697A] bg-[#FBEEF1]"
                : "border-[#EFE3D2] bg-white hover:border-[#D9C7B8]"
            }`}
          >
            <span className={`block text-xs ${isSelected ? "text-[#B5697A]" : "text-[#2C2C2C]"}`}>
              {getPackagingLabel(packaging)}
            </span>
            <span className="mt-1 block text-[10px] text-gray-500">
              Select packaging
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default PackagingSelector;