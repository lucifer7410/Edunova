import { useState } from "react";
import "./App.css";
import {
  digestApi,
  deadlineApi,
  notifyApi,
  motivateApi,
  enrichApi,
  planApi,
} from "./api";

function App() {
  const [response, setResponse] = useState(null);

  const callDigest = async () => {
    const res = await digestApi("This is a test from frontend");
    setResponse(res.data);
  };

  const callDeadline = async () => {
    const res = await deadlineApi("Exam on 15 Sept, assignment due 1 Sept");
    setResponse(res.data);
  };

  const callNotify = async () => {
    const res = await notifyApi("Hello student!", "email");
    setResponse(res.data);
  };

  const callMotivate = async () => {
    const res = await motivateApi();
    setResponse(res.data);
  };

  const callEnrich = async () => {
    const res = await enrichApi([{ title: "Exam", date: "2025-09-15" }]);
    setResponse(res.data);
  };

  const callPlan = async () => {
    const res = await planApi([{ title: "Exam", date: "2025-09-15" }]);
    setResponse(res.data);
  };

  return (
    <div className="card">
      <h1 className="text-3xl font-bold mb-6 text-center">🎓 Edunova Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button onClick={callDigest} className="bg-blue-600">Digest</button>
        <button onClick={callDeadline} className="bg-green-600">Deadline</button>
        <button onClick={callNotify} className="bg-purple-600">Notify</button>
        <button onClick={callMotivate} className="bg-yellow-600">Motivate</button>
        <button onClick={callEnrich} className="bg-pink-600">Enrich</button>
        <button onClick={callPlan} className="bg-red-600">Plan</button>
      </div>

      <pre className="bg-gray-900 rounded p-4 text-sm overflow-x-auto">
        {response ? JSON.stringify(response, null, 2) : "👉 Click a button to test"}
      </pre>
    </div>
  );
}

export default App;
