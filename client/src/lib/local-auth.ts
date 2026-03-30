import type { User } from "@/types";

const ACCOUNTS_KEY = "smashutme-local-accounts";
const AUTH_USER_KEY = "smashutme-auth-user";

type LocalAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
};

function readAccounts(): LocalAccount[] {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as LocalAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: LocalAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function getCurrentAuthUser(): User | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as User;
    if (!parsed?.id || !parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setCurrentAuthUser(user: User) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearCurrentAuthUser() {
  localStorage.removeItem(AUTH_USER_KEY);
}

export function registerLocalUser(input: {
  fullName: string;
  email: string;
  password: string;
}): User {
  const email = input.email.trim().toLowerCase();
  const accounts = readAccounts();

  if (accounts.some((account) => account.email.toLowerCase() === email)) {
    throw new Error("Email is already registered.");
  }

  const newAccount: LocalAccount = {
    id: `local-${Date.now()}`,
    name: input.fullName.trim(),
    email,
    password: input.password,
  };

  accounts.push(newAccount);
  saveAccounts(accounts);

  return { id: newAccount.id, name: newAccount.name, email: newAccount.email };
}

export function loginLocalUser(input: { email: string; password: string }): User {
  const email = input.email.trim().toLowerCase();
  const account = readAccounts().find((item) => item.email.toLowerCase() === email);

  if (!account) {
    throw new Error("No account found with this email.");
  }

  if (account.password !== input.password) {
    throw new Error("Incorrect password.");
  }

  return { id: account.id, name: account.name, email: account.email };
}
