const API_URL = "/api/offering-planning";

const TIME_ORDER = {
  "9:00": 1,
  "10:00": 2,
  "11:00": 3,
  "2:30": 4,
  "3:30": 5,
  "4:30": 6
};

const VIEW_COLUMNS = {
  summer: [
    ["area", "Area"],
    ["badgeName", "Badge"],
    ["time", "Class Time"],
    ["enrollment", "Summer Enrollment"],
    ["retentionPct", "Retention %"],
    ["earned", "Completed"],
    ["completionPct", "Completion %"]
  ],
  weekly: [
    ["session", "Week"],
    ["area", "Area"],
    ["badgeName", "Badge"],
    ["time", "Class Time"],
    ["enrollment", "Weekly Enrollment"],
    ["retentionPct", "Retention %"],
    ["earned", "Completed"],
    ["completionPct", "Completion %"]
  ],
  normalized: [
    ["area", "Area"],
    ["badgeName", "Badge"],
    ["time", "Class Time"],
    ["weeksOffered", "Weeks Offered"],
    ["enrollment", "Summer Enrollment"],
    ["avgWeeklyEnrollment", "Avg Weekly Enrollment"],
    ["retentionPct", "Retention %"],
    ["earned", "Completed"],
    ["completionPct", "Completion %"]
  ],
  completion: [
    ["area", "Area"],
    ["badgeName", "Badge"],
    ["time", "Class Time"],
    ["enrollment", "Enrollment"],
    ["earned", "Completed"],
    ["notEarned", "Not Completed"],
    ["completionPct", "Completion %"],
    ["retentionPct", "Retention %"]
  ]
};
