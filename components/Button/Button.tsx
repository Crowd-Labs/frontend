import { cn } from "@/lib/utils";

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
}
const Button = (props: ButtonProps) => {
  const { children, className = "" } = props;
  return (
    <div
      className={cn(
        `w-60 py-4 rounded-2xl shadow-md text-center font-medium bg-indigo-800 cursor-pointer`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Button;
