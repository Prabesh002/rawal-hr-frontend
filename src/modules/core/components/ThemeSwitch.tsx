import { FC, useState, useEffect } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@heroui/switch";
import clsx from "clsx";

import { SunFilledIcon, MoonFilledIcon } from "@/modules/core/design-system/icons";
import { useAppTheme } from "@/modules/core/hooks/useAppTheme"; 
export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { effectiveTheme, setTheme } = useAppTheme(); 

  const isCurrentlyLight = effectiveTheme === "light";

  const {
    Component,
    slots,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: isCurrentlyLight, 
    onChange: () => setTheme(isCurrentlyLight ? "dark" : "light"),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []); 

  if (!isMounted) return <div className="w-6 h-6" />; 

  return (
    <Component
      aria-label={isCurrentlyLight ? "Switch to dark mode" : "Switch to light mode"}
      {...getBaseProps({
        className: clsx(
          "px-px transition-opacity hover:opacity-80 cursor-pointer",
          className,
          classNames?.base,
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "w-auto h-auto",
              "bg-transparent",
              "rounded-lg",
              "flex items-center justify-center",
              "group-data-[selected=true]:bg-transparent",
              "!text-default-500",
              "pt-px",
              "px-0",
              "mx-0",
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {isCurrentlyLight ? (
          <MoonFilledIcon size={22} />
        ) : (
          <SunFilledIcon size={22} />  
        )}
      </div>
    </Component>
  );
};