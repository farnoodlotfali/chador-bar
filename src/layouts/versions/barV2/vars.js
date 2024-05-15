export const HEADER_HEIGHT = 60;
export const DRAWER_WIDTH = 85;
export const DRAWER_TRANSITION =
  "width 0.3s ease-in-out, left 0.3s ease-in-out";
//  links
export const DRAWER_MENU_ITEMS_TOP = [
  {
    title: "قرارداد",
    name: "contract",
    icon: "handshake",
    childrenLinks: [
      {
        title: "قرارداد جدید",
        link: "/contract/new",
        name: "contract.store",
      },
      {
        title: "لیست قرارداد",
        link: "/contract",
        name: "contract.index",
      },
      {
        title: "انبارها",
        link: "/contract/storage",
        name: "contract.storage",
      },
      {
        title: "پروژه",
        childrenLinks: [
          {
            title: "لیست پروژه",
            link: "/project",
            name: "project.index",
          },
          {
            title: "پروژه جدید",
            link: "/project/new",
            name: "project.store",
          },
        ],
      },
    ],
  },
  {
    title: "برنامه‌ریزی",
    icon: "calendar-clock",
    name: "request",
    childrenLinks: [
      {
        title: "درخواست حمل جدید",
        link: "/request/new",
        name: "request.store",
      },
      {
        title: "لیست درخواست حمل",
        link: "/request",
        name: "request.index",
      },
      // {
      //   title: "برنامه‌ریزی پروژه",
      //   link: "/project/shipping-plan-new",
      //   name: "project.store",
      // },
      {
        title: "لیست سالن بار",
        link: "/request/salon",
        name: "salon.index",
      },
      {
        title: "تخصیص ناوگان",
        link: "/request/fleet-allocation",
        name: "fleet.allocation",
      },
      {
        title: "ثبت آهنگ پروژه",
        link: "/request/new-tune",
        name: "project-plan.store",
      },
      {
        title: "آهنگ‌های پروژه",
        link: "/request/tune",
        name: "project-plan.index",
      },
      {
        title: "قیمت‌ها",
        link: "/prices",
        name: "price",
      },
      {
        title: "بارنامه و حواله‌",
        childrenLinks: [
          {
            title: "ثبت حواله جدید",
            link: "/waybill/NewDraft",
            name: "draft.store",
          },
          {
            title: "لیست حواله‌ها",
            link: "/waybill/Draft",
            name: "draft.index",
          },
          {
            title: "ثبت بارنامه جدید",
            link: "/waybill/newWaybill",
            name: "waybill.store",
          },
          {
            title: "لیست بارنامه‌ها",
            link: "/waybill",
            name: "waybill.index",
          },
        ],
      },
    ],
  },
  {
    title: "ناوگان",
    name: "fleet",
    icon: "car-bus",
    childrenLinks: [
      {
        title: "لیست شرکت حمل و نقل",
        link: "/shippingCompany",
        name: "shipping-company.index",
      },
      {
        title: "گروه ناوگان",
        link: "/fleet/group",
        name: "fleet-group.index",
      },
      {
        title: "لیست ناوگان",
        link: "/fleet",
        name: "fleet.index",
      },
      {
        title: "ناوگان جدید",
        link: "/fleet/new",
        name: "fleet.store",
      },
      {
        title: "لیست ناوگان آزاد",
        link: "/fleet/free",
        name: "fleet.index",
      },
      {
        title: "خودرو",
        childrenLinks: [
          {
            title: "لیست خودرو",
            link: "/vehicle",
            name: "vehicle.index",
          },
          {
            title: "نوع کامیون",
            link: "/vehicle/category",
            name: "vehicle-category.index",
          },
          {
            title: "برند",
            link: "/vehicle/brand",
            name: "vehicle-brand.index",
          },
          {
            title: "نوع بارگیر",
            link: "/vehicle/type",
            name: "vehicle-type.index",
          },
          {
            title: "مدل خودرو",
            link: "/vehicle/model",
            name: "vehicle-model.index",
          },
          {
            title: "سوخت‌گیری",
            link: "/vehicle/refueling",
            name: "refueling.index",
          },
        ],
      },
    ],
  },
  {
    title: "محصولات",
    name: "product",
    icon: "box",
    childrenLinks: [
      {
        title: "لیست محصولات",
        link: "/product",
        name: "product.index",
      },
      {
        title: "گروه محصول",
        link: "/product/group",
        name: "product-group.index",
      },
      {
        title: "واحد شمارشی",
        link: "/product/unit",
        name: "product-unit.index",
      },
      {
        title: "نوع بسته‌بندی",
        link: "/product/packing",
        name: "product-packing.index",
      },
    ],
  },
  {
    title: "افراد",
    name: "users",
    icon: "users",
    childrenLinks: [
      {
        title: "لیست رانندگان",
        link: "/driver",
        name: "driver.index",
      },
      {
        title: "ثبت راننده جدید",
        link: "/driver/new",
        name: "driver.store",
      },
      {
        title: "لیست صاحبان‌بار",
        link: "/owner",
        name: "customer.index",
      },
      {
        title: "ثبت صاحب‌بار جدید",
        link: "/owner/new",
        name: "customer.store",
      },
      {
        title: "ثبت فرستنده و گیرنده جدید",
        link: "/person/new",
        name: "person.store",
      },
      {
        title: "لیست فرستندگان و گیرندگان",
        link: "/person",
        name: "person.index",
      },
      {
        title: "کاربران",
        childrenLinks: [
          {
            title: "لیست کاربران",
            link: "/user",
            name: "user.index",
          },
          {
            title: "لیست نقش‌ها",
            link: "/role",
            name: "role.index",
          },
        ],
      },
    ],
  },
  {
    title: "پیام‌ها",
    name: "messages",
    icon: "envelopes-bulk",
    childrenLinks: [
      {
        title: "ارسال پیام",
        link: "/messages/send",
        name: "message.send-bulk",
      },
      {
        title: "ارسال پیام دستی",
        link: "/messages/sendManual",
        name: "message.send-bulk",
      },
      {
        title: "پیام‌ها",
        link: "/messages",
        name: "messages.index",
      },
      {
        title: "لیست هشدار‌ها",
        link: "/messages/alerts",
        name: "alert.index",
      },
      {
        title: "پیام‌های من",
        link: "/messages/my",
        name: "my-messages.index",
      },
      {
        title: "الگوهای پیام‌",
        link: "/messages/templates",
        name: "message-template.index",
      },
    ],
  },
  {
    title: "گزارشات",
    name: "reports",
    icon: "file-chart-column",
    childrenLinks: [
      {
        title: "گزارش قرارداد",
        link: "/contract/report",
        name: "",
      },

      {
        title: "گزارش مانده پروژه",
        link: "/project/report",
        name: "",
      },
      {
        title: "گزارش ساز (درخواست‌های بدون قرارداد)",
        link: "/request/report",
        name: "",
      },
      {
        title: "گزارش عملکرد راننده",
        link: "/driver/report",
        name: "",
      },
      {
        title: "گزارش عملکرد ناوگان",
        link: "/fleet/report",
        name: "report.driver",
      },
      {
        title: "گزارش عملکرد شرکت های حمل",
        link: "/shippingCompany/report",
        name: "",
      },
      {
        title: "گزارش عملکرد صاحب بار",
        link: "/owner/report",
        name: "",
      },
      {
        title: "گزارش سالن بار",
        link: "/salon/report",
        name: "",
      },
      {
        title: "گزارش جامع کشوری",
        link: "/request/requests-by-provinces",
        name: "",
      },
      {
        title: "گزارش ناوگان آزاد",
        link: "/fleet/free",
        name: "fleet.index",
      },

      // {
      //   title: "گزارش فراوانی درخواست محصول",
      //   link: "/request/requests-by-products",
      //   name: "",
      // },
      // {
      //   title: "گزارش فراوانی درخواست شهر",
      //   link: "/request/requests-by-cities",
      //   name: "",
      // },
    ],
  },
  {
    title: "مالی",
    name: "money",
    icon: "money-bill",
    childrenLinks: [
      {
        title: "تراکنش ها",
        link: "/financial/transaction",
        name: "transaction.index",
      },

      {
        title: "حساب ها",
        link: "/financial/account",
        name: "account.index",
      },
      {
        title: "صورتحساب ها",
        link: "/financial/invoice",
        name: "invoice.index",
      },
    ],
  },
];

export const DRAWER_MENU_ITEMS_BOTTOM = [
  {
    title: "سوپر اپ",
    icon: "mobile",
    link: "/super-app",
    name: "group.index",
  },
  {
    title: "مانیتورینگ",
    icon: "desktop",
    link: "/monitoring",
    name: "monitoring.index",
  },
  {
    title: "رویداد‌ها",
    icon: "file-lines",
    link: "/event",
    name: "event.index",
  },

  {
    title: "تنظیمات",
    icon: "gear",
    link: "/settings",
    name: "setting.index",
  },
];
