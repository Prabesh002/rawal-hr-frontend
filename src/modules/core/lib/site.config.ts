export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vite + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Employees",
      href: "/hr/employees",
    },
    {
      label: "Payrolls",
      href: "/hr/payrolls",
    },
    {
      label: "Create Payroll",
      href: "/hr/payroll/create",
    },
    {
      label: "Employee Setup",
      href: "/hr/employee-setup",
    },
    {
      label: "login",
      href: "/auth/login",
    },
  ],
};