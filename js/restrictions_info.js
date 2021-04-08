const topic_select = document.getElementById('topic_select');
const airline_label = document.getElementById('airline_label');
const airline_select = document.getElementById('airline_select');

const airline_container = document.querySelector('.airline_container');
const travel_container = document.querySelector('.travel_container');

function filter_handler(selected_value) {
    let hidden_value = true;
    if (selected_value === 'airline_information') {
        hidden_value = false;
    }

    if (!hidden_value) {
        airline_container.style.setProperty('display', 'flex');
        travel_container.style.setProperty('display', 'none');
    } else {
        airline_container.style.setProperty('display', 'none');
        travel_container.style.setProperty('display', 'flex');
    }

    airline_select.hidden = hidden_value;
    airline_label.hidden = hidden_value;
}

topic_select.addEventListener('input', (event) => filter_handler(event.target.value));

let airline_data = {};
let travel_data = {};

function add_airline_filter(data) {
    let airlines = new Set();
    for (let feature of data['features']) {
        let airline = feature['attributes']['airline'];
        airlines.add(airline)
    }

    for (let airline of airlines) {
        const option = document.createElement('option');

        const value = airline.trim().toLowerCase().replaceAll(' ', '_');
        option.setAttribute('value', value);
        option.textContent = airline;

        airline_select.appendChild(option);
    }
}

function update_airline_divs() {
    if (!airline_data) {
        return;
    }

    airline_container.replaceChildren();
    const selected_option = airline_select.selectedOptions[0].value;

    const features = airline_data['features'];
    for (let index = features.length - 1; index >= 0; index--) {
        const data = features[index]['attributes'];

        const airline = data['airline'];
        const airline_value = airline.trim().toLowerCase().replaceAll(' ', '_');

        if (selected_option === 'all' || selected_option === airline_value) {
            const airline_post_div = document.createElement('div');
            airline_post_div.className = 'airline_post';

            const airline_name_div = document.createElement('h3');
            airline_name_div.textContent = airline;
            airline_post_div.appendChild(airline_name_div);

            const date_div = document.createElement('h4');
            date_div.textContent = data['published'];
            airline_post_div.appendChild(date_div);

            const info_div = document.createElement('p');
            info_div.textContent = data['info'];
            airline_post_div.appendChild(info_div);

            const source_div = document.createElement('a');
            source_div.textContent = 'Source';

            source_div.setAttribute('href', data['source']);
            source_div.setAttribute('target', '_blank');

            airline_post_div.appendChild(source_div);

            airline_container.appendChild(airline_post_div);
        }
    }
}

airline_select.addEventListener('input', update_airline_divs);

function update_travel_divs() {
    if (!travel_data) {
        return;
    }

    travel_container.replaceChildren();

    const features = travel_data['features'];
    for (let index = features.length - 1; index >= 0; index--) {
        const data = features[index]['attributes'];

        const travel_post_div = document.createElement('div');
        travel_post_div.className = 'travel_post';

        const date_div = document.createElement('h3');
        date_div.textContent = data['published'];
        travel_post_div.appendChild(date_div);

        const info_div = document.createElement('div');
        info_div.className = 'info';
        info_div.insertAdjacentHTML('afterbegin', data['info']);
        travel_post_div.appendChild(info_div);

        const sources_title = document.createElement('h3');
        sources_title.textContent = 'Sources';
        travel_post_div.appendChild(sources_title);

        const sources_div = document.createElement('div');
        sources_div.className = 'sources';
        sources_div.insertAdjacentHTML('afterbegin', data['sources']);
        travel_post_div.appendChild(sources_div);

        travel_container.appendChild(travel_post_div);
    }
}

const body_container = document.querySelector('.body-container');
const iso3 = body_container.getAttribute('data-iso3');

async function fetch_airline_data() {
    // Retrieve the data
    const base_url = 'https://services3.arcgis.com/t6lYS2Pmd8iVx1fy/ArcGIS/rest/services/COVID_Airline_Information_V2/FeatureServer/0/query';
    const api_url = `${base_url}?where=iso3+%3D+%27${iso3}%27&f=pjson&outFields=published%2C+source%2C+airline%2C+info`;

    const response = await fetch(api_url);
    airline_data = await response.json();

    add_airline_filter(airline_data);
    update_airline_divs();
}

fetch_airline_data();

async function fetch_travel_data() {
    const base_url = 'https://services3.arcgis.com/t6lYS2Pmd8iVx1fy/ArcGIS/rest/services/COVID_Travel_Restrictions_V2/FeatureServer/0/query';
    const api_url = `${base_url}?where=iso3+%3D+%27${iso3}%27&f=pjson&outFields=published%2C+sources%2C+info`;

    const response = await fetch(api_url);
    travel_data = await response.json();

    console.log(travel_data);

    update_travel_divs();
}

fetch_travel_data();

function init() {
    const selected_option = topic_select.selectedOptions[0];
    filter_handler(selected_option.value);
}

init();
