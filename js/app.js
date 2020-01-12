const controller = (() => {

    const DOM = {
        icon: 'icon-box',
        temperature: 'temperature',
        town: 'town-name',
        submit: '.submit',
        dayOption: '.day-option',
        townOption: '.town-option',
        loader: '.loader-box'

    };

    const showSpinner = () => document.querySelector(DOM.loader).style.display = 'flex';
    const hideSpinner = () => document.querySelector(DOM.loader).style.display = 'none';

    async function getWeather(ID) {
        try {
            showSpinner();
            const response = await fetch(`https://www.metaweather.com/api/location/${ID}/`);
            const data = await response.json();
            hideSpinner();
            return data;
        } catch(error) {console.log('Error')};
    };

    const updateUI = (data, date) => {
        const weatherBox = document.querySelector('.weather-box__weather');
        const town = data.title;

        document.getElementById(DOM.town).textContent = town;

        if (!isNaN(date)) {
            const dateData = data.consolidated_weather[date];
            const temperature = dateData.the_temp;
            const weatherIcon = dateData.weather_state_abbr;

                weatherBox.innerHTML = '<p class="temperature" id="temperature"></p><div class="icon-box" id="icon-box"></div>';
                document.getElementById(DOM.temperature).textContent = `${Math.round(temperature)}°C` ;
                document.getElementById(DOM.icon).innerHTML = `<img src=https://www.metaweather.com/static/img/weather/${weatherIcon}.svg alt="" class="icon" id="icon"></img>`;
        } else {
            weatherBox.innerHTML = '<div class="weather-box__week-weather"></div>';
            const weatherBoxWeek = document.querySelector('.weather-box__week-weather');

            for (let i = 1; i<=5; i++) {
                const weekData = data.consolidated_weather[i];
                const currentDay = weekData.applicable_date;
                const temperature = weekData.the_temp;
                const weatherIcon = weekData.weather_state_abbr;

                weatherBoxWeek.innerHTML += `<div class="day" id="day--i">
                                        <p class="day-date" id="day-date-i">${currentDay}</p>
                                        <p class="temperature-week" id="day-temp--i">${Math.round(temperature)}°C</p>
                                        <div class="icon-box-week" id="icon-box-week--i">
                                        <img src=https://www.metaweather.com/static/img/weather/${weatherIcon}.svg alt="" class="icon-week" id="icon"></img></div>
                                        </div>`;
            }
        }
    };


    const getOptions = () => {
        const dayOption = document.querySelectorAll(DOM.dayOption);
        const townOption = document.querySelectorAll(DOM.townOption);
        let dayID = 0;
        let townID = 0;


        [...dayOption].forEach(option => option.checked == true ? dayID = !isNaN(option.value) ? parseInt(option.value) : option.value  : 'nothing selected');
        [...townOption].forEach(option => option.checked == true ? townID = parseInt(option.value) : 0);

        return {
            dayID: dayID,
            townID: townID
        }
    }

    const catchWeatherController = () => {

        const options = getOptions();

        if (options.townID !== 0) {
            getWeather(options.townID).then(data => {
                updateUI(data, options.dayID);
            });
        } else {
            document.getElementById(DOM.town).textContent = `Please choose country from table!`
        }
    }


    const eventListenerController = () => {
        document.querySelector(DOM.submit).addEventListener('click', catchWeatherController);
    };

    return {
        init: () => {
            eventListenerController();
        }
    }
})();

controller.init();