'use strict';

// TODO: On smaller screens, the status should either become invisible or be moved down
// TODO: Filter new people to the top???
// TODO: Some sort of a line break between results and controls
// TODO: If search is done with an empty string, don't do anything
// TODO: Make it impossible to add spaces to the search string
// TODO: Empty the input on lost focus
// TODO: Maybe add a circle that displays if the channel is online or offline? Or maybe just display status for all - even for offline

// maybe use a Promise instead?
let channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"],
    requestURL,
    baseURL = 'https://api.twitch.tv/kraken/channels/',
    endURL = '?callback=?',
    profiles,
    $results = $('#results');

function reqListener() {
  console.log(this.responseText);
  a_channelInfo.push(responseText);
}

// Ref: https://api.twitch.tv/kraken/streams?game=StarCraft+II%3A+Heart+of+the+Swarm&channel=test_channel,test_channel2
function buildStream(streamInfo) {
  // arr.forEach(function(streamInfo){
  switch (streamInfo.status) {
    case 422:
    case 404:
      return;
  }

  // if (streamInfo.status == 422) {
  //   // This means that the channel no longer exists. // closed
  //   return; // change this or remove
  // }

    console.log(streamInfo);

    let thumbnailUrl = streamInfo.logo,
        channelUrl = streamInfo.url,
        name = streamInfo.display_name,
        status,
        statusColor,
        statusOnOff;

    if (streamInfo.mature) {
      status = streamInfo.status;
      statusColor = '#0DA574';
      statusOnOff = "online";
    } else {
      status = streamInfo.status; // status = 'Channel Offline'; // add a case for a channel that is no longer active.
      statusColor = '#083358';
      statusOnOff = "offline";
    }

    // let wrapLinkAroundEntry = $('<a href="' +  channelUrl + '" target="_blank"></a>');

    // wrapLinkAroundEntry.wrap(divEntry);
    // Improve this code. // first create then animate show
    let $block = $('<div class="stream-block"></div>');
    let $anchorEl = $('<a href="' + channelUrl + '></a>');
    let $imgEl = $('<img src="' + thumbnailUrl + '" class="channel-logo"/>');
    let $nameEl = $('<p>' + name + '</p>');
    let $statusEl = $('<p>' + status + '</p>');

    // $anchorEl.append([$imgEl, $nameEl, $statusEl]);

    $block.append([$imgEl, $nameEl, $statusEl]).css('background-color', statusColor).addClass(statusOnOff).data('link', thumbnailUrl); // .css('background-color', statusColor).addClass(statusOnOff);

    // $anchorEl.append($block) .css('background-color', statusColor).addClass(statusOnOff);

    $results.append($block);


    // ORIGINAL
    console.log($results);
}

let streamElements = [],
    callURL;

$(document).ready(function() {
  // create tabs

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
        }
      }); // End of getJSON
  });

  // Make sure it only does it after the results came back
  // console.log("code makes it here");
  // buildStreams(profiles);

  let $showAll = $('#show-all'),
      $showOnline = $('#show-online'),
      $showOffline = $('#show-offline'),
      $searchButton = $('#search-button'),
      $searchInput = $('#search-box');

  // Remove placeholder text on search input focus
  $searchInput.on('focus', function() {
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

  $searchInput.on("blur", function() {
    $searchInput.val("");
  });


  function searchDisplayChannel() {
    let searchChannel = $searchInput.val();
    console.log("Searching for the following channel:" + searchChannel);

    // this should be a separate function;
    callURL = baseURL + searchChannel + endURL;
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
