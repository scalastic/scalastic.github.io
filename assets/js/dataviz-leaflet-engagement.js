document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map', {
                 center: [30, -2],
                 zoom: 2,
                 minZoom:2,
                 maxZoom:10,
                 zoomDelta: 0.75,
                 zoomSnap: 1,
             });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
        maxZoom: 20,
    }).addTo(map);

    var cfg = {
        "radius": 1.5,
        "maxOpacity": .8,
        "scaleRadius": true,
        "useLocalExtrema": false,
        "gradient": {
            0.125: "rgb(173, 216, 230)", // Bleu clair
            0.25: "rgb(135, 206, 235)",  // Bleu ciel
            0.375: "rgb(0, 255, 255)",   // Aqua
            0.5: "rgb(144, 238, 144)",   // Vert clair
            0.625: "rgb(255, 255, 0)",   // Jaune
            0.75: "rgb(255, 165, 0)",    // Orange
            0.875: "rgb(255, 69, 0)",    // Rouge orangé
            1.0: "rgb(128, 0, 128)"      // Violet
        },
        latField: 'l',
        lngField: 'L',
        valueField: 'c'
    };

    var heatmapLayer = new HeatmapOverlay(cfg).addTo(map);

    fetch('/assets/js/dataviz-leaflet-engagement.min.json').then(response => response.json()).then(data => {
        var customFilterControl = createControls(data);
        customFilterControl.addTo(map);

        data.forEach(point => { point.c = 1; });

        heatmapLayer.setData({ data: data });

        let isVisualizationRunning = false;
        let displayInterval;

        function createControls(data) {
            var control = new L.Control({ position: 'topright' });

            control.onAdd = function(map) {
                var div = L.DomUtil.create('div', 'custom-filter-control');
                L.DomEvent.disableClickPropagation(div);

                createFilterSelector(div, data, 'r', 'Referer');
                createFilterSelector(div, data, 'd', 'Device Type');
                createFilterSelector(div, data, 'o', 'OS');

                createChronosButton(div, data);
                L.DomUtil.create('div', 'timeDisplay', div);

                return div;
            };

            return control;
        }

        function createFilterSelector(parent, data, field, label) {
            var allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.innerText = 'All';
            var uniqueValues = [...new Set(data.map(item => item[field]))].sort();
            var select = L.DomUtil.create('select', 'select' + label.replace(/\s+/g, '_'), parent);
            select.appendChild(allOption);
            uniqueValues.forEach(value => {
                var option = document.createElement('option');
                option.value = value;
                option.innerText = value;
                select.appendChild(option);
            });

            L.DomEvent.on(select, 'change', () => filterData());
        }

        function createChronosButton(parent, data) {
            var startChronoButton = L.DomUtil.create('button', 'start-chrono-btn', parent);
            startChronoButton.innerText = 'Visitor Time';
            L.DomEvent.on(startChronoButton, 'click', () => toggleChronologicalDisplay(data, 't', unixTimeToMinutes, startChronoButton));
        }

        function toggleChronologicalDisplay(data, timeKey, conversionFunction, chronoButton) {
            if (isVisualizationRunning) {
                clearInterval(displayInterval);
                isVisualizationRunning = false;
                  chronoButton.innerText = 'Visitor Time';
            } else {
                startChronologicalDisplay(data, timeKey, conversionFunction, chronoButton);
                isVisualizationRunning = true;
            }
        }

        function filterData() {
            var selectReferer = document.querySelector('.selectReferer');
            var selectDeviceType = document.querySelector('.selectDevice_Type');
            var selectOS = document.querySelector('.selectOS');

            var selectedReferer = selectReferer ? selectReferer.value : 'all';
            var selectedDeviceType = selectDeviceType ? selectDeviceType.value : 'all';
            var selectedOS = selectOS ? selectOS.value : 'all';

            var filteredData = data.filter(function(item) {
                var matchesReferer = selectedReferer === 'all' || item.r === selectedReferer;
                var matchesDeviceType = selectedDeviceType === 'all' || item.d === selectedDeviceType;
                var matchesOS = selectedOS === 'all' || item.o === selectedOS;
                return matchesReferer && matchesDeviceType && matchesOS;
            });

            heatmapLayer.setData({ data: filteredData });
        }

        function startChronologicalDisplay(data, timeKey, conversionFunction, chronoButton) {
            const dataWithDuration = data.map(d => ({
                ...d,
                displayUntil: conversionFunction(d[timeKey]) + 30 // TTL
            }));

            const startOfDay = 0; // 0h00
            const endOfDay = 1439; // 23h59
            let currentTime = startOfDay;

            displayInterval = setInterval(() => {
                const visibleData = dataWithDuration.filter(d => {
                    const dataTime = conversionFunction(d[timeKey]);
                    return dataTime <= currentTime && currentTime <= d.displayUntil;
                });

                heatmapLayer.setData({ data: visibleData });

                updateTimeDisplay(currentTime, chronoButton);
                currentTime += 10; // Avance de 15 minutes
                if (currentTime > endOfDay) currentTime = startOfDay; // Loop

            }, 100); // Speed
        }

        function unixTimeToMinutes(unixTimestamp) {
            const date = new Date(unixTimestamp * 1000);
            return date.getHours() * 60 + date.getMinutes();
        }

        function timeStringToMinutes(timeString) {
            const [hours, minutes] = timeString.split(':').map(Number);
            return hours * 60 + minutes;
        }

        function updateTimeDisplay(currentTime, chronoButton) {
            var hours = Math.floor(currentTime / 60);
            var minutes = currentTime % 60;
            var timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            chronoButton.innerText = `${timeString}`;
        }
    });

    map.on('zoomend', function() {
        var zoomLevel = map.getZoom();
        var newRadius = Math.max(0.1, 1.5 - zoomLevel / 5);
        heatmapLayer.cfg.radius = newRadius;
        heatmapLayer._update();
    });
});
