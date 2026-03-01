const navigate = useNavigate();

const handleRegister = async (e) => {
  e.preventDefault();

  const res = await fetch("http://localhost:5000/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await res.json();

  if (res.ok) {
    alert("Registration successful! Please login.");
    navigate("/login");
  } else {
    alert(data.message);
  }
};
