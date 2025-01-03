import type { NextApiRequest, NextApiResponse } from 'next';
import { ForecastProps } from "@/types/weather";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { search } = req.query; // 從 query 中獲取搜索位置
  const apiKey = process.env.OPEN_WEATHER_API_KEY;
  const openWeatherDomain = process.env.OPEN_WEATHER_DOMAIN;

  if (!search || typeof search !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid search parameter' });
  }

  try {
    // 發送當前天氣請求
    const weatherResponse = await fetch(
      `${openWeatherDomain}/data/2.5/weather?q=${search}&units=metric&lang=zh_tw&appid=${apiKey}`
    );
    console.log(weatherResponse.status);

    if (!weatherResponse.ok) {
      res.status(404).json({ error: 'Weather data not found' });
      return;
    }

    const weatherData = await weatherResponse.json();

    // 發送預報請求
    const forecastResponse = await fetch(
      `${openWeatherDomain}/data/2.5/forecast?q=${search}&cnt=40&units=metric&lang=zh_tw&appid=${apiKey}`
    );

    if (!forecastResponse.ok) {
      res.status(404).json({ error: 'Forecast data not found' });
      return;
    }

    const forecastData = await forecastResponse.json();
    const filteredData = forecastData.list.filter(
      (item: ForecastProps, index: number) => index % 8 === 7
    );

    // 回傳今天的天氣和預報資料
    res.status(200).json({
      todayWeather: weatherData,
      forecast: filteredData,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}
