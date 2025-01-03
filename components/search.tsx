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
  const [searchHistory, setSearchHistory] = useState<
    { id: string; search: string }[]
  >([]);

  const { isLogin, userEmail } = useAuth();

  const handleSearch = async (search: string) => {
    //檢查是否有輸入關鍵字
    if (search === "") {
      setIsEmpty(true);
      return;
    }
    setIsEmpty(false);

    handleLoading(true);
    try {
      const response = await fetch(`/api/weather?search=${search}`);

      if (!response.ok) {
        toast.error("查詢失敗，請輸入有效關鍵字，或更換關鍵字語言");
        handleTodayWeather(null);
        handleForecast(null);
        return
      }

      //如果有登入狀態而且有使用者Email而且沒有重複搜尋的關鍵字，將搜尋紀錄存入Firestore
      if (
        isLogin &&
        userEmail &&
        !searchHistory.some((item) => item.search === search)
      ) {
        //create功能
        await addDoc(collection(db, "users", userEmail, "search"), {
          search: search,
        });
      }

      //如果有登入狀態，並更新searchHistory
      if (isLogin){
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
      }
      const data = await response.json();
      handleTodayWeather(data.todayWeather);
      handleForecast(data.forecast);

    } catch {
      toast.error("查詢失敗");
    } finally {
      handleLoading(false);
    }
  };

  //delete功能
  const deleteSearchHistory = async (id: string) => {
    try {
      if (!isLogin || !userEmail) return;
      await deleteDoc(doc(db, "users", userEmail, "search", id));
      //更新searchHistory
      setSearchHistory((prevHistory) =>
        prevHistory.filter((item) => item.id !== id)
      );
    } catch {
      toast.error("刪除搜尋紀錄失敗");
    }
  };

  //read功能
  useEffect(() => {
    if (isLogin && userEmail) {
      const getSearchHistory = async () => {
        try {
          const getSearchData = await getDocs(
            collection(db, "users", userEmail, "search")
          );
          const history: { id: string; search: string }[] = [];

          //將搜尋紀錄存入history
          getSearchData.forEach((doc) => {
            history.push({ id: doc.id, search: doc.data().search });
          });
          //顯示history list
          setSearchHistory(history);
        } catch {
          toast.error("取搜尋紀錄失敗");
        }
      };
      //執行
      getSearchHistory();
    }else {
      setSearchHistory([]);
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
              onClick={() => {handleSearch(item.search); setSearch(item.search);}}
            >
              <p className="mr-2">{item.search}</p>
              <IoIosCloseCircle
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSearchHistory(item.id);
                }}
              />
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
