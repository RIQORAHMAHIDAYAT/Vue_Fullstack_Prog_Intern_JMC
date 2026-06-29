import {
  IconLayoutDashboardFilled,
  IconUserFilled,
  IconDatabaseFilled,
  IconUsers,
  IconHistory,
} from "@tabler/icons-vue";

export const menuItems = [
  {
    title: "Dashboard",
    icon: IconLayoutDashboardFilled,
    to: "/",
    modulFitur: "dashboard",
  },
  {
    title: "Data Pegawai",
    icon: IconUserFilled,
    to: "/pegawai",
    modulFitur: "modul_pegawai",
  },
  {
    title: "Tunjangan",
    icon: IconDatabaseFilled,
    modulFitur: "modul_tunjangan_transport",
    children: [
      {
        title: "Setting Tunjangan Transport",
        to: "/tunjangan/setting",
        modulFitur: "setting_tunjangan_transport",
      },
      {
        title: "Tunjangan Transport",
        to: "/tunjangan/transport",
        modulFitur: "modul_tunjangan_transport",
      },
    ],
  },
  {
    title: "Manajemen User",
    icon: IconUsers,
    modulFitur: "kelola_user",
    children: [
      {
        title: "Manajemen Role",
        to: "/user/role",
        modulFitur: "kelola_role",
      },
      {
        title: "Manajemen User",
        to: "/user/manage",
        modulFitur: "kelola_user",
      },
    ],
  },
  {
    title: "Log Aktifitas",
    icon: IconHistory,
    to: "/log",
    modulFitur: "modul_log",
  },
];
