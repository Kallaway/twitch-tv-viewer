// TODO: Modes: All, Online, Offline
// TODO: Send request to TwitchTV API
// TODO: Ask Annie to help choose the color scheme and think about the design together
// TODO: On smaller screens, the status should either become invisible or be moved down
// TODO: Color differently based on whether the account is online, offline, or deactivated
// TODO: Animate adding blocks to the page

let channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"];
// maybe use a Promise instead?

let requestURL;
let baseURL = 'https://api.twitch.tv/kraken/channels/';
let endURL = '?callback=?';
let profiles;

let $results = $('#results');

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
    // let block = $('<div>');
    // block.addClass('stream-block');

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

    let thumbnailUrl = streamInfo.logo;
    let channelUrl = streamInfo.url; // use later
    let name = streamInfo.display_name;
    let status;
    let statusColor;

    /*
    $online-bg: #FD367E;
    $offline-bg: #0E1555;
    */

    if (streamInfo.mature) {
      status = streamInfo.status;
      statusColor = '#FD367E';
    } else {
      status = 'Channel Offline'; // add a case for a channel that is no longer active.
      statusColor = '#0E1555';
    }

    // Improve this code.
    $results.append($('<div><a href="' + channelUrl +  '" target="_blank"><img src="' + thumbnailUrl + '" class="channel-logo"/></a><a href="' + channelUrl +  '"><p>' + name + '</p></a><p>' + status + '</p></div>')
            .attr({'class': 'stream-block' }).css('background-color', statusColor)
          );

    console.log($results);

}

let streamElements = [];
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
        //console.log(profiles[0]);
        buildStream(response);
      }); // End of getJSON

    // if (profiles.length == channels.length-1) {// change to something else

    // }
    // check if the profiles array is the same length
  });
  // Make sure it only does it after the results came back
  // console.log("code makes it here");
  // buildStreams(profiles);

}); // End of document.ready
