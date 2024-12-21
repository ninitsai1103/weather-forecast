import { useState, JSX } from "react";
import { WeatherProps, ForecastProps } from "@/types/weather";
import { toast, Toaster } from "react-hot-toast";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/authContext";

type SearchProps = {
  handleTodayWeather: (todayWeather: WeatherProps | null) => void;
  handleForecast: (forecast: ForecastProps[] | null) => void;
  handleLoading: (loading: boolean) => void;
  loading: boolean;
};

export default function Search({
  handleTodayWeather,
  handleForecast,
  handleLoading,
  loading,
}: SearchProps): JSX.Element {
  const [search, setSearch] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);

  const { isLogin, userEmail } = useAuth();

  const handleSearch = async (search: string) => {
    if (search === "") {
      setIsEmpty(true);
      return;
    };
    handleLoading(true);
    try { 
      const response = await fetch(`/api/weather?search=${search}`);

      if (!response.ok) {
        toast.error("查詢失敗，請輸入有效關鍵字，或更換關鍵字語言");
      }

      const data = await response.json();
      setIsEmpty(false);
      handleTodayWeather(data.todayWeather);
      handleForecast(data.forecast);

      if (isLogin && userEmail && data.todayWeather && data.forecast) {
        await addDoc(collection(db, "users", userEmail, "search"), {
          search: search,
        });
      }
    } catch {
      toast.error("查詢失敗");
      setIsEmpty(false);
    } finally {
      handleLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <nav className="px-3 py-2 bg-[#1eb0ff] rounded-md lg:mb-0 mb-2">
        <div className="flex items-center">
          <div className="pb-[0.125rem]">
            <input
              type="text"
              className={`rounded-sm text-sm text-[#016697] p-1 ${isEmpty ? " border-2 border-[#ea6262]" : ""}`}
              placeholder="請輸入位置名稱"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(search)}
              disabled={loading}
            />
          </div>
          <button
            className="ml-2 bg-[#E1CEEF] text-[#3F1E68] rounded-sm text-sm p-1"
            onClick={() => handleSearch(search)}
            disabled={loading}
          >
            查詢
          </button>
        </div>
        {isEmpty && <p className="bg-[#ea6262] mt-1 px-2 rounded-sm inline-block">請輸入位置名稱</p>}
      </nav>
    </>
  );
}
