import store from "@/store";
import ua from "@/locales/ua.json";
import en from "@/locales/en.json";

const locales = {
  "en-EN": en,
  "ua-UA": ua,
};

export default {
  localize(key) {
    const locale = store.getters.info.locale || "en-EN";
    return locales[locale][key] || `[locale error]: key ${key} not found`;
  },
  currency(value, currency = "UAH") {
    return new Intl.NumberFormat("ua-UA", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    }).format(value);
  },
  date(value, format = "date") {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
    };
    if (format == "datetime") {
      options.hour = "numeric";
      options.minute = "numeric";
      options.second = "numeric";
    }
    const locale = store.getters.info.locale || window.navigator.language;
    return new Intl.DateTimeFormat(locale, options).format(value);
  },
};
