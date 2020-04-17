var base_url = "https://nacci-movie-fanfinder.glitch.me/";


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
    a = document.createElement("DIV");
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
function yourFunction(callback) {
  URL = base_url + "get_film_list";
  $.get(URL, function(data) {
    return data;
  }).done(function(result) {
    /* do something with the result here */
    callback(result); // invokes the callback function passed as parameter
  });
}

yourFunction(function(result) {
  console.log("Result: ", result);
  autocomplete(document.getElementById("myInput"), result);
});
/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/


// FILL DATA
var getMovieData = function() {
  movie = document.getElementById("myInput").value;
  
  //SIMILAR MOVIES
  URL = base_url + "attitudes?movie=" + movie;
  $.get(URL, function(data) {
    console.log(data);
    // similar movies by attitude
    similar_movies_string =
      "<h4>Similar Movies</h4><p> Based on the attitudes of fans of <strong>" +
      movie +
      "</strong>, the ten movies with the most similar fan profiles are:</p>";
    similar_movies_string += '<ul style="text-align:left; padding:0 0 0 40% ">';
    for (i = 0; i < 10; i++) {
      similar_movies_string +=
        "<li>- " + data["similar_movies"]["movies"][i] + "</li>";
    }
    similar_movies_string += "<br>";

    
    
    //SIMILAR MOVIES CONCEPT CHART
    concepts = data["concepts"];
    concept_string =
      "<h4>Conceptual Links</h4><p> Movies that fans of <strong>" +
      movie +
      "</strong> also like share some of the following concepts:</p>";
    concept_string += '<ul style="text-align:left; padding:0 0 0 40% ">';
    for (i in concepts) {
      concept_word_text = "";
      $.each(concepts[i], function(index, value) {
        $.each(value['words'], function(k, v) {
          concept_word_text += v + ", ";
        });
      });

      concept_string +=
        "<li>- <strong>" +
        Object.keys(concepts[i])[0] +
        "</strong> <span class='auto' id='roll_"+Object.keys(concepts[i])[0]+"'>rollover to see examples: " +
        "<div class='hide' id='show_"+Object.keys(concepts[i])[0]+"' style='display:none;'>" + concept_word_text + "</div></span>" +
        "</li>";
    }

    //SINGLE MOVIE ATTITUDES
    single_attitudes_string =
      "<h4>" + movie + '</h4><ul style="text-align:left;">';

    max_agreement = data["single_attitudes"]["top"][0]["v"];

    for (i = 0; i < data["single_attitudes"]["top"].length; i++) {
      single_attitudes_string +=
        '<li><span class="dot" style="background-color:green;height:' +
        (12 * data["single_attitudes"]["top"][i]["v"]) / max_agreement +
        ";width:" +
        (12 * data["single_attitudes"]["top"][i]["v"]) / max_agreement +
        'px;display:inline-block;  border-radius: 50%;"></span>' +
        '<span class="dot" style="opacity:0;height:12px;width:' +
        (20 - (12 * data["single_attitudes"]["top"][i]["v"]) / max_agreement) +
        ';display:inline-block;border-radius: 50%;"></span>' +
        data["single_attitudes"]["top"][i]["a"] +
        "</li>";
    }

    single_attitudes_string += '</ul><ul style="text-align:left;">';
    max_agreement = data["single_attitudes"]["bot"][0]["v"];
    for (i = 0; i < data["single_attitudes"]["bot"].length; i++) {
      single_attitudes_string +=
        '<li><span class="dot" style="background-color:red;height:' +
        (12 * data["single_attitudes"]["bot"][i]["v"]) / max_agreement +
        ";width:" +
        (12 * data["single_attitudes"]["bot"][i]["v"]) / max_agreement +
        'px;display:inline-block;  border-radius: 50%;"></span>' +
        '<span class="dot" style="opacity:0;height:12px;width:' +
        (20 - (12 * data["single_attitudes"]["bot"][i]["v"]) / max_agreement) +
        ';display:inline-block;border-radius: 50%;"></span>' +
        data["single_attitudes"]["bot"][i]["a"] +
        "</li>";
    }
    single_attitudes_string += "</ul>";

    
    //MOVIE CLUSTER ATTITUDES
    group_attitudes_string =
      "<h4>Movies similar to " + movie + '</h4><ul style="text-align:left;">';
    max_agreement = data["group_attitudes"]["top"][0]["v"];

    for (i = 0; i < data["group_attitudes"]["top"].length; i++) {
      group_attitudes_string +=
        '<li><span class="dot" style="background-color:green;height:' +
        (12 * data["group_attitudes"]["top"][i]["v"]) / max_agreement +
        ";width:" +
        (12 * data["group_attitudes"]["top"][i]["v"]) / max_agreement +
        'px;display:inline-block;  border-radius: 50%;"></span>' +
        '<span class="dot" style="opacity:0;height:12px;width:' +
        (20 - (12 * data["group_attitudes"]["top"][i]["v"]) / max_agreement) +
        ';display:inline-block;border-radius: 50%;"></span>' +
        data["group_attitudes"]["top"][i]["a"] +
        "</li>";
    }
    group_attitudes_string += '</ul><ul style="text-align:left;">';
    max_agreement = data["group_attitudes"]["bot"][0]["v"];

    for (i = 0; i < data["group_attitudes"]["bot"].length; i++) {
      group_attitudes_string +=
        '<li><span class="dot" style="background-color:red;height:' +
        (12 * data["group_attitudes"]["bot"][i]["v"]) / max_agreement +
        ";width:" +
        (12 * data["group_attitudes"]["bot"][i]["v"]) / max_agreement +
        'px;display:inline-block;  border-radius: 50%;"></span>' +
        '<span class="dot" style="opacity:0;height:12px;width:' +
        (20 - (12 * data["group_attitudes"]["bot"][i]["v"]) / max_agreement) +
        ';display:inline-block;border-radius: 50%;"></span>' +
        data["group_attitudes"]["bot"][i]["a"] +
        "</li>";
    }
    group_attitudes_string += "</ul>";

    explanation_string =
      "<h4>Defining Attitudes</h4><p> To generate fan profiles, we take correlations between various attitudes and propensity to like certain movies. We found ten distinct classes of movie and selected the attitudes most likely to be associated with those groups. In the left column, you will see the attitudes that are most associated with being a fan of <strong>" +
      movie +
      "</strong>. The green bubbles indicate that agreement with the statement will likely be associated with enjoyment of the movie, and the red bubbles show that disagreement with the statement is similarly linked to being a fan of the movie. The size of the bubbles indicate the strength of the association.</p>" +
      "<p>The list on the right is interpreted in the same way, but responses are aggregated over the entire group that contains " +
      movie +
      ".</p>";

    
    //PUSH TEXT TO DIVS
    $("#attitude_explanation").empty();
    $("#attitude_explanation").append(explanation_string);

    $("#similar_movies").empty();
    $("#similar_movies").append(similar_movies_string);

    $("#single_attitudes").empty();
    $("#single_attitudes").append(single_attitudes_string);

    $("#group_attitudes").empty();
    $("#group_attitudes").append(group_attitudes_string);

    $("#concepts").empty();
    $("#concepts").append(concept_string);

    
    // CONCEPT MAP FUNCTIONALITY
    if (document.getElementsByClassName("auto")) {
      var autos = document.getElementsByClassName("auto");
      for (var i = 0; i < autos.length; i++) {
        autos[i].addEventListener("mouseover", autoOver);
        autos[i].addEventListener("mouseout", autoOut);
      }
    }

    function autoOver() {
      console.log(this.id, 'show_'+ this.id.slice(5, this.id.length-1))
      document.getElementById('show_'+ this.id.slice(5, this.id.length)).style.display = 'block';
      document.getElementById('show_'+ this.id.slice(5, this.id.length)).style.height = document.getElementById('show_'+ this.id.slice(5, this.id.length)).scrollHeight + "px";
    }

    function autoOut() {
      document.getElementById('show_'+ this.id.slice(5, this.id.length)).style.display = 'none';

      document.getElementById('show_'+ this.id.slice(5, this.id.length)).style.height = "0px";
    }
  });

  
  //DEFINE CHART FUNCTIONS
  chart_map = {
    scatterPlot: scatterPlot,
    dotPlot: dotPlot,
    chloropleth: chloropleth
  };

  
  // DMA MAP CALL
  URL = base_url + "map?movie=" + movie;
  $.get(URL, function(data) {
    chart_map[data["chart_type"]](data["chart_data"], "#map", data["params"]);
  });

  // EDUCATION CALL
  URL = base_url + "demo?movie=" + movie + "&demo_type=" + "ed";
  $.get(URL, function(data) {
    chart_map[data["chart_type"]](data["chart_data"], "#ed", data["params"]);
  });

  // AGE CALL
  URL = base_url + "demo?movie=" + movie + "&demo_type=" + "age";
  $.get(URL, function(data) {
    chart_map[data["chart_type"]](data["chart_data"], "#age", data["params"]);
  });
  
  // INCOME CALL
  URL = base_url + "demo?movie=" + movie + "&demo_type=" + "income";
  $.get(URL, function(data) {
    chart_map[data["chart_type"]](
      data["chart_data"],
      "#income",
      data["params"]
    );
  });

  // GENDER CALL
  URL = base_url + "demo?movie=" + movie + "&demo_type=" + "gender";
  $.get(URL, function(data) {
    chart_map[data["chart_type"]](
      data["chart_data"],
      "#gender",
      data["params"]
    );
  });

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
    URL = base_url + "brands?movie=" + movie + "&brand_cat=" + brand_list[b];
    console.log(b);
    $("#brand_use").empty();

    $.get(URL, function(data) {
      console.log(data);

      text = "<strong>" + data["cat"] + ":  </strong>";
      for (i in data["b_list"]) {
        text += Object.keys(data["b_list"][i])[0];
        if (!(i == data["b_list"].length - 1)) {
          text += ", ";
        } else {
          text += ".<br><br>";
        }
      }
      $("#brand_use").append(text);
    });
  }

  //ADS AND MEDIA SECTION

  ad_media_list = [
    "Advertising channels that grab your attention",
    "Types of advertising seen regularly",
    "Social networks - member of",
    "Activities done regularly"
  ];

  for (b in ad_media_list) {
    URL =
      base_url + "ad_media?movie=" + movie + "&brand_cat=" + ad_media_list[b];
    console.log(b);
    $("#ad_media").empty();

    $.get(URL, function(data) {
      console.log(data);
      div_id = data["params"]["slice"];
      $("#" + div_id).empty();

      $("#ad_media").append("<div id='" + div_id + "'></div>");

      chart_map[data["chart_type"]](
        data["chart_data"],
        "#" + div_id,
        data["params"]
      );
      /*
      text = '<strong>'+data['cat']+':  </strong>'
      for (i in data['b_list']){
        text += Object.keys(data['b_list'][i])[0]
        if (!(i == data['b_list'].length-1)){
          text += ', '
        }
        else{
          text += '.<br><br>'
        }
      }
      $('#ad_media').append(text)
      */
    });
  }

  var link = document.getElementById("fanfinder_tab");
  link.click();
};

var loadMotivationCharts = function(sel) {
  motivation = sel.value;
  var chart_map = {
    pyramidChart: pyramidChart,
    scatterPlot: scatterPlot,
    dotPlot: dotPlot
  };

  //console.log(chart_map);

  URL = base_url + "motivations?m=" + motivation;
  $.get(URL, function(data) {
    console.log(data);
    console.log(chart_map[data["chart_type"]]);
    chart_map[data["chart_type"]](
      data["chart_data"],
      "#octagon",
      data["params"]
    );
  });

  URL = base_url + "motivations_text?m=" + motivation;
  $.get(URL, function(data) {
    $("#motivationChartText").empty();
    $("#motivationChartText").append(
      "<br><h4> Key Insights</h4><p>" + data + "</p>"
    );
    //chart_map[data['chart_type']](data['chart_data'], "#whyPlot", data['params'])
  });
};

var loadPersonaCharts = function(sel) {
  console.log("hfidshfidhfs", sel);
  chart_map = {
    pyramidChart: pyramidChart,
    scatterPlot: scatterPlot,
    dotPlot: dotPlot,
    dmaMap: dmaMap
  };

  //params = $('formname').serialize()
  value = document.getElementById("formname");
  console.log(value);

  persona = value.children.persona.value;
  qtype = value.children.qtype.value;
  question = value.children.question.value;
  console.log(persona, qtype, question);

  //console.log($("formname").serializeArray())
  //  console.log($('category1').value, $('category2').value, $('category3').value)
  //persona = 0
  //question = 'why_listen'
  //console.log(params);
  URL =
    base_url +
    "tell_me?qtype=" +
    qtype +
    "&persona=" +
    persona +
    "&question=" +
    question;
  $.get(URL, function(data) {
    console.log(data);
    chart_map[data["chart_type"]](
      data["chart_data"],
      "#whyPlot",
      data["params"]
    );
  });

  URL =
    base_url +
    "insight_text?qtype=" +
    qtype +
    "&persona=" +
    persona +
    "&question=" +
    question;
  $.get(URL, function(data) {
    console.log(data);
    $("#chartText").empty();
    $("#chartText").append("<br><h4> Key Insights</h4><p>" + data + "</p>");
    //chart_map[data['chart_type']](data['chart_data'], "#whyPlot", data['params'])
  });
};
//loadPersonaCharts('a')

function openTab(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

