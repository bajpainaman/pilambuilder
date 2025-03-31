import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDatabase } from "../contexts/DatabaseContext";
import Layout from "../components/UI/Layout";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

const Dashboard = () => {
  // States for PNM data and UI
  const [pnms, setPnms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPnmId, setSelectedPnmId] = useState("");
  const [editPnm, setEditPnm] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get auth and database contexts
  const { currentUser } = useAuth();
  const { subscribeToCollection, updateRecord, error: dbError } = useDatabase();
  const navigate = useNavigate();

  // Fetch PNMs on component mount
  useEffect(() => {
    const unsubscribe = subscribeToCollection("pnms", (data) => {
      setPnms(data);
      setLoading(false);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [subscribeToCollection]);

  // Handle selecting a PNM to edit
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

  // Handle updating a PNM
  const handleUpdatePNM = async () => {
    if (!selectedPnmId || !editPnm) return;

    try {
      await updateRecord(`pnms/${selectedPnmId}`, {
        ...editPnm,
        updatedAt: new Date().toISOString(),
      });

      alert(`${editPnm.fullName} updated successfully!`);
    } catch (error) {
      console.error("Error updating PNM:", error);
    }
  };

  // Filter PNMs based on status and search term
  const filteredPnms = pnms.filter((pnm) => {
    const matchesStatus = filterStatus === "all" || pnm.status === filterStatus;
    const matchesSearch = !searchTerm || 
      pnm.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pnm.contactInfo?.email && pnm.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pnm.contactInfo?.phone && pnm.contactInfo.phone.includes(searchTerm));
    
    return matchesStatus && matchesSearch;
  });

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "#4CAF50"; // Green
      case "Rejected":
        return "#F44336"; // Red
      case "In Progress":
        return "#2196F3"; // Blue
      case "Pending":
      default:
        return "#FFC107"; // Amber
    }
  };

  // Get status badge style
  const getStatusBadgeStyle = (status) => ({
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "12px",
    backgroundColor: getStatusColor(status),
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
  });

  // Button to add new PNM
  const AddPnmButton = () => (
    <Button 
      onClick={() => navigate("/referral")} 
      variant="success"
      style={{ marginBottom: "20px" }}
    >
      Add New PNM
    </Button>
  );

  return (
    <Layout title="PNM Dashboard">
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
        <h3 style={{ margin: 0, fontSize: 'clamp(16px, 4vw, 18px)', wordBreak: 'break-word' }}>
          Welcome, {currentUser?.displayName || currentUser?.email || "Brother"}
        </h3>
        <AddPnmButton />
      </div>

      {dbError && (
        <Card title="Error" elevation={2} style={{ marginBottom: "20px", backgroundColor: "#FFEBEE" }}>
          <p>{dbError}</p>
        </Card>
      )}

      <Card title="Filter PNMs" elevation={1}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "15px" }}>
          <Input 
            label="Search PNMs"
            placeholder="Name, Email, or Phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth={false}
            style={{ flex: 2, minWidth: "250px", width: "100%" }}
          />
          
          <div style={{ flex: 1, minWidth: "150px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "bold" }}>
              Filter by Status
            </label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "16px",
                width: "100%",
                minHeight: "44px",
                appearance: "none",
                backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"black\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
                paddingRight: "32px"
              }}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Edit PNM" elevation={1}>
        <select 
          onChange={handleSelectPNM} 
          value={selectedPnmId}
          style={{
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontSize: "16px",
            width: "100%",
            marginBottom: "15px",
            minHeight: "44px",
            appearance: "none",
            backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"black\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 8px center",
            paddingRight: "32px"
          }}
        >
          <option value="">Select a PNM to Edit</option>
          {pnms.map((pnm) => (
            <option key={pnm.id} value={pnm.id}>{pnm.fullName}</option>
          ))}
        </select>

        {editPnm && (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <Input 
                label="Full Name"
                value={editPnm.fullName}
                onChange={(e) => setEditPnm({ ...editPnm, fullName: e.target.value })}
                style={{ flex: 1, minWidth: "250px", width: "100%" }}
              />
              
              <Input 
                label="Phone"
                type="tel"
                value={editPnm.contactInfo?.phone || ""}
                onChange={(e) => setEditPnm({ 
                  ...editPnm, 
                  contactInfo: { ...editPnm.contactInfo, phone: e.target.value } 
                })}
                style={{ flex: 1, minWidth: "250px", width: "100%" }}
              />
              
              <Input 
                label="Email"
                type="email"
                value={editPnm.contactInfo?.email || ""}
                onChange={(e) => setEditPnm({ 
                  ...editPnm, 
                  contactInfo: { ...editPnm.contactInfo, email: e.target.value } 
                })}
                style={{ flex: 1, minWidth: "250px", width: "100%" }}
              />
            </div>
            
            <div style={{ marginTop: "15px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "bold" }}>
                Status
              </label>
              <select 
                value={editPnm.status || "Pending"}
                onChange={(e) => setEditPnm({ ...editPnm, status: e.target.value })}
                style={{
                  padding: "12px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                  width: "100%",
                  marginBottom: "15px",
                  minHeight: "44px",
                  appearance: "none",
                  backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"black\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                  paddingRight: "32px"
                }}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <Button onClick={handleUpdatePNM} variant="success">
              Update PNM
            </Button>
          </div>
        )}
      </Card>

      <Card title={`PNM List (${filteredPnms.length})`} elevation={1}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Loading PNMs...</p>
          </div>
        ) : (
          <div>
            {filteredPnms.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <p>No PNMs found matching your criteria.</p>
                <AddPnmButton />
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "15px" }}>
                {filteredPnms.map((pnm) => (
                  <Card 
                    key={pnm.id} 
                    elevation={1} 
                    padding="15px"
                    onClick={() => {
                      setSelectedPnmId(pnm.id);
                      setEditPnm({ ...pnm });
                    }}
                    style={{ cursor: "pointer", width: "100%" }}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <h3 style={{ margin: "0 0 10px 0", fontSize: 'clamp(16px, 4vw, 18px)', wordBreak: 'break-word' }}>{pnm.fullName}</h3>
                      <span style={getStatusBadgeStyle(pnm.status || "Pending")}>
                        {pnm.status || "Pending"}
                      </span>
                    </div>
                    
                    <div style={{ fontSize: "14px", color: "#555", wordBreak: 'break-word' }}>
                      {pnm.contactInfo?.phone && (
                        <p style={{ margin: "5px 0", overflowWrap: 'break-word' }}>
                          <strong>Phone:</strong> {pnm.contactInfo.phone}
                        </p>
                      )}
                      
                      {pnm.contactInfo?.email && (
                        <p style={{ margin: "5px 0", overflowWrap: 'break-word' }}>
                          <strong>Email:</strong> {pnm.contactInfo.email}
                        </p>
                      )}
                      
                      {pnm.referredBy && (
                        <p style={{ margin: "5px 0", overflowWrap: 'break-word' }}>
                          <strong>Referred by:</strong> {pnm.referredBy}
                        </p>
                      )}
                      
                      <p style={{ margin: "5px 0", fontSize: "12px", color: "#757575" }}>
                        Added: {new Date(pnm.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </Layout>
  );
};

export default Dashboard;
