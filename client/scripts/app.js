var App = function() {
  this.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';
};

App.prototype.init = function() {
  this.fetch();
};

App.prototype.send = function(message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: this.server,
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
  success: function (data) {
    var results = data.results;
    for (var index = 0; index < results.length; index++) {
    App.prototype.renderMessage(results[index]);
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

App.prototype.renderMessage = function(message) {
  var username = '<a>' + message.username + '</a>';
  var message = '<span>' + message.text + '</span>';

  $('#chats').append('<div>' + username + message + '</div>');
};

App.prototype.clearMessages = function() {
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

var app = new App();
app.init();