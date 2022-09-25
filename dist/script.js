//Importing modules
const { Provider, connect } = ReactRedux;
const {
  applyMiddleware,
  createStore,
  combineReducers,
  bindActionCreators } =
Redux;


const alertStyle = { color: "red" };
const normalStyle = { color: "black" };

const timePeriod = 1000; //set 1000 for 1s movement

const defaultSessionLength = 25;
const defaultBreakLength = 5;

function formatString(num) {
  if (num < 10) {
    return "0" + num;
  }
  return num;
}

const defaultTimerState = {
  seconds: "00",
  timer: true,
  sessionOver: true };



const defaultState = {
  minutes: formatString(defaultSessionLength),
  seconds: "00",
  timer: true,
  breakLength: defaultBreakLength,
  sessionLength: defaultSessionLength,
  sessionOver: true };


//action types 

const BREAK = "change_break";
const SESSION = "change_session";
const MINUTES = "change_minutes";


//action creators 

let changeBreak = data => {
  return {
    type: BREAK,
    payload: data };

};



let changeSession = data => {
  return {
    type: SESSION,
    payload: data };

};

let changeMinutes = data => {
  return {
    type: MINUTES,
    payload: data };

};


//reducers

let breakReducer = function (state = defaultBreakLength, action) {
  switch (action.type) {
    case BREAK:
      return action.payload;
    default:
      return state;}

};

let sessionReducer = function (state = defaultSessionLength, action) {
  switch (action.type) {
    case SESSION:
      return action.payload;
    default:
      return state;}

};

let minuteReducer = function (state = defaultSessionLength, action) {
  switch (action.type) {
    case MINUTES:
      return action.payload;
    default:
      return state;}

};


// root reducers

const rootReducer = combineReducers({
  break: breakReducer,
  session: sessionReducer,
  stateMinutes: minuteReducer });


//create store 
let store = createStore(rootReducer);



class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultTimerState;

    let intervalID = -1;
    this.secondChange = this.secondChange.bind(this);
    this.secondReduce = this.secondReduce.bind(this);
    this.minuteChange = this.minuteChange.bind(this);
    this.resetTime = this.resetTime.bind(this);
    this.sessionSwitch = this.sessionSwitch.bind(this);
    this.timeFormat = this.timeFormat.bind(this);


  }

  secondReduce() {
    this.setState({
      seconds: this.state.seconds - 1 });

    this.sessionSwitch();
    this.minuteChange();

    this.timeFormat();

  }

  // make single digit numbers appear as double digit with first digit zero.
  timeFormat() {
    if (this.state.seconds < 10) {
      this.setState({
        seconds: "0" + this.state.seconds });

    }
    if (this.props.minutes < 10 && this.state.seconds == 59) {
      this.props.submitMinutes("0" + this.props.minutes);
      // this.setState({
      //   minutes: "0" + this.props.minutes
      // });
    }
  }

  secondChange() {
    if (this.state.timer) {
      this.intervalID = setInterval(this.secondReduce, timePeriod);
      this.setState({ timer: !this.state.timer });
    } else
    {
      clearInterval(this.intervalID);
      this.setState({ timer: !this.state.timer });
    }
  }

  minuteChange() {
    if (this.state.seconds < 0) {
      this.props.submitMinutes(this.props.minutes - 1);
      this.setState({
        seconds: 59 });

    }

  }

  sessionSwitch() {
    if (this.props.minutes == 0 && this.state.seconds == -1) {
      if (this.state.sessionOver) {
        var audioSound = document.getElementById("beep");
        audioSound.play();
        this.props.submitMinutes(formatString(this.props.breakLength));
        console.log("audio");
        this.setState({
          seconds: 0,
          sessionOver: false });

      } else
      {
        var audioSound = document.getElementById("beep");
        this.props.submitMinutes(formatString(this.props.sessionLength));
        audioSound.play();
        console.log("audio");
        this.setState({
          seconds: 0,
          sessionOver: true });

      }
    }
  }



  resetTime() {
    this.setState(defaultTimerState);
    clearInterval(this.intervalID);
    var audioSound = document.getElementById("beep");
    audioSound.load();
    this.props.submitBreak(defaultBreakLength);
    this.props.submitSession(defaultSessionLength);
    this.props.submitMinutes(defaultSessionLength);
  }

  render() {
    console.log(this.props.minutes, this.state.seconds);
    return /*#__PURE__*/(
      React.createElement("div", { id: "timer-main-container" }, /*#__PURE__*/
      React.createElement("div", { id: "timer-container", style: this.props.minutes == 0 ? alertStyle : normalStyle }, /*#__PURE__*/
      React.createElement("p", { id: "timer-label" }, this.state.sessionOver ? "Session" : "Break"), /*#__PURE__*/
      React.createElement("p", { id: "time-left" },
      this.props.minutes, ":", this.state.seconds)), /*#__PURE__*/


      React.createElement(Beep, null), /*#__PURE__*/
      React.createElement("button", { id: "start_stop", onClick: this.secondChange },
      this.state.timer ? /*#__PURE__*/React.createElement("i", { className: "fa fa-play control-icons icons" }) : /*#__PURE__*/React.createElement("i", { className: "fa fa-pause control-icons icons" }), " "), /*#__PURE__*/
      React.createElement("button", { id: "reset", onClick: this.resetTime }, /*#__PURE__*/
      React.createElement("i", { className: "fa fa-rotate control-icons icons" }))));

  }}


const Beep = () => {
  return /*#__PURE__*/React.createElement("audio", { preload: "auto", id: "beep", src: "https://fsa.zobj.net/download/bYTH9OHh6bQR5L_z-yFXeXnQbco_8A8OL_jwSuZbHdCAtYqmu9c75Q30RFXKGOWUVhS8HehddCRbC9B8cuvLUchtspefEs2zH03Lijw3EKbtFgV1bWWaNVNOpJvg/?a=&c=72&f=beep_alarm.mp3&special=1664099693-QgyKMF0svln0iGlzvvdaNy1t31ZDBn3k5ne%2F7vgSLso%3D" });
};



class Break extends React.Component {
  constructor(props) {
    super(props);
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
  }

  handleIncrement() {
    if (this.props.breakLength < 60) {
      this.props.submitBreak(this.props.breakLength + 1);
    }

  }

  handleDecrement() {
    if (this.props.breakLength > 1) {
      this.props.submitBreak(this.props.breakLength - 1);
    }
  }


  render() {

    return /*#__PURE__*/(
      React.createElement("div", { id: "break-container" }, /*#__PURE__*/

      React.createElement("p", { id: "break-label" }, "Break Length"), /*#__PURE__*/
      React.createElement("div", { id: "break-controls" }, /*#__PURE__*/
      React.createElement("button", { id: "break-increment", onClick: this.handleIncrement }, /*#__PURE__*/React.createElement("i", { className: "fa fa-arrow-up arrows " })), /*#__PURE__*/
      React.createElement("p", { id: "break-length" }, this.props.breakLength, " "), /*#__PURE__*/
      React.createElement("button", { id: "break-decrement", onClick: this.handleDecrement }, /*#__PURE__*/React.createElement("i", { className: "fa fa-arrow-down arrows " })))));




  }}



class Session extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: defaultSessionLength };

    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
  }

  handleIncrement() {
    if (this.props.sessionLength < 60) {
      this.props.submitSession(this.props.sessionLength + 1);
      this.props.submitMinutes(this.props.sessionLength + 1);
    }

  }

  handleDecrement() {
    if (this.props.sessionLength > 1) {
      this.props.submitMinutes(this.props.sessionLength - 1);
      this.props.submitSession(this.props.sessionLength - 1);
    }
  }


  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "session-container" }, /*#__PURE__*/
      React.createElement("p", { id: "session-label" }, "Session Length"), /*#__PURE__*/
      React.createElement("div", { id: "session-controls" }, /*#__PURE__*/
      React.createElement("button", { id: "session-increment", onClick: this.handleIncrement }, /*#__PURE__*/React.createElement("i", { className: "fa fa-arrow-up arrows icons" })), /*#__PURE__*/
      React.createElement("p", { id: "session-length" }, this.props.sessionLength, " "), /*#__PURE__*/
      React.createElement("button", { id: "session-decrement", onClick: this.handleDecrement }, /*#__PURE__*/React.createElement("i", { className: "fa fa-arrow-down arrows icons" })))));




  }}


// map state to props 
let mapStateToProps = state => {
  return {
    breakLength: state.break,
    sessionLength: state.session,
    minutes: state.stateMinutes };

};

//map dispatch to props

let mapDispatchToProps = dispatch => {
  return {
    submitBreak: data => {
      return dispatch(changeBreak(data));
    },
    submitSession: data => {
      return dispatch(changeSession(data));
    },
    submitMinutes: data => {
      return dispatch(changeMinutes(data));
    } };


};

const BreakContainer = connect(mapStateToProps, mapDispatchToProps)(Break);
const SessionContainer = connect(mapStateToProps, mapDispatchToProps)(Session);
const TimerContainer = connect(mapStateToProps, mapDispatchToProps)(Timer);

const ProjectName = () => {
  return /*#__PURE__*/(
    React.createElement("h1", { id: "project-name" }, "25 + 5 Clock"));

};

const Developer = () => {
  return /*#__PURE__*/(
    React.createElement("p", { id: "developer" }, "Coded by Sathish"));

};

const Attribution = () => {
  return /*#__PURE__*/(
    React.createElement("p", { id: "attribution" }, "This site is an exact replica of '25+5' clock on freeCodeCamp at the URL: ", /*#__PURE__*/React.createElement("a", { href: "https://codepen.io/freeCodeCamp/full/XpKrrW" }, "https://codepen.io/freeCodeCamp/full/XpKrrW"), " and was done as a part of coursework of ", /*#__PURE__*/React.createElement("a", { href: "https://www.freecodecamp.org/learn/front-end-development-libraries" }, "Frontend development libraries"), " on freeCodeCamp."));

};

class App extends React.Component {

  render() {
    return /*#__PURE__*/(
      React.createElement(Provider, { store: store }, /*#__PURE__*/
      React.createElement("div", { id: "app-background" }, /*#__PURE__*/
      React.createElement(ProjectName, null), /*#__PURE__*/
      React.createElement("div", { id: "time-length-controls" }, /*#__PURE__*/
      React.createElement(BreakContainer, null), /*#__PURE__*/
      React.createElement(SessionContainer, null)), /*#__PURE__*/

      React.createElement(TimerContainer, null), /*#__PURE__*/
      React.createElement(Developer, null), /*#__PURE__*/
      React.createElement(Attribution, null))));



  }}



//render to dom
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));