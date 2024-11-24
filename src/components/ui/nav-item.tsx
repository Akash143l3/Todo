import { cva, VariantProps } from "class-variance-authority";

const navItemVariants = cva("text-secondary h-full", {
  variants: {
    isActive: {
      true: "border-b-2",
    },
  },
});

export interface NavItemProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof navItemVariants> {}

export default function NavItem({
  className,
  children,
  isActive,
  ...props
}: NavItemProps) {
  return (
    <button className={navItemVariants({ className, isActive })} {...props}>
      {children}
    </button>
  );
}
