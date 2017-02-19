d3.csv('https://raw.githubusercontent.com/marknauf/marknauf.github.io/master/data_w_mission.csv', function(err, rows) {
    if (err) throw err;

    function unpack(rows, key) {
        return rows.map(function(row) {
            return row[key];
        });
    }

    var cLat = unpack(rows, 'lat'),
        cLon = unpack(rows, 'lon'),
        cCap = unpack(rows, 'mCap'),
        cBio = unpack(rows, 'Bio'),
        cMission = unpack(rows, 'Mission'),
        city = unpack(rows, 'city'),
        state = unpack(rows, 'state'),
        cCompanySize = unpack(rows, 'companySize'),
        radius = unpack(rows, 'radius'),
        cName = unpack(rows, 'name'),
        cYearFounded = unpack(rows, 'yearFounded'),
        cIndustry = unpack(rows, 'industry'),
        cType = unpack(rows, 'type'),
        connections = [
            []
        ];



    var map = new Datamap({
        element: document.getElementById("myDiv"),
        scope: 'usa',
        fills: {
            defaultFill: "rgb(0,0,0)",
            white: "rgb(255,255,255)"
        },
        responsive: true,
        geographyConfig: {
            borderWidth: 1,
            borderOpacity: 1,
            borderColor: '#09C1E3',
            popupTemplate: function(geography, data) { // This function should just return a string
                return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
            },
            popupOnHover: true, // True to show the popup while hovering
            highlightOnHover: true,
            highlightFillColor: '#09C1E3',
            highlightBorderColor: '#ff9900',
        },
        bubblesConfig: {
            borderWidth: .05,
            borderColor: '#fff',
            borderOpacity: .05,
            popupOnHover: true,
            radius: radius,
            popupTemplate: function(geography, data) {
                return '<div class="hoverinfo"><strong>' + data.name + '</strong><br>' + data.city + ", " + data.state  + '<br>' + data.companySize + " Employees";
            
            },
            fillOpacity: .50,
            animate: true,
            highlightOnHover: true,
            highlightFillColor: '#1C8EFF',
            highlightBorderColor: '#ff9900',
        },
        done: function(datamap) {
            datamap.svg.call(d3.behavior.zoom().on("zoom", redraw));

            function redraw() {
                datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

        }
        
    });

    for (var i = 0; i < cName.length; i++) {
        var temp = [];
        connections.push(temp);
        for (var j = 0; j < cName.length; j++) {
            connections[i][j] = rows[i][j]
        }
    }

    var bubb = []
    for (var i = 0; i < cName.length; i++) {
        curr = {
            name: cName[i],
            latitude: cLat[i],
            longitude: cLon[i],
            fillKey: 'white',
            bio: cBio[i],
            mission: cMission[i],
            radius: radius[i],
            companySize: cCompanySize[i],
            state: state[i],
            city: city[i],
            yearFounded: cYearFounded[i],
            industry: cIndustry[i],
            type: cType[i]
        }
        bubb.push(curr);
    }

    map.bubbles(bubb);
    var isClicked = false;
    // Arcs coordinates can be specified explicitly with latitude/longtitude,
    // or just the geographic center of the state/country.
    /*document.getElementById("slider").addEventListener("click", function(){
        if(document.getElementById('slider').checked == true){
          map.scope: 'world'
          map.projection: 'orthographic'
      }
        else{
          map.scope: 'usa'
          map.projection: 'equirectangular'
      }
    });*/
    console.log(map.scope)

    //Handle bubble clicks
    d3.selectAll(".datamaps-bubble").on('click', function(bubble, data) {
        if (isClicked == false) {

            var lines = []
            for (var i = 0; i < cName.length; i++) {
                if (parseInt(connections[data][i]) == 1) {
                    temp = {
                        origin: {
                            latitude: bubble.latitude,
                            longitude: bubble.longitude
                        },
                        destination: {
                            latitude: cLat[i],
                            longitude: cLon[i]
                        },
                        options: {
                            strokeWidth: 2,
                            strokeColor: 'rgb(255,255,255)',
                            greatArc: true
                        }
                    }
                    lines.push(temp)
                }
            }
            
            
            map.arc(lines, {
                strokeWidth: 1,
                arcSharpness: 1.4
            });

            isClicked = true;
            document.getElementById("bio").append(bubble.bio);
            document.getElementById("company").append(bubble.name);
            document.getElementById("mission").append(bubble.mission);
            document.getElementById("yearFounded").append(bubble.yearFounded);
            document.getElementById("industry").append(bubble.industry);
            document.getElementById("type").append(bubble.type);
        } else {
            map.arc([]);
            isClicked = false;
            document.getElementById("company").innerText = "";
            document.getElementById("mission").innerText = "";
            document.getElementById("bio").innerText = "";
            document.getElementById("yearFounded").innerText = "";
            document.getElementById("industry").innerText = "";
            document.getElementById("type").innerText = "";
        }
    });
});

//THIS MAKES BAR CHARTS AND STUFF
window.onload = function() {
    CanvasJS.addColorSet("Shades", [ //colorSet Array

        "#171726 ",
        "#177C89",
        "#30A99A",
        "#51BEB4",
        "#05668D",
        "#028090",
        "#00A896",
        "#F0F3BD",
    ]);

    var piechart = new CanvasJS.Chart("piechartContainer", {
        colorSet: "Shades",
        creditText: " ",
        backgroundColor: "rgba(0,0,0,0)",
        animationEnabled: true,
        legend: {
            verticalAlign: "center",
            horizontalAlign: "left",
            fontSize: 10,

        },
        theme: "theme",
        toolTip: {
            fontSize: 10,
        },
        data: [{
            type: "pie",
            startAngle: 200,
            showInLegend: false,
            toolTipContent: "{legendText} #percent%",
            dataPoints: [{
                    y: 581,
                    legendText: "Foundation + Non-Profit Leadership:"
                }, {
                    y: 291,
                    legendText: "Investors:"
                }, {
                    y: 363,
                    legendText: "Higher Education Leadership:"
                }, {
                    y: 436,
                    legendText: "K-12 School Leaders + Superintendents:"
                }, {
                    y: 73,
                    legendText: "Media:"
                }, {
                    y: 36,
                    legendText: "Graduate Students:"
                }, {
                    y: 764,
                    legendText: "Education + Talent Technology Entrepreneurs: "
                }, {
                    y: 327,
                    legendText: "Service Providers:"
                },

            ]
        }]
    });
    piechart.render();

    var barchart = new CanvasJS.Chart("barchartContainer", {
        colorSet: "Shades",
        creditText: {
            fontColor: "rgba(0,0,0,0)"
        },
        backgroundColor: "rgba(0,0,0,0)",
        animationEnabled: true,
        toolTip: {
            fontSize: 14,
        },
        axisY: {
            lineColor: "rgba(0,0,0,0)",
            valueFormatString: " ",
            tickLength: 0
        },
        axisX: {
            lineColor: "rgba(0,0,0,0)",
            valueFormatString: " ",
            tickLength: 0
        },

        legend: {
            verticalAlign: "bottom",
            horizontalAlign: "center"
        },
        theme: "theme4",
        data: [{
            type: "column",
            showInLegend: false,
            legendMarkerColor: "white",
            legendText: "",
            dataPoints: [{
                y: 350,
                label: "2010"
            }, {
                y: 560,
                label: "2011"
            }, {
                y: 800,
                label: "2012"
            }, {
                y: 1460,
                label: "2013"
            }, {
                y: 2100,
                label: "2014"
            }, {
                y: 2550,
                label: "2015"
            }, {
                y: 3635,
                label: "2016"
            }]
        }]
    });

    barchart.render();

};
