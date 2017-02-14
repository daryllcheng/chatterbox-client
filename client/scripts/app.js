var App = function() {
  this.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';
};

App.prototype.init = function() {
  this.fetch();
  $(document).ready(function() {
    $('.submitButton').on('click', function() {
      var sentMessage = {
        username: window.location.search.slice(10),
        text: document.getElementsByName('messageText')[0].value,
        roomname: $('select option:selected').val()
      };
      console.log(sentMessage)
      App.prototype.send.call(null,sentMessage);
    })
  })
};



App.prototype.send = function(message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message', data);
  }
});
};

App.prototype.fetch = function() {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: this.server,
  type: 'GET',
  data: {'order': '-createdAt'},
  success: function (data) {
    var results = data.results;
    for (var index = 0; index < results.length; index++) {
    App.prototype.renderMessage(results[index]);
    }
    console.log(data)
  },
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message', data);
    return data;
  }
  // console.log(this.server);
});
};

App.prototype.renderMessage = function(message) {
  var username = '<a class="username">' + escapeHtml(message.username) + ': </a>';
  var message = '<span class="messageText">' + escapeHtml(message.text) + '</span>';

  $('#chats').append('<div class="oneMessage">' + username + '<br>' + message + '</div>');
};

App.prototype.clearMessages = function() {
  $('div.oneMessage').remove();
  $('blink').remove();
};

App.prototype.renderRoom = function(room) {
  $('select').html('<option value=' + room + '>' + room + '</option>');

}

App.prototype.handleUsernameClick = function() {
  var friendsArr = []
  var restore = function(friendUsername) {
    friendsArr.push(friendUsername);
  }
}

function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}


var app = new App();
app.init();