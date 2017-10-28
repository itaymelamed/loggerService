function CalculatePrecent(data, value){
  return ((value+0)/(data.Passed + data.Failed + data.Running + data.SentToHub + 0)*100).toFixed(1); 
}

function  GetTestsRuns(){
  return fetch('http://localhost:4000/api/testsRunsIds').then(res => res.json());s
}

function RenderTestRuns(){
  var tests = GetTestsRuns();
  var idCompo = tests.map(test => {
    return (
      <div id="testrun1" className="testrunsids">
      <div className="title">Test Run {test.TestRunId}</div>
      <div className="env details">Env: {test.Env}</div>
      <div className="date details">Date: {test.Date}</div>
      <div className="passed details">Passed: {test.Results.Passed} ( {CalculatePrecent(test.Results, test.Results.Passed)}% )</div>
      <div className="failed details">Failed: {test.Results.Failed} ( {CalculatePrecent(test.Results, test.Results.Failed)}% )</div>
      <div className="running details">Runing: {test.Results.Running}</div>
      <div className="waiting details">Waiting: {test.Results.SentToHub}</div>
      <span className="btn"><button id="1234" onClick={ShowResults(4)}>Show Results</button></span>
    </div>
    )
  })

  return(
    
  )
}

function ShowResults(id){
  setInterval(() => {
    fetch('http://localhost:4000/api/tests?id='+id)
    .then(res => res.json())
    .then(runsJson => {
      var passed = <div>{runsJson.filter(data => data.Result.Passed).map(data => data.TestName)}</div>;
      console.log(passed);
      var failed = <div>{runsJson.filter(data => data.Result.failed).map(data => data.TestName)}</div>;
      var running = <div>{runsJson.filter(data => data.Result.running).map(data => data.TestName)}</div>;
      var waiting = <div>{runsJson.filter(data => data.Result.SentToHub).map(data => data.TestName)}</div>
      return(passed);
    });
      ReactDOM.render(
        <div id="showresults">{passed}</div>,
          document.getElementById('testresults')
        );
  }, 1000);
};

setInterval(() => {
  fetch('http://localhost:4000/api/testsRunsIds')
  .then(res => res.json())
  .then(runsJson => {
    var runs = runsJson.map((test) => {
      return (
        <div id="testrun1" className="testrunsids">
          <div className="title">Test Run {test.TestRunId}</div>
          <div className="env details">Env: {test.Env}</div>
          <div className="date details">Date: {test.Date}</div>
          <div className="passed details">Passed: {test.Results.Passed} ( {CalculatePrecent(test.Results, test.Results.Passed)}% )</div>
          <div className="failed details">Failed: {test.Results.Failed} ( {CalculatePrecent(test.Results, test.Results.Failed)}% )</div>
          <div className="running details">Runing: {test.Results.Running}</div>
          <div className="waiting details">Waiting: {test.Results.SentToHub}</div>
          <span className="btn"><button id="1234" onClick={ShowResults(4)}>Show Results</button></span>
        </div>
      );
    });
    ReactDOM.render(
      <div id="testruns">{runs}</div>,
        document.getElementById('runs')
      );
  });
}, 1000);

