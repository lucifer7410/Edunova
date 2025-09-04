import axios from "axios";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdC11c2VyIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3NTY4NzA2ODYsImV4cCI6MTc1Njg3NDI4Nn0.O0wrxu1zNFOzYc_rD8vE5p88SMeaJQjFQAr38zBA00E";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`
  }
});

export const digestApi = (content) =>
  axiosInstance.post("http://localhost:5001/api/digest", { content });

export const deadlineApi = (text) =>
  axiosInstance.post("http://localhost:5002/api/deadline", { text });

export const notifyApi = (message, channel) =>
  axiosInstance.post("http://localhost:5003/api/notify", { message, channel });

export const motivateApi = () =>
  axiosInstance.get("http://localhost:5004/api/motivate");

export const enrichApi = (deadlines) =>
  axiosInstance.post("http://localhost:5005/api/enricher", { deadlines });

export const planApi = (deadlines) =>
  axiosInstance.post("http://localhost:5006/api/plan", { deadlines });
