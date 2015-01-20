var ENTER_KEY = 13;

var App = React.createClass({

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
        <h1 className='Title'>Leave a comment</h1>

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

React.render(<App />, document.getElementById('app'));