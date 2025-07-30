import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useAuthService } from "@/modules/auth/services/authService";
import { siteConfig } from "@/modules/core/lib/site.config";
import { ThemeSwitch } from "@/modules/core/components/ThemeSwitch";
import { SearchIcon } from "@/modules/core/design-system/icons";

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { logout } = useAuthService();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  const visibleNavItems = siteConfig.navItems.filter(item => {
    if (item.requiresAdmin && !isAdmin) return false;
    if (item.isPublic && isAuthenticated) return false;
    return true;
  });

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <p className="font-bold text-inherit">PAT</p>
          </Link>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {visibleNavItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex">
          <ThemeSwitch />
        </NavbarItem>
        {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
        {isAuthenticated && (
          <NavbarItem>
            <Button color="danger" variant="flat" onPress={handleLogout}>
              Logout
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {visibleNavItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color="foreground"
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          {isAuthenticated && (
            <NavbarMenuItem>
              <Button fullWidth color="danger" variant="flat" onPress={handleLogout}>
                Logout
              </Button>
            </NavbarMenuItem>
          )}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};