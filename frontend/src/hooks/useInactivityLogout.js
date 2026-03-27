import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

/**
 * useInactivityLogout
 * Call this inside any protected layout/page.
 * Listens for mouse, keyboard, touch events. If none for 15 mins, logs the user out.
 */
const useInactivityLogout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const reset = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        logout();
        const dest = user.role === "admin" ? "/admin/login" : "/login";
        navigate(dest, { state: { sessionExpired: true } });
      }, INACTIVITY_LIMIT);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, reset));
    reset(); // start timer immediately

    return () => {
      clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [user, logout, navigate]);
};

export default useInactivityLogout;