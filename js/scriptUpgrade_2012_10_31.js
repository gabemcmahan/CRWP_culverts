/**
 * @author gmcmahan
 */

google.load("visualization", "1", {packages:["corechart", "table", "map", "controls"]});google.setOnLoadCallback(drawVisualization)
	google.setOnLoadCallback(drawVisualization);


var dataTab;
var roadFilter
var infowindow = null;  // <-- added this here; make sure it's global
var culCode;
var selectTableData;
var	map;
var table;
// var AWCLayer = new google.maps.KmlLayer('http://www.crks.org/culVis/AWC_SC_clipped.kmz', {preserveViewport:true});
// var LSLayer = new google.maps.KmlLayer('http://www.crks.org/culVis/Land_Status.kmz', {preserveViewport:true});

var AWCLayer = new google.maps.FusionTablesLayer({
  query: {
    select: 'geometry',
    from: '1M7-xcvBFR_bjkHmkiicJv0FvC2P34b6J1vuiH1I'
  },
  
});

var milePostsID = "1WgFYJA0sGY4f-7CA5MvqI4A8xxsx1mLVyJ4Q54U"
var milePosts = new google.maps.FusionTablesLayer({
  query: {
    select: 'geometry',
    from: milePostsID
  },
  
});

var bridgesID = "1noAepE_0y2zscvWJwItHSBbp5GoJqVXzVmPAQiE"
var bridges = new google.maps.FusionTablesLayer({
  query: {
    select: 'geometry',
    from: bridgesID
  },
  
});

var gagesID = "1oPxi7WGCt-LtWhyMwyr9iJGsYIfhpdRjJdusXAI"
var gages = new google.maps.FusionTablesLayer({
  query: {
    select: 'geometry',
    from: gagesID
  },
  
});


var markersArray = [];
	
	function drawVisualization() {	  
	  var query = new google.visualization.Query(
		'https://docs.google.com/spreadsheet/pub?key=0Ag_a8kjSvmjfdFowZFlsTHZOc1Zsb0RiUXV2NjRXcHc&single=true&gid=0&output=html');  //Main Data sheet of Spreadsheet

		query.send(handleQueryResponse);
		
		var cBox = document.getElementById('AWCcheck');
		cBox.checked = false;
		// cBox = document.getElementById('LScheck');
		// cBox.checked = false;
	  }
	  
	  function handleQueryResponse(response) {
		if (response.isError()) {
		alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
		}


		dataTab = response.getDataTable();
		
		// Define a StringFilter control for the '' column
		
		// Define a Category control for the '' column
				roadFilter = new google.visualization.ControlWrapper({
					'controlType': 'CategoryFilter',
					'containerId': 'culvertComboFilter_div',
					'options': {
					  'filterColumnIndex': 3,
					  //'cssClass': 'comboBox',
					  'ui': {'labelStacking': 'horizontal',
					  'selectedValuesLayout': 'belowStacked' // 'height': '150px'},
						}
					}
				  });
			  
		
		
		
		/*
		culvertStringFilter = new google.visualization.ControlWrapper({
				'controlType': 'StringFilter',
				'containerId': 'culvertStringFilter_div',
				'options': {
				  'filterColumnIndex': 0,
				  'matchType': 'any',
				  "ui": {'labelStacking': 'vertical'},
				}
			  });
		*/
		
			  
		// Define a table visualization 
			  table = new google.visualization.ChartWrapper({
				'chartType': 'Table',
				'containerId': 'table_div',
				'view': {'columns': [5,6]} ,
				//"allowHtml": true,
				//'options': {'showRowNumber': 'true', }
				'options': {'pageSize': 5}
					
				});
		
		
		//////////////////////////////
		
		// Create the dashboard.
		dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div')).
		// Configure the string filter to affect the table contents
		bind([roadFilter], table);
		
		//google.visualization.events.addListener(roadFilter, 'statechange', filt);
		
		
		//set event listener
		//google.visualization.events.addListener(table, 'ready', drawBarChart);
		
		// Draw the dashboard
		dashboard.draw(dataTab);
		
		
		
		

  	
	var cent = new google.maps.LatLng(62.3019, -145.3019);
	
	var lat;
	var lng;
	var title = "point title";
	
	
	var myOptions = {
		  zoom: 6,
		  center: cent,
		  mapTypeId: google.maps.MapTypeId.SATELLITE
		};
		
	map = new google.maps.Map(document.getElementById("map_canvas"),
			myOptions);

	var marker = new google.maps.Marker();
	
	var sLatLng;
	var num;
	

	for (i=0;i<=dataTab.getNumberOfRows()-1;i++)
	//for (i=0;i<=3;i++)
		{
		title = dataTab.getValue(i, 2);
		latlng = new google.maps.LatLng(dataTab.getValue(i, 0),dataTab.getValue(i, 1));
		
		var blue = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png'
		var red = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png'
		var yellow = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/yellow-dot.png'
		var green = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png'
	
		if(dataTab.getValue(i, 6)=="I"){
		marker = new google.maps.Marker({position: latlng, title: title, map: map, icon: red});	//http://maps.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png - red-dot.png
		}
		
		else if(dataTab.getValue(i, 6)=="II"){
		marker = new google.maps.Marker({position: latlng, title: title, map: map, icon: yellow});
		}
		
		else if(dataTab.getValue(i, 6)=="III"){
		marker = new google.maps.Marker({position: latlng, title: title, map: map, icon: blue});
		}
		
		else{
		marker = new google.maps.Marker({position: latlng, title: title, map: map, icon: green});
		}

		markersArray.push(marker);

		}

	


	for (i in markersArray) {
	  google.maps.event.addListener(markersArray[i], 'click', function() {clickMarker(this)})
    };  


	  //google.visualization.events.addListener(visTable, 'select', selectHandler);
	  google.visualization.events.addListener(table, 'select', selectHandler);
	  
	  //google.visualization.events.addListener(table.getChart(), 'select', selectHandler);
	  
	showAtts();
	};
	
	
	// function filt(){
		// table.getDataTable();
	// } 
	
	function selectHandler() {
		
		if (infowindow != null) infowindow.close();
		
		//var selection = visTable.getSelection();
		var selection = table.getChart().getSelection();
		
		var message = '';
		var culLat;
		var culLng;
		
			  for (var i = 0; i < selection.length; i++) {
				var item = selection[i];
				if (item.row != null) {
				  message += table.getDataTable().getFormattedValue(item.row, 2);
				  culLat = table.getDataTable().getFormattedValue(item.row, 0);
				  culLng = table.getDataTable().getFormattedValue(item.row, 1);
				} 
			  }
			  if (message == '') {
				message = 'nothing';
			  }

		infowindow = new google.maps.InfoWindow(
		  { 
			//content: message[number],
			//content: visTable.getSelection(),
			content: message,
			size: new google.maps.Size(30,30),
			position: new google.maps.LatLng(culLat, culLng)
			
		  });
		  infowindow.open(map);
		  map.setCenter(infowindow.position);
		  map.setZoom(12);
		  
		  showAtts();
		  showScatter();
		  showColumn();
		  
		  };
		  
		  //////////////
		  
		  function showAtts(){
		  //var selection = visTable.getSelection();
		  var selection = table.getChart().getSelection();
		
			var selValueArray = new Array();
			var selNameArray = new Array();
				
			
			
			
			
		  for (var i = 0; i < selection.length; i++) {
			var item = selection[i];
			if (item.row != null) {
				
				for (var n = 0; n <= 49; n++) {
					selNameArray[n] = table.getDataTable().getColumnLabel(n);
				}
				
				for (var n = 0; n <= 49; n++) {
					
					selValueArray[n] = table.getDataTable().getFormattedValue(item.row, n);
					
				}
				
				culCode = table.getDataTable().getFormattedValue(item.row, 2);
				//sketchCode = table.getDataTable().getFormattedValue(item.row, 49);

				
			

			} else if (item.column != null) {
			  var str = table.getDataTable().getFormattedValue(0, item.column);
			  message += '';
		};
	};
		  

		  	selectTableData = new google.visualization.DataTable();
		  
			  selectTableData.addColumn('string', '');
			  selectTableData.addColumn('string', '');
			  selectTableData.addRows(47);

			  
			  for (var n = 0; n <= 46; n++) {
			  	myN = n+3;
			  		//alert(n + " : " + selValueArray[n])
			  	selectTableData.setCell(n ,0, selNameArray[myN]);
			  	selectTableData.setCell(n ,1, selValueArray[myN]);
				
			  }
			  	  
		  

		var cssClassNames = {
			'headerRow': 'headerCell',
			};
			
		var options = {'allowHtml': true, 'cssClassNames': cssClassNames, 'showRowNumber':true};
		  
		var selectTable = new google.visualization.Table(document.getElementById('selectInfo_div'));
		
		selectTable.draw(selectTableData, options);	
		
		//draw images
		
		
		getImages();
		showScatter();
		showColumn();
		
		
		};//end of showAtts
		
		function showScatter(){
		
			var options = {
	          width: 325, height: 190,
	          title: "State ID - " + selectTableData.getValue(2,1),
	          hAxis: {title: 'Culvert Condition', gridlines: {count: 3}, viewWindowMode: 'explicit', viewWindow: {min: 0, max: 30} ,  minValue: 0, maxValue: 30},
	          vAxis: {title: 'Ecological Score', gridlines: {count: 3}, viewWindowMode: 'explicit', viewWindow: {min: 0, max: 30} , minValue: 0, maxValue: 30},
	          tooltip: {showColorCode: true},
	          colors: ['#000000'],
	          backgroundColor: 'transparent',
	          //backgroundColor: {opacity: "0.5"},
	          legend: 'none'
	        };


			var scatterTable = new google.visualization.DataTable();

			scatterTable.addColumn('number', 'Eco');
	        scatterTable.addColumn('number', 'Culvert Score vs. Ecological Score');
	        scatterTable.addRows([
	          [Number(selectTableData.getValue(17,1)), Number(selectTableData.getValue(21,1))]
	        ]);

			
			var scatterChart = new google.visualization.ScatterChart(document.getElementById('scatterPlot_div'));
        	
        	scatterChart.draw(scatterTable, options);
        	
        	/*
        	var chartBack = document.getElementById("scatterHolder");
        	var myURL = location.href;
        	var baseURL = myURL.substring(0, myURL.lastIndexOf('/'));
        	var imageURL = 'url(' + baseURL + 'img/scatterBack.png' + ')';

        	chartBack.style.backgroundImage = imageURL;
        	*/

			
		}; //end of showScatter
		
		
		function showColumn(){
		
		
			var options = {
	          width: 330, height: 220,
	          title: "State ID - " + selectTableData.getValue(2,1),
	          //hAxis: {title: ''},
	          vAxis: {title: 'Score', viewWindowMode: 'explicit', viewWindow: {min: 0, max: 61} , minValue: 0, maxValue: 61},
	          backgroundColor: {opacity: "0.0"},
	          legend: 'none'
	        };


			var columnTable = new google.visualization.DataTable();

			columnTable.addColumn('string', 'score');
			columnTable.addColumn('number', 'score');
	        
	        
	        columnTable.addRows([
	          [selectTableData.getFormattedValue(17,0), Number(selectTableData.getValue(17,1))],
	          [selectTableData.getFormattedValue(21,0), Number(selectTableData.getValue(21,1))],
	          [selectTableData.getFormattedValue(22,0), Number(selectTableData.getValue(22,1))],
	          [selectTableData.getFormattedValue(26,0), Number(selectTableData.getValue(26,1))],
	          [selectTableData.getFormattedValue(27,0), Number(selectTableData.getValue(27,1))]
	        ]);

			
			var columnChart = new google.visualization.ColumnChart(document.getElementById('columnChart_div'));
        	
        	columnChart.draw(columnTable, options);
			
		}; //end of showColumn
		
		
		function getImages() {
			  var queryImsSketches = new google.visualization.Query(
				'https://docs.google.com/spreadsheet/pub?key=0Ag_a8kjSvmjfdFowZFlsTHZOc1Zsb0RiUXV2NjRXcHc&single=true&gid=3&output=html');
		
				queryImsSketches.send(handleIMGs);
				
		  };
	  
		
		function handleIMGs(response) {
			
				

			
			
			if (response.isError()) {
			alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
			return;
			}
			
				var imgTab = response.getDataTable();
				var imgArray = new Array();
				
				
		
			for (var i = 0; i < imgTab.getNumberOfRows(); i++) {
			 		
			 	var codeValue = imgTab.getValue(i, 0);
			 		
			 	if(culCode == codeValue){
			 		imgArray.push(imgTab.getValue(i, 1));
			 	};
			 		
			 
				};
				
			var element = document.getElementById("banner");					
			if (element.childNodes != null){			
			 while (element.hasChildNodes()) {
    			element.removeChild(element.lastChild);
			}
			};
			
			/*
			element = document.getElementById("myUL");					
			if (element.childNodes != null){			
			 while (element.hasChildNodes()) {
    			element.removeChild(element.lastChild);
			}
			};
			
			*/

			var uList = document.createElement('ul');
					uList.id = 'myUL';
					uList.className = 'bjqs';
			
			for(var i = 0; i < imgArray.length; i++){
				
								
				var listItem = document.createElement('li');
						
				var aElem = document.createElement('a');
					aElem.href = imgArray[i];
					aElem.target = "_blank";
					
					
				var image = document.createElement('img');
					image.src = imgArray[i];
					image.setAttribute('width', '320');
					image.setAttribute('height', '240');
										
				aElem.appendChild(image);
				listItem.appendChild(aElem);
				uList.appendChild(listItem);
					
			};
			
			element.appendChild(uList);
			
			sliderGM()

			
			};	
				
			function sliderGM() {
        
		        $('#banner').bjqs({
		          'animation' : 'slide',
		          'width' : 320,
		          'height' : 240
		        });
		        
		     };
		

		  ///////////////////////////////////

	
		function clickMarker(mark){ 
			if (infowindow != null) infowindow.close();
			
			
			infowindow = new google.maps.InfoWindow(
				{ 
				content: mark.title,
				size: new google.maps.Size(30,30),
				position: mark.position
				});
			infowindow.open(map);
			map.setCenter(infowindow.position);
			map.setZoom(12);
			

			roadFilter.setState({'selectedValues': []});
			roadFilter.draw();

			
			
			for (i in markersArray){
				if (markersArray[i] == mark){
				//alert(i);
				
				//visTable.setSelection([{row:i}]);
				table.getChart().setSelection([{row:i}]);
				
				}
				}
			
			showAtts();
			
			
		};
							

	function clickAWC () {
		
		var cBox = document.getElementById('AWCcheck');
		if(cBox.checked != true){
			AWCLayer.setMap(null);
		}
		else{
			AWCLayer.setMap(map)};		
	  
	};
	
	function clickMileposts () {
		var cBox = document.getElementById('Milepostscheck');
		if(cBox.checked != true){
			milePosts.setMap(null);
		}
		else{
			milePosts.setMap(map)
			
			milePosts.enableMapTips({
                select: "'name'", // list of columns to query, typially need only one column.
                from: milePostsID, // fusion table name
                geometryColumn: 'geometry', // geometry column name
                suppressMapTips: false, // optional, whether to show map tips. default false
                delay: 300, // milliseconds mouse pause before send a server query. default 300.
                tolerance: 6 // tolerance in pixel around mouse. default is 6.
              });
			
			
			};		
	  
	};
	

	function clickBridges () {
		var cBox = document.getElementById('Bridgescheck');
		if(cBox.checked != true){
			
			bridges.setMap(null);
		}
		else{
			bridges.setMap(map)
			bridges.enableMapTips({
                select: "'name'", // list of columns to query, typially need only one column.
                from: bridgesID, // fusion table name
                geometryColumn: 'geometry', // geometry column name
                suppressMapTips: false, // optional, whether to show map tips. default false
                delay: 300, // milliseconds mouse pause before send a server query. default 300.
                tolerance: 6 // tolerance in pixel around mouse. default is 6.
              });
			
			};		
	  
	};
	
	function clickGages () {
		var cBox = document.getElementById('Gagescheck');
		if(cBox.checked != true){
			gages.setMap(null);
		}
		else{
			gages.setMap(map)
			gages.enableMapTips({
                select: "'description'", // list of columns to query, typially need only one column.
                from: gagesID, // fusion table name
                geometryColumn: 'geometry', // geometry column name
                suppressMapTips: false, // optional, whether to show map tips. default false
                delay: 300, // milliseconds mouse pause before send a server query. default 300.
                tolerance: 6 // tolerance in pixel around mouse. default is 6.
              });
			
			};		
	  
	};
	

	
	

	function clickSummary (){
		
		document.getElementById('scoringSum').click()
	};
	
