// Immutable Playground:
// http://jsbin.com/tahire/1/edit?js,console,output

function logo(o) {
  console.log(JSON.stringify(o, null, '\t').replace(/"/g, ''));
}

// Create an Immutable Map
var m = Immutable.Map({
  'a': 'one',
  'b': 'two'
});

// Iterate the map using forEach and ES6 features:
// (1) arrow function
// (2) string template
m.forEach((v,k) => console.log(
  `${k}: ${v}`
));

var aVal = m.get('a');
console.log(`the value of a is ${aVal}`);

// create a more complex Immutable object
var m = Immutable.fromJS({
  'a': 'one',
  'b': 'two',
  'nest': {
    x: 'maude',
    y: 'lebowski'
  }
});

// what type of object is the nest property?
var t = m.get('nest').constructor.name;
console.log(`nest is type ${t}`);

// how do we reference nested Immutables?
var v = m.getIn(['nest','x']);
console.log(`m.nest.x is ${v}`);

// Create a Morearty Context
var ctx = Morearty.createContext({
  initialState: m
});

var binding = ctx.getBinding();

var m1 = binding.get();
console.log(`m === m1 is ${m === m1}`);

console.log('does binding.get() 2 times return the same thing?');
var m2 = binding.get();
console.log(`m1 === m2 is ${m1 === m2}`);

binding.set('a', 'xxxxxxxx');

console.log('now does binding.get() return the same thing?');
var m2 = binding.get()
console.log(`m1 === m2 is ${m1 === m2}`);
logo(m1.toJS());
logo(m2.toJS());

console.log('How does Morearty manage state change detection?')
binding.addListener(function() { console.log('i changed!')});

binding.set('a', 'zzzzzz');

logo(binding.toJS());

