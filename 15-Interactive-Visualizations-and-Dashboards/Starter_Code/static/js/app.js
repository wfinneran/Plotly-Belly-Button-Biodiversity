function buildMetadata(sample) {

    d3.json("/metadata/"+ sample).then(function(data) {
      var selector = d3.select("#sample-metadata").html("");
      selector.html("");

      for (i = 0; i < 5; i++) {
        selector.append("text").html("<font size='1'>" 
          + Object.entries(data)[i][0] + ": " 
          + Object.entries(data)[i][1] + "</font><br>");  
      };
  
      selector.append("text").html("<font size='1'>SAMPLEID: " + Object.entries(data)[6][1] + "</font><br>");
  
    });  
  }
  
  function buildCharts(sample) {
  
    d3.json("/samples/"+ sample).then(function(data) {
  
      var otu_ids = data.otu_ids;
      var otu_labels = data.otu_labels;
      var sample_values = data.sample_values;

      var topTenOtuIds = data.otu_ids.slice(0,10).reverse();
      var topOtuLabels = data.otu_labels.slice(0,10).reverse();
      var topTenSampleValues = data.sample_values.slice(0,10).reverse();

      var OTU_id = topTenOtuIds.map(d => "OTU " + d);

      var trace = {
          x: topTenSampleValues,
          y: OTU_id,
          hovertext: topOtuLabels,
          type: 'bar',
          orientation:'h'
      };
  
      var data = [trace];

      var layout = {
        title: "Top 10 OTU",
        yaxis:{
            tickmode:"linear",
        }
      }
      Plotly.newPlot("bar", data, layout);
    
      var trace1 = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids
        },
        text: otu_labels
      };
  
      var data1 = [trace1];
  
      var layout = {
        showlegend: false
      };
  
      Plotly.newPlot('bubble', data1, layout);
    
    });
  }
  
  function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text("BB_" + sample)
          .property("value", sample);
      });

      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
  }

  init();