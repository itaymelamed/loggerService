function  GetTestsRuns(){
  return fetch('http://localhost:4000/api/testsRunsIds').then(res => res.json());
}

function GetResults(testRunId){
  return fetch('http://localhost:4000/api/tests?id=' + testRunId).then(res => res.json());
}

function ShowTest(testNumber, testRunId){
    GetResults(testRunId).then(json => {
    var testResults = json.filter(x => x.TestNumber == testNumber).map(x => x.Result);
    var testSteps = json.filter(x => x.TestNumber == testNumber).map(x => x.Steps);
    var steps = testSteps[0].map((s,i) => {
      return (
        <div key={i} className="step">{i+1+" )" + s}</div>
      )
    })

    var testResultsComp = testResults.map(d => {
      console.log(d.ScrennShot);
      console.log(d);
      return(
        <div id="testdetails-container">
          <div id="testdetails-title"><span id="titlehelper">Test Details</span></div>
          <div className="testdetails-detail">Error Message: {d.ErrorMessage}</div>
          <div className="testdetails-detail">Url: {d.Url}</div>
          <div className="testdetails-detail">Steps: <div>{steps}</div></div>    
          <div id="scrennshot"><img src={testRunId+"/"+testNumber + ".jpg"} id="photo" width="80%" height="400px"/></div>
        </div>
      )
    });

    ReactDOM.render(<div>{testResultsComp}</div>, document.getElementById('testdetails'));
  })
}

function RenderResults(id){
  GetResults(id).then(data => {
    var passedTests = data.filter(d => d.Result.Status == 'Passed').map(result => {
      return(
        <div className="showdetail">{result.TestName} - {result.TestNumber}</div>
      )
    });
    
      var failedTests = data.filter(d => d.Result.Status == 'Failed').map(result => {
        return(
          <div className="showdetail" id="failedtest" onClick={()=> ShowTest(result.TestNumber, id)}>{result.TestName} - {result.TestNumber}</div>
        )
      });

      var runningTests = data.filter(d => d.Result.Status == 'Running').map(result => {
        return(
          <div className="showdetail">{result.TestName} - {result.TestNumber}</div>
        )
      });

      var sentToHubTests = data.filter(d => d.Result.Status == 'SentToHub').map(result => {
        return(
          <div className="showdetail">{result.TestName} - {result.TestNumber}</div>
        )
      });

    ReactDOM.render(
      <div id="show-container">
        <div id="testrunidtitle"><div id="titletest">Test Run: {id}</div></div>
        <div id="helper">
          <div id="passedtitle" className="showTitle">Passed</div>
          <div id="passed-container" className="table">
            {passedTests}
          </div>
          <div id="failedtitle" className="showTitle">Failed</div>  
          <div id="failed-container" className="table">
            {failedTests}
          </div>
          <div id="runningtitle" className="showTitle">Runing</div>  
          <div id="running-container" className="table">
            {runningTests}
          </div>
          <div id="waitingtitle" className="showTitle">Waiting</div>  
          <div id="waiting-container" className="table">
            {sentToHubTests}
          </div>
        </div>
      </div>,
        document.getElementById('show')
      )
    });
  }

function RenderTestRuns(){
  GetTestsRuns().then(data => {
    var idCompo = data.reverse().slice(0, 5).map(test => {
      return (
        <div id="testrun1" className="testrunsids">
          <div className="title">Test Run {test.TestRunId}</div>
          <div className="env details">Env: {test.Env}</div>
          <div className="date details">Date: {test.Date}</div>
          <div className="passed details">Passed: {test.Results.Passed}</div>
          <div className="failed details">Failed: {test.Results.Failed}</div>
          <div className="running details">Runing: {test.Results.Running}</div>
          <div className="waiting details">Waiting: {test.Results.SentToHub}</div>
          <div className="btn"><a onClick={() => RenderResults(test.TestRunId)}>Show Results</a></div>
        </div>
      )
    })

    ReactDOM.render(
      <div id="showresults">{idCompo}</div>,
        document.getElementById('testresults')
      );
  })
}

RenderTestRuns();
setInterval(RenderTestRuns, 5000);