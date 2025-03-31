import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDatabase } from "../contexts/DatabaseContext";
import Layout from "../components/UI/Layout";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

const Referral = () => {
  // Form state for new referral
  const [newReferral, setNewReferral] = useState({
    fullName: "", 
    phone: "", 
    email: "", 
    instagram: "", 
    facebook: "", 
    linkedin: "", 
    grade: "", 
    referredBy: "", 
    notes: ""
  });
  
  // State for existing referrals and UI
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Comments functionality
  const [selectedReferralId, setSelectedReferralId] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedReferral, setSelectedReferral] = useState(null);

  // Get auth and database contexts
  const { currentUser } = useAuth();
  const { subscribeToCollection, addRecord, updateRecord, error: dbError } = useDatabase();
  const navigate = useNavigate();

  // Get referrals on component mount
  useEffect(() => {
    const unsubscribe = subscribeToCollection("referrals", (data) => {
      setReferrals(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [subscribeToCollection]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!newReferral.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    
    if (newReferral.email && !/\S+@\S+\.\S+/.test(newReferral.email)) {
      errors.email = "Email is invalid";
    }
    
    if (newReferral.phone && !/^\+?[\d\s-]{10,15}$/.test(newReferral.phone)) {
      errors.phone = "Phone number is invalid";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle adding a new referral
  const handleAddReferral = async () => {
    if (!validateForm()) return;
    
    setSubmitLoading(true);
    try {
      await addRecord("referrals", {
        fullName: newReferral.fullName.trim(),
        contactInfo: {
          phone: newReferral.phone.trim() || "",
          email: newReferral.email.trim() || "",
          socialMediaLinks: {
            instagram: newReferral.instagram.trim() || "",
            facebook: newReferral.facebook.trim() || "",
            linkedin: newReferral.linkedin.trim() || "",
          },
        },
        grade: newReferral.grade ? newReferral.grade.toUpperCase().trim() : "N/A",
        referredBy: newReferral.referredBy.trim() || (currentUser?.displayName || currentUser?.email || "Unknown"),
        notes: newReferral.notes.trim() || "",
        status: "Pending",
        comments: [],
      });

      // Clear form after successful submission
      setNewReferral({
        fullName: "", 
        phone: "", 
        email: "", 
        instagram: "", 
        facebook: "", 
        linkedin: "", 
        grade: "", 
        referredBy: "", 
        notes: ""
      });
      
      // Show success message
      alert(`Referral for ${newReferral.fullName} added successfully!`);
    } catch (error) {
      console.error("Error adding referral:", error);
      setFormErrors({ general: "Failed to add referral. Please try again." });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle selecting a referral
  const handleSelectReferral = (e) => {
    const selectedId = e.target.value;
    setSelectedReferralId(selectedId);
    
    if (selectedId) {
      const selected = referrals.find((referral) => referral.id === selectedId);
      setSelectedReferral({ ...selected });
    } else {
      setSelectedReferral(null);
    }
  };

  // Handle adding comments
  const handleAddComment = async () => {
    if (!selectedReferralId || !commentText.trim()) {
      setFormErrors({ comment: "Please enter a comment" });
      return;
    }

    setSubmitLoading(true);
    try {
      // Create comment object
      const comment = {
        text: commentText.trim(),
        author: currentUser?.displayName || currentUser?.email || "Anonymous",
        timestamp: new Date().toISOString()
      };
      
      // Get existing comments or initialize empty array
      const existingComments = selectedReferral.comments || [];
      
      // Update referral with new comment
      await updateRecord(`referrals/${selectedReferralId}`, {
        comments: [...existingComments, comment]
      });

      // Clear comment field
      setCommentText("");
      setFormErrors({});
      
      // Fetch the updated referral to show new comment immediately
      const updatedReferral = referrals.find(r => r.id === selectedReferralId);
      if (updatedReferral) {
        setSelectedReferral({
          ...updatedReferral,
          comments: [...(updatedReferral.comments || []), comment]
        });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setFormErrors({ comment: "Failed to add comment. Please try again." });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Layout title="PNM Referral" showBackButton>
      <div style={{ marginBottom: "30px" }}>
        <Card title="Add New PNM Referral" elevation={2}>
          {dbError && (
            <div style={{ color: "#F44336", marginBottom: "15px" }}>
              {dbError}
            </div>
          )}
          
          {formErrors.general && (
            <div style={{ color: "#F44336", marginBottom: "15px" }}>
              {formErrors.general}
            </div>
          )}
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            <Input 
              label="Full Name"
              value={newReferral.fullName}
              onChange={(e) => setNewReferral({ ...newReferral, fullName: e.target.value })}
              error={formErrors.fullName}
              required
              style={{ flex: "1 1 100%" }}
            />
            
            <Input 
              label="Phone Number"
              value={newReferral.phone}
              onChange={(e) => setNewReferral({ ...newReferral, phone: e.target.value })}
              error={formErrors.phone}
              style={{ flex: "1 1 calc(50% - 8px)" }}
            />
            
            <Input 
              label="Email Address"
              type="email"
              value={newReferral.email}
              onChange={(e) => setNewReferral({ ...newReferral, email: e.target.value })}
              error={formErrors.email}
              style={{ flex: "1 1 calc(50% - 8px)" }}
            />
          </div>
          
          <Card title="Social Media (Optional)" elevation={0} padding="15px 0" style={{ marginTop: "15px", backgroundColor: "transparent", boxShadow: "none" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <Input 
                label="Instagram"
                value={newReferral.instagram}
                onChange={(e) => setNewReferral({ ...newReferral, instagram: e.target.value })}
                placeholder="@username"
                style={{ flex: "1 1 calc(33.33% - 10px)" }}
              />
              
              <Input 
                label="Facebook"
                value={newReferral.facebook}
                onChange={(e) => setNewReferral({ ...newReferral, facebook: e.target.value })}
                placeholder="Profile URL or username"
                style={{ flex: "1 1 calc(33.33% - 10px)" }}
              />
              
              <Input 
                label="LinkedIn"
                value={newReferral.linkedin}
                onChange={(e) => setNewReferral({ ...newReferral, linkedin: e.target.value })}
                placeholder="Profile URL or username"
                style={{ flex: "1 1 calc(33.33% - 10px)" }}
              />
            </div>
          </Card>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginTop: "15px" }}>
            <Input 
              label="Grade (A/B/C/D)"
              value={newReferral.grade}
              onChange={(e) => setNewReferral({ ...newReferral, grade: e.target.value })}
              placeholder="Quality grade (optional)"
              style={{ flex: "1 1 calc(50% - 8px)" }}
            />
            
            <Input 
              label="Referred By"
              value={newReferral.referredBy}
              onChange={(e) => setNewReferral({ ...newReferral, referredBy: e.target.value })}
              placeholder={currentUser?.displayName || currentUser?.email || "Your name"}
              style={{ flex: "1 1 calc(50% - 8px)" }}
            />
            
            <Input 
              label="Notes"
              value={newReferral.notes}
              onChange={(e) => setNewReferral({ ...newReferral, notes: e.target.value })}
              placeholder="Any additional information about this PNM"
              style={{ flex: "1 1 100%" }}
            />
          </div>
          
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
            <Button 
              onClick={() => navigate("/dashboard")} 
              variant="outline"
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleAddReferral} 
              variant="success"
              disabled={submitLoading}
            >
              {submitLoading ? "Submitting..." : "Submit Referral"}
            </Button>
          </div>
        </Card>
      </div>
      
      <Card title="Existing Referrals" elevation={1}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Loading referrals...</p>
          </div>
        ) : referrals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>No referrals found. Add your first referral above!</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "bold" }}>
                Select a referral to view details
              </label>
              <select 
                onChange={handleSelectReferral} 
                value={selectedReferralId}
                style={{
                  padding: "10px 12px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  width: "100%"
                }}
              >
                <option value="">Select a Referral</option>
                {referrals.map((referral) => (
                  <option key={referral.id} value={referral.id}>
                    {referral.fullName} ({new Date(referral.createdAt).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            
            {selectedReferral && (
              <Card title={selectedReferral.fullName} elevation={1} padding="15px">
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "15px" }}>
                    <div style={{ flex: "1 1 calc(50% - 5px)" }}>
                      <p style={{ margin: "0", fontSize: "14px", color: "#757575" }}>Contact Info:</p>
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        <strong>Phone:</strong> {selectedReferral.contactInfo?.phone || "Not provided"}
                      </p>
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        <strong>Email:</strong> {selectedReferral.contactInfo?.email || "Not provided"}
                      </p>
                    </div>
                    
                    <div style={{ flex: "1 1 calc(50% - 5px)" }}>
                      <p style={{ margin: "0", fontSize: "14px", color: "#757575" }}>Referral Details:</p>
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        <strong>Grade:</strong> {selectedReferral.grade || "Not graded"}
                      </p>
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        <strong>Referred By:</strong> {selectedReferral.referredBy || "Unknown"}
                      </p>
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        <strong>Status:</strong> {selectedReferral.status || "Pending"}
                      </p>
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        <strong>Added On:</strong> {new Date(selectedReferral.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {selectedReferral.notes && (
                    <div style={{ marginTop: "10px" }}>
                      <p style={{ margin: "0", fontSize: "14px", color: "#757575" }}>Notes:</p>
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>{selectedReferral.notes}</p>
                    </div>
                  )}
                  
                  <div style={{ marginTop: "20px" }}>
                    <h4 style={{ marginBottom: "10px" }}>Comments</h4>
                    
                    <div style={{ maxHeight: "200px", overflowY: "auto", padding: "10px", border: "1px solid #eee", borderRadius: "4px", marginBottom: "15px" }}>
                      {!selectedReferral.comments || selectedReferral.comments.length === 0 ? (
                        <p style={{ color: "#757575", textAlign: "center" }}>No comments yet</p>
                      ) : (
                        selectedReferral.comments.map((comment, index) => (
                          <div key={index} style={{ marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                            <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}>{comment.text}</p>
                            <p style={{ margin: "0", fontSize: "12px", color: "#757575" }}>
                              By {comment.author} on {new Date(comment.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div>
                      <Input 
                        label="Add Comment"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        error={formErrors.comment}
                        placeholder="Enter your comment about this PNM"
                      />
                      <Button 
                        onClick={handleAddComment} 
                        variant="primary"
                        disabled={submitLoading}
                      >
                        {submitLoading ? "Adding..." : "Add Comment"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </Card>
    </Layout>
  );
};

export default Referral;
