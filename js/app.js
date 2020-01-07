const controller = (function() {

    const DOM = {
        flags: '.flag-box__flag',
        flagbox: '.flag-box',
        icon: 'icon-box',
        temperature: 'temperature',
        town: 'town-name'
    };

    async function getWeather(ID) {
        try {
            const response = await fetch(`https://www.metaweather.com/api/location/${ID}/`);
            const data = await response.json();
            return data;
        } catch(error) {console.log('Error')};
    };

    function updateUI(data) {
        const town = data.title;
        const today = data.consolidated_weather[0];
        const temperature = today.the_temp;
        const weatherIcon = today.weather_state_abbr;

        document.getElementById(DOM.town).textContent = town;
        document.getElementById(DOM.temperature).textContent = `${Math.round(temperature)}°C` ;
        document.getElementById(DOM.icon).innerHTML = `<img src=https://www.metaweather.com/static/img/weather/${weatherIcon}.svg alt="" class="icon" id="icon"></img>`;
    };


    const fetchData = function(e) {
        const townID = e.target.parentNode.id;

        if(townID) {
            getWeather(townID).then(data => {
                updateUI(data);
            });
        }
    };


    const eventListenerController = function() {
        document.querySelectorAll(DOM.flags).forEach(flag => flag.addEventListener('click', fetchData));
    };

    return {
        init: function() {
            eventListenerController();
        }
    }
})();

controller.init();