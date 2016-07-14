'use strict';

// TODO: On smaller screens, the status should either become invisible or be moved down
// TODO: Filter new people to the top???
// TODO: Some sort of a line break between results and controls
// TODO: If search is done with an empty string, don't do anything
// TODO: Make it impossible to add spaces to the search string
// #EA5455
// #343434

// maybe use a Promise instead?
let channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404", "2ggaming", "NoahJ456", "Meteos"],
    requestURL,
    baseURL = 'https://api.twitch.tv/kraken/channels/',
    endURL = '?callback=?',
    profiles,
    $results = $('#results'),
    $noSuchChannel = $('#no-such-channel'),
    areMainChannelsLoaded = false;

function reqListener() {
  console.log(this.responseText);
  a_channelInfo.push(responseText);
}

function buildStream(streamInfo) {
  // arr.forEach(function(streamInfo){

    // https://pixabay.com/static/uploads/photo/2013/04/01/21/29/help-99085_960_720.png
    // https://image.freepik.com/free-icon/question-mark-in-a-circle_318-27276.png
    console.log(streamInfo);

    let thumbnailUrl = streamInfo.logo,
        channelUrl = streamInfo.url,
        name = streamInfo.display_name,
        status,
        statusColor,
        statusOnOff;

    if (streamInfo.mature) {
      status = streamInfo.status;
      statusColor = '#8B5D33';
      statusOnOff = "online";
    } else {
      status = streamInfo.status; // status = 'Channel Offline'; // add a case for a channel that is no longer active.
      statusColor = '#91785D';
      statusOnOff = "offline";
    }

    switch (streamInfo.status) {
      case 404:
      case 422:
        thumbnailUrl = "https://image.freepik.com/free-icon/question-mark-in-a-circle_318-27276.png";
        channelUrl = "#";
        var channelNameRegex = /'(.+)'/gi;
        var channelName = streamInfo.message.match(channelNameRegex)[0];
        console.log("$$$ $$$ $$$");
        channelName = channelName.split("");
        channelName = channelName.splice(1, channelName.length-2).join("");
        console.log(channelName);
        name = channelName; // "channel"; // change name
        status = streamInfo.message; // "This channel doesn't exist.";

      default:
        if (thumbnailUrl == null) {
          thumbnailUrl = "https://image.freepik.com/free-icon/question-mark-in-a-circle_318-27276.png";
        }
        if (streamInfo.status == null) {
          status = "User has not specified a status";
        }
    }

    let $block = $('<div class="stream-block"></div>'),
    $anchorEl = $('<a href="' + channelUrl + '" target="_blank"></a>'),
    $imgEl = $('<img src="' + thumbnailUrl + '" class="channel-logo"/>'),
    $nameEl = $('<p class="channel-name">' + name + '</p>'),
    $statusEl = $('<p class="channel-status">' + status + '</p>');

    $anchorEl.append([$imgEl, $nameEl, $statusEl]).addClass("block-anchor"); // .css('background-color',;
    $block.append($anchorEl).css('background-color', statusColor).addClass(statusOnOff).data('link', thumbnailUrl);
    $results.append($block);

    // ORIGINAL
    console.log($results);
}

let $showAll = $('#show-all'),
    $showOnline = $('#show-online'),
    $showOffline = $('#show-offline'),
    $searchButton = $('#search-button'),
    $searchInput = $('#search-box');

let streamElements = [],
    callURL;

$(document).ready(function() {
  var profiles = [];

  channels.forEach(function(channel) {
    // Build up the string
    callURL = baseURL + channel + endURL;
    console.log("URL it sends with is: " + callURL);
    console.log("Testing changes *********");
    //
    $.getJSON(callURL, function(data) {
        console.log(data);
      }).success(function(response) {
        profiles.push(response);
        if (profiles.length == channels.length) {
          displayResults();
          areMainChannelsLoaded = true;
        }
        // areMainChannelsLoaded = true;
      }).error(function(e) {
        console.log("Problem detected: " + e.message);
      });
      // .error(function(e) {
      //   console.log("Error is registered"); // check
      //   $noSuchChannel.slideDown(300);
      // }); // End of getJSON
  });

      // $searchInput = $('input[name=search]');

  // Remove placeholder text on search input focus
  $searchInput.on('focus', function() {
    $noSuchChannel.slideUp(300);
    $searchInput.data('placeholder', $(this).attr('placeholder'))
      .attr('placeholder', '');
  }).on('blur', function() {
    $(this).attr('placeholder', $(this).data('placeholder'));
  });

  // Filter Buttons
  $showAll.on('click', function() {
    $('.highlighted').removeClass('highlighted');
    $(this).addClass('highlighted');

    $('#results div').slideDown(300); // but show them one by one maybe?
  });

  $showOnline.on('click', function() {
    $('.highlighted').removeClass('highlighted'); // test this
    $(this).addClass('highlighted');
    // experiment
    // $('#results div').hide();
    $('#results div').each(function() {
      if ($(this).hasClass('online')) {
        $(this).slideDown(300);
      } else {
        $(this).slideUp(300);
      }
    });
  });

  $showOffline.on('click', function() {
    $('.filter-button').removeClass('highlighted');
    $(this).addClass('highlighted');

    $('#results div').each(function() {
      if ($(this).hasClass('offline')) {
        $(this).slideDown(300);
      } else {
        $(this).slideUp(300);
      }
    });
  });

  $searchButton.on('click', searchDisplayChannel);

  $searchInput.keypress(function(ev) {

    switch (ev.which) {
      case 13:
        searchDisplayChannel();

        /*
      case 32:
        let inputStr = $searchInput.val();
        let inputChars = inputStr.split("");
        inputChars.pop();
        inputChars.join("");

        $searchInput.val(inputChars);
      */

      default:
    }


    if (ev.which == 13) {
      searchDisplayChannel();
      // reorder the results. OR
    }
  });

  // $searchInput.on("blur", function() {
  //   $searchInput.val("");
  // });


  function searchDisplayChannel() {
    // 'search'
    // let $searchInput_updated = $('#search-box');
    $('#search-box').addClass('highlighted');
    let searchChannel = $('#search-box').val();
    console.log("Searching for the following channel:" + searchChannel);

    // this should be a separate function;
    callURL = baseURL + searchChannel + endURL;
    console.log("When adding a channel to the list, the url is: " + callURL);
    $.getJSON(callURL, function(data) {
        console.log(data);
      }).success(function(response) {
        console.log("*********");
        console.log(profiles);

        // if it already exists in the profiles array, don't add it in.
        for (var i = 0; i < profiles.length; i++) {
          console.log("$$$ " + profiles[i].name);
          console.log("$$$" + response);
          if (profiles.name == response) {
            return;
          }
        }

        profiles.push(response); // shift(response);

        console.log("*********");
        console.log(profiles);
        removePreviousResults();
        displayResults();

        /*
        // maybe remove all the previous results
        removePreviousResults(); // change

        profiles.forEach(function(channel) {
          buildStream(channel);
          // channel.on('click', function() {
          //   // go to the site?
          // });
        });
        */


        // displayResults();
        //
        // console.log("Profiles: " + profiles);
        // //console.log(profiles[0]);
        // buildStream(response);
      });

      // bring back the val
      $searchInput.val("");
  }

  function filterOnlineChannelsUp() {
    profiles.sort(function(channel) {
      if (channel.mature) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  function displayResults() {
    // filter
    filterOnlineChannelsUp();

    profiles.forEach(function(channel) {
      buildStream(channel);
      // channel.on('click', function() {
      //   // go to the site?
      // });
    });

  }

  function removePreviousResults() { // ?
    $('.stream-block').remove();
  }

}); // End of document.ready







//
