// 03: Create InputWidget and refactor

var ENTER_KEY = 13;

var InputWidget = React.createClass({

  getInitialState: function () {
    return {
      comments: []
    }
  },

  handleMsgKeyDown: function (event) {
    if (event.which === ENTER_KEY) {

      event.preventDefault();

      var val = this.refs.inputMsg.getDOMNode().value.trim();

      if (val) {
        console.log("Add New Comment:",val);

        this.setState({
          comments: this.state.comments.concat([val])
        });

        this.refs.inputMsg.getDOMNode().value = '';
      }
    }
  },

  render: function () {
    var comments = this.state.comments.map(comment =>
        <p>{comment}</p>
    );

    return (
      <div>
        <input
          ref="inputMsg"
          onKeyDown={this.handleMsgKeyDown}
          autoFocus={true}
        />
        {comments}
      </div>
    )
  }
});

var App = React.createClass({
  render: function () {
    return (
      <div>
        <h1 className='Title'>Comments</h1>

        <InputWidget />
      </div>
    )
  }
});

React.render(<App />, document.getElementById('app'));