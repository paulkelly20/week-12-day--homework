var app = function(){
  document.getElementById("group").style.visibility="hidden";
  document.getElementById("main-map").style.visibility="hidden";
  document.getElementById("team-div").style.visibility="hidden";
  document.getElementById("Stadium-info").style.visibility="hidden";
  const homeButtons = document.getElementsByClassName("home-link");
  Array.from(homeButtons).forEach(function(element) {
    element.addEventListener('click', reloadPage);
  });
  const fixturesLink = document.getElementById("fixtures-link");
  fixturesLink.addEventListener('click', handleSelectChangeFixtures)

  drawMap();
  const teamTvUrl = "https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json"
  makeRequest(teamTvUrl, requestStatusFirst);
  const groupUrl = "http://api.football-data.org/v1/competitions/467/leagueTable"
  const groupHeader =  { 'X-Auth-Token': 'Y0b7f3775576b43dfa2a1ca657004ee97' }
  makeRequestAuth(groupUrl, requestStatusSecond, groupHeader);
  // const teamUrl = "http://api.football-data.org/v1/competitions/467/teams"
  // makeRequestAuth(teamUrl, requestStatusTeams, groupHeader);
  const fixturesUrl = "http://api.football-data.org/v1/competitions/467/fixtures"
  makeRequestAuth(fixturesUrl, requestStatusFixtures, groupHeader);


}

const reloadPage = function(){
  location.reload();
}

const makeRequest = function(url, callback){
  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.addEventListener('load', callback);
  request.send();
}

const makeRequestAuth = function(url, callback, header){
  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.setRequestHeader('X-Auth','Y0b7f3775576b43dfa2a1ca657004ee97')
  request.addEventListener('load', callback);
  request.send();
}

const requestStatusFirst = function(){
  if(this.status !== 200) return;
  worldCup = JSON.parse(this.response);
  stadiaDropDown(worldCup.stadiums);
  teamsList(worldCup.teams);
}

const requestStatusSecond = function(){
  if(this.status !== 200) return;
  group = JSON.parse(this.response);
  groupDropDown(group)
}
//
// const requestStatusTeams = function(){
//   if(this.status !== 200) return;
//   teams = JSON.parse(this.response);
// }
const requestStatusFixtures = function(){
  if(this.status !== 200) return;
  fixtures = JSON.parse(this.response);
}


const groupDropDown = function(groups){
  const groupsArray = Object.values(groups.standings);
  for(group of groupsArray){
    const select = document.querySelector("#group-list")
    const option = document.createElement('option');
    option.textContent = "Group " + group[0].group;
    option.value = JSON.stringify(group);
    select.appendChild(option);
    select.addEventListener('change', handleSelectChangeGroup);
  }
}

const stadiaDropDown = function(stadia){

    // Sorting stadia alphabetically
    stadia.sort(function(a, b) {
      var nameA = a.name.toUpperCase();
      var nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

  for(stadium of stadia){
    const select = document.querySelector("#stadia-list")
    const option = document.createElement('option');
    option.textContent = stadium.name;
    option.value = JSON.stringify(stadium);
    select.appendChild(option);
    select.addEventListener('change', handleSelectChangestadium);
  }
}

const teamsList = function(teams){

  // Sorting teams alphabetically
  teams.sort(function(a, b) {
    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  teams.forEach(function(team){
    const select = document.querySelector("#team-list")
    const option = document.createElement('option');
    option.textContent = team.name;
    option.value = JSON.stringify(team);
    select.appendChild(option);
    select.addEventListener('change', handleSelectChangeTeam);
  })
}

const handleSelectChangeTeam = function(){
  hideElements()
  let team = JSON.parse(this.value)
  displayTeam(team);
};

  const handleSelectChangeFixtures = function(){
    hideElements()
    displayFixtures(fixtures);
  }


const handleSelectChangestadium = function(){
  hideElements()
  let stadium = JSON.parse(this.value)
  var infoDiv = document.getElementById('Stadium-info')
  var stadiumh2 = document.getElementById("stadium-name")
  if(stadiumh2 !== null){stadiumh2.remove()}
  var stadiumImage = document.getElementById("stadium-image")
  if(stadiumImage !== null){stadiumImage.remove()}
  displayStadium(stadium)
};

const handleSelectChangeGroup = function(){
  const twitterFeed = document.getElementsByClassName("twitter-timeline")[0].style.visibility ="hidden";
  let group = JSON.parse(this.value)
  for (var i = 0; i < 4; i++) {
    var table = document.getElementById('display-table')
    if(table !== null){
      table.remove()
    }}
    document.getElementById("group").style.visibility="visible";
    displayGroupTable(group);
  };

  const displayGroupTable = function(group){
    document.getElementById("Stadium-info").style.visibility="hidden";
    document.getElementById("team-div").style.visibility="hidden";
    let i = 1
    group.forEach(function(team){
      let table = document.querySelector("#group")
      let tr = document.createElement("tr")
      tr.setAttribute("id", "display-table");
      let tdPostion = document.createElement("td")
      tdPostion.setAttribute("id", "info")
      let tdName = document.createElement("td")
      tdName.setAttribute("class", "info")
      let tdMatches = document.createElement("td")
      tdMatches.setAttribute("class", "info")
      let tdGF = document.createElement("td")
      tdGF.setAttribute("class", "info")
      let tdGA = document.createElement("td")
      tdGA.setAttribute("class", "info")
      let tdGD = document.createElement("td")
      tdGD.setAttribute("class", "info")
      let tdPoints = document.createElement("td")
      tdPoints.setAttribute("class", "info")

      tdPostion.textContent = i;
      tdName.textContent = team.team
      tdMatches.textContent = team.playedGames
      tdGF.textContent = team.goals
      tdGA.textContent = team.goalsAgainst
      tdGD.textContent = team.goalDifference
      tdPoints.textContent = team.points

      table.appendChild(tr)
      tr.appendChild(tdPostion)
      tr.appendChild(tdName)
      tr.appendChild(tdMatches)
      tr.appendChild(tdGF)
      tr.appendChild(tdGA)
      tr.appendChild(tdGD)
      tr.appendChild(tdPoints)

      i += 1;
    })

  }
  const displayTeam = function(team){
    document.getElementById("team-div").style.visibility="visible";
    document.getElementById("group").style.visibility="hidden";
    document.getElementById("Stadium-info").style.visibility="hidden";
    const teamDiv = document.getElementById("team-div")
    const image = document.createElement('img')
    const heading = document.createElement('h2')
    heading.textContent = team.name
    image.src = team.flag;
    image.height = 150;
    image.width = 250;
    teamDiv.appendChild(heading);
    teamDiv.appendChild(image);

  };

  const displayStadium = function(stadium){
    document.getElementById("group").style.visibility="hidden";
    document.getElementById("team-div").style.visibility="hidden";
    document.getElementById("Stadium-info").style.visibility="visible";
    document.getElementById("main-map").style.visibility="visible";
    const infoDiv = document.querySelector('#Stadium-info')
    const h2 = document.createElement('h2')
    h2.setAttribute("id", "stadium-name")
    const image = document.createElement('img')
    image.setAttribute("id", "stadium-image")
    image.width = "250";
    image.height = "300";
    image.src = stadium.image
    h2.textContent = stadium.name;
    infoDiv.appendChild(h2);
    infoDiv.appendChild(image);
    const coords = [stadium.lat, stadium.lng]
    mainMap.flyTo(coords, 10)
    mainMap.addMarker(coords, stadium.city)
  }

  const drawMap = function () {
    const russia = [61.5240, 105.3188];
    const moscow = [55.7558, 37.6173];
    const zoomLevel = 2;
    const mapDiv = document.getElementById ("main-map");
    mainMap = new MapWrapper (mapDiv, russia, zoomLevel);
    mainMap.addMarker(moscow, "Moscow: Capital of Russia");
  }


  const hideElements = function(){
    document.getElementsByClassName("twitter-timeline")[0].style.visibility ="hidden";
    document.getElementById("main-map").style.visibility="hidden";
    document.getElementById("group").style.visibility="hidden";

  }

  window.addEventListener('load', app);
