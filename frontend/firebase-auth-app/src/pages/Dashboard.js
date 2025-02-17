import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, update } from "firebase/database";

const Dashboard = () => {
  const navigate = useNavigate();
  const [pnms, setPnms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPnmId, setSelectedPnmId] = useState("");
  const [editPnm, setEditPnm] = useState(null);

  const db = getDatabase();

  useEffect(() => {
    const pnmsRef = ref(db, "pnms");
    const unsubscribe = onValue(pnmsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const pnmList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setPnms(pnmList);
      } else {
        setPnms([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  // ✅ Handle selecting a PNM to edit
  const handleSelectPNM = (e) => {
    const selectedId = e.target.value;
    setSelectedPnmId(selectedId);
    if (selectedId) {
      const selectedPnm = pnms.find((pnm) => pnm.id === selectedId);
      setEditPnm({ ...selectedPnm });
    } else {
      setEditPnm(null);
    }
  };

  // ✅ Handle updating a PNM
  const handleUpdatePNM = async () => {
    if (!selectedPnmId || !editPnm) return;

    try {
      const pnmRef = ref(db, `pnms/${selectedPnmId}`);
      await update(pnmRef, {
        ...editPnm,
        updatedAt: new Date().toISOString(),
      });

      alert(`PNM ${editPnm.fullName} updated successfully!`);
    } catch (error) {
      console.error("Error updating PNM:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>PNM Dashboard</h2>
      <button onClick={() => navigate("/referral")} style={styles.referralButton}>
        Add New PNM via Referral
      </button>

      <h3>Edit a PNM Record</h3>
      <select onChange={handleSelectPNM} style={styles.input}>
        <option value="">Select a PNM to Edit</option>
        {pnms.map((pnm) => (
          <option key={pnm.id} value={pnm.id}>{pnm.fullName}</option>
        ))}
      </select>

      {editPnm && (
        <div>
          <input type="text" placeholder="Full Name" value={editPnm.fullName}
            onChange={(e) => setEditPnm({ ...editPnm, fullName: e.target.value })} style={styles.input} />
          <input type="text" placeholder="Phone" value={editPnm.contactInfo?.phone || ""}
            onChange={(e) => setEditPnm({ ...editPnm, contactInfo: { ...editPnm.contactInfo, phone: e.target.value } })} style={styles.input} />
          <input type="text" placeholder="Email" value={editPnm.contactInfo?.email || ""}
            onChange={(e) => setEditPnm({ ...editPnm, contactInfo: { ...editPnm.contactInfo, email: e.target.value } })} style={styles.input} />
          <input type="text" placeholder="Status" value={editPnm.status || ""}
            onChange={(e) => setEditPnm({ ...editPnm, status: e.target.value })} style={styles.input} />
          <button onClick={handleUpdatePNM} style={styles.updateButton}>Update PNM</button>
        </div>
      )}

      <h3>All PNMs</h3>
      {loading ? <p>Loading PNMs...</p> : (
        <div>
          {pnms.length === 0 ? (
            <p>No PNMs found.</p>
          ) : (
            pnms.map((pnm) => (
              <div key={pnm.id} style={styles.pnmCard}>
                <h4>{pnm.fullName}</h4>
                <p><strong>Phone:</strong> {pnm.contactInfo?.phone}</p>
                <p><strong>Email:</strong> {pnm.contactInfo?.email}</p>
                <p><strong>Status:</strong> {pnm.status}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ✅ Styles




// ✅ Define styles object
    const styles = {
    container: {
      textAlign: "center",
      padding: "20px"
    },
    logoutButton: {
      backgroundColor: "#d9534f",
      color: "white",
      border: "none",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer"
    },
    input: {
      width: "80%",
      padding: "8px",
      margin: "10px 0",
      borderRadius: "5px",
      border: "1px solid #ccc"
    },
    addButton: {
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
      marginBottom: "20px"
    },
    pnmCard: {
      border: "1px solid #ddd",
      padding: "15px",
      margin: "10px auto",
      width: "60%",
      borderRadius: "8px",
      boxShadow: "2px 2px 10px rgba(0,0,0,0.1)"
    },
    updateButton: {
      backgroundColor: "#34a853",
      color: "white",
      border: "none",
      padding: "8px",
      borderRadius: "5px",
      cursor: "pointer"
    }
  };
  

  
export default Dashboard;
