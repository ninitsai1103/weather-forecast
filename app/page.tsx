"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Search from "@/components/search";
import TodayCard from "@/components/todayCard";
import ForecastCard from "@/components/forecastCard";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

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

export default function Index() {
  const [todayWeather, setTodayWeather] = useState<WeatherProps | null>(null);
  const [forecast, setForecast] = useState<ForecastProps[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const todayCardRef = useRef<HTMLDivElement | null>(null);
  const forecastCardRef = useRef<HTMLDivElement | null>(null);

  const animationTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const handleTodayWeather = (todayWeather: WeatherProps | null) => {
    setTodayWeather(todayWeather);
  };

  const handleForecast = (forecast: ForecastProps[] | null) => {
    setForecast(forecast);
  };

  const handleLoading = (loading: boolean) => {
    setLoading(loading);
  };

  useGSAP(() => {
    if (animationTimelineRef.current) {
      animationTimelineRef.current.kill();
    }

    if (!loading && todayWeather && forecast) {
      const timeline = gsap.timeline();
      animationTimelineRef.current = timeline;

      timeline.fromTo(
        ".today-card", 
        { opacity: 0, y: 250 }, 
        {
          opacity: 1, 
          duration: 2, 
          y: 0,
          ease: "power2.out"
        }
      ).fromTo(
        ".forecast-card", 
        { opacity: 0, y: 300 }, 
        {
          opacity: 1, 
          duration: 2, 
          y: 0,
          ease: "power2.out"
        },
        "-=1.5" // Slight overlap for smoother animation
      );
    }
  }, [loading, todayWeather, forecast]);
  return (
    <>
      <div className="flex md:items-center justify-center h-dvh">
        <div className="md:w-[60%] w-[100%] p-5">
          <div className="mb-2 px-3 py-2 bg-[#81D2FF] text-3xl rounded-md">
            Weather不淋雨
          </div>
          <div className="lg:flex block">
            <Search
              handleTodayWeather={handleTodayWeather}
              handleForecast={handleForecast}
              handleLoading={handleLoading}
              loading={loading}
            />
            <div className="ml-0 lg:ml-2 flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src="/loading.gif"
                    width={200}
                    height={70}
                    unoptimized
                    alt="loading"
                  />
                  <div>LOADING...</div>
                </div>
              ) : (
                <>
                  <div ref={todayCardRef} className="today-card">
                    <TodayCard todayWeather={todayWeather} />
                  </div>
                  <div ref={forecastCardRef} className="forecast-card">
                    <ForecastCard forecast={forecast} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
