import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, onValue, update } from "firebase/database";

const Referral = () => {
  const [newReferral, setNewReferral] = useState({
    fullName: "", phone: "", email: "", instagram: "", facebook: "", linkedin: "", grade: "", referredBy: "", status: "Pending"
  });
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReferralId, setSelectedReferralId] = useState("");
  const [editReferral, setEditReferral] = useState(null);
  const [commentText, setCommentText] = useState("");

  const db = getDatabase();

  useEffect(() => {
    const referralsRef = ref(db, "referrals");
    const unsubscribe = onValue(referralsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const referralList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
          comments: data[key].comments ? Object.values(data[key].comments) : [],
        }));
        setReferrals(referralList);
      } else {
        setReferrals([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  // ✅ Handle adding a new referral
  const handleAddReferral = async () => {
    if (!newReferral.fullName.trim()) {
      alert("Please enter the full name.");
      return;
    }

    try {
      const referralsRef = ref(db, "referrals");
      await push(referralsRef, {
        fullName: newReferral.fullName,
        contactInfo: {
          phone: newReferral.phone || "",
          email: newReferral.email || "",
          socialMediaLinks: {
            instagram: newReferral.instagram || "",
            facebook: newReferral.facebook || "",
            linkedin: newReferral.linkedin || "",
          },
        },
        grade: newReferral.grade ? newReferral.grade.toUpperCase() : "N/A",
        referredBy: newReferral.referredBy || "Unknown Referrer",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "Pending",
        comments: [],
      });

      alert(`Referral ${newReferral.fullName} added successfully!`);
      setNewReferral({ fullName: "", phone: "", email: "", instagram: "", facebook: "", linkedin: "", grade: "", referredBy: "", status: "Pending" });
    } catch (error) {
      console.error("Error adding referral:", error);
    }
  };

  // ✅ Handle selecting a referral to edit
  const handleSelectReferral = (e) => {
    const selectedId = e.target.value;
    setSelectedReferralId(selectedId);
    if (selectedId) {
      const selected = referrals.find((referral) => referral.id === selectedId);
      setEditReferral({ ...selected });
    } else {
      setEditReferral(null);
    }
  };

  // ✅ Handle updating a referral
  const handleUpdateReferral = async () => {
    if (!selectedReferralId || !editReferral) return;

    try {
      const referralRef = ref(db, `referrals/${selectedReferralId}`);
      await update(referralRef, {
        ...editReferral,
        updatedAt: new Date().toISOString(),
      });

      alert(`Referral ${editReferral.fullName} updated successfully!`);
    } catch (error) {
      console.error("Error updating referral:", error);
    }
  };

  // ✅ Handle adding comments
  const handleAddComment = async () => {
    if (!selectedReferralId || !commentText.trim()) {
      alert("Please enter a comment.");
      return;
    }

    try {
      const commentsRef = ref(db, `referrals/${selectedReferralId}/comments`);
      await push(commentsRef, {
        commentText: commentText,
        timestamp: new Date().toISOString(),
      });

      alert("Comment added!");
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Referral Page</h2>

      <h3>Add a New Referral</h3>
      <input type="text" placeholder="Full Name" value={newReferral.fullName} 
        onChange={(e) => setNewReferral({ ...newReferral, fullName: e.target.value })} style={styles.input} />
      <input type="text" placeholder="Phone (Optional)" value={newReferral.phone} 
        onChange={(e) => setNewReferral({ ...newReferral, phone: e.target.value })} style={styles.input} />
      <input type="email" placeholder="Email (Optional)" value={newReferral.email} 
        onChange={(e) => setNewReferral({ ...newReferral, email: e.target.value })} style={styles.input} />
      <input type="text" placeholder="Instagram (Optional)" value={newReferral.instagram} 
        onChange={(e) => setNewReferral({ ...newReferral, instagram: e.target.value })} style={styles.input} />
      <input type="text" placeholder="Facebook (Optional)" value={newReferral.facebook} 
        onChange={(e) => setNewReferral({ ...newReferral, facebook: e.target.value })} style={styles.input} />
      <input type="text" placeholder="LinkedIn (Optional)" value={newReferral.linkedin} 
        onChange={(e) => setNewReferral({ ...newReferral, linkedin: e.target.value })} style={styles.input} />
      <input type="text" placeholder="Grade (Optional, A/B/C/D)" value={newReferral.grade} 
        onChange={(e) => setNewReferral({ ...newReferral, grade: e.target.value })} style={styles.input} />
      <input type="text" placeholder="Referred By" value={newReferral.referredBy} 
        onChange={(e) => setNewReferral({ ...newReferral, referredBy: e.target.value })} style={styles.input} />
      <button onClick={handleAddReferral} style={styles.addButton}>Add Referral</button>

      <h3>Edit a Referral</h3>
      <select onChange={handleSelectReferral} style={styles.input}>
        <option value="">Select a Referral to Edit</option>
        {referrals.map((referral) => (
          <option key={referral.id} value={referral.id}>{referral.fullName}</option>
        ))}
      </select>

      {editReferral && (
        <div>
          <input type="text" placeholder="Full Name" value={editReferral.fullName}
            onChange={(e) => setEditReferral({ ...editReferral, fullName: e.target.value })} style={styles.input} />
          <button onClick={handleUpdateReferral} style={styles.updateButton}>Update Referral</button>

          <h4>Comments</h4>
          <input type="text" placeholder="Add a comment" value={commentText}
            onChange={(e) => setCommentText(e.target.value)} style={styles.input} />
          <button onClick={handleAddComment} style={styles.addButton}>Add Comment</button>
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

export default Referral;
