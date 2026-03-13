export function setAdminSession(token: string) {
  localStorage.setItem("adminToken", token);
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("adminToken");

  return !!token;
}

export function clearAdminSession() {
  localStorage.removeItem("adminToken");
}
