export type WeatherProps = {
    main: {
        temp: number;
        temp_max: number;
        temp_min: number;
        humidity: number;
        feels_like: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
    dt_txt: string;
};

export type ForecastProps = {
    main: {
        temp_max: number;
        temp_min: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
    dt_txt: string;
};