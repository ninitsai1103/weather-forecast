import { JSX } from "react";
import { ForecastProps } from "@/types/weather";


export default function ForecastCard({
  forecast
}: {
  forecast: ForecastProps[] | null;
}): JSX.Element {
  return (
    <>
      <div className="px-3 py-2 bg-[#ffffff80] rounded-md text-[#016697] ">
        {forecast ? (
          <>
              <div className="grid grid-cols-4 gap-2 p-2 text-center xl:text-[1rem] text-[0.7rem] text-gray-600">
                <div className="col-span-1 text-start">日期</div>
                <div className="col-span-1 text-center">天氣狀況</div>
                <div className="col-span-1 text-end">最高溫</div>
                <div className="col-span-1 text-end">最低溫</div>
              </div>
              {forecast.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-2 p-2 mb-4 bg-white rounded-md xl:text-lg text-[0.8rem] hover:bg-[#E1CEEF] hover:text-[#3F1E68] transition-color duration-500"
                >
                  <div className="col-span-1 text-start">
                    {item.dt_txt.split(" ")[0]}
                  </div>
                  <div className="col-span-1 text-center">
                    {item.weather[0].description}
                  </div>
                  <div className="col-span-1 text-end">
                    {item.main.temp_max}°C
                  </div>
                  <div className="col-span-1 text-end">
                    {item.main.temp_min}°C
                  </div>
                </div>
              ))}
          </>
        ) : (
          <>
            <div>開始搜尋未來五天天氣</div>
          </>
        )}
      </div>
    </>
  );
}
