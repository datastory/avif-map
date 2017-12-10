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
        //http://birds.cz/avif/api_test.php
        var url = 'https://45fzjpt8jg.execute-api.eu-central-1.amazonaws.com/prod/?order=ObsDate&order_direction=DESC&radius=2.0&latitude=' 
        + loc.coords.latitude + '&longitude=' + loc.coords.longitude + '&dates%5b%5d=' + start + '|' + end + '&page=0&onpage=200';

        $.get(encodeURI(url), function(data) {
            var l = {};
            data.forEach(function(i) {
                var name = i.Species;
                if (!(name in l)) {
                    l[name] = [];
                }
                l[name].push(i)
            })
            var cont = '<div id="accordion">';
            for (var i in l) {
                cont += '<h3>' + i + ' (' + l[i].length + ')</h3><div>'
                l[i].forEach(function (v) {
                    cont += '<p>' + v.DateCr + ', ' + v.SiteName + ', ' + v.municipality + ', <a target="_blank" href="http://birds.cz/avif/obsdetail.php?obs_id=' + v.Id + '">detail</a></p>'
                })
                cont += '</div>' 
            }
            cont += '</div>'
            $('#list').html(cont);
            $( "#accordion" ).accordion({
                heightStyle: "content"
            });
        })
    });   
};

$('.filtr').click(function() {
    var selStart = $('#start').val(),
        selEnd = $('#stop').val()

    getAround(selStart, selEnd)
});