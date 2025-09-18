import { cn } from "@/lib/utils";
import * as React from "react";

interface SheetContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextType | undefined>(
  undefined,
);

const Sheet = ({
  children,
  open: controlledOpen,
  onOpenChange,
  ...props
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange],
  );

  return (
    <SheetContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild = false, children, ...props }, ref) => {
  const context = React.useContext(SheetContext);

  const handleClick = () => {
    context?.onOpenChange(true);
  };

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
    });
  }

  return (
    <button ref={ref} className={className} onClick={handleClick} {...props}>
      {children}
    </button>
  );
});
SheetTrigger.displayName = "SheetTrigger";

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "top" | "bottom" | "left" | "right";
  }
>(({ className, side = "right", children, ...props }, ref) => {
  const context = React.useContext(SheetContext);

  if (!context?.open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/80"
        onClick={() => context?.onOpenChange(false)}
      />

      {/* Sheet */}
      <div
        ref={ref}
        className={cn(
          "fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out dark:bg-gray-950",
          {
            "inset-x-0 top-0 border-b": side === "top",
            "inset-x-0 bottom-0 border-t": side === "bottom",
            "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm":
              side === "left",
            "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm":
              side === "right",
          },
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
});
SheetContent.displayName = "SheetContent";

export { Sheet, SheetTrigger, SheetContent };
