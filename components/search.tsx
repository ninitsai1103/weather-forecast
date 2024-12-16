"use client";

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
    setTodayWeather: ( todayWeather: WeatherProps | null) => void;
    setForecast: ( forecast: ForecastProps[] | null) => void;
  };

export default function Search({ setTodayWeather, setForecast }: SearchProps): JSX.Element {
  const [search, setSearch] = useState("");

  const handleSearch = async (search: string) => {
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&lang=zh_tw&appid=${process.env.NEXT_PUBLIC_API_KEY}`
      );

      if (!weatherResponse.ok) {
        throw new Error(`HTTP error! status: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();
      //   console.log(weatherData);
      setTodayWeather(weatherData);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${search}&cnt=40&units=metric&lang=zh_tw&appid=${process.env.NEXT_PUBLIC_API_KEY}`
      );

      if (!forecastResponse.ok) {
        throw new Error(`HTTP error! status: ${forecastResponse.status}`);
      }

      const forecastData = await forecastResponse.json();
      const filteredData = forecastData.list.filter(
        (item: ForecastProps, index: number)=> index % 8 === 5
      );
      //   console.log(filteredData);
      setForecast(filteredData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <>
      <div className="px-3 py-2 bg-[#81D2FF] rounded-md">
        <div className="flex items-center">
          <div className="pb-[0.125rem]">
            <input
              type="text"
              className="rounded-sm text-sm text-[#016697] p-1"
              placeholder="請輸入位置名稱"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div
            className="ml-2 bg-[#15ACFE] rounded-sm text-sm p-1 cursor-pointer"
            onClick={() => handleSearch(search)}
          >
            查詢
          </div>
        </div>
      </div>
    </>
  );
}
