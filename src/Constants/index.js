export const GENDER = [
  { name: "مرد", value: "male" },
  { name: "زن", value: "female" },
];

export const MESSAGE_TYPE = [
  { name: "داخل برنامه", value: "in-app" },
  { name: "پیامک", value: "sms" },
  { name: "نوتیفیکیشن", value: "push" },
];
export const MESSAGE_TEMPLATE_TYPE = [
  { name: "عمومی", value: "general" },
  { name: "پیامک", value: "sms" },
  { name: "نوتیفیکیشن", value: "push" },
  { name: "ایمیل", value: "email" },
];

export const SEND_MESSAGE_METHOD = [
  { name: "داخل برنامه", value: "in-app" },
  { name: "پیامک", value: "sms" },
  { name: "نوتیفیکیشن", value: "push" },
];

export const FLEET_FREE_TYPE = [
  { title: "آزاد", id: "false" },
  { title: "همه", id: "true" },
];
export const SENDER_RECEIVER = [
  { title: "فرستنده", id: "sender" },
  { title: "گیرنده", id: "receiver" },
];
export const RATE_TYPE = {
  driver: "راننده",
  customer: "صاحب‌بار",
  company: "شرکت حمل",
};

export const OWNER_TYPES_VALUE = {
  legal: "legal",
  natural: "natural",
};

export const OWNER_TYPES = [
  { title: "حقوقی", id: OWNER_TYPES_VALUE.legal },
  { title: "حقیقی", id: OWNER_TYPES_VALUE.natural },
];

export const PAGE_TITLES = {
  "/desktop": "میزکار",
  "/waybill/newWaybill": "ثبت بارنامه جدید",
  "/waybill/NewGroupWaybill": "ثبت بارنامه گروهی",
  "/waybill/NewDraft": "ثبت حواله جدید",
  "/waybill/Draft": "لیست حواله‌ها",
  "/waybill": "لیست بارنامه‌ها",
  "/contract": "لیست قراردادها",
  "/prices": "قیمت‌ها",
  "/contract/new": "ثبت قرارداد جدید",
  "/contract/storage": "انبارها",
  "/contract/report": "گزارش قرارداد",
  "/project/new": "ثبت پروژه جدید",
  "/project/report": "گزارش مانده پروژه",
  "/project/report/:id": "گزارش مانده پروژه",
  "/project": "لیست پروژه‌ها",
  "/request/tune": "لیست آهنگ حمل پروژه‌ها",
  "/request/new-tune": "ثبت آهنگ حمل پروژه",
  "/request/requests-by-products": "گزارش فراوانی درخواست محصول",
  "/request/new": "ثبت درخواست حمل",
  "/request": "لیست درخواست حمل",
  "/request/report": "گزارش ساز (درخواست‌های بدون قرارداد)",
  "/project/shipping-plan-new": "برنامه‌ریزی پروژه",
  "/shippingCompany": "لیست شرکت حمل و نقل",
  "/shippingCompany/report": "گزارش عملکرد شرکت حمل",
  "/LegalAndCompany": "لیست اشخاص حقوقی و شرکت ها",
  "/fleet": "لیست ناوگان",
  "/survey": "نظرسنجی",
  "/fleet/free": "گزارش ناوگان آزاد",
  "/fleet/new": "ثبت ناوگان",
  "/beneficiary": "ذی‌نفعان",
  "/request/fleet-allocation": "تخصیص ناوگان",
  "/product": "لیست محصولات",
  "/product/group": "گروه محصول",
  "/product/packing": "نوع بسته‌بندی",
  "/product/unit": "واحد شمارشی",
  "/owner": "لیست صاحبان‌بار",
  "/owner/new": "ثبت صاحب‌‌بار جدید",
  "/owner/report": "گزارش عملکرد صاحب بار",
  "/salon": "سالن بار",
  "/salon/report": "گزارش سالن بار",
  "/driver": "لیست رانندگان",
  "/driver/new": "ثبت راننده جدید",
  "/driver/report": "گزارش عملکرد راننده",
  "/person": "لیست فرستندگان و گیرندگان",
  "/person/new": "ثبت فرستنده و گیرنده جدید",
  "/vehicle": "لیست خودرو‌ها",
  "/financial": "مالی",
  "/financial/transaction": "تراکنش ها",
  "/financial/invoice": "صورتحساب ها",
  "/financial/account": "حساب ها",

  "/vehicle/category": "نوع کامیون",
  "/vehicle/brand": "برند",
  "/vehicle/type": "نوع بارگیر",
  "/vehicle/model": "مدل خودرو",
  "/vehicle/refueling": "سوخت‌گیری",
  "/user": "لیست کاربران",
  "/super-app": "مدیریت سوپر اپ",
  "/role": "لیست نقش‌ها",
  "/event": "رویداد‌ها",
  "/settings": "تنظیمات",
  "/request/salon": "لیست سالن بار",
  "/fleet/group": "گروه ناوگان",
  "/super-app/section/item": "آیتم‌ها",
  "/super-app/section": "بخش‌‌ها",
  "/messages": "پیام‌ها",
  "/request/requests-by-provinces": "گزارش جامع کشوری",
  "/request/requests-by-cities": "گزارش فراوانی درخواست شهر",
  "/messages/my": "پیام‌های من",
  "/messages/alerts": "هشدار‌ها",
  "/messages/send": "ارسال پیام",
  "/messages/templates": "الگو‌های پیام‌",
  "/monitoring": "مانیتورینگ",
};
