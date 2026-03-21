import { useState, useEffect } from "react";
import "./Attendance.css";
import { attendanceAPI } from "../src/services/api";
import useToast from "../src/hooks/useToast";
import Loader from "./Loader";

export default function Attendance() {
  const [date, setDate] = useState("");
  const [rows, setRows] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // Track which record is being edited
  const { showSuccess, showError } = useToast();

  // Fetch history when date changes
  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  useEffect(() => {
    if (date) {
      fetchHistoryForDate(date);
    }
  }, [date]);

  const fetchHistoryForDate = async (selectedDate) => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getAllAttendance();
      
      if (response.success) {
        // Convert selected date to ISO format for consistent comparison
        const selectedDateISO = new Date(selectedDate + 'T00:00:00').toISOString().split('T')[0];
        
        // Filter records for the selected date
        const filtered = response.attendanceRecords.filter(record => {
          if (!record.date) return false;
          const recordDate = new Date(record.date).toISOString().split('T')[0];
          return recordDate === selectedDateISO;
        });
        
        console.log("Selected Date:", selectedDate);
        console.log("Filtered History:", filtered);
        setHistory(filtered);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      showError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), labourType: "", workers: 0, wage: 0, total: 0 }
    ]);
  };

  const deleteRow = (id) => {
    const updated = rows.filter((r) => r.id !== id);
    updateTotals(updated);
  };

  const updateRow = (id, field, value) => {
    const updated = rows.map((r) =>
      r.id === id
        ? {
            ...r,
            [field]: value,
            total: field === "workers" || field === "wage"
              ? (field === "workers" ? value : r.workers) * (field === "wage" ? value : r.wage)
              : r.total
          }
        : r
    );
    updateTotals(updated);
  };

  const updateTotals = (updatedRows) => {
    setRows(updatedRows);

    const sum = updatedRows.reduce((a, r) => a + r.total, 0);
    const workers = updatedRows.reduce((a, r) => a + r.workers, 0);

    setGrandTotal(sum);
    setTotalWorkers(workers);
  };

  const saveAttendance = async () => {
    if (!date) {
      showError("Please select a date");
      return;
    }

    if (rows.length === 0) {
      showError("Please add at least one labour record");
      return;
    }

    try {
      setLoading(true);
      
      // Convert date string to ISO date format
      const dateISO = new Date(date + 'T00:00:00').toISOString();
      
      console.log("=== ATTENDANCE SAVE DEBUG ===");
      console.log("Saving", rows.length, "labour entries as separate records");

      // Save each labour entry as a SEPARATE record
      const savePromises = rows.map(row => {
        const attendanceData = {
          date: dateISO,
          labourRecords: [
            {
              labourType: row.labourType,
              workers: row.workers,
              wage: row.wage,
              total: row.total
            }
          ],
          grandTotal: row.total
        };

        console.log("Saving record:", attendanceData);
        return attendanceAPI.addAttendance(attendanceData);
      });

      // Wait for all records to be saved
      const responses = await Promise.all(savePromises);
      
      console.log("All responses:", responses);

      // Check if all were successful
      const allSuccessful = responses.every(r => r.success);

      if (allSuccessful) {
        showSuccess(`${rows.length} labour record(s) saved successfully!`);
        console.log("All records saved successfully");
        setRows([]);
        setGrandTotal(0);
        setTotalWorkers(0);
        // Refresh history
        fetchHistoryForDate(date);
      } else {
        const failedCount = responses.filter(r => !r.success).length;
        showError(`${failedCount} record(s) failed to save`);
        console.error("Some records failed:", responses);
      }
    } catch (error) {
      showError("Error: " + error.message);
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryRecord = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await attendanceAPI.deleteAttendance(recordId);

      if (response.success) {
        showSuccess("Record deleted successfully!");
        fetchHistoryForDate(date);
      } else {
        showError(response.message || "Failed to delete record");
      }
    } catch (error) {
      showError("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitHistoryRecord = async (recordId) => {
    try {
      setLoading(true);
      const response = await attendanceAPI.submitAttendance(recordId);

      if (response.success) {
        showSuccess("Record submitted successfully!");
        fetchHistoryForDate(date);
      } else {
        showError(response.message || "Failed to submit record");
      }
    } catch (error) {
      showError("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ===================== HISTORY EDITING FUNCTIONS =====================
  const editHistoryLabour = (recordId, labourIndex, field, value) => {
    setEditingRecord(prev => {
      if (!prev || prev.id !== recordId) {
        // Initialize edit mode for this record
        const record = history.find(r => r._id === recordId);
        if (!record) return null;

        return {
          id: recordId,
          data: JSON.parse(JSON.stringify(record)) // Deep copy
        };
      }

      // Update the labour record
      const updated = { ...prev };
      if (field === "workers" || field === "wage") {
        const numValue = value === "" ? 0 : parseFloat(value);
        updated.data.labourRecords[labourIndex][field] = numValue;

        // Recalculate total for this entry
        updated.data.labourRecords[labourIndex].total =
          updated.data.labourRecords[labourIndex].workers *
          updated.data.labourRecords[labourIndex].wage;

        // Recalculate grandTotal
        updated.data.grandTotal = updated.data.labourRecords.reduce(
          (sum, r) => sum + r.total,
          0
        );
      } else {
        updated.data.labourRecords[labourIndex][field] = value;
      }

      return updated;
    });
  };

  const deleteHistoryLabour = (recordId, labourIndex) => {
    setEditingRecord(prev => {
      if (!prev || prev.id !== recordId) return null;

      const updated = { ...prev };
      updated.data.labourRecords.splice(labourIndex, 1);

      // Recalculate grandTotal
      updated.data.grandTotal = updated.data.labourRecords.reduce(
        (sum, r) => sum + r.total,
        0
      );

      return updated;
    });
  };

  const saveHistoryEdits = async (recordId) => {
    if (!editingRecord || editingRecord.id !== recordId) {
      console.error("Edit record not found or ID mismatch");
      return;
    }

    if (editingRecord.data.labourRecords.length === 0) {
      showError("At least one labour entry is required");
      return;
    }

    try {
      setLoading(true);
      
      // Remove the 'id' field if it exists in labour records (it's a frontend-only field)
      const cleanLabourRecords = editingRecord.data.labourRecords.map(record => ({
        labourType: record.labourType,
        workers: record.workers,
        wage: record.wage,
        total: record.total
      }));

      const updateData = {
        date: editingRecord.data.date,
        labourRecords: cleanLabourRecords,
        grandTotal: editingRecord.data.grandTotal
      };

      console.log("=== SAVE HISTORY EDITS DEBUG ===");
      console.log("Record ID:", recordId);
      console.log("Update Data:", updateData);

      const response = await attendanceAPI.updateAttendance(recordId, updateData);

      console.log("API Response:", response);

      if (response.success) {
        showSuccess("Record updated successfully!");
        setEditingRecord(null);
        fetchHistoryForDate(date);
      } else {
        showError(response.message || "Failed to update record");
        console.error("Update failed:", response);
      }
    } catch (error) {
      showError("Error: " + error.message);
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelHistoryEdits = () => {
    setEditingRecord(null);
  };

  return (
    <div className="container">
      <h1>Labour Attendance</h1>

      <div className="top-bar">
        <label className="date-label">Attendance Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Labour Type</th>
            <th>No. of Workers</th>
            <th>Daily Wage (₹)</th>
            <th>Total (₹)</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="labour-row">
              <td>
                <input
                  type="text"
                  placeholder="e.g., Skilled, Unskilled"
                  value={row.labourType}
                  onChange={(e) =>
                    updateRow(row.id, "labourType", e.target.value)
                  }
                  className="input-field"
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  placeholder="0"
                  value={row.workers || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                    updateRow(row.id, "workers", value);
                  }}
                  className="input-field"
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0"
                  value={row.wage || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    updateRow(row.id, "wage", value);
                  }}
                  className="input-field"
                />
              </td>
              <td className="total-cell">
                <span className="total-value">₹ {row.total}</span>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteRow(row.id)}
                  title="Delete this entry"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-btn" onClick={addRow}>
        + Add Labour
      </button>

      <div style={{marginTop:"10px",display:"flex",gap:"10px"}}>
        <button className="add-btn" onClick={saveAttendance} disabled={loading}>
          💾 Save
        </button>
      </div>

      <div className="summary">
        <span>Total Workers:</span>
        <strong>{totalWorkers}</strong>
      </div>

      <div className="summary">
        <span>Total Cost:</span>
        <strong>₹ {grandTotal}</strong>
      </div>

      {/* ============ HISTORY SECTION ============ */}
      <div className="history-section">
        <div className="history-title-bar">
          <h2>Attendance History for {date || "Select a date"}</h2>
          {!loading && history.length > 0 && (
            <div className="history-day-total">
              <span>Daily Total Cost:</span>
              <strong>₹ {history.reduce((sum, record) => sum + (record.grandTotal || 0), 0)}</strong>
            </div>
          )}
        </div>
        
        {loading && <Loader message="Loading..." />}

        {!loading && history.length === 0 ? (
          <p style={{textAlign: "center", color: "#999", padding: "20px"}}>
            No records found for this date
          </p>
        ) : (
          <div className="history-list">
            {history.map((record) => (
              <div key={record._id} className="history-card">
                <div className="history-header">
                  <div className="history-meta">
                    <strong>Record ID:</strong> {record._id.substring(0, 8)}
                    <br />
                    <strong>Added by:</strong> {record.addedBy}
                    <br />
                    <strong>Status:</strong> 
                    <span className={`status-badge status-${record.status}`}>
                      {record.status}
                    </span>
                  </div>
                  <div className="history-actions">
                    {record.status === "draft" && !editingRecord && (
                      <button 
                        className="edit-btn"
                        onClick={() => setEditingRecord({
                          id: record._id,
                          data: JSON.parse(JSON.stringify(record))
                        })}
                        disabled={loading}
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {editingRecord && editingRecord.id === record._id && (
                      <>
                        <button 
                          className="save-btn"
                          onClick={() => saveHistoryEdits(record._id)}
                          disabled={loading}
                        >
                          💾 Save Changes
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={cancelHistoryEdits}
                          disabled={loading}
                        >
                          ✕ Cancel
                        </button>
                      </>
                    )}
                    {record.status === "draft" && !editingRecord && (
                      <button 
                        className="submit-btn"
                        onClick={() => submitHistoryRecord(record._id)}
                        disabled={loading}
                      >
                        ✓ Submit
                      </button>
                    )}
                    {!editingRecord && (
                      <button 
                        className="delete-btn"
                        onClick={() => deleteHistoryRecord(record._id)}
                        disabled={loading}
                      >
                        ❌ Delete
                      </button>
                    )}
                  </div>
                </div>

                <div className="history-details">
                  {editingRecord && editingRecord.id === record._id ? (
                    // EDIT MODE
                    <table>
                      <thead>
                        <tr>
                          <th>Labour Type</th>
                          <th>Workers</th>
                          <th>Wage (₹)</th>
                          <th>Total (₹)</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editingRecord.data.labourRecords.map((labour, idx) => (
                          <tr key={idx} className="labour-row">
                            <td>
                              <input
                                type="text"
                                placeholder="Labour Type"
                                value={labour.labourType}
                                onChange={(e) =>
                                  editHistoryLabour(record._id, idx, "labourType", e.target.value)
                                }
                                className="input-field"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="0"
                                value={labour.workers || ''}
                                onChange={(e) => {
                                  const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                                  editHistoryLabour(record._id, idx, "workers", value);
                                }}
                                className="input-field"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0"
                                value={labour.wage || ''}
                                onChange={(e) => {
                                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                  editHistoryLabour(record._id, idx, "wage", value);
                                }}
                                className="input-field"
                              />
                            </td>
                            <td className="total-cell">
                              <span className="total-value">₹ {labour.total}</span>
                            </td>
                            <td>
                              <button
                                className="delete-btn"
                                onClick={() => deleteHistoryLabour(record._id, idx)}
                              >
                                🗑️ Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    // VIEW MODE
                    <table>
                      <thead>
                        <tr>
                          <th>Labour Type</th>
                          <th>Workers</th>
                          <th>Wage (₹)</th>
                          <th>Total (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {record.labourRecords.map((labour, idx) => (
                          <tr key={idx}>
                            <td>{labour.labourType}</td>
                            <td>{labour.workers}</td>
                            <td>{labour.wage}</td>
                            <td>{labour.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div className="record-total">
                    <strong>Record Total: ₹{editingRecord && editingRecord.id === record._id ? editingRecord.data.grandTotal : record.grandTotal}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}