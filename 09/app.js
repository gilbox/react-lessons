// 09: Refactor App to use Morearty
//      - fix adding comments
//      - add appBinding var
//      - fix appStore's 'submit:comment'

var ENTER_KEY = 13;

var dispatcher = new simflux.Dispatcher();

// appContext.js
var ctx = Morearty.createContext({
  initialState: {
    comments: [
      'Hello World',
      'This is cool',
      'F3P is 1337'
    ]
  }
});


// appStore.js
var appBinding = ctx.getBinding();

var appStore = dispatcher.registerStore({
  storeName: 'appStore',

  'submit:comment': function (payload) {
    console.log("submit:comment", payload);
    appBinding.update('comments', comments => comments.concat([payload.comment]));
  }
});

// actionCreator.js
var actionCreator = dispatcher.registerActionCreator({
  submitComment: function (payload) {
    dispatcher.dispatch('submit:comment', payload);
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
      <div>
        <input
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
      <p key={i}>{comment}</p>
    ).toArray();

    return (
      <div>
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