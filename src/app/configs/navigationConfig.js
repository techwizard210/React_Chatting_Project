import i18next from "i18next";

import { authRoles } from "app/auth";
import en from "./navigation-i18n/en";
import th from "./navigation-i18n/th";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("th", "navigation", th);

const navigationConfig = [
  {
    id: "applications",
    title: "Applications",
    translate: "APPLICATIONS",
    type: "group",
    icon: "apps",
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        translate: "DASHBOARD",
        type: "item",
        icon: "dashboard",
        url: "/apps/dashboard",
      },
      {
        id: "chat",
        title: "Chat",
        translate: "CHAT",
        type: "item",
        icon: "chat",
        url: "/apps/chat",
        // auth: authRoles.user,
      },
      {
        id: "customers",
        title: "Customers",
        translate: "CUSTOMERS",
        type: "item",
        icon: "contact_page",
        url: "/customers",
        auth: authRoles.user,
      },
      // {
      //   id: 'loyalty',
      //   title: 'Reward',
      //   translate: 'LOYALTY',
      //   type: 'collapse',
      //   icon: 'emoji_events',
      //   url: '/customers',
      //   auth: authRoles.user,
      //   children: [
      //     {
      //       id: 'reward',
      //       title: 'Rewards',
      //       translate: 'REWARD',
      //       type: 'item',
      //       icon: 'emoji_events',
      //       url: '/rewards',
      //       auth: authRoles.user,
      //     },
      //     {
      //       id: 'point',
      //       title: 'Point History',
      //       translate: 'POINT_HISTORY',
      //       type: 'item',
      //       icon: 'confirmation_number',
      //       url: '/pointHistory',
      //       auth: authRoles.user,
      //     },

      //     {
      //       id: 'rewards-history',
      //       title: 'Reward History',
      //       translate: 'REWARD_HISTORY',
      //       type: 'item',
      //       icon: 'assignment',
      //       url: '/rewardHistory',
      //       auth: authRoles.user,
      //     },
      //   ],
      // },

      // {
      //   id: 'e-commerce',
      //   title: 'eCommerce',
      //   translate: 'ECOMMERCE',
      //   type: 'collapse',
      //   icon: 'shopping_cart',
      //   url: '/woocommerce/products',
      //   children: [
      //     {
      //       id: 'woocommerce',
      //       title: 'Woocommerce',
      //       translate: 'WOOCOMMERCE',
      //       type: 'collapse',
      //       icon: 'shopping_cart',
      //       children: [
      //         {
      //           id: 'woocommerce-categories',
      //           title: 'Categories',
      //           translate: 'CATEGORY',
      //           type: 'item',
      //           url: '/woocommerce/categories',
      //           exact: true,
      //         },
      //         {
      //           id: 'woocommerce-products',
      //           title: 'Products',
      //           translate: 'PRODUCT',
      //           type: 'item',
      //           url: '/woocommerce/products',
      //           exact: true,
      //         },
      //         {
      //           id: 'woocommerce-orders',
      //           title: 'Orders',
      //           translate: 'ORDER',
      //           type: 'item',
      //           url: '/woocommerce/orders',
      //           exact: true,
      //         },
      //       ],
      //     },
      //   ],
      // },

      {
        id: "todo",
        title: "To-Do",
        translate: "TODO",
        type: "item",
        icon: "check_box",
        url: "/apps/todo",
      },
      // {
      //   id: 'scrumboard',
      //   title: 'Scrumboard',
      //   translate: 'SCRUMBOARD',
      //   type: 'item',
      //   icon: 'assessment',
      //   url: '/apps/scrumboard',
      // },
      {
        id: "scrumboard",
        title: "Scrumboard",
        translate: "SCRUMBOARD",
        type: "collapse",
        icon: "assessment",
        children: [
          {
            id: "addscrumboard",
            title: "Add new board",
            type: "item",
            icon: "add_circle",
            url: "/apps/scrumboard/boards",
          },
        ],
      },
      {
        id: "user-group",
        title: "Users",
        translate: "USERS",
        type: "collapse",
        icon: "people",
        auth: authRoles.user,
        children: [
          {
            id: "users",
            title: "Users",
            translate: "USERS",
            type: "item",
            icon: "person",
            url: "/users",
            auth: authRoles.user,
          },

          {
            id: "teams",
            title: "Teams",
            translate: "TEAMS",
            type: "item",
            icon: "groups",
            url: "/teams",
            auth: authRoles.user,
          },
        ],
      },
    ],
  },

  {
    type: "divider",
    id: "divider-1",
  },

  {
    id: "settings",
    title: "Settings",
    translate: "SETTINGS",
    type: "group",
    icon: "settings",
    children: [
      {
        id: "general",
        title: "General",
        translate: "GENERAL",
        type: "item",
        icon: "settings",
        url: "/settings/general",
        auth: authRoles.admin,
      },
      {
        id: "profile",
        title: "Profile",
        translate: "PROFILE",
        type: "item",
        icon: "account_circle",
        url: "/pages/profile",
        auth: authRoles.user,
      },
      {
        id: "channels",
        title: "Channels",
        translate: "CHANNELS",
        type: "item",
        icon: "public",
        url: "/settings/channels",
        auth: authRoles.admin,
      },

      {
        id: "replies",
        title: "Replies",
        translate: "REPLIES",
        type: "item",
        icon: "quickreply",
        url: "/settings/reply",
        auth: authRoles.user,
      },

      // {
      //   id: 'replies',
      //   title: 'Replies',
      //   translate: 'REPLIES',
      //   type: 'collapse',
      //   icon: 'reply_all',
      //   children: [
      //     {
      //       id: 'quick-replies',
      //       title: 'Quick Reply',
      //       translate: 'QUICKREPLIES',
      //       type: 'item',
      //       icon: 'quickreply',
      //       url: '/apps/reply/quick',
      //     },
      // {
      //   id: 'auto-replies',
      //   title: 'Auto Reply',
      //   type: 'item',
      //   icon: 'reply',
      //   url: '/apps/reply/quick',
      // },
      //   ],
      // },
    ],
  },

  {
    type: "divider",
    id: "divider-2",
  },

  {
    id: "more",
    title: "More",
    // translate: 'SETTINGS',
    type: "group",
    // icon: 'settings',
    children: [
      {
        id: "doc-link",
        title: "Documentation",
        type: "link",
        icon: "link",
        url: "https://fox-doumentation.gitbook.io/fox-connect-documentation/",
        target: "_blank",
      },
    ],
  },
];

export default navigationConfig;
