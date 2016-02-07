const React = require('react'),
 ReactDOM = require('react-dom'),
 R = require('ramda'),
 moment = require('moment');



let days = R.map((x) => {
  let d = moment().add(x, 'days');
  return {
    o: d,
    day: d.format('D'),
    month: d.format('MMM'),
    dow: d.format('dd'),
    dayofweekidx: Number(d.format('d')) % 6,
    week: Number(d.format('WW')) % 52,
    year: d.format('YYYY')
  }
}, R.range(0, 366)); //[d,d,d,d...]

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

let Day = (props) => <td>{props.day} <span>{props.dow} </span></td>;

let weekday = (x) => (!!x) ? <Day day={x.day} dow={x.dow} /> : <td>&nbsp;</td>;
let Week = ({days}) => <tr>{days.map(weekday)}</tr>;
let FirstWeek = ({days}) => <tr>{padwith(undefined,7,days).map(weekday)}</tr>;

let monthweek = (x) => <Week days={x} />;
let firstmonthweek = (x) => <FirstWeek days={x} />;
let Month = ({weeks}) => { return <div>
  <h4>{weeks[0][0].month}</h4>
  <table className="table">
    {firstmonthweek(R.head(weeks))}
    {R.tail(weeks).map(monthweek)}
  </table>
</div>;};

let yearmonth = (x) => <Month weeks={x} /> ;
let Year = ({months}) => <div><h2>{months[0][0][0].year}</h2> {months.map(yearmonth)}</div>;

let calyear = (x) => <Year months={x} />;
let Calendar = ({ymw}) => <div>{ymw.map(calyear)}</div>

ReactDOM.render(<Calendar ymw={ymw} />, document.body);