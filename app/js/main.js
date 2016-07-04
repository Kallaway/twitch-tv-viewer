'use strict';

// TODO: Modes: All, Online, Offline
// TODO: On smaller screens, the status should either become invisible or be moved down
// TODO: Color differently based on whether the account is online, offline, or deactivated
// TODO: Filter online people to the top? on press of Online
// TODO: Filter new people to the top?
// TODO: Some sort of a line break between results and controls
// TODO: If search is done with an empty string, don't do anything

// maybe use a Promise instead?
let channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"],
    requestURL,
    baseURL = 'https://api.twitch.tv/kraken/channels/',
    endURL = '?callback=?',
    profiles,
    $results = $('#results');

function collectChannelInfo() {

}

function reqListener() {
  console.log(this.responseText);
  a_channelInfo.push(responseText);
}

// Ref: https://api.twitch.tv/kraken/streams?game=StarCraft+II%3A+Heart+of+the+Swarm&channel=test_channel,test_channel2
function buildStream(streamInfo) {
  // arr.forEach(function(streamInfo){

  if (streamInfo.status == 422) {
    // This means that the channel no longer exists. // closed
    return; // change this or remove
  }

    console.log(streamInfo);

    /* EXAMPLE
    {
      mature: false,
      status: "@dogwaddle working on Pomodoro Timer #Programming #LearningJavaScript ",
      broadcaster_language: "en",
      display_name: "FreeCodeCamp",
      game: "Creative",
      language: "en",
      _id: 79776140,
      name: "freecodecamp",
      created_at: "2015-01-14T03:36:47Z",
      updated_at: "2016-06-29T05:30:53Z",
      delay: null,
      logo: "https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_image-d9514f2df0962329-300x300.png",
      banner: null,
      video_banner: "https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-channel_offline_image-b8e133c78cd51cb0-1920x1080.png",
      background: null,
      profile_banner: "https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_banner-6f5e3445ff474aec-480.png",
      profile_banner_background_color: null,
      partner: false,
      url: "https://www.twitch.tv/freecodecamp",
      views: 153967,
      followers: 9781,
      _links: {
        self: "https://api.twitch.tv/kraken/channels/freecodecamp",
        follows: "https://api.twitch.tv/kraken/channels/freecodecamp/follows",
        commercial: "https://api.twitch.tv/kraken/channels/freecodecamp/commercial",
        stream_key: "https://api.twitch.tv/kraken/channels/freecodecamp/stream_key",
        chat: "https://api.twitch.tv/kraken/chat/freecodecamp",
        features: "https://api.twitch.tv/kraken/channels/freecodecamp/features",
        subscriptions: "https://api.twitch.tv/kraken/channels/freecodecamp/subscriptions",
        editors: "https://api.twitch.tv/kraken/channels/freecodecamp/editors",
        teams: "https://api.twitch.tv/kraken/channels/freecodecamp/teams",
        videos: "https://api.twitch.tv/kraken/channels/freecodecamp/videos"
      }
    }
    */

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
      status = 'Channel Offline'; // add a case for a channel that is no longer active.
      statusColor = '#083358';
      statusOnOff = "offline";
    }


    /*
    let divEntry = $('<a href="' +  channelUrl + '" target="_blank"><div class="stream-block"><img src="' + thumbnailUrl + '" class="channel-logo"/><p>' + name + '</p><p>' + status + '</p></div></a>')
            // .attr({'class': 'stream-block' })
            .children().css('background-color', statusColor)
            .addClass(statusOnOff);
    */

    // let divEntry = $('<div class="stream-block"><img src="' + thumbnailUrl + '" class="channel-logo"/><p>' + name + '</p><p>' + status + '</p></div></a>')
    //         // .attr({'class': 'stream-block' })
    //         .children().css('background-color', statusColor)
    //         .addClass(statusOnOff);
    //
    //
    // let wrapLinkAroundEntry = $('<a href="' +  channelUrl + '" target="_blank"></a>');

    // wrapLinkAroundEntry.wrap(divEntry);
    // Improve this code. // first create then animate show
    $results.append($('<a href="' +  channelUrl + '" target="_blank"><div class="stream-block"><img src="' + thumbnailUrl + '" class="channel-logo"/><p>' + name + '</p><p>' + status + '</p></div></a>')
            // .attr({'class': 'stream-block' })
            .children().css('background-color', statusColor)
            .addClass(statusOnOff)
            // .wrapInner($('<a href="' +  channelUrl + '" target="_blank"></a>'))
          );

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
    $('#results div').slideDown(300); // but show them one by one maybe?
  });

  $showOnline.on('click', function() {
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
    if (ev.which == 13) {
      searchDisplayChannel();
      // reorder the results. OR
    }
  });

  function searchDisplayChannel() {
    let searchChannel = $searchInput.val();

    console.log("Searching for the following channel:" + searchChannel);

    // this should be a separate function;
    callURL = baseURL + searchChannel + endURL;
    $.getJSON(callURL, function(data) {
        console.log(data);

      }).success(function(response) {
        profiles.shift(response);
        console.log("Profiles: " + profiles);
        //console.log(profiles[0]);
        buildStream(response);
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


}); // End of document.ready







//
