import { useState } from "react";

const COLORS = {
  bg: "#0f0e17",
  card: "#1a1828",
  cardAlt: "#221f35",
  accent: "#7c3aed",
  accentLight: "#a78bfa",
  green: "#10b981",
  orange: "#f59e0b",
  red: "#ef4444",
  blue: "#3b82f6",
  pink: "#ec4899",
  text: "#ede9fe",
  muted: "#6b7280",
  border: "#2d2b45",
};

const students = [
  { id: 1, name: "Марія Коваленко", subject: "Англійська", teacher: "Олена Бойко", package: 20, used: 17, paid: true, lastContact: "2 дні тому", phone: "+380 67 123 4567", status: "active" },
  { id: 2, name: "Дмитро Іщенко", subject: "Математика", teacher: "Василь Мороз", package: 10, used: 3, paid: true, lastContact: "сьогодні", phone: "+380 50 234 5678", status: "active" },
  { id: 3, name: "Аліна Петренко", subject: "Англійська", teacher: "Олена Бойко", package: 15, used: 15, paid: false, lastContact: "5 днів тому", phone: "+380 93 345 6789", status: "warning" },
  { id: 4, name: "Олексій Сидоренко", subject: "Програмування", teacher: "Ігор Лисенко", package: 8, used: 6, paid: true, lastContact: "вчора", phone: "+380 66 456 7890", status: "active" },
  { id: 5, name: "Катерина Мельник", subject: "Математика", teacher: "Василь Мороз", package: 20, used: 19, paid: true, lastContact: "3 дні тому", phone: "+380 97 567 8901", status: "danger" },
  { id: 6, name: "Богдан Кравченко", subject: "Програмування", teacher: "Ігор Лисенко", package: 12, used: 2, paid: false, lastContact: "тиждень тому", phone: "+380 63 678 9012", status: "warning" },
];

const teachers = [
  { id: 1, name: "Олена Бойко", subject: "Англійська", students: 8, lessonsMonth: 32, ratePerLesson: 350, photo: "ОБ", color: "#ec4899" },
  { id: 2, name: "Василь Мороз", subject: "Математика", students: 6, lessonsMonth: 24, ratePerLesson: 400, photo: "ВМ", color: "#3b82f6" },
  { id: 3, name: "Ігор Лисенко", subject: "Програмування", students: 5, lessonsMonth: 20, ratePerLesson: 500, photo: "ІЛ", color: "#10b981" },
];

const lessons = [
  { id: 1, student: "Марія Коваленко", teacher: "Олена Бойко", date: "12.05.2026", time: "10:00", status: "проведено", recording: true },
  { id: 2, student: "Дмитро Іщенко", teacher: "Василь Мороз", date: "12.05.2026", time: "12:00", status: "проведено", recording: true },
  { id: 3, student: "Катерина Мельник", teacher: "Василь Мороз", date: "12.05.2026", time: "14:00", status: "заплановано", recording: false },
  { id: 4, student: "Олексій Сидоренко", teacher: "Ігор Лисенко", date: "13.05.2026", time: "11:00", status: "заплановано", recording: false },
  { id: 5, student: "Аліна Петренко", teacher: "Олена Бойко", date: "11.05.2026", time: "09:00", status: "пропущено", recording: false },
];

const StatusBadge = ({ status }) => {
  const map = {
    active: { label: "Активний", color: COLORS.green },
    warning: { label: "Увага", color: COLORS.orange },
    danger: { label: "Критично", color: COLORS.red },
    проведено: { label: "Проведено", color: COLORS.green },
    заплановано: { label: "Заплановано", color: COLORS.blue },
    пропущено: { label: "Пропущено", color: COLORS.red },
  };
  const s = map[status] || { label: status, color: COLORS.muted };
  return (
    <span style={{
      background: s.color + "22",
      color: s.color,
      border: `1px solid ${s.color}44`,
      borderRadius: 20,
      padding: "3px 10px",
      fontSize: 12,
      fontWeight: 600,
    }}>{s.label}</span>
  );
};

const ProgressBar = ({ value, max, color }) => {
  const pct = Math.min((value / max) * 100, 100);
  const barColor = pct >= 90 ? COLORS.red : pct >= 70 ? COLORS.orange : COLORS.green;
  return (
    <div style={{ background: COLORS.border, borderRadius: 99, height: 8, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color || barColor, borderRadius: 99, transition: "width 0.8s ease" }} />
    </div>
  );
};

const StatCard = ({ label, value, sub, color, icon }) => (
  <div style={{
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    position: "relative",
    overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: (color || COLORS.accent) + "15", borderRadius: "0 16px 0 80px" }} />
    <div style={{ fontSize: 24 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color: color || COLORS.accentLight, fontFamily: "serif" }}>{value}</div>
    <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: COLORS.muted }}>{sub}</div>}
  </div>
);

export default function SchoolCRM() {
  const [tab, setTab] = useState("dashboard");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = students.filter(s => {
    if (filterSubject !== "all" && s.subject !== filterSubject) return false;
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    return true;
  });

  const tabs = [
    { id: "dashboard", label: "📊 Дашборд" },
    { id: "students", label: "👩‍🎓 Учні" },
    { id: "teachers", label: "👨‍🏫 Вчителі" },
    { id: "lessons", label: "📅 Уроки" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Georgia', serif", color: COLORS.text }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 999,
          background: COLORS.green, color: "#fff",
          padding: "12px 20px", borderRadius: 12,
          fontSize: 14, fontWeight: 600,
          boxShadow: `0 8px 32px ${COLORS.green}44`,
          animation: "fadeIn 0.3s ease",
        }}>{notification}</div>
      )}

      {/* Header */}
      <div style={{
        background: COLORS.card,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.pink})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>🎓</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.accentLight }}>EduFlow CRM</div>
            <div style={{ fontSize: 11, color: COLORS.muted }}>Система управління онлайн-школою</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelectedStudent(null); setSelectedTeacher(null); }}
              style={{
                background: tab === t.id ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.pink})` : "transparent",
                border: tab === t.id ? "none" : `1px solid ${COLORS.border}`,
                color: tab === t.id ? "#fff" : COLORS.muted,
                borderRadius: 10, padding: "8px 16px",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s",
              }}>{t.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.accent + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Адміністратор</div>
            <div style={{ fontSize: 11, color: COLORS.muted }}>Керівник школи</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.accentLight }}>Дашборд</div>
              <div style={{ fontSize: 14, color: COLORS.muted }}>Загальна картина вашої школи</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              <StatCard label="Активних учнів" value="19" sub="+3 цього місяця" color={COLORS.accentLight} icon="👩‍🎓" />
              <StatCard label="Вчителів" value="3" sub="Всі активні" color={COLORS.green} icon="👨‍🏫" />
              <StatCard label="Уроків цього місяця" value="76" sub="З 80 запланованих" color={COLORS.blue} icon="📚" />
              <StatCard label="Потребують уваги" value="3" sub="Закінчується пакет" color={COLORS.red} icon="⚠️" />
            </div>

            {/* Alerts */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.red}44`, borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.red, marginBottom: 12 }}>⚠️ Потребують уваги прямо зараз</div>
              {students.filter(s => s.status !== "active").map(s => (
                <div key={s.id} onClick={() => { setSelectedStudent(s); setTab("students"); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", borderRadius: 10,
                    background: COLORS.cardAlt, marginBottom: 8, cursor: "pointer",
                    border: `1px solid ${COLORS.border}`,
                    transition: "all 0.2s",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.accent + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                      {s.status === "danger" ? "🔴" : "🟡"}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>
                        {s.status === "danger" ? `Залишився ${s.package - s.used} урок — потрібне поновлення!` : !s.paid ? "Не оплачено" : `Залишилось ${s.package - s.used} уроки`}
                      </div>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); showNotification(`Нагадування надіслано ${s.name}`); }}
                    style={{
                      background: COLORS.accent, color: "#fff", border: "none",
                      borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600,
                    }}>Надіслати нагадування</button>
                </div>
              ))}
            </div>

            {/* Teachers summary */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>👨‍🏫 Зарплата вчителів цього місяця</div>
              {teachers.map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: t.color + "33", color: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{t.photo}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</span>
                      <span style={{ fontSize: 14, color: COLORS.green, fontWeight: 700 }}>{(t.lessonsMonth * t.ratePerLesson).toLocaleString()} ₴</span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>{t.lessonsMonth} уроків × {t.ratePerLesson} ₴</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STUDENTS */}
        {tab === "students" && !selectedStudent && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.accentLight }}>Учні</div>
                <div style={{ fontSize: 14, color: COLORS.muted }}>{filtered.length} учнів знайдено</div>
              </div>
              <button onClick={() => showNotification("Форма додавання учня відкрита")}
                style={{ background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.pink})`, color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                + Додати учня
              </button>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
                style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}>
                <option value="all">Всі предмети</option>
                <option value="Англійська">Англійська</option>
                <option value="Математика">Математика</option>
                <option value="Програмування">Програмування</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}>
                <option value="all">Всі статуси</option>
                <option value="active">Активні</option>
                <option value="warning">Увага</option>
                <option value="danger">Критично</option>
              </select>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {filtered.map(s => (
                <div key={s.id} onClick={() => setSelectedStudent(s)}
                  style={{
                    background: COLORS.card, border: `1px solid ${COLORS.border}`,
                    borderRadius: 14, padding: 20, cursor: "pointer",
                    transition: "all 0.2s", display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 120px",
                    alignItems: "center", gap: 16,
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: COLORS.accent + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      {s.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{s.subject} · {s.teacher}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 4 }}>Уроків</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.used}/{s.package}</div>
                    <ProgressBar value={s.used} max={s.package} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 4 }}>Оплата</div>
                    <span style={{ fontSize: 13, color: s.paid ? COLORS.green : COLORS.red, fontWeight: 600 }}>{s.paid ? "✓ Оплачено" : "✗ Не оплачено"}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 4 }}>Контакт</div>
                    <div style={{ fontSize: 13 }}>{s.lastContact}</div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STUDENT CARD */}
        {tab === "students" && selectedStudent && (
          <div>
            <button onClick={() => setSelectedStudent(null)}
              style={{ background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.muted, borderRadius: 10, padding: "8px 16px", fontSize: 13, cursor: "pointer", marginBottom: 20 }}>
              ← Назад до списку
            </button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700 }}>
                    {selectedStudent.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{selectedStudent.name}</div>
                    <StatusBadge status={selectedStudent.status} />
                  </div>
                </div>
                {[
                  ["📚 Предмет", selectedStudent.subject],
                  ["👨‍🏫 Вчитель", selectedStudent.teacher],
                  ["📱 Телефон", selectedStudent.phone],
                  ["🕐 Останній контакт", selectedStudent.lastContact],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 13, color: COLORS.muted }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📊 Пакет уроків</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: COLORS.muted }}>Використано</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.accentLight }}>{selectedStudent.used}/{selectedStudent.package}</span>
                  </div>
                  <ProgressBar value={selectedStudent.used} max={selectedStudent.package} />
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 8 }}>
                    Залишилось: <strong style={{ color: selectedStudent.package - selectedStudent.used <= 2 ? COLORS.red : COLORS.green }}>{selectedStudent.package - selectedStudent.used} уроків</strong>
                  </div>
                </div>
                <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>💬 Дії</div>
                  {[
                    ["📨 Надіслати нагадування", COLORS.accent],
                    ["💳 Поновити пакет", COLORS.green],
                    ["📝 Додати нотатку", COLORS.blue],
                  ].map(([label, color]) => (
                    <button key={label} onClick={() => showNotification(`${label} — виконано`)}
                      style={{ display: "block", width: "100%", background: color + "22", border: `1px solid ${color}44`, color: color, borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8, textAlign: "left" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEACHERS */}
        {tab === "teachers" && !selectedTeacher && (
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.accentLight, marginBottom: 24 }}>Вчителі</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {teachers.map(t => (
                <div key={t.id} onClick={() => setSelectedTeacher(t)}
                  style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: t.color + "33", color: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>{t.photo}</div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 800 }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: COLORS.muted }}>{t.subject}</div>
                    </div>
                  </div>
                  {[
                    ["👩‍🎓 Учнів", t.students],
                    ["📚 Уроків цього місяця", t.lessonsMonth],
                    ["💰 Зарплата", `${(t.lessonsMonth * t.ratePerLesson).toLocaleString()} ₴`],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: 13, color: COLORS.muted }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{val}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEACHER CARD */}
        {tab === "teachers" && selectedTeacher && (
          <div>
            <button onClick={() => setSelectedTeacher(null)}
              style={{ background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.muted, borderRadius: 10, padding: "8px 16px", fontSize: 13, cursor: "pointer", marginBottom: 20 }}>
              ← Назад до списку
            </button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: selectedTeacher.color + "33", color: selectedTeacher.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800 }}>{selectedTeacher.photo}</div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{selectedTeacher.name}</div>
                    <div style={{ fontSize: 14, color: COLORS.muted }}>{selectedTeacher.subject}</div>
                  </div>
                </div>
                {[
                  ["👩‍🎓 Кількість учнів", selectedTeacher.students],
                  ["📚 Уроків цього місяця", selectedTeacher.lessonsMonth],
                  ["💵 Ставка за урок", `${selectedTeacher.ratePerLesson} ₴`],
                  ["💰 Нарахована зарплата", `${(selectedTeacher.lessonsMonth * selectedTeacher.ratePerLesson).toLocaleString()} ₴`],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 13, color: COLORS.muted }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: selectedTeacher.color }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🎥 Записи уроків</div>
                {lessons.filter(l => l.teacher === selectedTeacher.name && l.recording).map(l => (
                  <div key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: COLORS.cardAlt, borderRadius: 10, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{l.student}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>{l.date} · {l.time}</div>
                    </div>
                    <button onClick={() => showNotification("Відкриваємо запис уроку...")}
                      style={{ background: selectedTeacher.color + "22", border: `1px solid ${selectedTeacher.color}44`, color: selectedTeacher.color, borderRadius: 8, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                      ▶ Переглянути
                    </button>
                  </div>
                ))}
                <div style={{ fontSize: 15, fontWeight: 700, margin: "16px 0 12px" }}>👩‍🎓 Учні</div>
                {students.filter(s => s.teacher === selectedTeacher.name).map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 13 }}>{s.name}</span>
                    <StatusBadge status={s.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LESSONS */}
        {tab === "lessons" && (
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.accentLight, marginBottom: 24 }}>Облік уроків</div>
            <div style={{ display: "grid", gap: 10 }}>
              {lessons.map(l => (
                <div key={l.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 18, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 120px", alignItems: "center", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{l.student}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>{l.teacher}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>Дата</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{l.date}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>Час</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{l.time}</div>
                  </div>
                  <div>
                    {l.recording ? (
                      <button onClick={() => showNotification("Відкриваємо запис...")}
                        style={{ background: COLORS.blue + "22", border: `1px solid ${COLORS.blue}44`, color: COLORS.blue, borderRadius: 8, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                        🎥 Запис
                      </button>
                    ) : <span style={{ fontSize: 12, color: COLORS.muted }}>Немає запису</span>}
                  </div>
                  <StatusBadge status={l.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
