"use client";

import {useState} from "react";
import Search from "@/components/search";
import TodayCard from "@/components/todayCard";
import ForecastCard from "@/components/forecastCard";

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

export default function Index(){
  const [todayWeather, setTodayWeather] = useState<WeatherProps | null>(null);
  const [forecast, setForecast] = useState<ForecastProps[] | null>(null);

  const handleTodayWeather = (todayWeather: WeatherProps | null) => {
    setTodayWeather(todayWeather);
  }

  const handleForecast = (forecast: ForecastProps[] | null) => {
    setForecast(forecast);
  }
  return (
    <>
      <div className="flex md:items-center justify-center h-dvh">
        <div className="md:w-[60%] w-[100%] p-5">
          <div className="mb-2 px-3 py-2 bg-[#81D2FF] text-3xl rounded-md">Weather不淋雨</div>
          <div className="lg:flex block">
            <Search handleTodayWeather={handleTodayWeather} handleForecast={handleForecast}/>
            <div className="ml-0 lg:ml-2 flex-1">
              <TodayCard todayWeather={todayWeather}/>
              <ForecastCard forecast={forecast}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
