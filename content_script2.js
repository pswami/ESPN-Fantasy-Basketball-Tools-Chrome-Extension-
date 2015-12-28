///**
// * Created by Swami on 12/26/15.
// */
//
//
//var offVsDefTeams = [];
//
//function colorizeBox (player_stat_arr, teamPlayingAgainst, stat_name, column_num, position) {
//
//    var BLKtable = offVsDefTeams.filter(function (x) {
//        return position == x.position;
//    });
//    BLKtable = sortIncToDec(BLKtable, stat_name);
//
//    //console.log("am: " + BLKtable.length);
//    var num = BLKtable.map(function(x) {return x.name; }).indexOf(teamPlayingAgainst);
//
//    //console.log(teamPlayingAgainst + " " + getColorLevel(num));
//    $(player_stat_arr[column_num]).css({"background" : getColorLevel(num), "color" : "white"});
//}
//
//function getUrlParameter(url, sParam) {
//    var sPageURL = decodeURIComponent(url.substring(1)),
//        sURLVariables = sPageURL.split('&'),
//        sParameterName,
//        i;
//
//    for (i = 0; i < sURLVariables.length; i++) {
//        sParameterName = sURLVariables[i].split('=');
//
//        if (sParameterName[0] === sParam) {
//            return sParameterName[1] === undefined ? true : sParameterName[1];
//        }
//    }
//};
//
////Greatest to Smallest
//function sortIncToDec (arr, s) {
//    return arr.sort(function(a, b) {
//        if (eval('a.' + s) > eval('b.' + s))
//        {
//            return -1;
//        }
//        if (eval('a.' + s) < eval('b.' + s)) {
//            return 1;
//        }
//        return 0;
//    });
//}
//
//function getColorLevel (num) {
//    if (num >= 0 && num <= 5) {
//        return "#006600";
//    } else  if (num >= 6 && num <= 11) {
//        return "#72C926";
//    } else  if (num >= 12 && num <= 17) {
//        return "#C6C625";
//    } else  if (num >= 18 && num <= 23) {
//        return "#C67625";
//    } else {
//        return "#C42525";
//    }
//}
//
//var team_abbr_dict = {
//    "Atl" : "Atlanta Hawks",
//    "Bos" : "Boston Celtics",
//    "Bkn" : "Brooklyn Nets",
//    "Cha" : "Charlotte Hornets",
//    "Chi" : "Chicago Bulls",
//    "Cle" : "Cleveland Cavaliers",
//    "Dal" : "Dallas Mavericks",
//    "Den" : "Denver Nuggets",
//    "Det" : "Detroit Pistons",
//    "GS" : "Golden State Warriors",
//    "Hou" : "Houston Rockets",
//    "Ind" : "Indiana Pacers",
//    "LAC" : "Los Angeles Clippers",
//    "LAL" : "Los Angeles Lakers",
//    "Mem" : "Memphis Grizzlies",
//    "Mia" : "Miami Heat",
//    "Mil" : "Milwaukee Bucks",
//    "Min" : "Minnesota Timberwolves",
//    "Nor" : "New Orleans Pelicans",
//    "NY" : "New York Knicks",
//    "OKC" : "Oklahoma City Thunder",
//    "Orl" : "Orlando Magic",
//    "Phi" : "Philadelphia 76ers",
//    "Pho" : "Phoenix Suns",
//    "Por" : "Portland Trail Blazers",
//    "Sac" : "Sacramento Kings",
//    "SA" : "San Antonio Spurs",
//    "Tor" : "Toronto Raptors",
//    "Uta" : "Utah Jazz",
//    "Wsh" : "Washington Wizards"
//};
//
//function getOffDefData (position, statPeriod) {
//    $.get("http://www.rotowire.com/daily/nba/defense-vspos.htm?pos=" + position + "&statview=" + statPeriod, function (data, status) {
//        $(data).ready(function() {
//
//            var parse_stats = function () {
//                for (i = 0; i < 30; i++) {
//                    var team = {
//                        name: $(data).find('tbody tr:eq(' + i + ') td:eq(0)').text(),
//                        position: position,
//                        PTS:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(5)').text()),
//                        REB:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(6)').text()),
//                        OREB:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(6)').text()),
//                        AST:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(7)').text()),
//                        STL:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(8)').text()),
//                        BLK:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(9)').text()),
//                        THREE_PM:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(10)').text()),
//                        FG_pct:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(11)').text()),
//                        FT_pct:parseFloat($(data).find('tbody tr:eq(' + i + ') td:eq(12)').text())
//                    };
//
//                    offVsDefTeams.push(team);
//                }
//            };
//
//            parse_stats();
//            console.log(offVsDefTeams.length);
//            //
//            //sortIncToDec("BLK");
//            //console.log(offVsDefTeams[0].name + " " + offVsDefTeams[0].PTS + " " + offVsDefTeams[29].name + " " + offVsDefTeams[29].PTS);
//
//        });
//    }, "html");
//}
//
//function colorizePlayerRow (player_stat_arr, row_num) {
//
//    var tdLength = $('.pncPlayerRow:eq(' + row_num + ') td').length;
//    console.log("TDs " + tdLength);
//
//    var teamPlayingAgainst = team_abbr_dict[$('.pncPlayerRow:eq(' + row_num + ') td:eq(' + (tdLength - 19) + ') a').text().replace("@", "")];
//    var pos = $('.pncPlayerRow:eq(' + row_num + ') td:eq(1)').text();
//    var posStartIdx = pos.search("\u00A0") + 1;
//    pos = pos.substr(posStartIdx, 2).replace(",", "");
//
//    colorizeBox (player_stat_arr, teamPlayingAgainst, 'FG_pct', 2, pos);
//    colorizeBox (player_stat_arr, teamPlayingAgainst, 'FT_pct', 4, pos);
//    colorizeBox (player_stat_arr, teamPlayingAgainst, 'THREE_PM', 5, pos);
//    colorizeBox (player_stat_arr, teamPlayingAgainst, 'OREB', 6, pos);
//    colorizeBox (player_stat_arr, teamPlayingAgainst, 'REB', 7, pos);
//    colorizeBox (player_stat_arr, teamPlayingAgainst, 'AST', 8, pos);
//    colorizeBox (player_stat_arr, teamPlayingAgainst, 'STL', 9, pos);
//    colorizeBox (player_stat_arr, teamPlayingAgainst, 'BLK', 10, pos);
//    colorizeBox (player_stat_arr, teamPlayingAgainst, 'PTS', 11, pos);
//}
//
//getOffDefData("PG", "");
//getOffDefData("SG", "");
//getOffDefData("PF", "");
//getOffDefData("SF", "");
//getOffDefData("C", "");
//
//
//
//$(document).ready(function() {
//    setTimeout(function() {
//        for (i = 0; i < 14; i++) {
//            var player_rows = $(".pncPlayerRow");
//            var player_stat_arr = player_rows[i].getElementsByClassName("playertableStat");
//            var player_game_status = player_rows[i].getElementsByClassName("gameStatusDiv");
//
//            if (!isNaN(parseFloat(player_stat_arr[0].innerText)) && player_game_status[0] && player_game_status[0].innerText.replace(/\s/g, "")) {
//
//                colorizePlayerRow(player_stat_arr, i);
//            }
//        }
//    }, 5000);
//});