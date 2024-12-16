import { JSX } from "react";

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

export default function TodayCard({
  todayWeather,
}: {
  todayWeather: WeatherProps | null;
}): JSX.Element {
  return (
    <>
      <div className="xl:flex block mb-2 px-3 py-2 bg-[#ffffff80] rounded-md text-[#016697]">
        {todayWeather ? (
          <>
            <div>
              <div className="mb-4 text-[1.5rem]">當前體感溫度：</div>
              <div className="mb-4 text-[3.5rem]">
                {todayWeather.main.feels_like}°C
              </div>
            </div>
            <div className="xl:ml-4">
              <div>天氣狀況：{todayWeather.weather[0].description}</div>
              <div>目前氣溫：{todayWeather.main.temp}°C</div>
              <div>最高溫：{todayWeather.main.temp_max}°C</div>
              <div>最低溫：{todayWeather.main.temp_min}°C</div>
              <div>濕度：{todayWeather.main.humidity}％</div>
            </div>
          </>
        ) : (
          <div>開始搜尋當前天氣</div>
        )}
      </div>
    </>
  );
}
