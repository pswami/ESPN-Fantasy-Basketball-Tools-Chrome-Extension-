/**
 * Created by Swami on 12/27/15.
 */


var offVsDefTeams = [];

function getOffDefData (position, statPeriod) {
    var r = $.Deferred();

    $.get("http://www.rotowire.com/daily/nba/defense-vspos.htm?pos=" + position + "&statview=" + statPeriod, function (data, status) {
        $(data).ready(function() {

            var parse_stats = function () {
                for (i = 0; i < 30; i++) {
                    var team = {
                        name: $(data).find('tbody tr:eq(' + i + ') td:eq(0)').text(),
                        position: position,
                        PTS:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(5)').text()),
                        REB:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(6)').text()),
                        OREB:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(6)').text()),
                        AST:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(7)').text()),
                        STL:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(8)').text()),
                        BLK:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(9)').text()),
                        THREE_PM:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(10)').text()),
                        FG_pct:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(11)').text()),
                        FT_pct:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(12)').text())
                    };

                    offVsDefTeams.push(team);
                }
                r.resolve();
            };

            parse_stats();
            console.log(offVsDefTeams.length);
            //
            //sortIncToDec("BLK");
            //console.log(offVsDefTeams[0].name + " " + offVsDefTeams[0].PTS + " " + offVsDefTeams[29].name + " " + offVsDefTeams[29].PTS);

        });
    }, "html");

    return r;
}

function getAllData () {
    var r = $.Deferred();

    getOffDefData("PG", "last10");
    getOffDefData("SG", "last10");
    getOffDefData("PF", "last10");
    getOffDefData("SF", "last10");
    getOffDefData("C", "last10");

    r.resolve();

    return r;
}

$(document).ready(function() {


    getAllData().done(function() {

        $('#test').text(offVsDefTeams.length);
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                    "from the extension");
                if (request.greeting == "hello")
                    sendResponse({farewell: offVsDefTeams});
            });
    });




    //setTimeout(function() {


    //}, 2000);
});

