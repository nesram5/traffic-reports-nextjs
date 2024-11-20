export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Traffic Reports",
  description: "Consulta el trafico de forma inmediata.",
  navItems: [
    {
      label: "Traffic Reports",
      href: "/",
    },
    {
      label: "Configuracion",
      href: "/login",
    },
    {
      label: "ONU's Config",
      href: "/onu-config",
    },
    {
      label: "Caluladora BCV",
      href: "/calculator",
    },
    {
      label: "NetcomBook",
      href: "http://10.3.0.253",
    },
  ],
  navMenuItems: [
    {
      label: "Traffic Reports",
      href: "/",
    },
    {
      label: "Configuracion",
      href: "/config-page",
    },
    {
      label: "ONU's Config",
      href: "/onu-config",
    },
    {
      label: "Caluladora BCV",
      href: "/calculator",
    },
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "NetcomBook",
      href: "http://10.3.0.253",
    },    
  ],
};
