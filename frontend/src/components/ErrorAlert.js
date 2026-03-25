import React from "react";

const ErrorAlert = ({ message }) => {
  return (
    <div style={styles.alert}>
      {message}
    </div>
  );
};

const styles = {
  alert: {
    background: "#fff1f2",
    color: "#b42318",
    border: "1px solid #fda29b",
    padding: "14px 18px",
    borderRadius: "10px",
    fontWeight: 600,
    maxWidth: "500px",
    textAlign: "center",
  },
};

export default ErrorAlert;