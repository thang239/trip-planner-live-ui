var styleArr = [
    {
        "featureType": "landscape",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 60
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 40
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 30
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ef8c25"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#b6c54c"
            },
            {
                "lightness": 40
            },
            {
                "saturation": -40
            }
        ]
    },
    {}]
function initialize_gmaps() {
		    // initialize new google maps LatLng object
		    var myLatlng = new google.maps.LatLng(40.705786,-74.007672);
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
		    var map = new google.maps.Map(map_canvas_obj, mapOptions);
		    // Add the marker to the map
		    var marker = new google.maps.Marker({
		        position: myLatlng,
		        title:"Hello World!"
		    });
		    
		    // draw some locations
		    var hotelLocation = [40.705137, -74.007624];
		    var restaurantLocations = [
		        [40.705137, -74.013940],
		        [40.708475, -74.010846]
		    ];
		    var thingToDoLocations = [
		        [40.716291, -73.995315],
		        [40.707119, -74.003602]
		    ];

		    function drawLocation (location, opts) {
		        if (typeof opts !== 'object') {
		            opts = {}
		        }
		        opts.position = new google.maps.LatLng(location[0], location[1]);
		        opts.map = map;
		        var marker = new google.maps.Marker(opts);
		    }
		    drawLocation(hotelLocation, {
		        icon: '/images/lodging_0star.png'
		    });
		    restaurantLocations.forEach(function (loc) {
		        drawLocation(loc, {
		            icon: '/images/restaurant.png'
		        });
		    });
		    thingToDoLocations.forEach(function (loc) {
		        drawLocation(loc, {
		            icon: '/images/star-3.png'
		        });
		    });
		}

var daysChoice = [{hotel:[],restaurant:[],thing:[]}];
var arr = ['hotel','restaurant','thing'];
$(document).ready(function() {
    initialize_gmaps();
    
    arr.forEach(addChoice);
    removeChoice();
    addDay();
    getCurrentDay();
});

function addChoice(str){
	$('#'+str+'Add').on('click',function(){
		
		var selection = $('#'+str+'Select').val();
			if($('#'+str+'Added').text().indexOf(selection)===-1){

				$('#'+str+'Added').append('<div class="itinerary-item"><span class="title">'+selection+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
			     var indexOfDay = Number($('.current-day').text())-1;
                 if(daysChoice[indexOfDay]===undefined) daysChoice[indexOfDay]={};
                 // if(daysChoice[indexOfDay][str]===undefined) daysChoice[indexOfDay][str]=[];
                 daysChoice[indexOfDay][str].push(selection);
            };

        })
}



function removeChoice(){
    $('.panel-body').on('click', '.remove', function(){
        $(this).parent().remove();
    })
}

// function 

function addDay(){
    $('#add-btn').on('click', function(){
        var $before = parseInt($(this).prev().text());
        daysChoice[$before]={hotel:[],restaurant:[],thing:[]};
        $before++;
        //console.log($before);

         $(this).before(' <button class="btn btn-circle day-btn day">'+ $before.toString() +'</button> ');
    })
}

function getCurrentDay(){
    
    $('.day-buttons').on('click','.day',function(){
        $('.current-day').removeClass('current-day');
        $(this).addClass('current-day')
        arr.forEach(function(s){
            console.log(s);
            $('#'+s+'Added').empty();
            console.log(Number($('.current-day').text())-1);
            daysChoice[Number($('.current-day').text())-1][s].forEach(function(q){
                $('#'+s+'Added').append('<div class="itinerary-item"><span class="title">'+q+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
            })

        });
    })
    // $('#.hotelAdded').empty();
}




//
//Array of days contain hotels,restaurants,things to do.