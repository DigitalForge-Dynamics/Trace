interface UserloginData {
  username: string;
  password: string;
}

export const fetchUserAuth = async (userData: UserloginData) => {
  const res = await fetch("http://localhost:3000/auth/login", {
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
