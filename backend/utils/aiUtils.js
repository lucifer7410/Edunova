// Replace these with real LLM calls later (OpenAI/Anthropic)

async function summarizeDoc(text) {
  const snippet = text ? text.slice(0, 180) : "";
  return `Summary: ${snippet}${text && text.length > 180 ? "..." : ""}`;
}

async function extractDeadlines(text) {
  // naive demo; replace with regex + LLM
  // return ISO dates only for demo
  return [
    { title: "Assignment 1", date: "2025-09-01", source: "syllabus" },
    { title: "Midterm Exam", date: "2025-10-10", source: "syllabus" }
  ];
}

function enrichDeadlines(deadlines) {
  const out = (deadlines || []).map(d => {
    const dt = new Date(d.date);
    const weekday = dt.toLocaleDateString("en-US", { weekday: "long" });
    const weeksAway = Math.max(0, Math.round((dt - Date.now()) / (1000 * 60 * 60 * 24 * 7)));
    const difficultyTag = /exam/i.test(d.title) ? "high" : /assignment/i.test(d.title) ? "medium" : "low";
    return {
      ...d,
      weekday,
      weeksAway,
      tags: [difficultyTag, d.source || "unknown"]
    };
  });
  return out;
}

function buildStudyPlan(deadlines, availability) {
  // trivial spread: allocate daily 2h blocks
  const plan = (deadlines || []).map(d => ({
    deadline: d.title,
    date: d.date,
    suggestedDailyHours: 2,
    window: { start: availability?.start || "18:00", end: availability?.end || "21:00" }
  }));
  return plan;
}

module.exports = {
  summarizeDoc,
  extractDeadlines,
  enrichDeadlines,
  buildStudyPlan
};
