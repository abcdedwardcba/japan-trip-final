import React, { useState, useEffect, useRef } from "react";
import {
  Map,
  CheckSquare,
  Wallet,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Plane,
  Hotel,
  Car,
  Calendar,
  ExternalLink,
  MapPin,
  X,
  Music,
  Camera,
  Coffee,
  Train,
  ArrowRight,
  ShoppingBag,
  CloudSnow,
  Languages,
  CreditCard,
  Banknote,
  User,
  Search,
  Heart,
  Star,
  Edit2,
  Save,
  Copy,
  Check,
  Luggage,
  Users,
  ArrowLeft,
  UserPlus,
  MinusCircle,
  Upload,
  Image as ImageIcon,
  Globe,
  Loader2,
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";

// --- 1. 全局常量定义 ---

const THEME = {
  primary: "#FF5A5F",
  textMain: "#222222",
  textSub: "#717171",
  bg: "#FFFFFF",
  bgSecondary: "#F7F7F7",
  border: "#DDDDDD",
};

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1548263594-a71ea65a857c?auto=format&fit=crop&w=800&q=80";
const USER_AVATAR = "https://i.imgur.com/VjROZQL.jpeg";

const DEFAULT_PAYERS = [
  "Pei Teng",
  "Pei Leng",
  "Sony Lee",
  "Pei Wen",
  "Kobe",
  "Jordan",
  "Penny Phang",
  "Edward Foo",
];

// --- 2. Firebase 初始化 (这里已经填好了你的钥匙) ---

const firebaseConfig = {
  apiKey: "AIzaSyBeNe0gZ8w8lbF565sHOonkaZKZY6QVx9A",
  authDomain: "lee-family-hokkaido-2025.firebaseapp.com",
  projectId: "lee-family-hokkaido-2025",
  storageBucket: "lee-family-hokkaido-2025.firebasestorage.app",
  messagingSenderId: "1049495159054",
  appId: "1:1049495159054:web:a37f2cf06fe14f43d5575f",
  measurementId: "G-037S76KS1F",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "lee_family_hokkaido_2025"; // 给你的 App 起个固定的名字

// --- 3. 核心 Hook: useFirestore (修复后的云端同步) ---

function useFirestore(collectionName, docId, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 1. 自动匿名登录
  useEffect(() => {
    signInAnonymously(auth).catch((error) => {
      console.error("登录失败:", error);
    });
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. 监听数据
  useEffect(() => {
    // 只有登录成功后才开始监听
    if (!user) return;

    // 路径: artifacts/lee_family_hokkaido_2025/public/data/{集合}/{文档}
    const docRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      collectionName,
      docId
    );

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data().data;
          if (data !== undefined) {
            setValue(data);
          }
        } else {
          // 第一次创建数据
          setDoc(docRef, { data: defaultValue });
        }
        setLoading(false);
      },
      (error) => {
        console.error("读取数据出错:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, collectionName, docId]);

  // 3. 更新数据
  const updateValue = async (newValue) => {
    setValue(newValue); // 先变本地，反应快

    if (user) {
      try {
        const docRef = doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          collectionName,
          docId
        );
        await setDoc(docRef, { data: newValue });
      } catch (error) {
        console.error("写入数据出错:", error);
      }
    }
  };

  return [value, updateValue, loading];
}

// ------------------------------------------------------------------
// 👇 不要动下面的代码，保留原来的 "4. 辅助函数" 及以后的内容 👇
// ------------------------------------------------------------------

// --- 4. 辅助函数 & 图标 ---

const getIcon = (type) => {
  switch (type) {
    case "plane":
      return <Plane size={16} />;
    case "camera":
      return <Camera size={16} />;
    case "car":
      return <Car size={16} />;
    case "train":
      return <Train size={16} />;
    case "coffee":
      return <Coffee size={16} />;
    case "map":
      return <Map size={16} />;
    case "music":
      return <Music size={16} />;
    default:
      return <MapPin size={16} />;
  }
};

const openMap = (location) => {
  const query = encodeURIComponent(location);
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${query}`,
    "_blank"
  );
};

const openFlight = (flightNo) => {
  window.open(
    `https://www.google.com/search?q=${flightNo}+flight+status`,
    "_blank"
  );
};

const openTranslate = (source) => {
  const sl = source === "cn" ? "zh-CN" : "en";
  window.open(
    `https://translate.google.com/?sl=${sl}&tl=ja&op=translate`,
    "_blank"
  );
};

const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    alert(`已复制: ${text}`);
  }
};

// --- 5. 初始数据定义 ---

const INITIAL_FLIGHTS = [
  {
    type: "Outbound",
    date: "Dec 25",
    route: "KUL ➔ CTS",
    flightNo: "D79550",
    airline: "AirAsia X",
    ref: "H7NTRI",
    time: "01:05 - 09:40",
    duration: "8h 35m",
    location: "New Chitose Airport",
  },
  {
    type: "Return",
    date: "Jan 01",
    route: "CTS ➔ KUL",
    flightNo: "D79551",
    airline: "AirAsia X",
    ref: "AD613Q",
    time: "10:55 - 18:45",
    duration: "7h 50m",
    location: "Kuala Lumpur International Airport Terminal 2",
  },
];

const INITIAL_ACCOMMODATIONS = [
  {
    id: 1,
    name: "The Tower by Hoshino Resorts",
    nameCn: "星野集团 Tomamu",
    dates: "Dec 25 - 27",
    rating: "4.8",
    location: "Hoshino Resorts Tomamu The Tower",
    image:
      "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=800&q=80",
    details: [{ room: "Twin Room ×3", ref: "SUR940950", source: "Klook" }],
  },
  {
    id: 2,
    name: "JR Inn Asahikawa",
    nameCn: "旭川 JR Inn",
    dates: "Dec 27 - 28",
    rating: "4.6",
    location: "JR Inn Asahikawa",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    details: [
      { room: "Economy Twin ×1", ref: "1433806953951695", source: "Trips" },
      { room: "Twin Room ×2", ref: "1433806953958841", source: "Trips" },
    ],
  },
  {
    id: 3,
    name: "Hotel Sonia Otaru",
    nameCn: "小樽索尼娅酒店",
    dates: "Dec 28 - 29",
    rating: "4.5",
    location: "Hotel Sonia Otaru",
    image:
      "https://images.unsplash.com/photo-1579760777249-204739266779?auto=format&fit=crop&w=800&q=80",
    details: [
      { room: "Twin Room ×1", ref: "1433806936047743", source: "Trips" },
      { room: "2 Single + 1 Sofa ×2", ref: "1952402636", source: "Agoda" },
    ],
  },
  {
    id: 4,
    name: "Granbell Hotel Tanuki",
    nameCn: "札幌薄野格兰贝尔",
    dates: "Dec 29 - Jan 01",
    rating: "4.7",
    location: "Sapporo Granbell Hotel",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
    details: [
      { room: "Twin Room 18m² ×4", ref: "1433806954425507", source: "Trips" },
    ],
  },
];

const INITIAL_TRANSFERS = [
  {
    id: 1,
    date: "12/25",
    from: "New Chitose",
    to: "Tomamu",
    note: "Arrival Pickup",
    location: "New Chitose Airport",
  },
  {
    id: 2,
    date: "12/27",
    from: "Tomamu",
    to: "Asahikawa",
    note: "Sightseeing Charter",
    location: "Shirahige Falls",
  },
  {
    id: 3,
    date: "12/28",
    from: "Asahikawa",
    to: "Otaru",
    note: "Via Tenguyama",
    location: "Otaru Tenguyama Ropeway",
  },
  {
    id: 4,
    date: "12/29",
    from: "Otaru",
    to: "Sapporo",
    note: "City Transfer",
    location: "Sapporo",
  },
  {
    id: 5,
    date: "01/01",
    from: "Sapporo",
    to: "New Chitose",
    note: "Departure",
    location: "New Chitose Airport",
  },
];

const INITIAL_ITINERARY = [
  {
    day: 1,
    date: "Dec 25",
    titleCn: "抵达北海道 & 前往 Tomamu",
    titleEn: "Arrival",
    weather: "-5°C",
    iconType: "plane",
    activities: [
      {
        time: "09:40",
        content: "Arrive New Chitose Airport",
        location: "New Chitose Airport",
      },
      {
        time: "13:00",
        content: "Check-in: The Tower",
        location: "Hoshino Resorts Tomamu The Tower",
      },
      {
        time: "18:00",
        content: "Dinner: Nininupuri",
        location: "Nininupuri Tomamu",
      },
    ],
  },
  {
    day: 2,
    date: "Dec 26",
    titleCn: "Tomamu 全日滑雪体验",
    titleEn: "Snow Resort",
    weather: "-8°C",
    iconType: "camera",
    activities: [
      {
        time: "09:00",
        content: "Skiing & Snow Park",
        location: "Tomamu Ski Resort",
      },
      {
        time: "14:00",
        content: "Mina-Mina Beach & Onsen",
        location: "Mina-Mina Beach",
      },
      { time: "17:00", content: "Ice Village", location: "Ice Village Tomamu" },
    ],
  },
  {
    day: 3,
    date: "Dec 27",
    titleCn: "富良野 & 美瑛观光",
    titleEn: "Sightseeing",
    weather: "-6°C",
    iconType: "car",
    activities: [
      {
        time: "11:00",
        content: "Furano Lunch (Kumagera)",
        location: "Kumagera Furano",
      },
      {
        time: "13:30",
        content: "Shirahige Falls",
        location: "Shirahige Falls",
      },
      {
        time: "18:00",
        content: "Check-in Asahikawa",
        location: "JR Inn Asahikawa",
      },
    ],
  },
  {
    day: 4,
    date: "Dec 28",
    titleCn: "旭川前往小樽",
    titleEn: "To Otaru",
    weather: "-4°C",
    iconType: "train",
    activities: [
      {
        time: "13:00",
        content: "Tenguyama Ropeway",
        location: "Otaru Tenguyama Ropeway",
      },
      { time: "15:30", content: "Otaru Canal Walk", location: "Otaru Canal" },
      {
        time: "18:30",
        content: "Dinner: Sushi Street",
        location: "Otaru Sushi Street",
      },
    ],
  },
  {
    day: 5,
    date: "Dec 29",
    titleCn: "小樽 & 札幌",
    titleEn: "To Sapporo",
    weather: "-3°C",
    iconType: "coffee",
    activities: [
      {
        time: "10:00",
        content: "Music Box Museum",
        location: "Otaru Music Box Museum",
      },
      {
        time: "15:30",
        content: "Check-in: Granbell",
        location: "Sapporo Granbell Hotel",
      },
      {
        time: "17:00",
        content: "Tanukikoji Shopping",
        location: "Tanukikoji Shopping Arcade",
      },
    ],
  },
  {
    day: 6,
    date: "Dec 30",
    titleCn: "札幌自由行",
    titleEn: "Sapporo Day",
    weather: "-5°C",
    iconType: "map",
    activities: [
      {
        time: "09:00",
        content: "Odori Park & TV Tower",
        location: "Sapporo TV Tower",
      },
      {
        time: "11:00",
        content: "Nijo Market",
        location: "Nijo Market Sapporo",
      },
      {
        time: "19:00",
        content: "Genghis Khan BBQ",
        location: "Daruma Genghis Khan",
      },
    ],
  },
  {
    day: 7,
    date: "Dec 31",
    titleCn: "跨年日",
    titleEn: "New Year's Eve",
    weather: "-7°C",
    iconType: "music",
    activities: [
      {
        time: "10:00",
        content: "Daimaru Shopping",
        location: "Daimaru Sapporo",
      },
      {
        time: "22:00",
        content: "Hokkaido Shrine",
        location: "Hokkaido Shrine",
      },
    ],
  },
  {
    day: 8,
    date: "Jan 01",
    titleCn: "返程",
    titleEn: "Departure",
    weather: "-4°C",
    iconType: "plane",
    activities: [
      {
        time: "07:30",
        content: "Transfer to Airport",
        location: "New Chitose Airport",
      },
      {
        time: "10:55",
        content: "Flight D79551",
        location: "New Chitose Airport",
      },
    ],
  },
];

const WINTER_CHECKLIST_TEMPLATE = [
  { id: 1, text: "Passport & Flight Tickets", completed: false },
  { id: 2, text: "Visit Japan Web QR", completed: false },
  { id: 3, text: "Ski Wear & Thermal", completed: false },
  { id: 4, text: "Snow Boots (Non-slip)", completed: false },
  { id: 5, text: "Gloves, Beanie, Neck Warmer", completed: false },
  { id: 6, text: "Power Bank", completed: false },
  { id: 7, text: "Sim Card / Roaming", completed: false },
  { id: 8, text: "Cash (Yen) & Credit Cards", completed: false },
];

const INITIAL_MULTI_USER_CHECKLISTS = (() => {
  const initial = {};
  DEFAULT_PAYERS.forEach((user) => {
    initial[user] = WINTER_CHECKLIST_TEMPLATE.map((i) => ({ ...i }));
  });
  return initial;
})();

const WINTER_PHRASES = [
  {
    jp: "リフト乗り場はどこですか？",
    romaji: "Rifuto noriba wa doko desu ka?",
    cn: "缆车在哪?",
  },
  { jp: "寒いです", romaji: "Samui desu", cn: "好冷" },
  {
    jp: "スキーをレンタルしたいです",
    romaji: "Sukii o rentaru shitai desu",
    cn: "我想租滑雪板",
  },
  {
    jp: "トイレはどこですか？",
    romaji: "Toire wa doko desu ka?",
    cn: "厕所在哪?",
  },
  { jp: "お会計お願いします", romaji: "Okaikei onegaishimasu", cn: "买单" },
];

const EXCHANGE_RATE = 0.031;

// --- 6. 子组件定义 ---

// 6.1 Plan Tab
const PlanTab = () => {
  // 这里 'activeSubTab' 是本地状态，不需要云同步
  const [subTab, setSubTab] = useState("schedule");
  const [expandedDay, setExpandedDay] = useState(1);

  // --- 云端数据 ---
  const [itinerary, setItinerary] = useFirestore(
    "hokkaido_trip",
    "itinerary",
    INITIAL_ITINERARY
  );
  const [transfers, setTransfers] = useFirestore(
    "hokkaido_trip",
    "transfers",
    INITIAL_TRANSFERS
  );
  const [accommodations, setAccommodations] = useFirestore(
    "hokkaido_trip",
    "accommodations",
    INITIAL_ACCOMMODATIONS
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [isEditingTransfer, setIsEditingTransfer] = useState(false);
  const [isEditingStays, setIsEditingStays] = useState(false);

  // --- Handlers ---
  const handleNoteChange = (day, note) => {
    const updated = itinerary.map((item) =>
      item.day === day ? { ...item, note: note } : item
    );
    setItinerary(updated);
  };
  const startEditing = (day) => {
    setIsEditing(true);
    setEditingDay(day);
    setExpandedDay(day);
  };
  const saveEditing = () => {
    setIsEditing(false);
    setEditingDay(null);
  };

  const updateActivity = (day, idx, field, value) => {
    const updated = itinerary.map((item) => {
      if (item.day === day) {
        const newActivities = [...item.activities];
        newActivities[idx] = { ...newActivities[idx], [field]: value };
        return { ...item, activities: newActivities };
      }
      return item;
    });
    setItinerary(updated);
  };
  const deleteActivity = (day, idx) => {
    const updated = itinerary.map((item) => {
      if (item.day === day) {
        return {
          ...item,
          activities: item.activities.filter((_, i) => i !== idx),
        };
      }
      return item;
    });
    setItinerary(updated);
  };
  const addActivity = (day) => {
    const updated = itinerary.map((item) => {
      if (item.day === day) {
        return {
          ...item,
          activities: [
            ...item.activities,
            { time: "00:00", content: "New Activity", location: "" },
          ],
        };
      }
      return item;
    });
    setItinerary(updated);
  };

  const updateTransfer = (id, field, value) => {
    const updated = transfers.map((t) =>
      t.id === id ? { ...t, [field]: value } : t
    );
    setTransfers(updated);
  };
  const deleteTransfer = (id) =>
    setTransfers(transfers.filter((t) => t.id !== id));
  const addTransfer = () =>
    setTransfers([
      ...transfers,
      {
        id: Date.now(),
        date: "12/xx",
        from: "Origin",
        to: "Dest",
        note: "Note",
        location: "",
      },
    ]);

  // Stay Handlers
  const updateAccommodation = (id, field, value) => {
    const updated = accommodations.map((h) =>
      h.id === id ? { ...h, [field]: value } : h
    );
    setAccommodations(updated);
  };

  const addAccommodation = () => {
    setAccommodations([
      ...accommodations,
      {
        id: Date.now(),
        name: "New Hotel",
        nameCn: "酒店中文名",
        dates: "Dates",
        rating: "4.5",
        location: "Location",
        image: DEFAULT_COVER,
        details: [],
      },
    ]);
  };

  const deleteAccommodation = (id) =>
    setAccommodations(accommodations.filter((h) => h.id !== id));

  const handleHotelImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large (< 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAccommodation(id, "image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateRoomDetail = (hotelId, idx, field, value) => {
    const updated = accommodations.map((h) => {
      if (h.id === hotelId) {
        const newDetails = [...h.details];
        newDetails[idx] = { ...newDetails[idx], [field]: value };
        return { ...h, details: newDetails };
      }
      return h;
    });
    setAccommodations(updated);
  };

  const addRoomDetail = (hotelId) => {
    const updated = accommodations.map((h) => {
      if (h.id === hotelId) {
        return {
          ...h,
          details: [...h.details, { room: "", ref: "", source: "" }],
        };
      }
      return h;
    });
    setAccommodations(updated);
  };

  const deleteRoomDetail = (hotelId, idx) => {
    const updated = accommodations.map((h) => {
      if (h.id === hotelId) {
        return { ...h, details: h.details.filter((_, i) => i !== idx) };
      }
      return h;
    });
    setAccommodations(updated);
  };

  const getTabClass = (name) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
      subTab === name
        ? "bg-[#222222] text-white shadow-md"
        : "bg-white border border-[#DDDDDD] text-[#717171] hover:border-[#222222] hover:text-[#222222]"
    }`;

  return (
    <div className="h-full flex flex-col pb-24 bg-[#F7F7F7]">
      <div className="bg-white sticky top-0 z-20 px-6 py-4 shadow-sm">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSubTab("schedule")}
            className={getTabClass("schedule")}
          >
            Itinerary
          </button>
          <button
            onClick={() => setSubTab("flight")}
            className={getTabClass("flight")}
          >
            Flights
          </button>
          <button
            onClick={() => setSubTab("hotel")}
            className={getTabClass("hotel")}
          >
            Stays
          </button>
          <button
            onClick={() => setSubTab("transfer")}
            className={getTabClass("transfer")}
          >
            Transfers
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 pt-4 overflow-y-auto space-y-4 pb-20">
        {/* Schedule */}
        {subTab === "schedule" &&
          itinerary.map((item) => {
            const isExpanded = expandedDay === item.day;
            const displayMonth = item.date.includes("Jan") ? "JAN" : "DEC";

            return (
              <div
                key={item.day}
                className="bg-white rounded-2xl border border-[#DDDDDD] overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
              >
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : item.day)}
                  className="w-full flex items-center justify-between p-5 bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD]">
                      <span className="text-[10px] uppercase font-bold text-[#717171]">
                        {displayMonth}
                      </span>
                      <span className="text-lg font-extrabold text-[#222222]">
                        {item.date.split(" ")[1]}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-[#222222] text-base">
                        {item.titleCn}
                      </h3>
                      <p className="text-xs text-[#717171]">{item.titleEn}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {item.iconType && (
                      <div className="bg-[#FF5A5F]/10 p-1.5 rounded-full text-[#FF5A5F]">
                        {getIcon(item.iconType)}
                      </div>
                    )}
                    {item.weather && (
                      <div className="flex items-center gap-1 bg-[#F7F7F7] px-2 py-0.5 rounded-full border border-[#DDDDDD]">
                        <span className="text-[#717171]">
                          <CloudSnow size={10} />
                        </span>
                        <span className="text-[10px] font-bold text-[#222222]">
                          {item.weather}
                        </span>
                      </div>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 animate-fadeIn">
                    <div className="flex justify-end mb-2">
                      {isEditing && editingDay === item.day ? (
                        <button
                          onClick={saveEditing}
                          className="flex items-center gap-1 text-xs font-bold text-white bg-green-500 px-3 py-1.5 rounded-full"
                        >
                          <Save size={12} /> Done
                        </button>
                      ) : (
                        <button
                          onClick={() => startEditing(item.day)}
                          className="flex items-center gap-1 text-xs font-bold text-[#717171] hover:text-[#FF5A5F] bg-[#F7F7F7] px-3 py-1.5 rounded-full"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                      )}
                    </div>

                    <div className="space-y-6 pl-4 border-l border-[#DDDDDD] ml-6 py-2">
                      {item.activities.map((act, idx) => (
                        <div key={idx} className="relative group">
                          <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-white border-2 border-[#FF5A5F] rounded-full"></div>

                          {isEditing && editingDay === item.day ? (
                            <div className="flex gap-2 items-start bg-[#F7F7F7] p-2 rounded-lg">
                              <div className="flex-1 space-y-2">
                                <input
                                  value={act.time}
                                  onChange={(e) =>
                                    updateActivity(
                                      item.day,
                                      idx,
                                      "time",
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-xs font-bold p-1 rounded border border-[#DDDDDD]"
                                />
                                <textarea
                                  value={act.content}
                                  onChange={(e) =>
                                    updateActivity(
                                      item.day,
                                      idx,
                                      "content",
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-sm p-1 rounded border border-[#DDDDDD] resize-none"
                                  rows="2"
                                />
                              </div>
                              <button
                                onClick={() => deleteActivity(item.day, idx)}
                                className="text-red-400 p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start">
                              <div className="flex-1 pr-2">
                                <span className="inline-block text-xs font-bold text-[#222222] mb-0.5 bg-[#F7F7F7] px-1.5 py-0.5 rounded mr-2">
                                  {act.time}
                                </span>
                                <span className="text-sm text-[#222222] leading-relaxed">
                                  {act.content}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openMap(act.location);
                                }}
                                className="text-[#717171] hover:text-[#FF5A5F] transition-colors p-1"
                              >
                                <MapPin size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      {isEditing && editingDay === item.day && (
                        <button
                          onClick={() => addActivity(item.day)}
                          className="flex items-center gap-1 text-xs font-bold text-[#FF5A5F] mt-2 ml-1"
                        >
                          <Plus size={14} /> Add Activity
                        </button>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#DDDDDD]">
                      <textarea
                        className="w-full p-4 text-sm bg-[#F7F7F7] rounded-xl border-none focus:ring-2 focus:ring-[#222222] outline-none resize-none transition-all placeholder-[#717171]"
                        rows="2"
                        placeholder="Add a private note for this day..."
                        value={item.note || ""}
                        onChange={(e) =>
                          handleNoteChange(item.day, e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        {/* Flight View */}
        {subTab === "flight" && (
          <div className="space-y-4">
            <div className="bg-[#FF5A5F]/10 p-4 rounded-xl border border-[#FF5A5F] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#FF5A5F] uppercase">
                  Trip.com Booking ID
                </span>
                <div className="text-lg font-mono font-bold text-[#222222]">
                  1433808123136448
                </div>
              </div>
              <button
                onClick={() => copyToClipboard("1433808123136448")}
                className="bg-white p-2 rounded-full text-[#FF5A5F] shadow-sm"
              >
                <Copy size={16} />
              </button>
            </div>

            {INITIAL_FLIGHTS.map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-[#DDDDDD] shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#FF5A5F]"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-[#717171] uppercase tracking-wider">
                      {f.type} • {f.airline}
                    </span>
                    <h3 className="text-2xl font-bold text-[#222222] mt-1">
                      {f.route}
                    </h3>
                    <div className="text-sm font-medium text-[#FF5A5F] mt-1 flex items-center gap-2">
                      Booking Ref: {f.ref}
                      <button
                        onClick={() => copyToClipboard(f.ref)}
                        className="text-[#717171] hover:text-[#222222]"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="bg-[#F7F7F7] p-2 rounded-full">
                    <Plane size={24} className="text-[#222222]" />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center py-2 border-b border-[#DDDDDD]">
                    <div
                      className="flex items-center gap-2"
                      onClick={() => openFlight(f.flightNo)}
                    >
                      <span className="text-lg font-semibold text-[#222222] underline decoration-[#DDDDDD] underline-offset-4 cursor-pointer hover:text-[#FF5A5F]">
                        {f.flightNo}
                      </span>
                      <ExternalLink size={14} className="text-[#717171]" />
                    </div>
                    <span className="text-sm font-medium text-[#222222]">
                      {f.date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-[#717171]">
                    <span>{f.time}</span>
                    <span>{f.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#222222] bg-[#F7F7F7] p-2 rounded-lg mt-2">
                    <Luggage size={14} />
                    <span>
                      <b>7kg</b> Hand Carry / <b>20kg</b> Check-in
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hotel View (Fully Editable + Details Array) */}
        {subTab === "hotel" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              {isEditingStays ? (
                <button
                  onClick={() => setIsEditingStays(false)}
                  className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1"
                >
                  <Save size={12} /> Done
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingStays(true)}
                  className="bg-[#222222] text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1"
                >
                  <Edit2 size={12} /> Edit Stays
                </button>
              )}
            </div>

            {accommodations.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-2xl border border-[#DDDDDD] shadow-sm overflow-hidden group"
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Image Upload */}
                  {isEditingStays && (
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity">
                      <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm hover:bg-white/40">
                        <Camera size={24} className="text-white" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleHotelImageUpload(hotel.id, e)}
                      />
                    </label>
                  )}

                  {!isEditingStays && (
                    <>
                      <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md shadow-md flex items-center gap-1">
                        <Star
                          size={12}
                          className="fill-[#FF5A5F] text-[#FF5A5F]"
                        />
                        <span className="text-xs font-bold text-[#222222]">
                          {hotel.rating}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#222222]">
                        {hotel.dates}
                      </div>
                    </>
                  )}
                </div>

                <div className="p-5">
                  {isEditingStays ? (
                    <div className="space-y-3">
                      <input
                        className="w-full font-bold text-lg border-b border-[#DDDDDD] outline-none"
                        value={hotel.name}
                        onChange={(e) =>
                          updateAccommodation(hotel.id, "name", e.target.value)
                        }
                      />
                      <input
                        className="w-full text-sm text-[#717171] border-b border-[#DDDDDD] outline-none"
                        value={hotel.nameCn}
                        onChange={(e) =>
                          updateAccommodation(
                            hotel.id,
                            "nameCn",
                            e.target.value
                          )
                        }
                      />
                      <div className="flex gap-2">
                        <input
                          className="w-1/2 text-xs border rounded p-1"
                          value={hotel.dates}
                          onChange={(e) =>
                            updateAccommodation(
                              hotel.id,
                              "dates",
                              e.target.value
                            )
                          }
                        />
                        <input
                          className="w-1/4 text-xs border rounded p-1"
                          value={hotel.rating}
                          onChange={(e) =>
                            updateAccommodation(
                              hotel.id,
                              "rating",
                              e.target.value
                            )
                          }
                          placeholder="Rating"
                        />
                      </div>

                      {/* Editable Details List */}
                      <div className="space-y-2 border-t border-[#DDDDDD] pt-2 mt-2">
                        <label className="text-xs font-bold text-[#717171]">
                          Rooms & Booking Refs:
                        </label>
                        {hotel.details.map((detail, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              className="w-1/3 text-xs border p-1 rounded"
                              placeholder="Room"
                              value={detail.room}
                              onChange={(e) =>
                                updateRoomDetail(
                                  hotel.id,
                                  idx,
                                  "room",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              className="w-1/4 text-xs border p-1 rounded"
                              placeholder="Source"
                              value={detail.source}
                              onChange={(e) =>
                                updateRoomDetail(
                                  hotel.id,
                                  idx,
                                  "source",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              className="flex-1 text-xs border p-1 rounded"
                              placeholder="Ref"
                              value={detail.ref}
                              onChange={(e) =>
                                updateRoomDetail(
                                  hotel.id,
                                  idx,
                                  "ref",
                                  e.target.value
                                )
                              }
                            />
                            <button
                              onClick={() => deleteRoomDetail(hotel.id, idx)}
                              className="text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addRoomDetail(hotel.id)}
                          className="text-xs text-[#FF5A5F] flex items-center gap-1"
                        >
                          <Plus size={12} /> Add Room
                        </button>
                      </div>

                      <button
                        onClick={() => deleteAccommodation(hotel.id)}
                        className="text-red-500 text-xs font-bold flex items-center gap-1 mt-4"
                      >
                        <Trash2 size={12} /> Delete Hotel
                      </button>
                    </div>
                  ) : (
                    <>
                      <h4
                        className="font-bold text-[#222222] text-lg leading-tight mb-1 cursor-pointer hover:text-[#FF5A5F]"
                        onClick={() => openMap(hotel.location)}
                      >
                        {hotel.name}
                      </h4>
                      <p className="text-sm text-[#717171] mb-4">
                        {hotel.nameCn}
                      </p>
                      <div className="flex flex-col gap-2">
                        {hotel.details.map((d, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col gap-1 text-sm bg-[#F7F7F7] p-3 rounded-xl border border-[#DDDDDD]"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[#222222] font-medium flex items-center gap-2">
                                <Hotel size={14} /> {d.room}
                              </span>
                              <span className="text-[10px] text-[#717171] bg-white px-1.5 py-0.5 rounded border">
                                {d.source || "Booking"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-200">
                              <span className="text-xs text-[#717171] font-mono leading-relaxed tracking-wide">
                                {d.ref}
                              </span>
                              <button
                                onClick={() => copyToClipboard(d.ref)}
                                className="flex items-center gap-1 text-[10px] text-[#FF5A5F] font-bold bg-white px-2 py-1 rounded border border-[#DDDDDD] hover:bg-[#FF5A5F] hover:text-white transition-colors"
                              >
                                <Copy size={10} /> Copy Ref
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {isEditingStays && (
              <button
                onClick={addAccommodation}
                className="w-full py-3 border-2 border-dashed border-[#DDDDDD] rounded-2xl text-[#717171] font-bold text-sm hover:border-[#FF5A5F] hover:text-[#FF5A5F] flex justify-center items-center gap-2"
              >
                <Plus size={16} /> Add New Stay
              </button>
            )}
          </div>
        )}

        {/* Transfer View */}
        {subTab === "transfer" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              {isEditingTransfer ? (
                <button
                  onClick={() => setIsEditingTransfer(false)}
                  className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1"
                >
                  <Save size={12} /> Done
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingTransfer(true)}
                  className="bg-[#222222] text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1"
                >
                  <Edit2 size={12} /> Edit
                </button>
              )}
            </div>

            {transfers.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-5 border border-[#DDDDDD] shadow-sm relative hover:border-[#FF5A5F] transition group"
              >
                {isEditingTransfer ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        value={t.date}
                        onChange={(e) =>
                          updateTransfer(t.id, "date", e.target.value)
                        }
                        className="w-16 p-1 border rounded text-xs font-bold text-center"
                      />
                      <input
                        value={t.from}
                        onChange={(e) =>
                          updateTransfer(t.id, "from", e.target.value)
                        }
                        className="flex-1 p-1 border rounded text-sm"
                        placeholder="From"
                      />
                      <span className="self-center">➔</span>
                      <input
                        value={t.to}
                        onChange={(e) =>
                          updateTransfer(t.id, "to", e.target.value)
                        }
                        className="flex-1 p-1 border rounded text-sm"
                        placeholder="To"
                      />
                    </div>
                    <input
                      value={t.note}
                      onChange={(e) =>
                        updateTransfer(t.id, "note", e.target.value)
                      }
                      className="w-full p-1 border rounded text-xs text-gray-500"
                      placeholder="Note"
                    />
                    <button
                      onClick={() => deleteTransfer(t.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => openMap(t.location)}
                  >
                    <div className="flex flex-col items-center justify-center min-w-[50px]">
                      <span className="text-xs font-bold text-[#717171] uppercase">
                        Dec
                      </span>
                      <span className="text-xl font-extrabold text-[#222222]">
                        {t.date.split("/")[1]}
                      </span>
                    </div>
                    <div className="h-10 w-px bg-[#DDDDDD]"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-[#222222] font-bold text-sm mb-1">
                        <span>{t.from}</span>
                        <ArrowRight size={14} className="text-[#717171]" />
                        <span>{t.to}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-[#F7F7F7] text-[#717171] px-2 py-1 rounded-md font-medium border border-[#DDDDDD]">
                          {t.note}
                        </span>
                        <div className="p-2 bg-[#FF5A5F] rounded-full text-white shadow-sm">
                          <Car size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isEditingTransfer && (
              <button
                onClick={addTransfer}
                className="w-full py-3 border-2 border-dashed border-[#DDDDDD] rounded-2xl text-[#717171] font-bold text-sm hover:border-[#FF5A5F] hover:text-[#FF5A5F] flex justify-center items-center gap-2"
              >
                <Plus size={16} /> Add Transfer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 4.2 Checklist (Multi-User)
const ChecklistTab = () => {
  const [users, setUsers] = useFirestore(
    "hokkaido_trip",
    "users_list",
    DEFAULT_PAYERS
  );
  const [activeUser, setActiveUser] = useState(null);
  const [isEditingUsers, setIsEditingUsers] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [userAvatars, setUserAvatars] = useFirestore(
    "hokkaido_trip",
    "user_avatars",
    {}
  );

  const [checklists, setChecklists] = useFirestore(
    "hokkaido_trip",
    "checklists",
    INITIAL_MULTI_USER_CHECKLISTS
  );

  const [newItem, setNewItem] = useState("");

  const addUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    const name = newUserName.trim();
    setUsers([...users, name]);
    if (!checklists[name]) {
      setChecklists({
        ...checklists,
        [name]: WINTER_CHECKLIST_TEMPLATE.map((i) => ({ ...i })),
      });
    }
    setNewUserName("");
  };

  const removeUser = (nameToRemove) => {
    setUsers(users.filter((u) => u !== nameToRemove));
  };

  const handleAvatarUpload = (userName, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large. Please use an image < 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatars({ ...userAvatars, [userName]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (activeUser) {
    const currentList = checklists[activeUser] || [];
    const progress =
      Math.round(
        (currentList.filter((i) => i.completed).length / currentList.length) *
          100
      ) || 0;
    const avatarSrc = userAvatars[activeUser];

    const toggleItem = (id) => {
      const updatedUserList = currentList.map((i) =>
        i.id === id ? { ...i, completed: !i.completed } : i
      );
      setChecklists({ ...checklists, [activeUser]: updatedUserList });
    };

    const deleteItem = (id) => {
      const updatedUserList = currentList.filter((i) => i.id !== id);
      setChecklists({ ...checklists, [activeUser]: updatedUserList });
    };

    const addItem = (e) => {
      e.preventDefault();
      if (!newItem.trim()) return;
      const newItemObj = { id: Date.now(), text: newItem, completed: false };
      setChecklists({
        ...checklists,
        [activeUser]: [...currentList, newItemObj],
      });
      setNewItem("");
    };

    return (
      <div className="flex flex-col h-full pb-24 bg-[#F7F7F7]">
        <div className="bg-white sticky top-0 z-20 px-6 py-4 shadow-sm border-b border-[#DDDDDD] flex items-center gap-3">
          <button
            onClick={() => setActiveUser(null)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-[#222222]" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#DDDDDD] overflow-hidden bg-[#F7F7F7] flex-shrink-0">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={activeUser}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#FF5A5F] font-bold text-sm">
                  {activeUser.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#222222] leading-none">
                {activeUser}
              </h2>
              <p className="text-xs text-[#717171] mt-1">Packing List</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 pt-6 overflow-y-auto">
          <div className="bg-white p-5 rounded-2xl border border-[#DDDDDD] shadow-sm mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#222222]">Progress</h3>
              <p className="text-[#717171] text-xs mt-1">
                {currentList.length -
                  currentList.filter((i) => i.completed).length}{" "}
                items left
              </p>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="transform -rotate-90 w-12 h-12">
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  stroke="#F7F7F7"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  stroke="#FF5A5F"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={113}
                  strokeDashoffset={113 - (113 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-[#222222]">
                {progress}%
              </span>
            </div>
          </div>

          <div className="space-y-3 pb-4">
            {currentList.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  item.completed
                    ? "bg-[#F7F7F7] border-transparent"
                    : "bg-white border-[#DDDDDD] shadow-sm"
                }`}
              >
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => toggleItem(item.id)}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      item.completed
                        ? "bg-[#FF5A5F] border-[#FF5A5F]"
                        : "border-[#DDDDDD] bg-white"
                    }`}
                  >
                    {item.completed && (
                      <CheckSquare size={12} className="text-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      item.completed
                        ? "line-through text-[#DDDDDD]"
                        : "text-[#222222]"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-[#DDDDDD] hover:text-[#FF5A5F] transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={addItem} className="relative mt-2 mb-24">
            <input
              type="text"
              placeholder="Add item..."
              className="w-full pl-4 pr-12 py-3 rounded-full border border-[#DDDDDD] bg-white shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#222222]"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 w-8 bg-[#FF5A5F] rounded-full flex items-center justify-center text-white hover:bg-[#E00B41] transition"
            >
              <Plus size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pb-24 bg-[#F7F7F7]">
      <div className="bg-white p-6 pb-4 border-b border-[#DDDDDD]">
        <h2 className="text-2xl font-extrabold text-[#222222]">Who are you?</h2>
        <p className="text-[#717171] text-sm mt-1">
          Select your profile to manage packing.
        </p>
      </div>

      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsEditingUsers(!isEditingUsers)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors ${
              isEditingUsers
                ? "bg-[#FF5A5F] text-white"
                : "bg-white border border-[#DDDDDD] text-[#717171]"
            }`}
          >
            {isEditingUsers ? <Check size={14} /> : <Edit2 size={14} />}{" "}
            {isEditingUsers ? "Done" : "Edit Users"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {users.map((user) => {
            const avatarSrc = userAvatars[user];
            return (
              <div key={user} className="relative group">
                {isEditingUsers && (
                  <input
                    type="file"
                    id={`avatar-upload-${user}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAvatarUpload(user, e)}
                  />
                )}

                <label
                  htmlFor={isEditingUsers ? `avatar-upload-${user}` : undefined}
                  onClick={(e) => {
                    if (!isEditingUsers) {
                      e.preventDefault();
                      setActiveUser(user);
                    }
                  }}
                  className={`w-full bg-white p-5 rounded-2xl border border-[#DDDDDD] shadow-sm flex flex-col items-center gap-3 transition-all cursor-pointer ${
                    isEditingUsers
                      ? "border-dashed border-2 hover:border-[#FF5A5F]"
                      : "hover:scale-105 hover:shadow-md active:scale-95"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 relative ${
                      avatarSrc
                        ? "border-transparent"
                        : isEditingUsers
                        ? "bg-[#F7F7F7] text-[#717171] border-[#DDDDDD]"
                        : "bg-[#F7F7F7] text-[#FF5A5F] border-white shadow-sm"
                    }`}
                  >
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={user}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold">
                        {user.charAt(0)}
                      </span>
                    )}

                    {isEditingUsers && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Upload size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-[#222222] text-sm">
                    {user}
                  </span>
                </label>

                {isEditingUsers && (
                  <button
                    onClick={() => removeUser(user)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors z-10"
                  >
                    <MinusCircle size={16} />
                  </button>
                )}
              </div>
            );
          })}

          {isEditingUsers && (
            <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-[#DDDDDD] flex flex-col items-center justify-center gap-2">
              <form
                onSubmit={addUser}
                className="w-full flex flex-col items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full text-center text-sm font-bold p-1 outline-none bg-transparent"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-[#222222] text-white p-2 rounded-full hover:scale-110 transition"
                >
                  <Plus size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 4.3 Shopping Tab
const ShoppingTab = () => {
  const [shopItems, setShopItems] = useFirestore(
    "hokkaido_trip",
    "shopping_list",
    [
      {
        id: 1,
        text: "Shiroi Koibito",
        img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80",
      },
    ]
  );
  const [text, setText] = useState("");

  const addItem = (e) => {
    e.preventDefault();
    if (!text) return;
    setShopItems([...shopItems, { id: Date.now(), text, img: null }]);
    setText("");
  };

  const handleImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      // Note: In real production app, you should upload to Firebase Storage.
      // Here we store base64 data URL in Firestore for simplicity, but be mindful of the 1MB limit.
      if (file.size > 500 * 1024) {
        alert("For online sync, please use small images (< 500KB).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = shopItems.map((item) =>
          item.id === id ? { ...item, img: reader.result } : item
        );
        setShopItems(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteItem = (id) => setShopItems(shopItems.filter((i) => i.id !== id));

  return (
    <div className="h-full flex flex-col pb-24 px-6 pt-6 bg-[#F7F7F7]">
      <div className="bg-white p-5 rounded-2xl border border-[#DDDDDD] shadow-sm mb-6">
        <h2 className="text-xl font-extrabold text-[#222222]">Shopping List</h2>
        <p className="text-[#717171] text-sm mt-1">
          Don't forget the souvenirs!
        </p>
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4 content-start pb-4">
        {shopItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#DDDDDD] overflow-hidden shadow-sm flex flex-col"
          >
            <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
              {item.img ? (
                <img
                  src={item.img}
                  alt="item"
                  className="w-full h-full object-cover"
                />
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer text-[#717171] hover:text-[#FF5A5F] transition">
                  <Camera size={24} />
                  <span className="text-[10px] font-bold">ADD PHOTO</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(item.id, e)}
                  />
                </label>
              )}
              {item.img && (
                <button
                  onClick={() => {
                    const updated = shopItems.map((i) =>
                      i.id === item.id ? { ...i, img: null } : i
                    );
                    setShopItems(updated);
                  }}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                >
                  <X size={12} className="text-[#222222]" />
                </button>
              )}
            </div>
            <div className="p-3 flex justify-between items-center bg-white border-t border-[#F7F7F7]">
              <span className="text-sm font-bold text-[#222222] truncate">
                {item.text}
              </span>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-[#DDDDDD] hover:text-[#FF5A5F]"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* Add Button Card */}
        <div className="aspect-square rounded-2xl border-2 border-dashed border-[#DDDDDD] flex flex-col items-center justify-center bg-white hover:border-[#FF5A5F] transition-colors p-4">
          <form
            onSubmit={addItem}
            className="w-full flex flex-col items-center gap-2"
          >
            <input
              type="text"
              placeholder="Add item..."
              className="w-full text-center text-sm font-semibold outline-none placeholder-[#DDDDDD]"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem(e)}
            />
            <button
              type="submit"
              className="bg-[#222222] text-white p-2 rounded-full hover:scale-110 transition-transform"
            >
              <Plus size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// 4.4 Budget Tab
const BudgetTab = () => {
  const [expenses, setExpenses] = useFirestore("hokkaido_trip", "expenses", []);
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState(DEFAULT_PAYERS[0]);
  const [method, setMethod] = useState("Credit Card");

  const add = (e) => {
    e.preventDefault();
    if (!item || !amount) return;
    setExpenses([
      { id: Date.now(), item, amount: parseFloat(amount), payer, method },
      ...expenses,
    ]);
    setItem("");
    setAmount("");
  };
  const deleteExpense = (id) =>
    setExpenses(expenses.filter((e) => e.id !== id));
  const totalJPY = expenses.reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="h-full px-6 pt-6 pb-24 flex flex-col bg-[#F7F7F7]">
      {/* Total Card */}
      <div className="bg-[#FF5A5F] rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1">
            Total Trip Expenses
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight">
              ¥{totalJPY.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
            <span className="text-sm font-medium">
              ≈ MYR {(totalJPY * EXCHANGE_RATE).toFixed(2)}
            </span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">
              Rate: {EXCHANGE_RATE}
            </span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
      </div>

      <div className="bg-white rounded-2xl border border-[#DDDDDD] p-5 mb-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#222222] mb-4 uppercase tracking-wide">
          Add New Expense
        </h3>
        <form onSubmit={add} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-bold text-[#717171] mb-1 block">
                Item
              </label>
              <input
                type="text"
                placeholder="e.g. Ramen"
                className="w-full p-2 bg-[#F7F7F7] rounded-lg border border-transparent focus:bg-white focus:border-[#222222] outline-none text-sm transition-all"
                value={item}
                onChange={(e) => setItem(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#717171] mb-1 block">
                JPY
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full p-2 bg-[#F7F7F7] rounded-lg border border-transparent focus:bg-white focus:border-[#222222] outline-none text-sm transition-all"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#717171] mb-1 block">
                Payer
              </label>
              <select
                className="w-full p-2 bg-[#F7F7F7] rounded-lg border border-transparent outline-none text-sm text-[#222222] appearance-none"
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
              >
                {DEFAULT_PAYERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#717171] mb-1 block">
                Method
              </label>
              <select
                className="w-full p-2 bg-[#F7F7F7] rounded-lg border border-transparent outline-none text-sm text-[#222222] appearance-none"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#222222] text-white py-3 rounded-lg text-sm font-bold hover:opacity-90 transition"
          >
            Record Expense
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <h3 className="text-xs font-bold text-[#717171] mb-3 px-1 uppercase">
          Recent Transactions
        </h3>
        <div className="space-y-3">
          {expenses.map((ex) => (
            <div
              key={ex.id}
              className="p-4 bg-white rounded-xl border border-[#DDDDDD] shadow-sm flex justify-between items-center group"
            >
              <div>
                <span className="block text-[#222222] font-bold text-sm">
                  {ex.item}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-[#F7F7F7] text-[#717171] px-1.5 py-0.5 rounded border border-[#DDDDDD] flex items-center gap-1">
                    <User size={8} /> {ex.payer}
                  </span>
                  <span className="text-[10px] text-[#717171] flex items-center gap-1">
                    {ex.method === "Credit Card" ? (
                      <CreditCard size={10} />
                    ) : (
                      <Banknote size={10} />
                    )}{" "}
                    {ex.method}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#222222] font-bold text-sm">
                  ¥{ex.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => deleteExpense(ex.id)}
                  className="text-gray-300 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4.5 Translator Tab
const TranslatorTab = () => {
  const [revealed, setRevealed] = useState(null);
  return (
    <div className="h-full px-6 pt-6 pb-24 overflow-y-auto bg-[#F7F7F7]">
      <div className="bg-white p-6 rounded-2xl border border-[#DDDDDD] shadow-sm mb-6 text-center">
        <h3 className="font-extrabold text-[#222222] text-lg mb-2">
          Google Translate
        </h3>
        <p className="text-sm text-[#717171] mb-4">
          Tap below for accurate translation
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => openTranslate("cn")}
            className="bg-[#F7F7F7] p-4 rounded-xl border border-[#DDDDDD] hover:bg-[#FF5A5F] hover:text-white hover:border-[#FF5A5F] transition-all flex flex-col items-center gap-2"
          >
            <Languages size={24} />
            <span className="font-bold text-sm">CN ➔ JP</span>
          </button>
          <button
            onClick={() => openTranslate("en")}
            className="bg-[#F7F7F7] p-4 rounded-xl border border-[#DDDDDD] hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all flex flex-col items-center gap-2"
          >
            <Languages size={24} />
            <span className="font-bold text-sm">EN ➔ JP</span>
          </button>
        </div>
      </div>
      <h3 className="text-[#222222] font-extrabold text-xl mb-4">
        Saved Phrases
      </h3>
      <div className="grid gap-4">
        {WINTER_PHRASES.map((p, i) => (
          <div
            key={i}
            onClick={() => setRevealed(revealed === i ? null : i)}
            className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer ${
              revealed === i
                ? "border-[#FF5A5F] shadow-md ring-1 ring-[#FF5A5F]"
                : "border-[#DDDDDD] hover:border-[#222222]"
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-[#222222] text-lg">{p.jp}</h3>
              <ChevronDown
                size={20}
                className={`text-[#717171] transition-transform duration-300 ${
                  revealed === i ? "rotate-180" : ""
                }`}
              />
            </div>
            <p className="text-sm text-[#717171] mt-1">{p.cn}</p>
            <div
              className={`grid transition-all duration-300 ${
                revealed === i
                  ? "grid-rows-[1fr] opacity-100 mt-4"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="bg-[#F7F7F7] p-3 rounded-xl border border-[#DDDDDD]">
                  <span className="text-[#FF5A5F] font-bold text-sm tracking-wide">
                    {p.romaji}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 5. Main App Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState("plan");
  const [coverPhoto, setCoverPhoto] = useFirestore(
    "hokkaido_trip",
    "app_settings",
    { cover: DEFAULT_COVER }
  );

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        // 1MB limit for cover
        alert("Please use an image < 1MB for faster loading.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto({ cover: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // 封面图可以是对象(如果从Firestore读)或字符串(默认值)
  const coverSrc = coverPhoto?.cover || coverPhoto || DEFAULT_COVER;

  return (
    <div className="flex justify-center bg-[#EBEBEB] h-screen font-sans overflow-hidden">
      <div className="w-full max-w-md bg-white h-full relative flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="relative h-48 flex-shrink-0 z-50 bg-gray-200">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={coverSrc}
              alt="Trip Cover"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h1 className="text-2xl font-extrabold tracking-tight leading-tight drop-shadow-md">
              Lee Family <span className="text-[#FF5A5F]">2025</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded border border-white/30 flex items-center gap-1">
                <Globe size={12} /> Online
              </span>
              <span className="text-xs font-medium opacity-90 drop-shadow-sm">
                Dec 25 - Jan 01
              </span>
            </div>
          </div>

          {/* Edit Cover Button */}
          <label className="absolute top-4 right-4 bg-black/30 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/50 transition-colors text-white border border-white/20">
            <Camera size={18} />
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </label>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden relative z-10 bg-[#F7F7F7]">
          {activeTab === "plan" && <PlanTab />}
          {activeTab === "shop" && <ShoppingTab />}
          {activeTab === "budget" && <BudgetTab />}
          {activeTab === "reminder" && <ChecklistTab />}
          {activeTab === "translator" && <TranslatorTab />}
        </main>

        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/+601165090611"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-24 right-4 z-50 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform font-bold text-sm"
        >
          <MessageCircle size={20} fill="white" /> Live Agent
        </a>

        {/* Bottom Nav (Fixed) */}
        <nav className="absolute bottom-0 left-0 w-full bg-white border-t border-[#DDDDDD] pb-safe pt-2 px-2 flex justify-around items-center z-50 h-[80px]">
          <NavButton
            active={activeTab === "plan"}
            onClick={() => setActiveTab("plan")}
            icon={<Search size={24} />}
            label="Explore"
          />
          <NavButton
            active={activeTab === "shop"}
            onClick={() => setActiveTab("shop")}
            icon={<Heart size={24} />}
            label="Wishlist"
          />
          <NavButton
            active={activeTab === "budget"}
            onClick={() => setActiveTab("budget")}
            icon={
              <div className="w-8 h-8 rounded-full border-2 border-[#222222] flex items-center justify-center">
                <span className="text-xs font-bold">¥</span>
              </div>
            }
            label="Budget"
          />
          <NavButton
            active={activeTab === "reminder"}
            onClick={() => setActiveTab("reminder")}
            icon={<CheckSquare size={24} />}
            label="Reminder"
          />
          <NavButton
            active={activeTab === "translator"}
            onClick={() => setActiveTab("translator")}
            icon={<Languages size={24} />}
            label="Translator"
          />
        </nav>
      </div>

      {/* Hide Scrollbar & Animations */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${
      active ? "text-[#FF5A5F]" : "text-[#717171] hover:text-[#222222]"
    }`}
  >
    {React.cloneElement(icon, {
      size: 24,
      className: active
        ? "text-[#FF5A5F]"
        : "text-[#717171] hover:text-[#222222]",
    })}
    <span
      className={`text-[10px] font-medium ${
        active ? "text-[#FF5A5F]" : "text-[#717171]"
      }`}
    >
      {label}
    </span>
  </button>
);
