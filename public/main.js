$(document).ready(function() {

	var plans = [];
	function DayTemplate() {
		return {
			hotel: [],
			restaurant: [],
			activity: []
		};
	}
	plans.push(DayTemplate());

	var icons = {
		hotel: '/images/lodging_0star.png',
		activity: '/images/star-3.png',
		restaurant: '/images/restaurant.png'
	};

	var drawLocation = mapFunctions.drawLocation;
	var clearOverlays = mapFunctions.clearOverlays;

		// add plans //
		$('.hotel-select button, .restaurant-select button, .activity-select button').on('click', function() {
			var typeOfPlan = $(this).closest('div').attr('class').match(/(hotel|restaurant|activity)/)[0];
			var plan = $(this).closest('div').find('select').val();
			// If we're already doing it, do nothing
			var numDay = $('.currentDay').text();
			var todaysPlans = plans[numDay - 1][typeOfPlan];
			for (var i = 0; i < todaysPlans.length; i++) {
				if (plan === todaysPlans[i].name) {
					alert("You\'re already doing that thing!")
					return;
				}
			}
			// lookup this venue in dataset, get name and location
			var d = data[typeOfPlan];
			for (var i = 0 ; i < d.length; i++) {
				// push planObject with attr name, lat, long
				if (d[i].name === plan) {
					todaysPlans.push({name: plan, location: d[i].place[0].location});
					drawLocation(d[i].place[0].location, {
						icon: icons[typeOfPlan]
					});
					markers[markers.length-1].name = plan;
					console.log(markers);
				}
			}

			// add lat and long to map
			// ....

			var newPlan = $('<div class="itinerary-item"><span class="title">' + 
				plan + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
			$('.' + typeOfPlan).append(newPlan);
		});

		// remove plans //
		$('.dayPlans').on('click', 'button', function() {
			// p is this day's plan object
			var p = plans[$( '.currentDay' ).text()-1]
			var planName = $($( this ).closest('div').children()[0]).text();
			var planType = $( this ).closest('ul').attr('class').match(/(hotel|restaurant|activity)/)[0];

			// Remove plan marker from map
			for (var i = 0; i < markers.length; i++) {
				if (markers[i].name === planName) {
					markers[i].setMap(null);
				}
			}

			// look for this plan and delete from this day's plan object.
			for (var i = 0 ; i< p[planType].length; i++) {
					console.log("whatever", p[planType][i].name);
				if (planName === p[planType][i].name) {
					console.log("got in");
					p[planType].splice(i, 1);
				}
			}
			$(this).closest('div').remove();
		});

		// add days 
		$('.addDay').on('click', function() {
			// DATA
			var numDay = +$('.currentDay').text();
			plans.splice(numDay,0,DayTemplate());

			// APPEARANCE
			// clear map (since moving to new day)
			clearOverlays();

			// clear plans from screen
			for (var key in plans[numDay-1]) {
				$('.' + key).children().remove();
			}
			// clear plans from plans array

			var numDays = $( this ).closest('div').children().length;
			var nextDay = $('<button class="btn btn-circle day-btn addDay">' + numDays + '</button>');
			$( this ).before(nextDay);
			$('.currentDay').removeClass('currentDay');
			$($('.day-buttons').children()[numDay]).addClass('currentDay');
			$('#day-title span').text("Day " + (numDay + 1));
		});

		// Remove a Day
		$('.removeDay').on('click', function() {
			var numDay = +$('.currentDay').text();
			// clear plans from screen
			for (var key in plans[numDay-1]) {
				$('.' + key).children().remove();
			}
			// clear plans from plans array
			plans.splice(numDay-1,1);

			if ($('.day-buttons').children().length > 2) {
				$('.currentDay').remove();
				var kids = $('.day-buttons').children();
				numDay = numDay > 1 ? numDay-2 : 0;
				$(kids[numDay]).addClass('currentDay');
				for (var i = 0; i < kids.length - 1; i++) {
					$(kids[i]).text(i + 1);
				}
			}
		});

		// switch days
		$('.day-buttons').on('click',  'button:not(:last)', function() { 
			$('.currentDay').removeClass('currentDay');
			$( this ).addClass('currentDay');
			var whichDay = $( this ).text();
			$('#day-title span').text("Day " + whichDay);
			var numDay = $('.currentDay').text();
			// Reinitialize map
			clearOverlays();
			for (var key in plans[numDay-1]) {
				$('.' + key).children().remove();
				for (var i = 0; i < plans[numDay-1][key].length; i++) {
					var plan  = plans[numDay-1][key][i];
					// for every place location, draw on map with correct icon
					drawLocation(plan.location, {
						icon: icons[key]
					});
					

					var planName = plan.name;
					var newPlan = $('<div class="itinerary-item"><span class="title">' + planName
					+ '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
					$('.' + key).append(newPlan);
					console.log(plans);
				}
			}
		});
});

// drawLocation(hotelLocation, {
//   icon: '/images/lodging_0star.png'
// });
// restaurantLocations.forEach(function (loc) {
//   drawLocation(loc, {
//     icon: '/images/restaurant.png'
//   });
// });
// activityLocations.forEach(function (loc) {
//   drawLocation(loc, {
//     icon: '/images/star-3.png'
//   });
// });






