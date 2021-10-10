const urlCorona = "https://corona-api.com/countries",
    urlCountries = "https://api.allorigins.win/raw?url=https://restcountries.herokuapp.com/api/v1";

let worldCorona = {},
    myChart,
    currentRegion = 'World',
    currentType = 'confirmed',
    asia = [],
    africa = [],
    europe = [],
    americas = [];

const regionBtns = document.querySelectorAll('.btn-region'),
    caseBtns = document.querySelectorAll('.btn-case'),
    select = document.querySelector('#selection'),
    display1 = document.querySelector('.data1'),
    display2 = document.querySelector('.data2'),
    display3 = document.querySelector('.data3'),
    display4 = document.querySelector('.data4'),
    display5 = document.querySelector('.data5'),
    display6 = document.querySelector('.data6');
/** initializing the data on local storage and the arrays **/
const getWorld = (async () => {
    let dataCountries = {},
        coronaData = {};
    if (!localStorage.getItem('world') || !localStorage.getItem('cases')) {
        const countries = await (await fetch(urlCountries)).json();
        const corona = await (await fetch(urlCorona)).json();
        localStorage.setItem('world', JSON.stringify(countries));
        localStorage.setItem('cases', JSON.stringify(corona.data));
    }
    dataCountries = JSON.parse(localStorage.getItem('world'));
    coronaData = JSON.parse(localStorage.getItem('cases'));
    dataCountries.map(val1 => {
        worldCorona[val1.cca2] = { name: val1.name.common, region: val1.region }
    })
    coronaData.forEach(val1 => {
        worldCorona[val1.code]['confirmed'] = val1.latest_data.confirmed;
        worldCorona[val1.code]['critical'] = val1.latest_data.critical;
        worldCorona[val1.code]['deaths'] = val1.latest_data.deaths;
        worldCorona[val1.code]['recovered'] = val1.latest_data.recovered;
        worldCorona[val1.code]['newCases'] = val1.today.confirmed;
        worldCorona[val1.code]['newDeaths'] = val1.today.deaths;
    })
    worldCorona = Object.values(worldCorona);
    worldCorona = worldCorona.filter(val => {
        return val.region.length > 0 && val.confirmed >= 0;
    })
    asia = worldCorona.filter(val => {
        return val.region === 'Asia';
    })
    africa = worldCorona.filter(val => {
        return val.region === 'Europe';
    })
    europe = worldCorona.filter(val => {
        return val.region === 'Africa';
    })
    americas = worldCorona.filter(val => {
        return val.region === 'Americas';
    })
    updateChart(worldCorona);
})

getWorld();

/**function that will be called when need to update a chart**/
function updateChart(array, type) {
    let keys = [], values = [], type1 = 'confirmed';
    if (type1 !== type && type !== undefined) {
        type1 = type;
    }
    array.map(value => {
        keys.push(value.name);
        values = [...values, value[type1]];
    })
    setChart(keys, values, type1)
}


/**function that setting a new chart**/
function setChart(keys, values, type) {
    let ctx = document.querySelector('#mychart').getContext('2d');
    if (myChart) {
        myChart.destroy();
    }
    Chart.defaults.font.size = 8;

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: keys,
            datasets: [{
                label: `covid 19 ${type}`,
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false
        }
    });
}

/**function that that checks which region is clicked and call for update**/
function showDataPerRegion(e) {
    if (e.currentTarget.value === 'Asia') {
        currentRegion = e.currentTarget.value;
        updateChart(asia, currentType);
    }
    else if (e.currentTarget.value === 'Europe') {
        currentRegion = e.currentTarget.value;
        updateChart(europe, currentType);
    }
    else if (e.currentTarget.value === 'Africa') {
        currentRegion = e.currentTarget.value;
        updateChart(africa, currentType);
    }
    else if (e.currentTarget.value === 'Americas') {
        currentRegion = e.currentTarget.value;
        updateChart(americas, currentType);
    }
    else if (e.currentTarget.value === 'World') {
        currentRegion = e.currentTarget.value;
        updateChart(worldCorona, currentType);
    }
}

/**function that that checks which region for a specific case is clicked and call for update**/
function showDataPerRegionCase(type) {
    if (currentRegion === 'Asia') {
        updateChart(asia, type);
    }
    else if (currentRegion === 'Europe') {
        updateChart(europe, type);
    }
    else if (currentRegion === 'Africa') {
        updateChart(africa, type);
    }
    else if (currentRegion === 'Americas') {
        updateChart(americas, type);
    }
    else {
        updateChart(worldCorona, type);
    }
}

/**function that that checks which case is clicked**/
function showDataPerCase(e) {
    if (e.currentTarget.value === 'Confirmed') {
        currentType = 'confirmed';
        showDataPerRegionCase(currentType);
    }
    else if (e.currentTarget.value === 'Deaths') {
        currentType = 'deaths';
        showDataPerRegionCase(currentType);
    }
    else if (e.currentTarget.value === 'Recovered') {
        currentType = 'recovered';
        showDataPerRegionCase(currentType);
    }
    else if (e.currentTarget.value === 'Critical') {
        currentType = 'critical';
        showDataPerRegionCase(currentType);
    }
}

/**event listener for buttons**/
regionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => { showDataPerRegion(e); showCountriesSelect(e) })
})

caseBtns.forEach(btn => {
    btn.addEventListener('click', showDataPerCase);
})

/**showing the countries on the select option**/
function showCountriesSelect(e) {
    select.innerHTML = '';
    if (e.currentTarget.value === 'Asia') {
        asia.map((val, i) => select.innerHTML += `<option value="${i}">${val.name}</option>`)
    }
    else if (e.currentTarget.value === 'Europe') {
        europe.map((val, i) => select.innerHTML += `<option value="${i}">${val.name}</option>`)
    }
    else if (e.currentTarget.value === 'Africa') {
        africa.map((val, i) => select.innerHTML += `<option value="${i}">${val.name}</option>`)
    }
    else if (e.currentTarget.value === 'Americas') {
        americas.map((val, i) => select.innerHTML += `<option value="${i}">${val.name}</option>`)
    }
    else {
        worldCorona.map((val, i) => select.innerHTML += `<option value="${i}">${val.name}</option>`)
    }
}
worldCorona.map((val, i) => select.innerHTML += `<option value="${i}">${val.name}</option>`)


select.addEventListener('change', handleSelect);
/**showing the data for choosen country on the screen**/
function showDown(array, index) {
    display1.innerHTML = `Total cases: </br>${array[index].confirmed}`;
    display2.innerHTML = `New cases: </br>${array[index].newCases}`;
    display3.innerHTML = `Total Deaths: </br>${array[index].deaths}`;
    display4.innerHTML = `New Deaths: </br>${array[index].newDeaths}`;
    display5.innerHTML = `Total Recovered: </br>${array[index].recovered}`;
    display6.innerHTML = `In critical condition: </br>${array[index].critical}`;
}
/**function that handle which country is choosen and it calls the function thas shows the data on the screen**/
function handleSelect(e) {
    switch (currentRegion) {
        case 'Asia':
            showDown(asia, e.currentTarget.value);
            break;
        case 'Europe':
            showDown(europe, e.currentTarget.value);
            break;
        case 'Africa':
            showDown(africa, e.currentTarget.value);
            break;
        case 'Americas':
            showDown(americas, e.currentTarget.value);
            break;
        default:
            showDown(worldCorona, e.currentTarget.value);
            break;
    }
}

