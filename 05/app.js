// 05: Create CommentList

var ENTER_KEY = 13;

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
  getInitialState: function () {
    return {
      comments: []
    }
  },

  handleSubmitComment: function (val) {
    console.log("Add New Comment:",val);

    this.setState({
      comments: this.state.comments.concat([val])
    });
  },

  render: function () {

    return (
      <div>
        <h1 className='Title'>Comments</h1>

        <InputWidget
          onCommentSubmit={this.handleSubmitComment}
        />

        <CommentList comments={this.state.comments} />
      </div>
    )
  }
});

React.render(<App />, document.getElementById('app'));