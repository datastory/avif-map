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
        var url = 'https://45fzjpt8jg.execute-api.eu-central-1.amazonaws.com/prod/?order=ObsDate&order_direction=DESC&radius=10.0&latitude=' + loc.coords.latitude + '&longitude=' + loc.coords.longitude + '&dates%5b%5d=' + start + '|' + end + '&page=0';

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
                c = 'black';
                if (l[i][0]['yIsRare'] == 1) {
                    c = 'red';
                } else if (l[i][0]['IsInteresting'] == 1) {
                    c = 'blue';
                };
                cont += '<h3 style="color: ' + c + ';">' + i + ' (' + l[i].length + ')</h3><div>'
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

function getEbird() {
    navigator.geolocation.getCurrentPosition(function positionSuccess(loc) {
        var url = "https://ebird.org/ws2.0/data/obs/geo/recent?lat=" + loc.coords.latitude + "&lng=" + 
        + loc.coords.longitude + "&sort=species&dist=10&sppLocale=cs";

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            headers: {
                'X-eBirdApiToken': 'ghijpdbtags4',
            },
            success: function (result) {
                var cont = '<div id="ebird_accordion">';
                result.forEach(function(i) {
                    cont += '<p>' + i.comName + ' (' + i.howMany + '), ' + i.obsDt + ', ' + i.locName + '</p>'
                })
                cont += '</div>'
                $('#list_ebird').html(cont);
            },
            error: function (error) {
                alert('eBird err!')
            }
        });
    });   
};

$('.filtr').click(function() {
    var selStart = $('#start').val(),
        selEnd = $('#start').val()
    getAround(selStart, selEnd)
    getEbird()
});