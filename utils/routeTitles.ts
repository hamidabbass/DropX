import TermsOfService from "@/app/termsofservice";

export type RoutePath =
  | '/onboarding'
  | '/onboarding2'
  | '/onboarding3'
  | '/auth'
  | '/signin'
  | '/signup'
  | '/'; 

export const routeTitles: Record<
  string,
  { title: string; showBack?: boolean; fallbackRoute?: RoutePath }
> = {
  onboarding2: { title: '', showBack: false },
  onboarding3: { title: '', showBack: false },
  splash: { title: '', showBack: false },
  onboarding: { title: '', showBack: false },
  auth: { title: '', showBack: false },
  signin: {
    title: 'Login',
    showBack: true,
    fallbackRoute: '/auth', 
  },
  signup: {
    title: 'Register',
    showBack: true,
    fallbackRoute: '/auth', 
  },
  signupdriver: {
    title: 'Register Driver',
    showBack: true,
    fallbackRoute: '/signup', 
  },
  signupsender: {
    title: 'Register Sender',
    showBack: true,
    fallbackRoute: '/signup', 
  },
  privacypolicy: {
    title: 'Privacy Policy',
    showBack: true,
    fallbackRoute: '/signup', 
  },
  termsofservice: {
    title: 'Terms of Service',
    showBack: true,
    fallbackRoute: '/signup', 
  },
  personalinfo: {
    title: '',
    showBack: false,
  },
};
