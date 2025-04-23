import { cn } from "@/lib/utils";

const AuthBanner = () => {
  return (
    <div className="relative hidden bg-muted md:block">
      {/* Light mode image */}
      <img
        src="/banner.jpg"
        alt="Banner"
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          "block dark:hidden",
        )}
      />
      {/* Dark mode image */}
      <img
        src="/banner-dark.jpg"
        alt="Banner dark"
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          "hidden dark:block",
        )}
      />
    </div>
  );
};

export default AuthBanner;
