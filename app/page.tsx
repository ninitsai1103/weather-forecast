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
