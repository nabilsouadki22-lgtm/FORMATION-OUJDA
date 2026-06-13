import { useState } from "react";

const sections = [
  {
    id: "overview",
    icon: "ti-file-description",
    label: "Overview",
    color: "#0C447C",
    bg: "#E6F1FB",
  },
  {
    id: "architecture",
    icon: "ti-stack-2",
    label: "Architecture",
    color: "#3C3489",
    bg: "#EEEDFE",
  },
  {
    id: "filestructure",
    note: "Production URLs (Fly): Frontend=https://CentreFormationOujda-frontend.fly.dev, Backend=https://CentreFormationOujda-backend.fly.dev",
  {
    id: "features",
    icon: "ti-list-check",
    label: "Features",
    color: "#993C1D",
    bg: "#FAECE7",
  },
  {
    id: "database",
    icon: "ti-database",
    label: "Database",
    color: "#854F0B",
    bg: "#FAEEDA",
  },
  {
    id: "workflow",
    icon: "ti-arrow-right-circle",
    label: "Workflow",
    color: "#3B6D11",
    bg: "#EAF3DE",
  },
];

const Badge = ({ label, color, bg }) => (
  <span
    style={{
      display: "inline-block",
      fontSize: 11,
      fontWeight: 500,
      padding: "2px 10px",
      borderRadius: 20,
      background: bg,
      color: color,
      letterSpacing: "0.03em",
    }}
  >
    {label}
  </span>
);

const Tag = ({ children }) => (
  <code
    style={{
      fontSize: 12,
      background: "var(--color-background-secondary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: 4,
      padding: "2px 7px",
      color: "var(--color-text-primary)",
      fontFamily: "monospace",
    }}
  >
    {children}
  </code>
);

const Row = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "9px 0",
      borderBottom: "0.5px solid var(--color-border-tertiary)",
      gap: 16,
    }}
  >
    <span style={{ fontSize: 13, color: "var(--color-text-secondary)", minWidth: 160 }}>
      {label}
    </span>
    <span style={{ fontSize: 13, color: "var(--color-text-primary)", textAlign: "right" }}>
      {value}
    </span>
  </div>
);

const SectionCard = ({ children, style }) => (
  <div
    style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: 12,
      padding: "1.25rem",
      marginBottom: "1rem",
      ...style,
    }}
  >
    {children}
  </div>
);

const FileTree = ({ items, level = 0 }) => (
  <div style={{ paddingLeft: level * 18 }}>
    {items.map((item, i) => (
      <div key={i}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "4px 0",
          }}
        >
          <i
            className={`ti ${item.icon || (item.children ? "ti-folder" : "ti-file")}`}
            style={{
              fontSize: 14,
              color: item.children ? "#185FA5" : "var(--color-text-secondary)",
            }}
            aria-hidden="true"
          />
          <span
            style={{
              fontSize: 13,
              color: item.children ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              fontFamily: item.children ? "inherit" : "monospace",
              fontWeight: item.children ? 500 : 400,
            }}
          >
            {item.name}
          </span>
          {item.note && (
            <span style={{ fontSize: 11, color: "var(--color-text-secondary)", fontStyle: "italic" }}>
              — {item.note}
            </span>
          )}
        </div>
        {item.children && <FileTree items={item.children} level={level + 1} />}
      </div>
    ))}
  </div>
);

const fileTree = [
  {
    name: "/project-root/",
    children: [
      { name: "config.php", icon: "ti-settings", note: "DB credentials, site settings, constants" },
      { name: "index.php", icon: "ti-file-code", note: "Home page (frontend + backend)" },
      { name: "login.php", icon: "ti-file-code", note: "Auth page" },
      { name: "dashboard.php", icon: "ti-file-code", note: "Admin dashboard" },
      { name: "developers.php", icon: "ti-file-code", note: "Developer list + search/filter" },
      { name: "developer-profile.php", icon: "ti-file-code", note: "Full dev profile (admin view)" },
      { name: "developer-edit.php", icon: "ti-file-code", note: "Edit developer details" },
      {
        name: "/partials/",
        children: [
          { name: "header.php", note: "HTML head, meta, CSS links" },
          { name: "nav.php", note: "Top navigation bar" },
          { name: "footer.php", note: "Footer + JS links" },
          { name: "alerts.php", note: "Flash messages / toast banners" },
          { name: "sidebar.php", note: "Admin sidebar menu" },
        ],
      },
      {
        name: "/includes/",
        children: [
          { name: "db.php", note: "PDO database connection (uses config.php)" },
          { name: "functions.php", note: "Shared helper functions" },
          { name: "auth.php", note: "Session/auth guard" },
        ],
      },
      {
        name: "/assets/",
        children: [
          { name: "/css/", children: [{ name: "global.css" }, { name: "admin.css" }] },
          { name: "/js/", children: [{ name: "main.js" }, { name: "developers.js" }] },
          { name: "/images/", children: [{ name: "logo.png" }, { name: "avatars/" }] },
        ],
      },
    ],
  },
];

const adminActions = [
  { icon: "ti-eye", label: "View full developer profile", color: "#185FA5", bg: "#E6F1FB" },
  { icon: "ti-edit", label: "Edit developer details", color: "#3C3489", bg: "#EEEDFE" },
  { icon: "ti-lock", label: "Block / Unblock developer", color: "#993C1D", bg: "#FAECE7" },
  { icon: "ti-trash", label: "Delete developer (with all apps)", color: "#A32D2D", bg: "#FCEBEB" },
  { icon: "ti-search", label: "Search & Filter developers", color: "#0F6E56", bg: "#E1F5EE" },
];

const profileFields = [
  "Username / Brand",
  "Email / Mobile",
  "Country",
  "Developer Type (Individual / Company)",
  "Account Status (Active / Blocked)",
  "Total Apps",
  "Joined Date",
];

const dbSchema = [
  { table: "developers", columns: "id, username, brand_name, email, mobile, country, type, status, joined_at" },
  { table: "apps", columns: "id, developer_id, app_name, status, created_at" },
  { table: "admin_logs", columns: "id, admin_id, action, target_developer_id, timestamp" },
];

const workflowSteps = [
  { step: "01", title: "Local Dev (XAMPP)", desc: "Project lives in htdocs/. Database managed via phpMyAdmin. config.php uses localhost credentials.", color: "#185FA5", bg: "#E6F1FB" },
  { step: "02", title: "Upload to cPanel", desc: "Upload full project directory to public_html/ via File Manager or FTP. No code changes needed.", color: "#3C3489", bg: "#EEEDFE" },
  { step: "03", title: "Import Database", desc: "Export local DB from phpMyAdmin. Import into cPanel's phpMyAdmin under the live database.", color: "#0F6E56", bg: "#E1F5EE" },
  { step: "04", title: "Update config.php", desc: "Change DB host, name, user, and password to live server values. Save — site is live instantly.", color: "#854F0B", bg: "#FAEEDA" },
];

export default function PRD() {
  const [active, setActive] = useState("overview");

  return (
    <div style={{ fontFamily: "var(--font-sans)", maxWidth: 700, margin: "0 auto", paddingBottom: 40 }}>
      <h2 className="sr-only">Developer Management Admin Panel — Product Requirements Document</h2>

      {/* Header */}
      <div style={{ padding: "1.5rem 0 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Badge label="PRD" color="#0C447C" bg="#E6F1FB" />
          <Badge label="PHP · MySQL · XAMPP · cPanel" color="#3C3489" bg="#EEEDFE" />
          <Badge label="v1.0" color="#5F5E5A" bg="#F1EFE8" />
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "var(--color-text-primary)",
            margin: "0 0 4px",
          }}
        >
          Developer Management Admin Panel
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0 }}>
          Full-stack · Single-file-per-page architecture · Zero-config deployment
        </p>
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "6px 0 0" }}>
          Note: If you want to publish without paid hosting, you can deploy the frontend to GitHub Pages or Cloudflare Pages (free) and deploy the backend to cPanel or any shared host. See the repo workflow `.github/workflows/deploy-frontend.yml` for an automated, no-billing frontend deploy.
        </p>
      </div>

      {/* Nav tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          borderBottom: "0.5px solid var(--color-border-tertiary)",
          paddingBottom: 0,
        }}
      >
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: active === s.id ? 500 : 400,
              border: "none",
              borderBottom: active === s.id ? `2px solid ${s.color}` : "2px solid transparent",
              background: "transparent",
              color: active === s.id ? s.color : "var(--color-text-secondary)",
              cursor: "pointer",
              borderRadius: 0,
              transition: "color 0.15s",
            }}
          >
            <i className={`ti ${s.icon}`} style={{ fontSize: 15 }} aria-hidden="true" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {active === "overview" && (
        <div>
          <SectionCard>
            <p style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.7, margin: 0 }}>
              This is a full-stack web application built on a <strong>single-file-per-page</strong> architecture
              using <Tag>PHP</Tag> and <Tag>MySQL</Tag>. Each page file (e.g.{" "}
              <Tag>developers.php</Tag>) encapsulates its own backend logic and frontend markup in one place.
              The system is developed locally on <Tag>XAMPP</Tag> and deployed directly to cPanel hosting
              with no code changes — only <Tag>config.php</Tag> is updated.
            </p>
          </SectionCard>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "ti-file-code", label: "Architecture", value: "Single-file-per-page (PHP)", color: "#185FA5" },
              { icon: "ti-database", label: "Database", value: "MySQL via PDO", color: "#3C3489" },
              { icon: "ti-server", label: "Local Dev", value: "XAMPP (htdocs/)", color: "#0F6E56" },
              { icon: "ti-cloud-upload", label: "Deployment", value: "cPanel (public_html/)", color: "#854F0B" },
              { icon: "ti-settings", label: "Config", value: "Single config.php file", color: "#993C1D" },
              { icon: "ti-puzzle", label: "Components", value: "PHP partials (require_once)", color: "#3B6D11" },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  background: "var(--color-background-secondary)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <i className={`ti ${m.icon}`} style={{ fontSize: 20, color: m.color, marginTop: 1 }} aria-hidden="true" />
                <div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 2 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
                    {m.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Architecture */}
      {active === "architecture" && (
        <div>
          <SectionCard>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 12px" }}>
              Core principles
            </p>
            {[
              ["Single-file-per-page", "Every route is one .php file containing backend (queries, auth, form handling) and frontend (HTML, CSS, JS). No controller/view split."],
              ["Central config.php", "All DB credentials, site name, base URL, timezone, and shared content constants live in one file. Swapping environments = editing one file."],
              ["PHP Partials", "Shared UI (nav, header, footer, alerts) extracted into /partials/ and included via require_once. No template engine needed."],
              ["/includes/ helpers", "db.php holds the PDO connection. functions.php holds reusable logic. auth.php guards protected pages."],
              ["Zero build step", "No npm, no Composer (unless added later), no bundler. Drop folder into server and it runs."],
            ].map(([title, desc]) => (
              <div
                key={title}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "0.5px solid var(--color-border-tertiary)",
                }}
              >
                <i className="ti ti-check" style={{ fontSize: 15, color: "#185FA5", marginTop: 2, flexShrink: 0 }} aria-hidden="true" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 2 }}>
                    {title}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </SectionCard>
          <SectionCard>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 10px" }}>
              config.php — what it holds
            </p>
            {[
              ["DB_HOST", "localhost (dev) / live hostname (prod)"],
              ["DB_NAME", "Database name"],
              ["DB_USER", "Database username"],
              ["DB_PASS", "Database password"],
              ["SITE_NAME", "Site title used across pages"],
              ["BASE_URL", "Root URL (http://localhost/project or live domain)"],
              ["TIMEZONE", "e.g. Asia/Kolkata"],
              ["FOOTER_TEXT", "Copyright / footer copy"],
            ].map(([k, v]) => (
              <Row key={k} label={<Tag>{k}</Tag>} value={v} />
            ))}
          </SectionCard>
        </div>
      )}

      {/* File Structure */}
      {active === "filestructure" && (
        <SectionCard>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 14px" }}>
            Project directory layout
          </p>
          <FileTree items={fileTree} />
        </SectionCard>
      )}

      {/* Features */}
      {active === "features" && (
        <div>
          <SectionCard>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 12px" }}>
              Developer profile fields
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profileFields.map((f) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "var(--color-background-secondary)",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 13,
                    color: "var(--color-text-primary)",
                  }}
                >
                  <i className="ti ti-point-filled" style={{ fontSize: 10, color: "#185FA5" }} aria-hidden="true" />
                  {f}
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 12px" }}>
              Admin actions
            </p>
            {adminActions.map((a) => (
              <div
                key={a.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "0.5px solid var(--color-border-tertiary)",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: a.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i className={`ti ${a.icon}`} style={{ fontSize: 16, color: a.color }} aria-hidden="true" />
                </div>
                <span style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{a.label}</span>
              </div>
            ))}
          </SectionCard>
          <SectionCard>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 10px" }}>
              Sections on developer profile page (admin view)
            </p>
            {[
              ["Header", "Avatar, username/brand, type badge, status badge"],
              ["Identity", "Email, mobile, country, joined date"],
              ["App stats", "Total apps, active apps, blocked apps"],
              ["Admin actions", "Edit, Block/Unblock, Delete buttons"],
              ["Activity log", "Admin actions taken on this developer"],
            ].map(([s, d]) => <Row key={s} label={s} value={d} />)}
          </SectionCard>
        </div>
      )}

      {/* Database */}
      {active === "database" && (
        <div>
          {dbSchema.map((t) => (
            <SectionCard key={t.table}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <i className="ti ti-table" style={{ fontSize: 16, color: "#854F0B" }} aria-hidden="true" />
                <Tag>{t.table}</Tag>
              </div>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
                {t.columns.split(", ").map((col, i) => (
                  <span key={col}>
                    <Tag>{col}</Tag>
                    {i < t.columns.split(", ").length - 1 && " "}
                  </span>
                ))}
              </p>
            </SectionCard>
          ))}
          <SectionCard>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 10px" }}>
              Connection setup
            </p>
            {[
              ["File", "includes/db.php"],
              ["Method", "PDO with prepared statements"],
              ["Charset", "utf8mb4"],
              ["Error mode", "PDO::ERRMODE_EXCEPTION"],
              ["Credentials source", "config.php constants (DB_HOST, DB_NAME, DB_USER, DB_PASS)"],
            ].map(([k, v]) => <Row key={k} label={k} value={v} />)}
          </SectionCard>
        </div>
      )}

      {/* Workflow */}
      {active === "workflow" && (
        <div>
          {workflowSteps.map((w) => (
            <SectionCard key={w.step}>
              <div style={{ display: "flex", gap: 14 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: w.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 500,
                    color: w.color,
                    flexShrink: 0,
                  }}
                >
                  {w.step}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 }}>
                    {w.title}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                    {w.desc}
                  </div>
                </div>
              </div>
            </SectionCard>
          ))}
          <SectionCard style={{ borderColor: "#B5D4F4" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <i className="ti ti-info-circle" style={{ fontSize: 16, color: "#185FA5", marginTop: 1, flexShrink: 0 }} aria-hidden="true" />
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
                The project requires <strong>PHP 7.4+</strong> and <strong>MySQL 5.7+</strong>. No Composer, no npm,
                no build step. Any standard shared hosting with cPanel running Apache/PHP supports this out of the box.
              </p>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
