import fetch from "node-fetch";
import { logAction } from "../shared/audit.js";

const TOK_DIGEST = process.env.TOK_DIGEST;
const TOK_ENRICH = process.env.TOK_ENRICH;
const TOK_DEADLINE = process.env.TOK_DEADLINE;
const TOK_NOTIFY = process.env.TOK_NOTIFY;
const TOK_MOTIVATE = process.env.TOK_MOTIVATE;

async function runDemo() {
  // 1. Digest
  let digestRes = await fetch("http://localhost:3001/v1/digest", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOK_DIGEST}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: "Assignment 1 due 2025-09-10. Project due 2025-09-30. Quantum Computing lectures." })
  });
  let digestOutput = await digestRes.json();
  logAction("digest-agent", "docs.read", "processed syllabus", "user123");
  console.log("Digest Output:", digestOutput);

  // 2. Enricher
  let enrichRes = await fetch("http://localhost:3002/v1/enrich", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOK_ENRICH}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(digestOutput)
  });
  let enrichOutput = await enrichRes.json();
  logAction("enricher-agent", "knowledge.expand", "enriched digest", "user123");
  console.log("Enriched Output:", enrichOutput);

  // 3. Deadline
  let deadlineRes = await fetch("http://localhost:3003/v1/deadline", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOK_DEADLINE}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(enrichOutput)
  });
  let deadlineOutput = await deadlineRes.json();
  logAction("deadline-agent", "calendar.write", "added deadlines to calendar", "user123");
  console.log("Calendar Output:", deadlineOutput);

  // 4. Notify
  let notifyRes = await fetch("http://localhost:3004/v1/notify", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOK_NOTIFY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(deadlineOutput)
  });
  let notifyOutput = await notifyRes.json();
  logAction("notifier-agent", "messaging.send", "scheduled reminders", "user123");
  console.log("Notifications:", notifyOutput);

  // 5. Motivator
  let motivateRes = await fetch("http://localhost:3005/v1/motivate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOK_MOTIVATE}`,
      "Content-Type": "application/json"
    }
  });
  let motivateOutput = await motivateRes.json();
  logAction("motivator-agent", "motivate", "sent motivational tip", "user123");
  console.log("Motivator Output:", motivateOutput);
}

runDemo();
