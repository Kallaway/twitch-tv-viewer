// TODO: Modes: All, Online, Offline
// TODO: Send request to TwitchTV API
// TODO: Ask Annie to help choose the color scheme and think about the design together

console.log("AAAAAAAAA");
// Example Array of Names: ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"]

let channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"];
// maybe use a Promise instead?

// let arr;
let requestURL;
let baseURL = 'https://api.twitch.tv/kraken/streams/';
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
    // This means that the channel no longer exists.
    return;
  }

  if (streamInfo.stream !== null) {
    console.log(streamInfo);

    let block = $('<div>');
    block.addClass('stream-block');

    let thumbnailUrl = streamInfo.stream.preview.small;
    // let d_thumbnail = $('div').attr("src", thumbnailUrl);

    let viewerCount = streamInfo.stream.viewers;
    // let d_viewer = $('p').text("Viewers: " + viewerCount);

    let game = streamInfo.stream.game;
    // let d_p = $('p');
    // d_p.text(game);

    // block.append(d_thumbnail);
    // block.append(d_p);
    // block.append(d_viewer);

    console.log("Appending this to results: " + block);


    console.log("LALALALALALALALAL");

    // streamElements.push(block);
    // OR
    block = $('div').attr('class', 'stream-block')
      .html('<img src="' + thumbnailUrl + '" /><p>' + game + '</p><p>' + viewerCount + '</p>');

    console.log($results);
    block.appendTo($results);

    // $results.append('<div>', {'class': 'stream-block'})
    //   .append('<img>', {'src': thumbnailUrl})
    //   .append('<p>', {text: game})
    //   .append('<p>', {text: "Viewers: " + viewerCount});

      //
      // $(function() {
      //      $.each(widgets, function(i, item) {
      //          $('<div>').attr('id', item.div.id).html(
      //          $('<h1>').attr('class', item.h1.class).html(
      //          $('<a>').attr({
      //              'href' : item.a.href,
      //              'class' : item.a.class
      //          }).text(item.a.text))).appendTo('#container');
      //      });
      //  });

    // $results.append(block);
  }

    // $results.append(block);
  //
  // });
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
