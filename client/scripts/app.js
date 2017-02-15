var roomList = [];
var App = function() {
  this.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages'
  this.messages = [];
  this.lastMessageId = 0;
  this.roomname = 'lobby';
  this.friends = {};
};

App.prototype.init = function() {
  var context = this;
  $('#send').on('submit', App.prototype.handleSubmit.bind(context));
  $('#roomSelect').on('change', App.prototype.handleRoomChange.bind(context));
  context.fetch();

  var context = this;
// setTimeout(function() {
//   context.clearMessages();
//   context.fetch();
// }, 10000)
};

App.prototype.send = function(message) {
  var context = this;
  console.log('send', context);
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
    $('#message').val('');
    console.log('success send try to call fetch', context)
    context.fetch();
  },
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message', data);
  }
});
};

App.prototype.fetch = function() {
  var context = this;
  console.log('fetch', context);
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
  type: 'GET',
  data: {'order': '-createdAt'},
  success: function (data) {
    console.log(data.results);
    var results = data.results;
    if (!results || !results.length) {
      return;
    }
    context.messages = results;
    var lastMessage = results[results.length - 1];

    if (lastMessage.objectId !== context.lastMessageId) {
      context.createRooms(results);
      context.renderMessages(results);
      context.lastMessageId = lastMessage.objectId;
    }
    },
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message', data);
    return data;
  }
  // console.log(this.server);
});
};

App.prototype.renderMessages = function(messages) {
  var context = this;
  console.log('rendermessage this', this);
  context.clearMessages();
  messages.filter(function(message) {
    return messages.roomname === context.roomname || context.roomname === 'lobby' && !message.roomname;
  }).forEach(context.renderMessage.bind(context));
};

App.prototype.renderMessage = function(message) {
  var context = this;
  console.log('renderMessageS', this);
  if (!message.roomname) {
    message.roomname = 'lobby';
  }
   var $chat = $('<div class="chat"/>');
  var $username = $('<span class="username"/>');
  $username.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);

  // if (context.friends[message.username] === true) {
  //     $username.addClass('friend');
  //   }

    var $message = $('<br><span/>');
    $message.text(message.text).appendTo($chat);

    // Add the message to the UI
    $('#chats').append($chat);
};

    // var username = '<a class="username">' + escapeHtml(message.username) + ': </a>';
    // var message = '<span class="messageText" id="message">' + escapeHtml(message.text) + '</span>';

    // $('#chats').append('<div class="oneMessage">' + username + '<br>' + message + '</div>');

App.prototype.clearMessages = function() {
  $('#chats').html('');
  // $('div.oneMessage').remove();
  // $('blink').remove();
};

App.prototype.renderRoom = function(obj) {
  obj.roomname = obj.roomname || "";
  var roomname = escapeHtml(obj.roomname);
  if (roomList.indexOf(roomname) === -1) {
    roomList.push(roomname);
    $('select').append('<option value=' + roomname + '>' + roomname + '</option>');
  }
  
}

App.prototype.createRooms = function(messages) {
  //$('#roomSelect').html('<option value="newRoom">New room...</option>');
  if (messages) {
    var rooms = {};
    var context = this;
    console.log('createRoom', context);
    messages.forEach(function(message) {
      context.renderRoom(message);
    });
  }
  $('#roomSelect').val(context.roomname);
}

App.prototype.handleUsernameClick = function() {
  var friendsArr = []
  var restore = function(friendUsername) {
    friendsArr.push(friendUsername);
  }
}

App.prototype.handleSubmit = function(event) {
   event.preventDefault();
   var sentMessage = {
    username: window.location.search.slice(10),
    //text: document.getElementsByName('messageText')[0].value,
    text: $('#message').val(),
    roomname: $('select option:selected').val() || 'lobby'
  };
  console.log("handleSubmit calling")
  App.prototype.send(sentMessage);
 
}

App.prototype.handleRoomChange = function(event) {
  var context = this;
  var selectIndex = $('#roomSelect').prop('selectedIndex');
  
  if (selectIndex === 0) {
    var roomname = prompt('Enter room name');
    if (roomname) {
      context.roomname = roomname;
      $('select').append('<option value=' + roomname + '>' + roomname + '</option>');
      $('#roomSelect').val(roomname);
    }
  } else {
    context.roomname = $('#roomSelect').val();
    App.prototype.renderMessage(context.messages);
  }
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
