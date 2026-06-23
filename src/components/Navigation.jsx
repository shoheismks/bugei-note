import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  BookText,
  Dumbbell,
  Footprints,
  Home,
  Radar,
  Settings,
  Swords,
  Target,
  Trophy,
  User,
  Users,
} from "lucide-react";

const navItems = [
  { id: "home", label: "ホーム", Icon: Home },
  { id: "profile", label: "プロフィール", Icon: User },
  { id: "body", label: "身体", Icon: Activity },
  { id: "training", label: "鍛錬", Icon: Dumbbell },
  { id: "rank", label: "レポート", Icon: Radar },
  { id: "ranking", label: "ランキング", Icon: BarChart3 },
  { id: "rivals", label: "ライバル", Icon: Users },
  { id: "achievement", label: "実績", Icon: Trophy },
  { id: "martial", label: "稽古", Icon: Swords },
  { id: "journal", label: "日誌", Icon: BookOpen },
  { id: "titles", label: "称号", Icon: Award },
  { id: "missions", label: "任務", Icon: Target },
  { id: "steps", label: "歩数", Icon: Footprints },
  { id: "techniques", label: "図鑑", Icon: BookText },
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
