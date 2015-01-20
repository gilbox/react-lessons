// 07: Refactor App to use Flux
//      - handleSubmitComment refactor

var ENTER_KEY = 13;

var dispatcher = new simflux.Dispatcher();

var appStore = dispatcher.registerStore({
  storeName: 'appStore',
  comments: [],

  'submit:comment': function (payload) {
    console.log("submit:comment", payload);
    this.comments.push(payload.comment);
  }
});

var actionCreator = dispatcher.registerActionCreator({
  submitComment: function (payload) {
    dispatcher.dispatch('submit:comment', payload);
  }
});

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

var CommentList = React.createClass({
  render: function () {
    var comments = this.props.comments.map((comment, i) =>
      <p key={i}>{comment}</p>
    );

    return (
      <div>
        {comments}
      </div>
    )
  }
});

var App = React.createClass({
  handleSubmitComment: function (val) {
    actionCreator.submitComment({comment:val});
    this.forceUpdate(); // @todo
  },

  render: function () {

    return (
      <div>
        <h1 className='Title'>Leave a comment</h1>

        <InputWidget
          onCommentSubmit={this.handleSubmitComment}
        />

        <CommentList comments={appStore.comments} />
      </div>
    )
  }
});

React.render(<App />, document.getElementById('app'));