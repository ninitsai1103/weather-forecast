"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Header from "../components/header";
import Search from "../components/search";
import TodayCard from "../components/todayCard";
import ForecastCard from "../components/forecastCard";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { WeatherProps, ForecastProps } from "@/types/weather";

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
    //檢查是否有已經執行過的動畫，如果有就清除
    if (animationTimelineRef.current) {
      animationTimelineRef.current.kill();
    }

    //如果loading結束且有天氣資料，開始執行動畫
    if (!loading && todayWeather && forecast) {
      //GSAP 提供的 API，用來建立一個時間軸動畫建立timeline
      const timeline = gsap.timeline();
      //將timeline儲存到ref
      animationTimelineRef.current = timeline;

      timeline.fromTo(
        ".today-card", 
        { opacity: 0, y: 250 }, // 起始狀態
        {
          opacity: 1, 
          duration: 2, 
          y: 0,// 結束狀態
          ease: "power2.out"// 動畫效果
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
        "-=1.5" // 在上一個動畫結束前 1.5 秒開始
      );
    }
  }, [loading, todayWeather, forecast]);
  return (
    <>
      <main className="flex md:items-center justify-center h-dvh min-w-[370px]">
        <div className="md:w-[60%] w-[100%] p-5">
          <Header />
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
      </main>
    </>
  );
}
