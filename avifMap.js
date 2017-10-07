

var selCont = '<select class="taxon">';
Object.values(taxons).forEach(function(o) {
	selCont += '<option value="' + o.TaxonId + '">' + o.NameCZ + ' (' + o.Name + ')</option>'
});
selCont += '</select>'
$('#taxon').html(selCont);

$( ".datepicker" ).datepicker({
	dateFormat: "yy-mm-dd"
});

$(".datepicker").datepicker('setDate', new Date());

$('.taxon').select2();

var map = L.map('map').setView([49.7417517, 15.3350758], 8); //Číhošť

var tiles = L.tileLayer('http://b.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18,
    minZoom: 7
});

tiles.addTo(map);

function drawMap(taxon, start, end, count) {
	var url = 'http://birds.cz/avif/api_test.php?order=ObsDate&order_direction=DESC&taxon=' + taxon + '&dates%5b%5d=' + start + '|' + end + '&page=0&onpage=' + count;

	map.eachLayer(function (layer) {
    	map.removeLayer(layer)
	});

	tiles.addTo(map);

	$.getJSON(url, function(data) {
		var markers = L.markerClusterGroup();
		Object.values(data).forEach(function(e) {
			if (parseFloat(e.Latitude) > 0) {
				markers.addLayer(L.circleMarker([parseFloat(e.Latitude), parseFloat(e.Longitude)], {
					radius: 5,
					color: 'red',
					weight: 0.5,
					opacity: 1,
					fillColor: 'red',
					fillOpacity: 0.5
				}).bindPopup(e.SiteName + ' (' + e.slouceny_nazev + ')<br>' + e.ObsDate_fmt 
				+ '<br>' + e.SpeciesPresent + '<br>'
				+ 'Počet: ' + e.CountExact));
			};
		})
		map.addLayer(markers);
		$('.returnedCount').text('Vybráno ' + data.length + ' záznamů')
	});
};

$('.filtr').on('click', function() {
	var selTax = $('#taxon option:selected').val(),
		selStart = $('#start').val(),
		selEnd = $('#stop').val(),
		selCount = $('.count').val();

	drawMap(selTax, selStart, selEnd, selCount)
});