import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Package,
  Clock,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { supabase } from "./supabase";
import "./App.css";


function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <div className="logo-icon">M</div>
        <span>MediTrace</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/medicines">Medicines</Link>
        <Link to="/pharmacies">Pharmacies</Link>
        <Link to="/requests">My Requests</Link>
        <Link to="/about">About</Link>
        
      </div>

      <Link to="/login" className="login-btn">
        Login
      </Link>
    </nav>
  );
}


// HOME PAGE
function Home() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getMedicines();
  }, []);

  async function getMedicines() {
    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .order("name");

    if (error) {
      console.error(error);
    } else {
      setMedicines(data || []);
    }
  }

  const filtered = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(search.toLowerCase()) ||
    medicine.generic_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="hero">
        <div className="hero-content">

          <div className="badge">
            <ShieldCheck size={16} />
            Medicine transparency platform
          </div>

          <h1>
            Find the right medicine.
            <br />
            <span>Know where it is.</span>
          </h1>

          <p>
            Search medicine availability across pharmacies,
            check stock and expiry information, and make
            smarter healthcare decisions.
          </p>

          <div className="search-box">
            <Search size={22} />

            <input
              placeholder="Search for a medicine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={() =>
                document
                  .getElementById("medicines")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Search
            </button>
          </div>

          <div className="quick-info">
            <div>
              <Package size={18} />
              Live stock information
            </div>

            <div>
              <Clock size={18} />
              Batch & expiry tracking
            </div>

            <div>
              <MapPin size={18} />
              Pharmacy availability
            </div>
          </div>

        </div>
      </section>

      <section className="medicine-section" id="medicines">

        <div className="section-heading">
          <div>
            <p className="section-label">EXPLORE</p>
            <h2>Available medicines</h2>
          </div>

          <span className="medicine-count">
            {filtered.length} medicines
          </span>
        </div>

        <div className="medicine-grid">

          {filtered.map((medicine) => (
            <div className="medicine-card" key={medicine.id}>

              <div className="medicine-icon">
                💊
              </div>

              <div className="medicine-category">
                {medicine.category}
              </div>

              <h3>{medicine.name}</h3>

              <p className="generic">
                {medicine.generic_name}
              </p>

              <p className="strength">
                {medicine.strength}
              </p>

              <div className="card-footer">
                <span>
                  <ShieldCheck size={16} />
                  Tracked
                </span>

                <Link to={`/medicines/${medicine.id}`}>
                  View details <ArrowRight size={14} />
                </Link>
              </div>

            </div>
          ))}

        </div>
      </section>

      <section className="features">

        <p className="section-label">WHY MEDITRACE?</p>

        <h2>Transparency at every step.</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Stock visibility</h3>
            <p>
              Check medicine availability across
              participating pharmacies.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔎</div>
            <h3>Batch tracking</h3>
            <p>
              View batch numbers and expiry information
              provided by pharmacies.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">♻️</div>
            <h3>Reduce wastage</h3>
            <p>
              Better stock visibility can help reduce
              medicine wastage.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}


// PHARMACIES PAGE
function Pharmacies() {
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    getPharmacies();
  }, []);

  async function getPharmacies() {
    const { data, error } = await supabase
      .from("pharmacies")
      .select("*")
      .order("name");

    if (error) {
      console.error(error);
    } else {
      setPharmacies(data || []);
    }
  }

  return (
    <section className="page-section">

      <p className="section-label">FIND A PHARMACY</p>

      <h1>Pharmacies</h1>

      <p className="page-description">
        Find participating pharmacies and their available
        medicine stock.
      </p>

      <div className="pharmacy-grid">

        {pharmacies.map((pharmacy) => (
          <div className="pharmacy-card" key={pharmacy.id}>

            <div className="pharmacy-icon">
              🏥
            </div>

            <div>
              <h2>{pharmacy.name}</h2>

              <p>
                <MapPin size={15} />
                {pharmacy.address}
              </p>

              <p>
                📞 {pharmacy.phone}
              </p>

              {pharmacy.verified && (
                <span className="verified">
                  ✓ Verified pharmacy
                </span>
              )}
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}


// LOGIN PAGE
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
  setMessage(error.message);
} else {
  navigate("/dashboard");
}
  }

  return (
    <section className="login-page">

      <div className="login-card">

        <div className="logo login-logo">
          <div className="logo-icon">M</div>
          <span>MediTrace</span>
        </div>

        <h1>Welcome back</h1>

        <p>
          Login to access your MediTrace account.
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        {message && (
          <p className="login-message">{message}</p>
        )}

      </div>

    </section>
  );
}


// ABOUT PAGE
function About() {
  return (
    <section className="page-section about-page">

      <p className="section-label">ABOUT MEDITRACE</p>

      <h1>Making medicine availability more transparent.</h1>

      <p className="about-text">
        MediTrace is a medicine quality and stock transparency
        platform designed to help users find medicines across
        participating pharmacies while viewing stock, batch
        and expiry information.
      </p>

      <div className="about-box">
        <h2>Our goal</h2>
        <p>
          Improve medicine availability, reduce unnecessary
          stock wastage, and make pharmacy information easier
          to access.
        </p>
      </div>

    </section>
  );
}


// MEDICINE DETAILS
function MedicineDetails({ id }) {
  const [requestQuantity, setRequestQuantity] = useState(1);
const [requestMessage, setRequestMessage] = useState("");
const [requestedPharmacy, setRequestedPharmacy] = useState(null);
const [requesting, setRequesting] = useState(null);

  const [medicine, setMedicine] = useState(null);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    loadDetails();
  }, []);

  async function loadDetails() {

    const { data: med } = await supabase
      .from("medicines")
      .select("*")
      .eq("id", id)
      .single();

    setMedicine(med);

    const { data } = await supabase
      .from("inventory")
      .select(`
        *,
        pharmacies (
          name,
          address
        )
      `)
      .eq("medicine_id", id);

    setInventory(data || []);
  }

  if (!medicine) {
    return <div className="loading">Loading...</div>;
  }
  async function handleRequest(pharmacyId) {
 setRequesting(pharmacyId);
  setRequestMessage("");
  setRequestedPharmacy(pharmacyId);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    setRequestMessage("Please login to request medicine.");
    setRequesting(null);
    return;
  }

  const { error } = await supabase
    .from("requests")
    .insert({
      user_id: user.id,
      medicine_id: medicine.id,
      pharmacy_id: pharmacyId,
      quantity: Number(requestQuantity),
      status: "pending"
    });

  if (error) {
    console.error(error);
    setRequestMessage(error.message);
  } else {
    setRequestMessage("Medicine requested successfully!");
    setRequestQuantity(1);
  }

  setRequesting(null);
}
  return (
    <section className="page-section">

      <Link to="/" className="back-link">
        ← Back to medicines
      </Link>

      <p className="section-label">{medicine.category}</p>

      <h1>{medicine.name}</h1>

      <p className="page-description">
        {medicine.generic_name} · {medicine.strength}
      </p>

      <h2 className="availability-title">
        Pharmacy availability
      </h2>

      <div className="availability-list">

        {inventory.map((item) => {

          let stock = "Available";

          if (item.quantity === 0) {
            stock = "Out of stock";
          } else if (item.quantity <= 10) {
            stock = "Low stock";
          }

          return (
            <div className="availability-card" key={item.id}>

              <div>
                <h3>{item.pharmacies?.name}</h3>

                <p>{item.pharmacies?.address}</p>

                <p>
                  Batch: <strong>{item.batch_number}</strong>
                </p>

                <p>
                  Expiry: <strong>{item.expiry_date}</strong>
                </p>
              </div>

              <div className={`stock ${stock.replace(" ", "-").toLowerCase()}`}>
  {stock}
  <small>
    {item.quantity} units
  </small>
</div>

{item.quantity > 0 && (
  <button
    className="request-medicine-btn"
    onClick={() => handleRequest(item.pharmacy_id)}
    disabled={requesting === item.pharmacy_id}
  >
    {requesting === item.pharmacy_id ? "Requesting..." : "Request Medicine"}
  </button>
)}
{requestMessage && requestedPharmacy === item.pharmacy_id && (
  <p className="request-message">{requestMessage}</p>
)}

            </div>
          );
        })}

      </div>

    </section>
  );
}

// PHARMACY DASHBOARD
function Dashboard() {
  const [editingItem, setEditingItem] = useState(null);
const [editBatch, setEditBatch] = useState("");
const [editQuantity, setEditQuantity] = useState("");
const [editExpiry, setEditExpiry] = useState("");
const [editMessage, setEditMessage] = useState("");
const [updating, setUpdating] = useState(false);

  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
const [loadingRequests, setLoadingRequests] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [medicineId, setMedicineId] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
 const [message, setMessage] = useState("");
const [saving, setSaving] = useState(false);

const [chemicalComposition, setChemicalComposition] = useState("");
const [compositionStatus, setCompositionStatus] = useState("Not Verified");

 useEffect(() => {
  loadInventory();
  loadMedicines();
  loadRequests();
}, []);

  async function loadInventory() {
    const { data, error } = await supabase
      .from("inventory")
     .select(`
  id,
  batch_number,
  quantity,
  expiry_date,
  entered_composition,
  composition_status,
  medicines (
    name,
    strength
  ),
  pharmacies (
          id,
          name
        )
      `)
      .eq("pharmacy_id", 1)
      .order("expiry_date");

    if (error) {
      console.error(error);
    } else {
      setInventory(data || []);
    }

    setLoading(false);
  }

  async function loadMedicines() {
  const { data, error } = await supabase
    .from("medicines")
    .select("id, name, strength, chemical_composition")
    .order("name");

  if (error) {
    console.error(error);
  } else {
    setMedicines(data || []);
  }
}
  async function loadRequests() {
  const { data, error } = await supabase
    .from("requests")
    .select(`
      id,
      quantity,
      status,
      created_at,
      medicines (
        name,
        strength
      )
    `)
    .eq("pharmacy_id", 1)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  } else {
    setRequests(data || []);
  }

  setLoadingRequests(false);
}
async function updateRequestStatus(requestId, newStatus) {
  const { error } = await supabase
    .from("requests")
    .update({ status: newStatus })
    .eq("id", requestId)
    .eq("pharmacy_id", 1);

  if (error) {
    alert(error.message);
    return;
  }

   loadRequests();

}

function verifyComposition() {
  const selectedMedicine = medicines.find(
    medicine => medicine.id === Number(medicineId)
  );

  if (!selectedMedicine) {
    setCompositionStatus("Not Verified");
    setMessage("Please select a medicine first.");
    return;
  }

  if (!chemicalComposition.trim()) {
    setCompositionStatus("Not Verified");
    setMessage("Please enter the chemical composition.");
    return;
  }

  const entered = chemicalComposition.trim().toLowerCase();

  const reference = (selectedMedicine.chemical_composition || "")
    .trim()
    .toLowerCase();

  if (entered === reference) {
    setCompositionStatus("Verified");
    setMessage("Composition Verified ✓");
  } else {
    setCompositionStatus("Mismatch");
    setMessage("Composition Mismatch ✕");
  }
}

async function handleAddStock(e) {
  e.preventDefault();

  if (
    !medicineId ||
    !batchNumber ||
    !quantity ||
    !expiryDate ||
    !chemicalComposition
  ) {
    setMessage("Please fill all fields.");
    return;
  }

  if (compositionStatus !== "Verified") {
    setMessage("Please verify the chemical composition first.");
    return;
  }

  setSaving(true);
  setMessage("");

  const { error } = await supabase
    .from("inventory")
    .insert({
      medicine_id: Number(medicineId),
      pharmacy_id: 1,
      batch_number: batchNumber,
      quantity: Number(quantity),
      expiry_date: expiryDate,
      entered_composition: chemicalComposition.trim(),
      composition_status: "Verified"
    });

  if (error) {
    console.error(error);
    setMessage(error.message);
    setSaving(false);
    return;
  }

  setMessage("Stock added successfully!");

  setMedicineId("");
  setBatchNumber("");
  setQuantity("");
  setExpiryDate("");
  setChemicalComposition("");
  setCompositionStatus("Not Verified");

  await loadInventory();

  setSaving(false);

  setTimeout(() => {
    setShowForm(false);
    setMessage("");
  }, 1000);
}

  function getStatus(item) {
    const today = new Date();
    const expiry = new Date(item.expiry_date);

    if (expiry < today) {
      return "Expired";
    }

    if (item.quantity === 0) {
      return "Out of Stock";
    }

    if (item.quantity <= 10) {
      return "Low Stock";
    }

    return "Available";
  }

  const total = inventory.length;

  const available = inventory.filter(
    item => item.quantity > 10
  ).length;

  const lowStock = inventory.filter(
    item => item.quantity > 0 && item.quantity <= 10
  ).length;

  const expired = inventory.filter(
    item => new Date(item.expiry_date) < new Date()
  ).length;

  if (loading) {
    return (
      <div className="page">
        <p>Loading dashboard...</p>
      </div>
    );
  }
  async function handleUpdateStock(e) {
  e.preventDefault();

  setUpdating(true);
  setEditMessage("");

  const { error } = await supabase
    .from("inventory")
    .update({
      batch_number: editBatch,
      quantity: Number(editQuantity),
      expiry_date: editExpiry
    })
    .eq("id", editingItem.id)
    .eq("pharmacy_id", 1);

  if (error) {
    console.error(error);
    setEditMessage(error.message);
  } else {
    setEditMessage("Stock updated successfully!");

    await loadInventory();

    setTimeout(() => {
      setEditingItem(null);
      setEditMessage("");
    }, 800);
  }

  setUpdating(false);
}
async function handleDeleteStock(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this stock?"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("inventory")
    .delete()
    .eq("id", id)
    .eq("pharmacy_id", 1);

  if (error) {
    alert(error.message);
    return;
  }

  await loadInventory();
}
  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <div>
          <h1>CityCare Pharmacy</h1>
          <p>Pharmacy account</p>
        </div>

        <button
          className="add-stock-btn"
          onClick={() => setShowForm(true)}
        >
          + Add stock
        </button>
      </div>

      {/* Add Stock Form */}
      {showForm && (
        <div className="stock-form-overlay">
          <div className="stock-form">

            <h2>Add New Stock</h2>

            <form onSubmit={handleAddStock}>

              <div className="form-group">
                <label>Medicine</label>

                <select
                  value={medicineId}
                  onChange={(e) => setMedicineId(e.target.value)}
                >
                  <option value="">Select medicine</option>

                  {medicines.map((medicine) => (
                    <option
                      key={medicine.id}
                      value={medicine.id}
                    >
                      {medicine.name} {medicine.strength || ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Batch Number</label>

                <input
                  type="text"
                  placeholder="Example: PCM2026A"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Quantity</label>

                <input
                  type="number"
                  min="0"
                  placeholder="Example: 50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Expiry Date</label>

                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <div className="form-group">
  <label>Chemical Composition</label>

  <input
    type="text"
    placeholder="Example: Paracetamol 500mg"
    value={chemicalComposition}
    onChange={(e) => {
      setChemicalComposition(e.target.value);
      setCompositionStatus("Not Verified");
      setMessage("");
    }}
  />

  {medicineId && (
    <small style={{ display: "block", marginTop: "6px", color: "#60736e" }}>
      Reference:{" "}
      {medicines.find(
        medicine => medicine.id === Number(medicineId)
      )?.chemical_composition || "Not available"}
    </small>
  )}
</div>

<button
  type="button"
  className="verify-composition-btn"
  onClick={verifyComposition}
>
  Check Composition
</button>

{compositionStatus === "Verified" && (
  <p className="composition-verified">
    ✓ Composition Verified
  </p>
)}

{compositionStatus === "Mismatch" && (
  <p className="composition-mismatch">
    ✕ Composition Mismatch
  </p>
)}

              {message && (
                <p className="stock-message">
                  {message}
                </p>
              )}

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setMessage("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-stock-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Add Stock"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
            {/* Edit Stock Popup */}
      {editingItem && (
        <div className="stock-form-overlay">

          <div className="stock-form">

            <h2>Edit Stock</h2>

            <p className="edit-medicine-name">
              {editingItem.medicines?.name}{" "}
              {editingItem.medicines?.strength || ""}
            </p>

            <form onSubmit={handleUpdateStock}>

              <div className="form-group">
                <label>Batch Number</label>

                <input
                  type="text"
                  value={editBatch}
                  onChange={(e) => setEditBatch(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Quantity</label>

                <input
                  type="number"
                  min="0"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Expiry Date</label>

                <input
                  type="date"
                  value={editExpiry}
                  onChange={(e) => setEditExpiry(e.target.value)}
                />
              </div>

              {editMessage && (
                <p className="stock-message">
                  {editMessage}
                </p>
              )}

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-stock-btn"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

     
      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Stock Records</h3>
          <p>{total}</p>
        </div>

        <div className="stat-card">
          <h3>Available</h3>
          <p>{available}</p>
        </div>

        <div className="stat-card">
          <h3>Low Stock</h3>
          <p>{lowStock}</p>
        </div>

        <div className="stat-card">
          <h3>Expired</h3>
          <p>{expired}</p>
        </div>

      </div>

      {/* Inventory */}
      <div className="inventory-section">

        <h2>Inventory</h2>

        <div className="inventory-table">

          <div className="table-header">
            <span>Medicine</span>
            <span>Batch</span>
            <span>Quantity</span>
            <span>Expiry</span>
            <span>Status</span>
          </div>

          {inventory.map((item) => (

            <div className="table-row" key={item.id}>

              <span>
                {item.medicines?.name}
                <small>
                  {item.medicines?.strength}
                </small>
              </span>

              <span>{item.batch_number}</span>

              <span>{item.quantity}</span>

              <span>{item.expiry_date}</span>

             <span className="row-actions">

 <span className="inventory-status">
  {getStatus(item)}

  <small
    className={
      item.composition_status === "Verified"
        ? "composition-badge verified"
        : item.composition_status === "Mismatch"
        ? "composition-badge mismatch"
        : "composition-badge not-verified"
    }
  >
    {item.composition_status || "Not Verified"}
  </small>
</span>
  

  <button
    className="edit-stock-btn"
    onClick={() => {
      setEditingItem(item);
      setEditBatch(item.batch_number);
      setEditQuantity(item.quantity);
      setEditExpiry(item.expiry_date);
      setEditMessage("");
    }}
  >
    Edit
  </button>
  <button
  className="delete-stock-btn"
  onClick={() => handleDeleteStock(item.id)}
>
  🗑️
</button>

</span>

            </div>

          ))}

        </div>

      
      </div>
                  {/* Medicine Requests */}
      <div className="inventory-section">

        <h2>Medicine Requests</h2>

        {loadingRequests ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p>No medicine requests yet.</p>
        ) : (
          <div className="inventory-table">

            <div className="table-header">
              <span>Medicine</span>
              <span>Quantity</span>
              <span>Status</span>
              <span>Date</span>
            </div>

            {requests.map((request) => (
              <div className="table-row" key={request.id}>

                <span>
                  {request.medicines?.name}
                  <small>
                    {request.medicines?.strength}
                  </small>
                </span>

                <span>{request.quantity}</span>

                <span>
  {request.status}

  {request.status === "pending" && (
    <div className="request-actions">
      <button
        className="accept-btn"
        onClick={() => updateRequestStatus(request.id, "accepted")}
        style={{ marginRight: "6px" }}
      >
        Accept
      </button>

      <button
        className="reject-btn"
        onClick={() => updateRequestStatus(request.id, "rejected")}
      >
        Reject
      </button>
    </div>
  )}
</span>

                <span>
                  {new Date(request.created_at).toLocaleDateString()}
                </span>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}
function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    setMessage("");

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please login to view your requests.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("requests")
      .select(`
        id,
        quantity,
        status,
        created_at,
        medicines(name),
        pharmacies(name, address)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("Could not load your requests.");
    } else {
      setRequests(data || []);
    }

    setLoading(false);
  }

  return (
    <div className="page-section requests-page">
      <div className="section-heading">
        <h2>My Requests</h2>
        <p>Track the status of your medicine requests.</p>
      </div>

      {loading && <p>Loading your requests...</p>}

      {!loading && message && (
        <div className="request-message">
          <p>{message}</p>
          <Link to="/login" className="primary-btn">
            Login
          </Link>
        </div>
      )}

      {!loading && !message && requests.length === 0 && (
        <div className="empty-requests">
          <h3>No requests yet</h3>
          <p>
            Search for a medicine and request it from an available pharmacy.
          </p>
          <Link to="/medicines" className="primary-btn">
            Browse Medicines
          </Link>
        </div>
      )}

      {!loading && !message && requests.length > 0 && (
        <div className="requests-list">
          {requests.map((request) => (
            <div className="request-card" key={request.id}>
              <div className="request-card-top">
                <div>
                  <h3>{request.medicines?.name || "Medicine"}</h3>
                  <p className="request-pharmacy">
                    {request.pharmacies?.name || "Pharmacy"}
                  </p>
                  <p className="request-address">
                    {request.pharmacies?.address || "Address unavailable"}
                  </p>
                </div>

                <span
                  className={`request-status ${request.status?.toLowerCase()}`}
                >
                  {request.status}
                </span>
              </div>

              <div className="request-details">
                <span>
                  <strong>Quantity:</strong> {request.quantity}
                </span>

                <span>
                  <strong>Requested:</strong>{" "}
                  {request.created_at
                    ? new Date(request.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// ROUTER
function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/medicines"
          element={<Home />}
        />

        <Route
          path="/medicines/:id"
          element={<MedicineRoute />}
        />

        <Route
          path="/pharmacies"
          element={<Pharmacies />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/about"
          element={<About />}
        />
        <Route path="/requests" element={<MyRequests />} />
        <Route path="/dashboard" element={<Dashboard />} />

        

      </Routes>

      <footer>
        <div className="logo">
          <div className="logo-icon">M</div>
          <span>MediTrace</span>
        </div>

        <p>
          Medicine Quality & Stock Transparency Platform
        </p>
      </footer>

    </BrowserRouter>
  );
}


function MedicineRoute() {
  const id = window.location.pathname.split("/").pop();

  return <MedicineDetails id={id} />;
}


export default App;