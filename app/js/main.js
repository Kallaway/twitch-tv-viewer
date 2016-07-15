'use strict';

let channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404", "2ggaming", "NoahJ456", "Meteos"],
    requestURL,
    baseURL = 'https://api.twitch.tv/kraken/channels/',
    endURL = '?callback=?',
    profiles,
    $results = $('#results'),
    $noSuchChannel = $('#no-such-channel'),
    areMainChannelsLoaded = false;

function reqListener() {
  a_channelInfo.push(responseText);
}

function buildStream(streamInfo) {
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
      status = streamInfo.status;
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
        channelName = channelName.split("");
        channelName = channelName.splice(1, channelName.length-2).join("");
        name = channelName;
        status = streamInfo.message;

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

    $anchorEl.append([$imgEl, $nameEl, $statusEl]).addClass("block-anchor");
    $block.append($anchorEl).css('background-color', statusColor).addClass(statusOnOff).data('link', thumbnailUrl);
    $results.append($block);
}

let $showAll = $('#show-all'),
    $showOnline = $('#show-online'),
    $showOffline = $('#show-offline'),
    $searchButton = $('#search-button'),
    $searchInput = $('#search-box'),
    streamElements = [],
    callURL;

$(document).ready(function() {
  var profiles = [];

  channels.forEach(function(channel) {
    callURL = baseURL + channel + endURL;
    $.getJSON(callURL, function(data) {
        console.log(data);
      }).success(function(response) {
        profiles.push(response);
        if (profiles.length == channels.length) {
          displayResults();
          areMainChannelsLoaded = true;
        }
      }).error(function(e) {
        console.log("Problem detected: " + e.message);
      });
  });

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

    $('#results div').slideDown(300);
  });

  $showOnline.on('click', function() {
    $('.highlighted').removeClass('highlighted');
    $(this).addClass('highlighted');
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
      default:
    }
  });

  function searchDisplayChannel() {
    $('#search-box').addClass('highlighted');
    let searchChannel = $('#search-box').val();
    console.log("Searching for the following channel:" + searchChannel);

    callURL = baseURL + searchChannel + endURL;
    console.log("When adding a channel to the list, the url is: " + callURL);
    $.getJSON(callURL, function(data) {
        console.log(data);
      }).success(function(response) {

        // if it already exists in the profiles array, don't add it in.
        for (var i = 0; i < profiles.length; i++) {
          if (profiles.name == response) {
            return;
          }
        }

        profiles.push(response);
        removePreviousResults();
        displayResults();
      });

      // bring back the value
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
    filterOnlineChannelsUp();

    profiles.forEach(function(channel) {
      buildStream(channel);
    });

  }

  function removePreviousResults() {
    $('.stream-block').remove();
  }

});







//
