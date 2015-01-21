// 01: Create App component

var App = React.createClass({
  render: function () {
    return (
      <div>
        <h1 className='Title'>Comments</h1>
      </div>
    )
  }
});

React.render(<App />, document.getElementById('app'));