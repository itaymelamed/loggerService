var intervaliD = -2;

function  GetTestsRuns(){
  return fetch('https://automation-center.minutemediaservices.com/api/testsRunsIds').then(res => res.json());
}

function GetResults(testRunId){
  return fetch('https://automation-center.minutemediaservices.com/api/tests?id=' + testRunId).then(res => res.json());
}

function ShowTest(testNumber, testRunId, testName){
    GetResults(testRunId).then(json => {
    var testResults = json.filter(x => x.TestNumber == testNumber).map(x => x.Result);
    var testSteps = json.filter(x => x.TestNumber == testNumber).map(x => x.Steps);
    var testStat = testResults[0].Status == "Failed";
    if (testStat){
      var lastStep = testSteps[0][testSteps[0].length-1];      
      testSteps[0] = testSteps[0].slice(0, testSteps[0].length-1);    
    }

    var steps = testSteps[0].map((s,i) => {

        return (
          <div key={i} className="step testdetails-detail">{i+1+". " + s}<span id="vi">   ✔</span></div>
        )
    })
    if (testStat)
      steps.push(<div className="step testdetails-detail">{steps.length+1 + ". " +lastStep}<span id="x">    ✘</span></div>);

    var testResultsComp = testResults.map(d => {
      if (d.Status == "Passed"){
        return(
          <div id="testdetails-container">
            <div id="testdetails-title"><span id="titlehelper">Test Details</span></div>
            <div className="testdetails-detail">Url: {d.Url}</div>
            <div className="testdetails-detail">Steps: <div>{steps}</div></div>    
            <div id="scrennshot"><a href={d.ScreenShot} target="_blank"><img src={d.ScreenShot} id="photo" width="100%" height="40%"/></a></div>
          </div>
        )
      }
      else if (d.Status == "Running"){
        return(
          <div id="testdetails-container">
            <div id="testdetails-title"><span id="titlehelper">Test Details</span></div>
            <div className="testdetails-detail">Steps: <div>{steps}</div></div>    
          </div>
        )
      }
      else {
        return(
          <div id="testdetails-container">
            <div id="testdetails-title"><span id="titlehelper">Test Details</span></div>
            <div className="testdetails-detail">Error Message: {d.ErrorMessage}</div>
            <div className="testdetails-detail">Url: {d.Url}</div>
            <div className="testdetails-detail">Steps: <div>{steps}</div></div>    
            <div id="scrennshot"><a href={d.ScreenShot} target="_blank"><img src={d.ScreenShot} id="photo" width="100%" height="40%"/></a></div>
          </div>
        )
      }
    });

    ReactDOM.render(<div>{testResultsComp}</div>, document.getElementById('testdetails'));
  })
}

function RenderResults(id, siteName){
  GetResults(id).then(data => {
    var passedTests = data.filter(d => d.Result.Status == 'Passed').map(result => {
      return(
        <div className="showdetail" id="passedtest" onClick={()=> {
          clearInterval(intervaliD);
          console.log("stop");
          ShowTest(result.TestNumber, id, result.TestName);
          intervaliD = setInterval(() => ShowTest(result.TestNumber, id, result.TestName), 1000);
        }}>{result.TestName}</div>
      )
    });
    
      var failedTests = data.filter(d => d.Result.Status == 'Failed').map(result => {
        return(
          <div className="showdetail" id="failedtest" onClick={()=> {
            clearInterval(intervaliD);
            console.log("stop");
            ShowTest(result.TestNumber, id, result.TestName);
          }
        }>{result.TestName}</div>
        )
      });

      var runningTests = data.filter(d => d.Result.Status == 'Running').map(result => {
        return(
          <div className="showdetail" id="passedtest" onClick={()=> {
            console.log("Running");
            clearInterval(intervaliD);
            console.log("stop");
            ShowTest(result.TestNumber, id, result.TestName);
            intervaliD = setInterval(() => ShowTest(result.TestNumber, id, result.TestName), 1000);
          }
        }>{result.TestName}</div>
        )
      });

      var sentToHubTests = data.filter(d => d.Result.Status == 'SentToHub').map(result => {
        return(
          <div className="showdetail">{result.TestName} - {result.TestNumber}</div>
        )
      });

    ReactDOM.render(
      <div id="show-container">   
        <div id="testrunidtitle"><div id="titletest">Site Name: {siteName}</div></div>
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

function GetTestRunStatus(results) {
  if(results.SentToHub == 0 && results.Running == 0) {
    return "Completed"
  }
  else {
    return "Running"
  }
}

function CalculateSucRate(results, status){
  let sum = results.Passed + results.Failed + results.SentToHub + results.Running;
  let sucRate = (status / sum)*100;
  return Math.round(sucRate);
}

function DurationController(testResults)
{
  if(testResults.Results.SentToHub == 0 && testResults.Results.Running == 0)
  {
    return testResults.Duration.slice(3, 8);
  }
}

function RenderTestRuns(){
  GetTestsRuns().then(data => {
    var idCompo = data.reverse().slice(0, 8).map(test => {
      return (
        <div id="testrun1" className="testrunsids">
          <div className="title">{test.SiteName}</div>
          <div className="env details">Env: {test.Env}</div>
          <div className="date details">Date: {test.Date.slice(3,14)}</div>
          
          <div className="details">Status: {GetTestRunStatus(test.Results)}</div>          
          <div className="passed details">Passed: {test.Results.Passed} ({CalculateSucRate(test.Results, test.Results.Passed)}%)</div>
          <div className="failed details">Failed: {test.Results.Failed} ({CalculateSucRate(test.Results, test.Results.Failed)}%)</div>
          <div className="running details">Runing: {test.Results.Running}</div>
          <div className="waiting details">Waiting: {test.Results.SentToHub}</div>
          <div className="btn"><a onClick={() => RenderResults(test.TestRunId, test.SiteName)}>Show Results</a></div>
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
setInterval(RenderTestRuns, 1000);
