$( ".datepicker" ).datepicker({
    dateFormat: "yy-mm-dd"
});

dte = new Date();
dte.setDate(dte.getDate() - 7);

$("#start").datepicker('setDate', dte);
$("#stop").datepicker('setDate', new Date());

function setPos(pos){
    return [pos.coords.latitude, pos.coords.longitude]
};

function getAround(start, end) {
    navigator.geolocation.getCurrentPosition(function positionSuccess(loc) {
        var url = 'http://birds.cz/avif/api_test.php?order=ObsDate&order_direction=DESC&radius=2.0&latitude=' 
        + loc.coords.latitude + '&longitude=' + loc.coords.longitude + '&dates%5b%5d=' + start + '|' + end + '&page=0&onpage=200';

        $.get(url, function(data) {
            var cont = 'Celkem: ' + data.length + '<br>';
            data.forEach(function(i) {
                cont += i.Species + ' (' + i.DateCr + '), ' + i.SiteName + ', ' + i.municipality + ', <a target="_blank" href="http://birds.cz/avif/obsdetail.php?obs_id=' + i.Id + '">detail</a><br>'
            })
            $('#list').html(cont);
        })
    });   
};

$('.filtr').click(function() {
    alert('abs')
    var selStart = $('#start').val(),
        selEnd = $('#stop').val()

    getAround(selStart, selEnd)
});