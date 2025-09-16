// This type is based on the usage in PhoneInput and typical country picker libraries
export type CountryItem = {
  code: string;
  dial_code: string;
  flag: string;
  name: string | { [key: string]: string };
};
