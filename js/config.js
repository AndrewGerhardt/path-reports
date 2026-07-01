const API_URL = `${ENV.apiBase}/offering-planning`;

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
    ["retentionPct", "Attendance %"],
    ["earned", "Completed"],
    ["completionPct", "Completion %"]
  ],
  weekly: [
    ["session", "Week"],
    ["area", "Area"],
    ["badgeName", "Badge"],
    ["time", "Class Time"],
    ["enrollment", "Weekly Enrollment"],
    ["retentionPct", "Attendance %"],
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
    ["retentionPct", "Attendance %"],
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
    ["retentionPct", "Attendance %"]
  ]
};

const COLUMN_DESCRIPTIONS = {
  area: "Program area assigned to this badge or offering.",
  badgeName: "The badge or activity name. Click a badge to view only that badge.",
  time: "Scheduled class time.",
  enrollment: "Total badge enrollments. Combo offerings count once per badge.",
  retentionPct: "How well Scouts attended. 100% means every Scout attended every day.",
  earned: "Number of badges marked completed.",
  notEarned: "Number of badges not marked completed.",
  completionPct: "Percent of Scouts who earned the badge.",
  session: "Camp session/week.",
  weeksOffered: "Number of weeks this badge appeared in the data.",
  avgWeeklyEnrollment: "Average enrollment per week offered."
};

const CARD_OPTIONS = {
  badgesTaken: "Badges Taken",
  badgesEarned: "Badges Earned",
  completionRate: "Completion Rate",
  highestDemand: "Highest Demand",

  lowestDemand: "Lowest Demand",
  bestCompletion: "Best Completion",
  worstCompletion: "Worst Completion",
  bestAttendance: "Best Attendance",
  worstAttendance: "Worst Attendance",
  busiestTime: "Busiest Class Time",
  lightestTime: "Lightest Class Time",
  mostClassesTime: "Time With Most Classes",
  fewestClassesTime: "Time With Fewest Classes",
  averageEnrollment: "Average Enrollment",
  totalOfferings: "Total Offerings"
};

const METRIC_EXCLUDE_BADGES = {
  lowestDemand: [
    "Non-Swimmer Instruction",
    "Adventure Trek"
  ],

  worstCompletion: [
    "Non-Swimmer Instruction"
  ],

  worstAttendance: [
    "Non-Swimmer Instruction"
  ],

  bestCompletion: [
    "Adventure Trek"
  ],

  bestAttendance: [
    "Adventure Trek"
  ],

  highestDemand: [
    "Pioneers Program"
  ],

  busiestTime: [
    "Pioneers Program"
  ],

  averageEnrollment: [
    "Pioneers Program"
  ]
};