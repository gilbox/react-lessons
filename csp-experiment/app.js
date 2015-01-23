// 11: Spruce things up a big
//      - Add classes for styling
//      - add placeholder
//      - remove pre-filled comments
var ENTER_KEY = 13;

var dispatcher = new simflux.Dispatcher();

// appContext.js
var ctx = window.ctx = Morearty.createContext({
  initialState: {
    comments: [
      //{ comment: 'Hello World', sentiment: 'Neutral'},
      //{ comment: 'This is cool', sentiment: 'Positive'},
      //{ comment: 'F3P is 1337', sentiment: 'Negative'}
    ]
  }
});


// appStore.js
var appBinding = ctx.getBinding();

var appStore = dispatcher.registerStore({
  storeName: 'appStore',

  'submit:comment': function (payload) {
    console.log("submit:comment", payload);
    appBinding.update('comments', comments => comments.concat([Immutable.fromJS(payload.comment)]));
  }
});

// actionCreator.js
var channels = {};
function openChannel(channelName) {
  var channel = channels[channelName] || (channels[channelName] = {
      chan:csp.chan(),
      chanX:csp.chan()
    });

  csp.go(function* () {
    while (true) {
      (yield csp.take(channel.chan))();
      yield csp.take(channel.chanX);
    }
  })
}

function channelPayload(channelName, fn) {
  csp.putAsync(channels[channelName].chan, fn);
}

function channelComplete(channelName) {
  csp.putAsync(channels[channelName].chanX);
}

openChannel('channel');

var actionCreator = dispatcher.registerActionCreator({
  submitCommentChannel: function (payload) {
    superagent
      .post('https://community-sentiment.p.mashape.com/text/')
      .send({ txt: payload.comment })
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('X-Mashape-Key', 'Yz98b1gzTXmsh9luAiHOjwSTzsg9p1HoSs5jsnvdttcO9CbMrY')
      .set('Accept', 'application/json')
      .end(function(error, res){
        var result = res.body.result;
        console.log("Sentiment: ", result);

        dispatcher.dispatch('submit:comment', {
          comment: {
            comment: payload.comment,
            sentiment: result.sentiment
          }
        });

        channelComplete('channel');
      });
  },
  submitComment: function (payload) {
    channelPayload('channel',  () => this.submitCommentChannel(payload));
  }
});

// components/InputWidget.js
var InputWidget = React.createClass({

  handleMsgKeyDown: function (event) {
    if (event.which === ENTER_KEY) {

      event.preventDefault();

      var val = this.refs.inputMsg.getDOMNode().value.trim();

      if (val) {
        this.props.onCommentSubmit(val);

        this.refs.inputMsg.getDOMNode().value = '';
      }
    }
  },

  render: function () {
    return (
      <div className="InputMsg">
        <input
          placeholder="What would you like to say?"
          className="InputMsg-input"
          ref="inputMsg"
          onKeyDown={this.handleMsgKeyDown}
          autoFocus={true}
        />
      </div>
    )
  }
});

// components/CommentList.js
var CommentList = React.createClass({
  mixins: [Morearty.Mixin],
  render: function () {
    var comments = this.getDefaultBinding().get().map((comment, i) =>
      <p key={i} className={'CommentList-item is'+comment.get('sentiment')}> {comment.get('comment')}</p>
    ).toArray();

    return (
      <div className="CommentList">
        {comments}
      </div>
    )
  }
});

// components/App.js
var App = React.createClass({
  mixins: [Morearty.Mixin],
  handleSubmitComment: function (val) {
    actionCreator.submitComment({comment:val});
  },

  render: function () {
    var binding = this.getDefaultBinding();
    console.log(binding);

    return (
      <div>
        <h1 className='Title'>Comments</h1>

        <InputWidget
          onCommentSubmit={this.handleSubmitComment}
        />

        <CommentList binding={binding.sub('comments')} />
      </div>
    )
  }
});

var Bootstrap = ctx.bootstrap(App);
React.render(<Bootstrap />, document.getElementById('app'));