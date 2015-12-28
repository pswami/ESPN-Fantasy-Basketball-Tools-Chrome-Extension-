/**
 * Created by Swami on 12/17/15.
 */

//var url = window.location.href;

var leagueID = getUrlParameter(window.location.search,"leagueId");
var seasonID = getUrlParameter(window.location.search,"seasonId");
var teamID = getUrlParameter(window.location.search,"teamId");

var oppURL = $('.games-firstlist:eq(0) a:eq(0)').attr('href');
var oppTeamID = getUrlParameter(oppURL,"teamId");
var scoringPeriodID = $('#playerTableFramedForm input[name=scoringPeriodId]').val();
var offVsDefTeams = [];

function getUrlParameter(url, sParam) {
    var sPageURL = decodeURIComponent(url.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

//Greatest to Smallest
function sortIncToDec (arr, s) {
    return arr.sort(function(a, b) {
        if (eval('a.' + s) > eval('b.' + s))
        {
            return -1;
        }
        if (eval('a.' + s) < eval('b.' + s)) {
            return 1;
        }
        return 0;
    });
}

function getColorLevel (num) {
    if (num >= 0 && num <= 5) {
        return "#006600";
    } else  if (num >= 6 && num <= 11) {
        return "#72C926";
    } else  if (num >= 12 && num <= 17) {
        return "#C6C625";
    } else  if (num >= 18 && num <= 23) {
        return "#C67625";
    } else {
        return "#C42525";
    }
}

var team_abbr_dict = {
    "Atl" : "Atlanta Hawks",
    "Bos" : "Boston Celtics",
    "Bkn" : "Brooklyn Nets",
    "Cha" : "Charlotte Hornets",
    "Chi" : "Chicago Bulls",
    "Cle" : "Cleveland Cavaliers",
    "Dal" : "Dallas Mavericks",
    "Den" : "Denver Nuggets",
    "Det" : "Detroit Pistons",
    "GS" : "Golden State Warriors",
    "Hou" : "Houston Rockets",
    "Ind" : "Indiana Pacers",
    "LAC" : "Los Angeles Clippers",
    "LAL" : "Los Angeles Lakers",
    "Mem" : "Memphis Grizzlies",
    "Mia" : "Miami Heat",
    "Mil" : "Milwaukee Bucks",
    "Min" : "Minnesota Timberwolves",
    "Nor" : "New Orleans Pelicans",
    "NY" : "New York Knicks",
    "OKC" : "Oklahoma City Thunder",
    "Orl" : "Orlando Magic",
    "Phi" : "Philadelphia 76ers",
    "Pho" : "Phoenix Suns",
    "Por" : "Portland Trail Blazers",
    "Sac" : "Sacramento Kings",
    "SA" : "San Antonio Spurs",
    "Tor" : "Toronto Raptors",
    "Uta" : "Utah Jazz",
    "Wsh" : "Washington Wizards"
};

function getOffDefData (position, statPeriod) {
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
            };

            parse_stats();
            //console.log(offVsDefTeams.length);
            //
            //sortIncToDec("BLK");
            //console.log(offVsDefTeams[0].name + " " + offVsDefTeams[0].PTS + " " + offVsDefTeams[29].name + " " + offVsDefTeams[29].PTS);

        });
    }, "html");
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function colorizeBox (player_stat_arr, teamPlayingAgainst, stat_name, column_num, position) {

    var BLKtable = offVsDefTeams.filter(function (x) {
        return position == x.position;
    });
    BLKtable = sortIncToDec(BLKtable, stat_name);

    //console.log("am: " + BLKtable.length);
    var num = BLKtable.map(function(x) {return x.name; }).indexOf(teamPlayingAgainst);

    //console.log(teamPlayingAgainst + " " + getColorLevel(num));
    $(player_stat_arr[column_num]).css({"background" : getColorLevel(num), "color" : "white"});
}

function colorizePlayerRow (player_stat_arr, row_num) {

    var tdLength = $('.pncPlayerRow:eq(' + row_num + ') td').length;
    //console.log("TDs " + tdLength);

    var teamPlayingAgainst = team_abbr_dict[$('.pncPlayerRow:eq(' + row_num + ') td:eq(' + (tdLength - 19) + ') a').text().replace("@", "")];
    var pos = $('.pncPlayerRow:eq(' + row_num + ') td:eq(1)').text();
    var posStartIdx = pos.search("\u00A0") + 1;
    pos = pos.substr(posStartIdx, 2).replace(",", "");

    colorizeBox (player_stat_arr, teamPlayingAgainst, 'FG_pct', 2, pos);
    colorizeBox (player_stat_arr, teamPlayingAgainst, 'FT_pct', 4, pos);
    colorizeBox (player_stat_arr, teamPlayingAgainst, 'THREE_PM', 5, pos);
    colorizeBox (player_stat_arr, teamPlayingAgainst, 'OREB', 6, pos);
    colorizeBox (player_stat_arr, teamPlayingAgainst, 'REB', 7, pos);
    colorizeBox (player_stat_arr, teamPlayingAgainst, 'AST', 8, pos);
    colorizeBox (player_stat_arr, teamPlayingAgainst, 'STL', 9, pos);
    colorizeBox (player_stat_arr, teamPlayingAgainst, 'BLK', 10, pos);
    colorizeBox (player_stat_arr, teamPlayingAgainst, 'PTS', 11, pos);
}


function fill_total_stats(who_team) {

    //console.log(who_team);
    setTimeout( function() {

        var player_table = $(".playerTableTable");
        var player_rows = $(".pncPlayerRow");
        //
        //var teamPlayingAgainst = $(".pncPlayerRow");

        if (who_team === "myTotal" && !($("#myTotal")[0])) {
            player_table = $(".playerTableTable");
            player_rows = $(".pncPlayerRow");

            //console.log("added");


            var tdLength = $('.pncPlayerRow:eq(0) td').length;
            //alert(tdLength);
            $('.pncPlayerRow:eq(9)').after('<tr id=' + '"' + who_team + '"' +'class="totalAvgRow"><td colspan=' + '"' + (tdLength-20) + '"' +'></td><td class="sectionLeadingSpacer"></td><td colspan="2"align="center" ><b>TEAM TOTAL</b></td><td class="sectionLeadingSpacer"></td><td class="playertableStat ">62</td><td class="playertableStat ">11/25</td><td class="playertableStat ">.440</td><td class="playertableStat ">0/0</td><td class="playertableStat ">.000</td><td class="playertableStat ">3</td><td class="playertableStat ">2</td><td class="playertableStat ">9</td><td class="playertableStat ">6</td><td class="playertableStat ">4</td><td class="playertableStat ">0</td><td class="playertableStat ">25</td><td class="sectionLeadingSpacer"></td><td colspan="3"></td></tr>');

            player_table.append('<style>#myTotal{background:DarkSlateGray;color:white;} #oppTotal{background:#6F1919 ;color:white;}</style>');

        }

        if (who_team === "oppTotal" && !($("#oppTotal")[0])) {
            console.log("opp " + oppTeamID + " " + scoringPeriodID);

            $.get("http://games.espn.go.com/fba/clubhouse?leagueId=" + leagueID + "&teamId=" + oppTeamID + "&seasonId=" + seasonID + "&scoringPeriodId=" + scoringPeriodID, function (data, status) {
                $(data).ready(function() {
                    player_table = $(data).find(".playerTableTable");
                    player_rows = $(data).find(".pncPlayerRow");

                    calc_disp_stats(who_team, player_rows);
                    //        $(".player-list-position-tab").on('click', load_projections);
                    //        $(".player-list-vs-repeat-container").on('scroll', load_projections);
                });
            }, "html");



            var tdLength = $('.pncPlayerRow:eq(0) td').length;
            //console.log("added");

            $('#myTotal').after('<tr id="oppTotal" class="totalAvgRow"><td colspan=' + '"' + (tdLength-20) + '"' +'></td><td class="sectionLeadingSpacer"></td><td colspan="2" align="center"><b>OPP TOTAL</b></td><td class="sectionLeadingSpacer"></td><td class="playertableStat ">62</td><td class="playertableStat ">11/25</td><td class="playertableStat ">.440</td><td class="playertableStat ">0/0</td><td class="playertableStat ">.000</td><td class="playertableStat ">3</td><td class="playertableStat ">2</td><td class="playertableStat ">9</td><td class="playertableStat ">6</td><td class="playertableStat ">4</td><td class="playertableStat ">0</td><td class="playertableStat ">25</td><td class="sectionLeadingSpacer"></td><td colspan="3"></td></tr>');

        }

        calc_disp_stats(who_team, player_rows);


    }, 100);
}

function calc_disp_stats(who_team, player_rows) {

    var FGM = 0, FGA = 0, FG_pct = 0, FTM = 0, FTA = 0, FT_per = 0, THREE_PM = 0, OREB = 0, REB = 0, AST = 0, STL = 0, BLK = 0, PTS = 0, MIN = 0, PL_COUNT = 0;
    var sum_PTS = 0, sum_BLK = 0, sum_STL = 0, sum_AST = 0, sum_REB = 0, sum_OREB = 0, sum_THREE_PM = 0, sum_FGM = 0, sum_FGA = 0, sum_FTM = 0, sum_FTA = 0, sum_MIN = 0;

    for (i = 0; i < 10; i++) {
        var player_stat_arr = player_rows[i].getElementsByClassName("playertableStat");
        var player_game_status = player_rows[i].getElementsByClassName("gameStatusDiv");

        if (!isNaN(parseFloat(player_stat_arr[0].innerText)) && player_game_status[0] && player_game_status[0].innerText.replace(/\s/g, "")) {
            PL_COUNT++;

            MIN = parseFloat(player_stat_arr[0].innerText);

            var FGM_FGA_arr = player_stat_arr[1].innerText.split('/');
            FGM = parseFloat(FGM_FGA_arr[0]);
            FGA = parseFloat(FGM_FGA_arr[1]);

            var FTM_FTA_arr = player_stat_arr[3].innerText.split('/');
            FTM = parseFloat(FTM_FTA_arr[0]);
            FTA = parseFloat(FTM_FTA_arr[1]);

            THREE_PM = parseFloat(player_stat_arr[5].innerText);
            OREB = parseFloat(player_stat_arr[6].innerText);
            REB = parseFloat(player_stat_arr[7].innerText);
            AST = parseFloat(player_stat_arr[8].innerText);
            STL = parseFloat(player_stat_arr[9].innerText);
            BLK = parseFloat(player_stat_arr[10].innerText);
            PTS = parseFloat(player_stat_arr[11].innerText);

            sum_MIN += MIN;
            sum_FGM += FGM;
            sum_FGA += FGA;
            sum_FTM += FTM;
            sum_FTA += FTA;
            sum_THREE_PM += THREE_PM;
            sum_OREB += OREB;
            sum_REB += REB;
            sum_AST += AST;
            sum_STL += STL;
            sum_BLK += BLK;
            sum_PTS += PTS;
        }
    }

    var my_total_row = $("#" + who_team);
    var my_total_column_arr = my_total_row[0].getElementsByClassName("playertableStat");
    //
    //var opp_total_row = $("#oppTotal");
    //var opp_total_column_arr = opp_total_row[0].getElementsByClassName("playertableStat");

    $(my_total_column_arr[0]).html("<b>" + PL_COUNT + " PLY</b>");
    $(my_total_column_arr[1]).html("<b>" + (sum_FGM).toFixed(1) + "/" + (sum_FGA).toFixed(1)  + "</b>");
    $(my_total_column_arr[2]).html("<b>" + (sum_FGM/sum_FGA).toFixed(3)  + "</b>");
    $(my_total_column_arr[3]).html("<b>" + (sum_FTM).toFixed(1) + "/" + (sum_FTA).toFixed(1)  + "</b>");
    $(my_total_column_arr[4]).html("<b>" + (sum_FTM/sum_FTA).toFixed(3)  + "</b>");
    $(my_total_column_arr[5]).html("<b>" + (sum_THREE_PM).toFixed(1) + "</b>");
    $(my_total_column_arr[6]).html("<b>" + (sum_OREB).toFixed(1) + "</b>");
    $(my_total_column_arr[7]).html("<b>" + (sum_REB).toFixed(1) + "</b>");
    $(my_total_column_arr[8]).html("<b>" + (sum_AST).toFixed(1) + "</b>");
    $(my_total_column_arr[9]).html("<b>" + (sum_STL).toFixed(1) + "</b>");
    $(my_total_column_arr[10]).html("<b>" + (sum_BLK).toFixed(1) + "</b>");
    $(my_total_column_arr[11]).html("<b>" + (sum_PTS).toFixed(1) + "</b>");

}

$(document).ready(function() {

    $.get("http://games.espn.go.com/fba/boxscorefull?leagueId=" + leagueID + "&teamId=" + teamID +"&seasonId=" + seasonID + "&view=matchup&version=full", function (data, status) {
        $(data).ready(function() {
            var load_total_games = function () {
                var me_num_played = $(data).find('.playerTableBgRowTotals:eq(0) .playertableStat:eq(0)').text();
                var opponent_num_played = $(data).find('.playerTableBgRowTotals:eq(1) .playertableStat:eq(0)').text();
                var total_num_played = $(data).find('.games-alert-mod table tbody tr td:eq(1) span:eq(0)').text().split("/")[1];

            //console.log(data)
            //console.log();
            $('.games-univ-mod5 ul li:eq(0)').after('<li class="games-firstlist" style="color:SpringGreen ;border-top-right-radius:0px;border-top-left-radius:0px;"><strong style="color:white;">Number You Played: </strong>' + me_num_played + ' / ' + total_num_played + '<strong style="color:white;">   Opp: </strong>'  + opponent_num_played + ' / ' + total_num_played + '</li>');
        };

            load_total_games();
        });
    }, "html");

    $('.games-univ-mod5').css({"width" : "232px", "height" : "100px"});
    $('.games-dates-mod').css({"margin-top" : "6px"});
    $('.games-secondlist').css({"height" : "10px"});


    fill_total_stats("myTotal");
    fill_total_stats("oppTotal");

});

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log(response.farewell.length);

    offVsDefTeams = response.farewell;

    var color = function () {
        setTimeout(function () {
            // alert($(".pncPlayerRow").length);
            for (i = 0; i < $(".pncPlayerRow").length; i++) {
                var player_rows = $(".pncPlayerRow");
                var player_stat_arr = player_rows[i].getElementsByClassName("playertableStat");
                var player_game_status = player_rows[i].getElementsByClassName("gameStatusDiv");

                if (!isNaN(parseFloat(player_stat_arr[0].innerText)) && player_game_status[0] && player_game_status[0].innerText.replace(/\s/g, "")) {

                    colorizePlayerRow(player_stat_arr, i);
                }
            }
        }, 200);
    };

    color();

    $(document).on("click", ".games-dates-mod", function(event){
        scoringPeriodID = getUrlParameter($(event.target).parent().find("a")[0].getAttribute("href"), "scoringPeriodId")
        fill_total_stats("myTotal");
        fill_total_stats("oppTotal");
        color();
    });

    $(document).on("click", ".pncButton", function(){
        fill_total_stats("myTotal");
    });
});