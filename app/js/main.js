// TODO: Modes: All, Online, Offline
// TODO: Send request to TwitchTV API
// TODO: Ask Annie to help choose the color scheme and think about the design together

// Example Array of Names: ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"]

let channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"];
// maybe use a Promise instead?

// let arr;
let requestURL;
let baseURL = 'https://api.twitch.tv/kraken/streams/';
let endURL = '?callback=?';
let profiles;

function collectChannelInfo() {

}

function reqListener() {
  console.log(this.responseText);
  a_channelInfo.push(responseText);
}

// Ref: https://api.twitch.tv/kraken/streams?game=StarCraft+II%3A+Heart+of+the+Swarm&channel=test_channel,test_channel2


$(document).ready(function() {

  // create tabs


  var profiles = [];

  channels.forEach(function(channel) {
    // Build up the string
    callURL = baseURL + channel + endURL;
    console.log("URL it sends with is: " + callURL);
    //
    $.getJSON(callURL, function(data) {
        console.log(data);

      }).success(function(response) {
        profiles.push(response);
        console.log(profiles);
      }); // End of getJSON
  });
  // Make sure it only does it after the results came back




}); // End of document.ready
/*
function sendTwitchRequest(url) {
  console.log("URL it sends with is: " + url);
  var arr;

  // // Plain JavaScript Version
  // let twitchReq = new XMLHttpRequest();
  // twitchReq.addEventListener('load', reqListener);
  // twitchReq.open('GET', requestURL);
  // twitchReq.send();


  $.getJSON(url, function(data) {
          console.log(data);
        }).success(function(res) {
          arr.push(res);
       });

}

$(document).ready(function() {

  // window.onload = function() {
    for (channel of channels) {
      let requestURL = baseURL + channel + endURL;
      sendTwitchRequest(requestURL);
    }
    console.log(arr);
  // }


});

*/




// do everything after the page has loaded? Or send the requests first? makes sense. then after page loads, display them.
