//refactor to use google places api instead of our mongoDB (more locations)
//can type in a city and it will offer drop down list in 50 mile radius?
//can center map on the city/place entered

var daysChoice = [{
    hotel: [],
    restaurant: [],
    thing: [],
    hotelLocations: [],
    restaurantLocations: [],
    thingLocations: []
}];
//a single array of markers for quick removal of all of them.
var markers = []
var arr = ['hotel', 'restaurant', 'thing'];

$(document).ready(function() {
    initialize();
    initialize_gmaps();
    feedData('restaurant');
    
    arr.forEach(addChoice);
    removeChoice();
    addDay();
    getCurrentDay();
    removeDay();

    // console.log(city);
});




var styleArr = [{
    "featureType": "landscape",
    "stylers": [{
        "saturation": -100
    }, {
        "lightness": 60
    }]
}, {
    "featureType": "road.local",
    "stylers": [{
        "saturation": -100
    }, {
        "lightness": 40
    }, {
        "visibility": "on"
    }]
}, {
    "featureType": "transit",
    "stylers": [{
        "saturation": -100
    }, {
        "visibility": "simplified"
    }]
}, {
    "featureType": "administrative.province",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "water",
    "stylers": [{
        "visibility": "on"
    }, {
        "lightness": 30
    }]
}, {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#ef8c25"
    }, {
        "lightness": 40
    }]
}, {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#b6c54c"
    }, {
        "lightness": 40
    }, {
        "saturation": -40
    }]
}, {}]


var map;
var bounds;
var infoWindow = new google.maps.InfoWindow();

var myLatlng = new google.maps.LatLng(40.705786, -74.007672);

function initialize_gmaps() {
    bounds = new google.maps.LatLngBounds();
    // initialize new google maps LatLng object
    // set the map options hash
    var mapOptions = {
        center: myLatlng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: styleArr
    };
    // get the maps div's HTML obj
    var map_canvas_obj = document.getElementById("map-canvas");
    // initialize a new Google Map with the options
    map = new google.maps.Map(map_canvas_obj, mapOptions);
   
        // Add the marker to the map
    var marker = new google.maps.Marker({
        position: myLatlng,
        title: "Hello World!"
    });

}

function feedData(type){

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address':city},function(result,status){
        var location = result[0].geometry.location;
        setCenterAndZoom(location,13);
        var request = {
            location: location,
            radius: '5000',
            types: [type]
        };

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    results.forEach(function(place, index) {
                        // console.log(index, place);
                        var getTypeObj = Object.keys(request)[2];
                        if(dataObj[request.types]===undefined) {dataObj[request.types] = [];
                        }

                        dataObj[request.types].push(mapData(request.types,place));
                        // console.log(request.types);
                        // console.log(place);
                        appendDataDropdown(request.types,place.name);
                        // new google.maps.Marker({
                        //     position: place.geometry.location,
                        //     map: map,
                        //     title: place.name
                        // })
                    })
                }
            })
    })
    
}

function mapData(type,place){
    var res = {};
    if(type === 'restaurant'){
        res.name = place.name;
        res.place = {
            address:place.vicinity,
            city:'New York',
            state:'NY',
            phone:0,
            location:place.geometry.location
        }
        res.cuisine = 'America';
        res.price = place.price_level;
    }

    return res;
}




function appendDataDropdown(id,name){
    // console.log($(id+'Select'));
    $('#'+id+'Select').append('<option>'+name+'</option>');
}


//google maps manipulation
function drawLocation(location, typeOfActivity) {
    var opts = {};
    if (typeOfActivity === "hotel") opts.icon = '/images/lodging_0star.png';
    else if (typeOfActivity === "restaurant") opts.icon = '/images/restaurant.png';
    else if (typeOfActivity === "thing") opts.icon = '/images/star-3.png';
    else opts.icon = opts.icon = '/images/star-3.png';
    opts.position = new google.maps.LatLng(location[0], location[1]);
    opts.map = map;
    return new google.maps.Marker(opts);
}

function clearMarkers() {
    markers.forEach(function(marker) {
            marker.setMap(null);
        })
        //set the center and zoom again
    // map.setCenter(myLatlng);
    // map.setZoom(13);
    setCenterAndZoom(myLatlng,13);
}

function setCenterAndZoom(location,zoom){
    map.setCenter(location);
    map.setZoom(zoom);
}

function addChoice(str) {
    //should map be centered on choice?
    $('#' + str + 'Add').on('click', function() {
        var selection = $('#' + str + 'Select').val();
        if ($('#' + str + 'Added').text().indexOf(selection) === -1) {
            var indexOfDay = Number($('.current-day').text()) - 1;
            // adds lat/long for each day added to locations arrays.
            dataObj[str].forEach(function(poi) {
                // console.log(poi);
                if (poi.name === selection) {
                    var marker = drawLocation(poi.place[0].location, str)
                    bounds.extend(marker.position);
                    map.fitBounds(bounds);
                    //add event listener for the marker
                    var contentString = getInfoString(poi, str);
                    //clear opened window
                    if (infoWindow) {
                        infoWindow.close();
                    }
                    //set event listener for marker
                    google.maps.event.addListener(marker, 'click', function() {
                        infoWindow.setContent(contentString);
                        infoWindow.open(map, marker);
                    });
                    //push the marker to it's day
                    daysChoice[indexOfDay][str + "Locations"].push(marker);
                    markers.push(marker);
                }
            })
            $('#' + str + 'Added').append('<div class="itinerary-item"><span class="title">' + selection + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
            daysChoice[indexOfDay][str].push(selection);
        };
    })
}

function getInfoString(poi, str) {
    var res = '';
    res += '<h3>' + poi.name + '</h3>';
    if (str === 'thing') {
        res += '<p>Age range: ' + poi.age_range + '</p>';
    }
    if (str === 'restaurant') {
        res += '<p>Cuisine: ' + poi.cuisine + '</p>';
    }
    if (str === 'hotel') {
        res += '<p>' + getStars(poi.num_stars) + '</p>' + '<p>Amenities: ' + poi.amenities + '</p>';
    }
    res += '<p>Address: ' + poi.place[0].address + ', ' + poi.place[0].city + '</p>' + '<p>Phone: ' + poi.place[0].phone + '</p>';

    return res;
}

function getStars(num) {
    var res = '';
    for (var i = 0; i < num; i++) {
        res += '&#127775';
    }
    return res;
}

function removeChoice() {
    //need to remove map ping when you remove a choice
    $('.panel-body').on('click', '.remove', function() {
        var $this = $(this);
        var choiceType = $this.parent().parent().attr('class').split(" ")[1];
        var nameToRemove = $this.prev().text();
        var dayIndex = Number($(".current-day").text()) - 1;
        daysChoice[dayIndex][choiceType] = daysChoice[dayIndex][choiceType].filter(function(activity, index) {
            if (activity === nameToRemove) {
                //will remove the lat/long for the choice removed
                var marker = daysChoice[dayIndex][choiceType + "Locations"].splice(index, 1)[0].setMap(null);
                return false;
            }
            return true;
        })
        $this.parent().remove();
    })
}


function addDay() {
    $('#add-btn').on('click', function() {
        var $before = parseInt($(this).prev().text());
        daysChoice[$before] = {
            hotel: [],
            restaurant: [],
            thing: [],
            hotelLocations: [],
            restaurantLocations: [],
            thingLocations: []
        };
        $before++;
        $(this).before(' <button class="btn btn-circle day-btn day">' + $before.toString() + '</button> ');
    })
}

//loads central location of map as being hotel?
function getCurrentDay() {
    $('.day-buttons').on('click', '.day', function() {
        //remove all markers from map. 
        clearMarkers();
        bounds = new google.maps.LatLngBounds();
        var $currentDay = $(".current-day");
        $currentDay.removeClass('current-day');
        $(this).addClass('current-day');
        $('#day-title span').text("Day " + $(this).text())
        var indexOfDay = Number($('.current-day').text()) - 1;

        arr.forEach(function(s) {
            var $s = $('#' + s + 'Added');
            $s.empty();
            daysChoice[indexOfDay][s].forEach(function(q, index) {
                daysChoice[indexOfDay][s + "Locations"][index].setMap(map);
                bounds.extend(daysChoice[indexOfDay][s + "Locations"][index].position);
                map.fitBounds(bounds);
                $s.append('<div class="itinerary-item"><span class="title">' + q + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
            })
        });
    })
}

function isEmptyDay(day) {
    var res = true;
    for (var key in day) {
        if (day[key].length) res = false;
    }
    return res;
}

function removeDay() {
    $(".remove-current").on('click', function() {
        var $currentday = $('.current-day');
        if (daysChoice.length === 1) return;
        var indexArray = Number($currentday.text()) - 1;
        daysChoice.splice(indexArray, 1);
        $currentday.removeClass('current-day');

        if ($currentday.text() == "1") {
            $currentday.next().addClass('current-day');
            shiftDays($currentday);
            $currentday.next().trigger('click');
        } else {
            $currentday.prev().addClass('current-day');
            shiftDays($currentday);
            $currentday.prev().trigger('click');
        }
        $currentday.remove();
    })
}

function shiftDays($currentday) {
    Array.prototype.slice.call($currentday.nextAll()).forEach(function(sibling) {
        var tempText = Number($(sibling).text());
        if (!isNaN(tempText)) $(sibling).text(--tempText);
    })
}
//THINGS RELATED TO GOOGLE PLACES TO RETRIEVE DATA//
//OUTLINE

// Need to be able to input a city/place (use Google Places autocomplete feature)
//Based off the city, map is initialized focusing on a location for that.
//Will provide a list on the side of places within a 50 mile radius??
//Will slap on the map a list of places within a 50 mile radius and you can click on it? Filter by hotels/restaurants/things to do?

//Initialize homepage autocomplete form
function initialize() {
    // Create the autocomplete object, restricting the search
    // to geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
            /** @type {HTMLInputElement} */
            (document.getElementById('autocomplete')), {
                types: ['(cities)']
            })
        // When the user selects an address from the dropdown,
}