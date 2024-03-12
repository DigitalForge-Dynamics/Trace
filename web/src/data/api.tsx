interface UserloginData {
  username: string;
  password: string;
}

export const fetchUserAuth = async (userData: UserloginData) => {
  const res = await fetch("https://ominous-waffle-qxvv4prj97g2x4v4-3000.app.github.dev/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: userData.username,
      password: userData.password,
    }),
  });

  const data = res.json();
  return data;
};
