import './style.scss';

const React = require('react'),
 ReactDOM = require('react-dom'),
 R = require('ramda'),
 moment = require('moment'),
 Redux = require('redux');



let days = R.map((x) => {
  let d = moment().add(x, 'days');
  return {
    iso: d.format('YYYY-MM-DD'),
    day: d.format('D'),
    month: d.format('MMM'),
    dow: d.format('dd'),
    //dayofweekidx: Number(d.format('d')),
    week: Number(d.format('WW')),
    year: d.format('YYYY')
  }
}, R.range(0, 366)); //[d,d,d,d...]

//unpacks object into array. e.g: o2arr({a:1,b:2}) = [1,2]
let o2arr = (o) => Object.keys(o).map((x) => o[x]);

//groupby 
let gby = R.groupBy((x) => x.year);
let gbm = R.groupBy((x) => x.month);
let gbw = R.groupBy((x) => x.week);

let years = o2arr(gby(days));
let ym = years.map((y) => o2arr(gbm(y) ) );
let ymw = ym.map((y) => y.map((m) => o2arr(gbw(m))))

// console.log(ymw);

let padwith = (o,n,x) =>{
  let res=R.repeat(o,n);
  return x.reduce( (acc,v,i) => {
    acc[(res.length-x.length)+i] = v;
    return acc;
    }, res);
}

let weekdays = "M T W T F S S".split(" ");

//redux store
function counter(state = [], action) {
  switch (action.type) {
  case 'ADD_DAY':
    state.push(action.day);
    return state
  case 'REMOVE_DAY':
    state.splice(state.indexOf(action.day,1))
    return state 
  default:
    return state
  }
}

// Create a Redux store holding the state
// Its API is { subscribe, dispatch, getState }.
let store = Redux.createStore(counter);

let Day = React.createClass({
  getInitialState:function(){
    return {selected:false};
  },
  clickHandler:function(evt){
    //setState is async, so we pass toggle as callback.
    let toggle = () => this.state.selected  
      ? store.dispatch({ type: 'ADD_DAY', day: this.props.iso }) 
      : store.dispatch({ type: 'REMOVE_DAY', day: this.props.iso });
    
    this.setState({selected:!this.state.selected},
               toggle );
  },
  render: function(){
    return <td data-day={this.props.iso} 
             key={this.props.iso} 
             onClick={this.clickHandler} 
             className={this.state.selected ? "selected":"nope"}>
      {this.props.day} 
      <span>
        {this.props.dow} 
      </span>
    </td>;
  }
});
// let Day = (props) => 

let weekday = (x,i) => (!!x) ? <Day day={x.day} dow={x.dow} iso={x.iso} key={x.iso} /> : <td>&nbsp;</td>;
let Week = ({days}) => <tr>{days.map(weekday)}</tr>;
let FirstWeek = ({days}) => <tr>{padwith(undefined,7,days).map(weekday)}</tr>;

let monthweek = (x,i) => <Week days={x} key={i} />;
let firstmonthweek = (x,i) => <FirstWeek days={x} key={i} />;
let Month = ({weeks}) => { return <div>
  <h4>{weeks[0][0].month}</h4>
  <table className="table">
    <tbody>
    {firstmonthweek(R.head(weeks))}
    {R.tail(weeks).map(monthweek)}
    </tbody>
  </table>
</div>;};

let yearmonth = (x,i) => <Month weeks={x} key={i} /> ;
let Year = ({months}) => <div><h2>{months[0][0][0].year}</h2> {months.map(yearmonth)}</div>;


let Reservation = React.createClass({ 
  getInitialState:function(){
    return {days:[]};
  },
  componentWillMount:function(){
    let unsuscribe = store.subscribe(
      () => this.setState({days:store.getState()})
    );
    this.setState({unsuscribe:unsuscribe});
  },
  componentWillUnmount:function(){this.state.unsuscribe()},
  render: function(){
    return <div> your selected days: <pre>  {this.state.days.join(' ')} </pre></div>;
  }
});

let calyear = (x,i) => <Year months={x} key={i} />;
let Calendar = ({ymw}) => <div>
  <Reservation/>
  <div>{ymw.map(calyear)}</div>
</div>


ReactDOM.render(<Calendar ymw={ymw} />, document.getElementById('app'));