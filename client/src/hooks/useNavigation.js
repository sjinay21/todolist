import { useRouter } from "next/navigation";
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  TODOS: "/todos",
  ADMIN: "/admin",
  SETTINGS: "/settings",
};

export const useAppNavigation = () => {
  const router = useRouter();

  return {
    goToLogin: () => router.push(ROUTES.LOGIN),
    goToRegister: () => router.push(ROUTES.REGISTER),
    goToTodos: () => router.push(ROUTES.TODOS),
    goToAdmin: () => router.push(ROUTES.ADMIN),
    goToHome: () => router.push(ROUTES.HOME),
    goToSettings: () => router.push(ROUTES.SETTINGS),
  };
};
