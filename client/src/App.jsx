import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function App() {

  const [page, setPage] = useState("register");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [searchCity, setSearchCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const [propertyForm, setPropertyForm] = useState({
    propType: "",
    address: "",
    amount: "",
    additionalInfo: "",
    contact: "",
    image: ""
  });

  const [properties, setProperties] = useState([]);

  /* ================= REGISTER ================= */
  const register = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        form
      );
      setMessage(res.data.message);
      setPage("login");
    } catch {
      setMessage("Registration failed");
    }
  };

  /* ================= LOGIN ================= */
  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: form.email,
          password: form.password
        }
      );
      setUser(res.data);
      setPage(res.data.role);
    } catch {
      setMessage("Invalid credentials");
    }
  };

  /* ================= FETCH ================= */
  const fetchOwnerProperties = async (ownerId) => {
    const res = await axios.get(
      `http://localhost:5000/api/properties/owner/${ownerId}`
    );
    setProperties(res.data);
  };

  const fetchAllProperties = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/properties/all"
    );
    setProperties(res.data);
  };

  /* ================= ADD PROPERTY ================= */
  const addProperty = async () => {

    if (
      !propertyForm.propType ||
      !propertyForm.address ||
      !propertyForm.amount ||
      !propertyForm.additionalInfo ||
      !propertyForm.contact
    ) {
      alert("All fields required");
      return;
    }

    await axios.post("http://localhost:5000/api/properties/add", {
      ...propertyForm,
      ownerId: user.id
    });

    alert("Property Added Successfully!");

    setPropertyForm({
      propType: "",
      address: "",
      amount: "",
      additionalInfo: "",
      contact: "",
      image: ""
    });

    fetchOwnerProperties(user.id);
  };

  useEffect(() => {
    if (user?.role === "owner") fetchOwnerProperties(user.id);
    if (user?.role === "renter") fetchAllProperties();
  }, [user]);

  const logout = () => {
    setUser(null);
    setPage("login");
    setSearchCity("");
    setMinPrice("");
    setMaxPrice("");
    setSearchClicked(false);
  };

  /* ================= FILTER LOGIC ================= */
  const filteredProperties = properties.filter((p) => {
    return (
      p.address === searchCity &&
      Number(p.amount) >= Number(minPrice) &&
      Number(p.amount) <= Number(maxPrice)
    );
  });

  const handleSearch = () => {
    if (!searchCity || !minPrice || !maxPrice) {
      alert("Please select city and enter min & max price");
      return;
    }
    setSearchClicked(true);
  };

  return (
    <div className="background">
      <div className="container">
        <div className="card">

          <h1>RentEase</h1>

          {user && (
            <>
              <h2>{user.role} Dashboard</h2>

              {/* ================= OWNER ================= */}
              {user.role === "owner" && (
                <>
                  <h3>Add Property</h3>

                  <input
                    placeholder="Property Type (2BHK, Villa...)"
                    value={propertyForm.propType}
                    onChange={(e)=>
                      setPropertyForm({...propertyForm,propType:e.target.value})
                    }
                  />

                  <select
                    value={propertyForm.address}
                    onChange={(e)=>
                      setPropertyForm({...propertyForm,address:e.target.value})
                    }
                  >
                    <option value="">Select City</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Amount"
                    value={propertyForm.amount}
                    onChange={(e)=>
                      setPropertyForm({...propertyForm,amount:e.target.value})
                    }
                  />

                  <input
                    placeholder="Additional Info"
                    value={propertyForm.additionalInfo}
                    onChange={(e)=>
                      setPropertyForm({...propertyForm,additionalInfo:e.target.value})
                    }
                  />

                  <input
                    placeholder="Contact Number"
                    value={propertyForm.contact}
                    onChange={(e)=>
                      setPropertyForm({...propertyForm,contact:e.target.value})
                    }
                  />

                  <input
                    placeholder="Image URL"
                    value={propertyForm.image}
                    onChange={(e)=>
                      setPropertyForm({...propertyForm,image:e.target.value})
                    }
                  />

                  <button onClick={addProperty}>Add Property</button>

                  <h3>Your Properties</h3>

                  <div className="property-grid">
                    {properties.map((p)=>(
                      <div key={p._id} className="property-card">
                        {p.image && (
                          <img
                            src={p.image}
                            alt="property"
                            style={{
                              width:"100%",
                              height:"150px",
                              objectFit:"cover",
                              borderRadius:"8px"
                            }}
                          />
                        )}
                        <h4>{p.propType}</h4>
                        <p>{p.address}</p>
                        <p>₹ {p.amount}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ================= RENTER ================= */}
              {user.role === "renter" && (
                <>
                  <h3>Search Properties</h3>

                  <select
                    value={searchCity}
                    onChange={(e)=>{
                      setSearchCity(e.target.value);
                      setSearchClicked(false);
                    }}
                  >
                    <option value="">Select City</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e)=>{
                      setMinPrice(e.target.value);
                      setSearchClicked(false);
                    }}
                  />

                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e)=>{
                      setMaxPrice(e.target.value);
                      setSearchClicked(false);
                    }}
                  />

                  <button
                    onClick={handleSearch}
                    style={{ marginTop: "10px" }}
                  >
                    Search
                  </button>

                  {searchClicked && (
                    <div className="property-grid">
                      {filteredProperties.length === 0 ? (
                        <p>No properties found</p>
                      ) : (
                        filteredProperties.map((p)=>(
                          <div key={p._id} className="property-card">
                            {p.image && (
                              <img
                                src={p.image}
                                alt="property"
                                style={{
                                  width:"100%",
                                  height:"150px",
                                  objectFit:"cover",
                                  borderRadius:"8px"
                                }}
                              />
                            )}
                            <h4>{p.propType}</h4>
                            <p>{p.address}</p>
                            <p>₹ {p.amount}</p>
                            <p>{p.additionalInfo}</p>

                            <button
                              onClick={()=>alert("Booking Confirmed!")}
                              style={{marginTop:"10px"}}
                            >
                              Book Now
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}

              <button onClick={logout}>Logout</button>
            </>
          )}

          {/* REGISTER */}
          {!user && page === "register" && (
            <>
              <h2>Register</h2>

              <input
                placeholder="Name"
                onChange={(e)=>setForm({...form,name:e.target.value})}
              />

              <input
                placeholder="Email"
                onChange={(e)=>setForm({...form,email:e.target.value})}
              />

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e)=>setForm({...form,password:e.target.value})}
                />
                <span
                  onClick={()=>setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "10px",
                    cursor: "pointer"
                  }}
                >
                  👁
                </span>
              </div>

              <select onChange={(e)=>setForm({...form,role:e.target.value})}>
                <option value="">Select Role</option>
                <option value="owner">Owner</option>
                <option value="renter">Renter</option>
              </select>

              <button onClick={register}>Register</button>
              <p>{message}</p>
              <p onClick={()=>setPage("login")}>Already registered? Login</p>
            </>
          )}

          {/* LOGIN */}
          {!user && page === "login" && (
            <>
              <h2>Login</h2>

              <input
                placeholder="Email"
                onChange={(e)=>setForm({...form,email:e.target.value})}
              />

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e)=>setForm({...form,password:e.target.value})}
                />
                <span
                  onClick={()=>setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "10px",
                    cursor: "pointer"
                  }}
                >
                  👁
                </span>
              </div>

              <button onClick={login}>Login</button>
              <p>{message}</p>
              <p onClick={()=>setPage("register")}>New user? Register</p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}