import { tv } from "tailwind-variants";

export const title = tv({
  base: "tracking-tight inline font-semibold",
  variants: {
    color: {
      violet: "from-[#FF1CF7] to-[#b249f8]",
      yellow: "from-[#FF705B] to-[#FFB457]",
      blue: "from-[#5EA2EF] to-[#0072F5]",
      cyan: "from-[#00b7fa] to-[#01cfea]",
      green: "from-[#6FEE8D] to-[#17c964]",
      pink: "from-[#FF72E1] to-[#F54C7A]",
      foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
    },
    size: {
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.3rem] lg:text-5xl leading-9",
      lg: "text-4xl lg:text-6xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "foreground",
      ],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});

export const background = tv({
  base: "min-h-screen flex items-center justify-center p-4",
  variants: {
    color: {
      violet: "bg-gradient-to-tr from-violet-100 to-pink-100 dark:from-violet-900 dark:to-pink-900",
      slate: "bg-gradient-to-tr from-slate-100 to-gray-100 dark:from-slate-900 dark:to-gray-900",
      gradient: "bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8]"
    }
  },
  defaultVariants: {
    color: "violet"
  }
});

export const container = tv({
  base: "w-full max-w-md mx-auto p-6 rounded-2xl shadow-xl",
  variants: {
    blurred: {
      true: "backdrop-blur-lg bg-background/80"
    }
  }
});

export const text = tv({
  base: "text-default-500",
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg"
    },
    align: {
      center: "text-center"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
