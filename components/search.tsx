// Search.tsx
import { useState, JSX } from "react";

type ForecastProps = {
  dt_txt: string;
  weather: {
    description: string;
  }[];
  main: {
    temp_max: number;
    temp_min: number;
  };
};

type WeatherProps = {
  main: {
    feels_like: number;
    humidity: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: { description: string }[];
};

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

  const handleSearch = async (search: string) => {
    handleLoading(true);
    try {
      const response = await fetch(`/api/weather?search=${search}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.status}`);
      }

      const data = await response.json();
      handleTodayWeather(data.todayWeather);
      handleForecast(data.forecast);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      handleLoading(false);
    }
  };

  return (
    <>
      <div className="px-3 py-2 bg-[#81D2FF] rounded-md lg:mb-0 mb-2">
        <div className="flex items-center">
          <div className="pb-[0.125rem]">
            <input
              type="text"
              className="rounded-sm text-sm text-[#016697] p-1"
              placeholder="請輸入位置名稱"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            className="ml-2 bg-[#15ACFE] rounded-sm text-sm p-1"
            onClick={() => handleSearch(search)}
            disabled={loading}
          >
            查詢
          </button>
        </div>
      </div>
    </>
  );
}
