import { useState, useCallback } from "react";

const USERS_KEY = "sf_users";
const SESSION_KEY = "sf_current_user";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
  catch { return null; }
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => getSession());
  const [authPage, setAuthPage] = useState("login"); // "login" | "register"

  /**
   * Register a new user.
   * Checks: unique username, unique email.
   * Stores: { username, email, password, createdAt }
   */
  const register = useCallback(({ username, email, password }) => {
    const users = getUsers();

    const normalUser = username.trim().toLowerCase();
    const normalEmail = email.trim().toLowerCase();

    if (users.find((u) => u.username.toLowerCase() === normalUser)) {
      return { ok: false, field: "username", error: "Username is already taken." };
    }
    if (users.find((u) => u.email.toLowerCase() === normalEmail)) {
      return { ok: false, field: "email", error: "An account with this email already exists." };
    }

    const newUser = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    return { ok: true };
  }, []);

  /**
   * Login with username OR email + password.
   * Saves { username, email, loginAt } as session.
   */
  const login = useCallback(({ identifier, password }) => {
    const users = getUsers();
    const key = identifier.trim().toLowerCase();

    const user = users.find(
      (u) =>
        (u.username.toLowerCase() === key || u.email.toLowerCase() === key) &&
        u.password === password
    );

    if (!user) {
      return { ok: false, error: "Incorrect username / email or password." };
    }

    const session = {
      username: user.username,
      email: user.email,
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setCurrentUser(session);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setAuthPage("login");
  }, []);

  return { currentUser, authPage, setAuthPage, register, login, logout };
}