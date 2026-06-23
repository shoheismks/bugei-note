import {
  Activity,
  Dumbbell,
  Home,
  Settings,
  Swords,
} from "lucide-react";

const navItems = [
  { id: "home", label: "ホーム", Icon: Home },
  { id: "training", label: "稽古", Icon: Dumbbell },
  { id: "body", label: "身体", Icon: Activity },
  { id: "martial", label: "武芸", Icon: Swords },
  { id: "settings", label: "設定", Icon: Settings },
];

function Navigation({ tab, setTab }) {
  return (
    <nav aria-label="Primary navigation">
      {navItems.map(({ id, label, Icon }) => {
        const isActive = tab === id;

        return (
          <button
            key={id}
            type="button"
            className={isActive ? "active" : ""}
            aria-current={isActive ? "page" : undefined}
            onClick={() => setTab(id)}
          >
            <Icon aria-hidden="true" size={20} strokeWidth={2} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default Navigation;
