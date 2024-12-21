import { useState, JSX, useEffect } from "react";
import { WeatherProps, ForecastProps } from "@/types/weather";
import { toast, Toaster } from "react-hot-toast";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { IoIosCloseCircle } from "react-icons/io";

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
  const [search, setSearch] = useState<string>("");
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<{ id: string; search: string }[]>([]);

  const { isLogin, userEmail } = useAuth();

  const handleSearch = async (search: string) => {
    if (search === "") {
      setIsEmpty(true);
      return;
    }
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

      setSearchHistory((prevHistory) => {
        const existingSearch = prevHistory.find(
          (item) => item.search === search
        );
        if (existingSearch) {
          return prevHistory;
        } else {
          return [...prevHistory, { id: crypto.randomUUID(), search: search }];
        }
      });

    } catch {
      toast.error("查詢失敗");
      setIsEmpty(false);
    } finally {
      handleLoading(false);
    }
  };

  const deleteSearchHistory = async (id: string) => {
    try {
      if (!isLogin || !userEmail) return;
      await deleteDoc(doc(db, "users", userEmail, "search", id));
      setSearchHistory((prevHistory) =>
        prevHistory.filter((item) => item.id !== id)
      );
    } catch {
      toast.error("刪除搜尋紀錄失敗");
    }
  };

  useEffect(() => {
    if (isLogin && userEmail) {
      const getSearchHistory = async () => {
        try {
          const getSearchData = await getDocs(
            collection(db, "users", userEmail, "search")
          );
          const history: { id: string; search: string }[] = [];

        getSearchData.forEach((doc) => {
          history.push({ id: doc.id, search: doc.data().search });
        });
          setSearchHistory(history);
        } catch {
          toast.error("取搜尋紀錄失敗");
        }
      };
      getSearchHistory();
    }
  }, [isLogin, userEmail]);

  return (
    <>
      <Toaster />
      <nav className="px-3 py-2 bg-[#1eb0ff] rounded-md lg:mb-0 mb-2">
        <div className="flex items-center">
          <div className="pb-[0.125rem]">
            <input
              type="text"
              className={`rounded-sm text-sm text-[#016697] p-1 ${
                isEmpty ? " border-2 border-[#ea6262]" : ""
              }`}
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
        {isEmpty && (
          <p className="bg-[#ea6262] mt-1 px-2 rounded-sm inline-block">
            請輸入位置名稱
          </p>
        )}
        <div className="flex flex-wrap lg:max-w-[12rem] max-w-full">
          {searchHistory.map((item, index) => (
            <div
              key={index}
              className="flex items-center text-md mt-1 bg-[#E1CEEF] text-[#3F1E68] px-1 mr-1 mb-1 rounded-sm cursor-pointer"
              onClick={() => handleSearch(item.search)}
            >
              <p className="mr-2">{item.search}</p>
              <IoIosCloseCircle onClick={() => deleteSearchHistory(item.id)} />
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
