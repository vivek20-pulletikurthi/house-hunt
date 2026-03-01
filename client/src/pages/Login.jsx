const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  const res = await fetch("http://localhost:5000/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/home");
  } else {
    alert(data.message);
  }
};
