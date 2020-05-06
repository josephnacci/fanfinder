var base_url = "https://nacci-movie-fanfinder.glitch.me/";

let movie; 

//// DROPDOWN LIST AUTOCOMPLETE
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("div");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}

// POPULATE DRODOWN LIST
function fillDropdown(callback) {
    URL = base_url + "get_film_list";
    $.get("", function(data) {
      return data;
    }).done(function(result) {
      /* do something with the result here */
      callback(result); // invokes the callback function passed as parameter
    });

}

fillDropdown(function(result) {
  autocomplete(document.getElementById("myInput"), result);
});
/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/

var getMovieData = function() {
  movie = document.getElementById("myInput").value;
  $('.movie-content').removeClass("invisible")
  $('.front-page-filler').addClass("invisible")
  $('.movie-title').text(movie)
  getAttitudesData(movie);
}
var getAttitudesData = function(movie) {
  $('.similar-movies-bottom span').text(movie)
  $('#defining-attitudes-title span').text(movie)
  $('#attitude-explanatory span').text(movie)

  URL = base_url + "attitudes?movie=" + movie.toLowerCase();

  //Clear out the categories ahead of reset
  $('#fan-favorable').html("")  
  $('#group-favorable').html("")  
  $('.similar-movies-inner').html("")  
  $('.conceptual-links-inner').html("")  

  fetch(URL)
        .then((response) => {
          return response.json()
          })
        .then((data) => {
    const similar = data['similar_movies']['movies'];
    for (let similar_movie of similar) {
      const sim = '<li>'+similar_movie+'</li>'
      $('.similar-movies-inner').append(sim)
    }

    // Insert the icons array here
    const group_top = data['group_attitudes']['top']
    const group_bot = data['group_attitudes']['bot']
    const fan_top = data['single_attitudes']['top']
    const fan_bot = data['single_attitudes']['bot']

  for (let attitude of fan_top) {
    const att = '<li><div class="favorable-list-item">'+attitude['a']+'</div><div class="figure">'+ Math.round(attitude['v']*100) +'</div></li>'
      $('#fan-favorable').append(att)
    }
      for (let attitude of fan_bot) {
    const att = '<li><div class="unfavorable favorable-list-item">'+attitude['a']+'</div><div class="figure">'+ Math.round(attitude['v']*100) +'</div></li>'
      $('#fan-favorable').append(att)
    }
      for (let attitude of group_top) {
    const att = '<li><div class="favorable-list-item">'+attitude['a']+'</div><div class="figure">'+ Math.round(attitude['v']*100) +'</div></li>'
      $('#group-favorable').append(att)
    }
      for (let attitude of group_bot) {
    const att = '<li><div class="unfavorable favorable-list-item">'+attitude['a']+'</div><div class="figure">'+ Math.round(attitude['v']*100) +'</div></li>'
      $('#group-favorable').append(att)
    }
  
  for (let concept of data['concepts']) {
    const conc = '<li class="conceptual-links-item"><div class="concept-hed">'+Object.keys(concept)+'</div><div class="concept-icon">'+ fillConcepts(Object.keys(concept)[0]) +'</div><div class="concept-words">' + concept[Object.keys(concept)]['words'].join(', ') +'</div></li>'
    $('.conceptual-links-inner').append(conc)
  }

    $('.conceptual-links-item').on('mouseover', function(e){
        let dis = e.target;
        $(dis).toggleClass('visible')
      })
    $('.conceptual-links-item').on('mouseout', function(e){
      let dis = e.target;

      $(dis).toggleClass('visible')
    })
  }).catch((e)=>{
        console.log(e)
        $('.page-container').removeClass('clicked')
        $('#error-page').addClass('clicked')
        $('#error-page #error-type').text("Information on attitudes")
        $('#error-page #this-movie').text(movie)
      });
  }
// FILL DATA
var getBrandData = function(movie) {
  $('.brand-list-hed span').text(movie)
  //BRAND SECTION
  brand_list = [
    "Clothing",
    "Skincare",
    "Dining",
    "Specialty store",
    "Beverage",
    "Grocery store",
    "Department store",
    "Spirit",
    "Food",
    "Hair care",
    "TV networks",
    "Beer",
    "News websites"
  ];

  for (b in brand_list) {
    URL = base_url + "brands?movie=" + movie.toLowerCase() + "&brand_cat=" + brand_list[b];
    let targeter = "#" + brand_list[b].replace(" ", "-") + " > .brand-list-item"

    fetch(URL)
      .then((response) => {
        return response.json()})
      .then((data) => {
        let text = [];
        for (let i in data["b_list"]) {
          text.push(Object.keys(data["b_list"][i])[0])
        }
        $(targeter).text("")
        $(targeter).text(text.join(", "))
      }).catch((e)=>{
        console.log(e)
        $('.page-container').removeClass('clicked')
        $('#error-page').addClass('clicked')
        $('#error-page #error-type').text("Brand information")
        $('#error-page #this-movie').text(movie)
      });
  }
};

var makeMap = function(movie) {
  $('.map-explanation span').text(movie)

  // DMA MAP CALL REPLACED WITH FETCH
  URL = base_url + "map?movie=" + movie.toLowerCase();
  // $.get(URL, function(data) {
  //   chloropleth(data["chart_data"], "#map");
  // });
  fetch(URL)
        .then((response) => {
          return response.json()})
        .then((data) => {
          chloropleth(data["chart_data"], "#map");
        })
      .catch((e)=>{
        console.log(e)
        $('.page-container').removeClass('clicked')
        $('#error-page').addClass('clicked')
        $('#error-page #error-type').text("Geographic information")
        $('#error-page #this-movie').text(movie)
      });
}

var getDemoData = function(movie) {
  $('#demographics-explanatory span').text(movie)

  // EDUCATION CALL
  URL = base_url + "demo?movie=" + movie + "&demo_type=ed";

  fetch(URL)
        .then((response) => {
          return response.json()
          })
        .then((data) => {
    dotPlot(data["chart_data"], "#demo-education");
  }).catch((e)=>{
        console.log(e)
        $('.page-container').removeClass('clicked')
        $('#error-page').addClass('clicked')
        $('#error-page #error-type').text("Demographic information")
        $('#error-page #this-movie').text(movie)
      });

  // AGE CALL
  URL = base_url + "demo?movie=" + movie + "&demo_type=age";
  fetch(URL)
        .then((response) => {
          return response.json()
          })
        .then((data) => {
    dotPlot(data["chart_data"], "#demo-age");
  }).catch((e)=>{
        console.log(e)
        $('.page-container').removeClass('clicked')
        $('#error-page').addClass('clicked')
        $('#error-page #error-type').text("Demographic information")
        $('#error-page #this-movie').text(movie)
      });
  
  // INCOME CALL
  URL = base_url + "demo?movie=" + movie + "&demo_type=income";
    fetch(URL)
        .then((response) => {
          return response.json()
          })
        .then((data) => {
    dotPlot(
      data["chart_data"],
      "#demo-income"
    );
  }).catch((e)=>{
        console.log(e)
        $('.page-container').removeClass('clicked')
        $('#error-page').addClass('clicked')
        $('#error-page #error-type').text("Demographic information")
        $('#error-page #this-movie').text(movie)
      });

  // GENDER CALL
  URL = base_url + "demo?movie=" + movie + "&demo_type=gender";
  fetch(URL)
        .then((response) => {
          return response.json()
          })
        .then((data) => {
    dotPlot(
      data["chart_data"],
      "#demo-gender"
    );
  }).catch((e)=>{
        console.log(e)
        $('.page-container').removeClass('clicked')
        $('#error-page').addClass('clicked')
        $('#error-page #error-type').text("Demographic information")
        $('#error-page #this-movie').text(movie)
      });
}

var getAdvertising = function(movie) {
  $('#advertising-explanatory span').text(movie)

   ad_media_list = [
    "Advertising channels that grab your attention",
    "Types of advertising seen regularly",
    "Social networks - member of",
    "Activities done regularly"
  ];

  for (let b in ad_media_list) {
    URL = base_url + "ad_media?movie=" + movie + "&brand_cat=" + ad_media_list[b];
    let target = "#advertising-" + ad_media_list[b].split(" ")[0].toLowerCase();
    fetch(URL)
        .then((response) => {
          return response.json()
          })
        .then((data) => {
      scatterPlot(data["chart_data"], target);
    }).catch((e)=>{
        console.log(e)
        $('.page-container').removeClass('clicked')
        $('#error-page').addClass('clicked')
        $('#error-page #error-type').text("Advertising information")
        $('#error-page #this-movie').text(movie)
      });
  }
}

var fillConcepts = function(concept) {
  let icon;
  switch(concept) {
    case "music":
      icon = '<i class="fas fa-music"></i>'
      break;
    case 'money': icon = '<i class="fas fa-dollar-sign"></i>' 
      break;
    case 'the ocean': icon = '<i class="fas fa-water"></i>' 
      break;
    case 'sides': icon = '<i class="fas fa-users"></i>' 
      break;
    case 'chairman': icon = '<i class="fas fa-user-tie"></i>' 
      break;
    case 'spies': icon = '<i class="fas fa-user-secret"></i>' 
      break;
    case 'friend': icon = '<i class="fas fa-user-friends"></i>' 
      break;
    case 'vacation': icon = '<i class="fas fa-umbrella-beach"></i>' 
      break;
    case 'performing': icon = '<i class="fas fa-theater-masks"></i>' 
      break;
    case 'monsters': icon = '<i class="fas fa-teeth-open"></i>' 
      break;
    case 'drugs': icon = '<i class="fas fa-syringe"></i>' 
      break;
    case 'light': icon = '<i class="fas fa-sun"></i>' 
      break;
    case 'store': icon = '<i class="fas fa-store"></i>' 
      break;
    case 'towns': icon = '<i class="fas fa-store-alt"></i>' 
      break;
    case 'medicine': icon = '<i class="fas fa-stethoscope"></i>' 
      break;
    case 'famed': icon = '<i class="fas fa-star"></i>' 
      break;
    case 'murderous': icon = '<i class="fas fa-skull"></i>' 
      break;
    case 'death': icon = '<i class="fas fa-skull-crossbones"></i>' 
      break;
    case 'play': icon = '<i class="fas fa-shapes"></i>' 
      break;
    case 'technology': icon = '<i class="fas fa-server"></i>' 
      break;
    case 'garden': icon = '<i class="fas fa-seedling"></i>' 
      break;
    case 'uncovers': icon = '<i class="fas fa-search"></i>' 
      break;
    case 'journey': icon = '<i class="fas fa-route"></i>' 
      break;
    case 'spacecraft': icon = '<i class="fas fa-rocket"></i>' 
      break;
    case 'robots': icon = '<i class="fas fa-robot"></i>' 
      break;
    case 'the other': icon = '<i class="fas fa-question-circle"></i>' 
      break;
    case 'faith': icon = '<i class="fas fa-praying-hands"></i>' 
      break;
    case 'character traits': icon = '<i class="fas fa-portrait"></i>' 
      break;
    case 'flight': icon = '<i class="fas fa-plane-departure"></i>' 
      break;
    case 'election': icon = '<i class="fas fa-person-booth"></i>' 
      break;
    case 'headlines': icon = '<i class="fas fa-newspaper"></i>' 
      break;
    case 'music': icon = '<i class="fas fa-music"></i>' 
      break;
    case 'tranquil': icon = '<i class="fas fa-mug-hot"></i>' 
      break;
    case 'mythological': icon = '<i class="fas fa-moon"></i>' 
      break;
    case 'competition': icon = '<i class="fas fa-medal"></i>' 
      break;
    case 'bodies': icon = '<i class="fas fa-male"></i>' 
      break;
    case 'nature': icon = '<i class="fas fa-leaf"></i>' 
      break;
    case 'home': icon = '<i class="fas fa-home"></i>' 
      break;
    case 'effort': icon = '<i class="fas fa-hiking"></i>' 
      break;
    case 'construction': icon = '<i class="fas fa-hard-hat"></i>' 
      break;
    case 'partners': icon = '<i class="fas fa-handshake"></i>' 
      break;
    case 'pulling': icon = '<i class="fas fa-hand-holding"></i>' 
      break;
    case 'food': icon = '<i class="fas fa-hamburger"></i>' 
      break;
    case 'comical': icon = '<i class="fas fa-grin-beam"></i>' 
      break;
    case 'education': icon = '<i class="fas fa-graduation-cap"></i>' 
      break;
    case 'sophistication': icon = '<i class="fas fa-glass-martini-alt"></i>' 
      break;
    case 'celebration': icon = '<i class="fas fa-glass-cheers"></i>' 
      break;
    case 'horror': icon = '<i class="fas fa-ghost"></i>' 
      break;
    case 'convicted': icon = '<i class="fas fa-gavel"></i>' 
      break;
    case 'animals': icon = '<i class="fas fa-frog"></i>' 
      break;
    case 'championship': icon = '<i class="fas fa-flag-checkered"></i>' 
      break;
    case 'flames': icon = '<i class="fas fa-fire-alt"></i>' 
      break;
    case 'enormous': icon = '<i class="fas fa-expand-alt"></i>' 
      break;
    case 'writing': icon = '<i class="fas fa-edit"></i>' 
      break;
    case 'betting': icon = '<i class="fas fa-dice"></i>' 
      break;
    case 'royalty': icon = '<i class="fas fa-crown"></i>' 
      break;
    case 'persuades': icon = '<i class="fas fa-comment"></i>' 
      break;
    case 'weather': icon = '<i class="fas fa-cloud-sun-rain"></i>' 
      break;
    case 'family': icon = '<i class="fas fa-child"></i>' 
      break;
    case 'experts': icon = '<i class="fas fa-chalkboard-teacher"></i>' 
      break;
    case 'cars': icon = '<i class="fas fa-car"></i>' 
      break;
    case 'christmas': icon = '<i class="fas fa-candy-cane"></i>' 
      break;
    case 'job': icon = '<i class="fas fa-briefcase"></i>' 
      break;
    case 'violence': icon = '<i class="fas fa-bomb"></i>' 
      break;
    case 'origins': icon = '<i class="fas fa-baby"></i>' 
      break;
    case 'history': icon = '<i class="fas fa-atlas"></i>' 
      break;
    case 'hatred': icon = '<i class="fas fa-angry"></i>' 
      break;
    case 'inevitably': icon = '<i class="far fa-flag"></i>' 
      break;
    case 'nation': icon = '<i class="fab fa-font-awesome-flag"></i>' 
      break;
    default:
      icon = '<i class="fas fa-film"></i>'
  }
  return icon;
}