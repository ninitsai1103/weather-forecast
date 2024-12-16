import { JSX } from "react";

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

export default function ForecastCard({
  forecast,
}: {
  forecast: ForecastProps[] | null;
}): JSX.Element {
  return (
    <>
      <div className="px-3 py-2 bg-[#ffffff80] rounded-md text-[#016697] ">
        {forecast ? (
          <>
            <div className="px-3 py-2">
              {forecast.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 mb-4 bg-white rounded-md"
                >
                  <div>{item.dt_txt.split(" ")[0]}</div>
                  <div>{item.weather[0].description}</div>
                  <div>{item.main.temp_max}°C</div>
                  <div>{item.main.temp_min}°C</div>
                </div>
              ))}
            </div>
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
