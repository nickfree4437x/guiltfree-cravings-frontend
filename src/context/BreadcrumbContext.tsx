
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface BreadcrumbContextType {
  dynamicLabel: string;
  setDynamicLabel: (label: string) => void;
}

const BreadcrumbContext = createContext<
  BreadcrumbContextType | undefined
>(undefined);

export function BreadcrumbProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [dynamicLabel, setDynamicLabelState] = useState("");

  const setDynamicLabel = useCallback((label: string) => {
    setDynamicLabelState(label);
  }, []);

  return (
    <BreadcrumbContext.Provider
      value={{ dynamicLabel, setDynamicLabel }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error(
      "useBreadcrumb must be used inside BreadcrumbProvider"
    );
  }

  return context;
}
