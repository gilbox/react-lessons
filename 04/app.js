// 04: Move Comment state back to <App />

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
    var comments = this.state.comments.map(comment =>
        <p>{comment}</p>
    );

    return (
      <div>
        <h1 className='Title'>Leave a comment</h1>

        <InputWidget
          onCommentSubmit={this.handleSubmitComment}
        />

        {comments}
      </div>
    )
  }
});

React.render(<App />, document.getElementById('app'));