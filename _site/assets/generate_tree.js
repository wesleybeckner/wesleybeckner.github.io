function generate_tree(tree_json_path) {
  console.log("Generate Tree")
  console.log("json path:")
  console.log(tree_json_path)
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
  width = .65*window.innerWidth - margin.right - margin.left,
  height = window.innerHeight/2 - margin.top - margin.bottom;

  // keep track of how many trees have been drawn
  // (a hack for erasing tree if not the first)
  trees_drawn = trees_drawn + 1;
  console.log("trees_drawn: " + trees_drawn);
  //console.log("second tree?: " + (trees_drawn == 2)); 

  // delete the old tree if this function call is drawing a new tree. 
  if (trees_drawn > 1) {
    console.log("remove previous tree, then draw tree # " + trees_drawn)
    var svg = d3.select("#current_tree").remove();
  }

  // Variable i get used in `var_node` below. 
  var i = 0;

  // this function isn't being used as of 6/4/2014...
  // function separation(a, b) {
  //   return (a.parent == b.parent ? 1 : 7) / a.depth;
  // }

  var tree = d3.layout.tree()
    //.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2)/ a.depth; })
    .size([width*0.9, height]) // size option A: fixed width height/width for whole tree
    //.nodeSize([3, 3])  // size option B: fixed spacing between nodes
    ; 

  // lines to connect each parent/child node pair. 
  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y]; });

  var svg = d3.select("div#tree").append("svg")
    .attr("id", "current_tree")  // allow removal of tree upon slider movement
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
      .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Load our .json data exported from scikit-learn
  d3.json(tree_json_path, function(error, treeData) {
    root = treeData[0];
    update(root);
  });

  // ?? Is this continually being called?  
  function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 40; });

    // Declare the nodes:
    // Declare the variable / function node so that when we call it later it 
    // will know to select the appropriate object (a node) with the appropriate .id.
    var node = svg.selectAll("g.node")
      // ?? What's the deal with the || and the ++  (?)  (learn that javascript!! haha)
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // http://stackoverflow.com/questions/19297808/how-to-display-name-of-node-when-mouse-over-on-node-in-collapsible-tree-graph
    // You have to apply this to the node.enter().append("g") thing, 
    // *not* the circle made by nodeEnter.append("circle").  (need to understand better)
    var hoverLabelOn = function() {
      d3.select(this).append("text")
        .classed('info', true)
        .attr('x', 0)  // no offset (will be centered b/c of "middle" below
        .attr('y', -10)  // 10 pixels above the circle
        .attr('text-anchor', 'middle') // center test
        .text(function(d) {return d.name;})
      ;}

    var hoverLabelOff = function() {
      d3.select(this).select('text.info').remove()
      ;}

    // Enter the nodes.
    // assigns the variable / function nodeEnter to the action of appending
    // a node to a particular position
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")"; })
      .on("mouseout", hoverLabelOff )
      .on("mouseover", hoverLabelOn )
      ;

    var hoverCircleOn = function() {
      // http://stackoverflow.com/questions/19297808/how-to-display-name-of-node-when-mouse-over-on-node-in-collapsible-tree-graph
      var hoverCircle = d3.select(this);
        // note: the transition makes it possible for the node to remain enlarged
        // after you expect it to shrink (if you mouseout before it is done enlarging)
        hoverCircle.transition().duration(300)
          //.attr("r", hoverCircle.attr("r") * 1 + 10 );
          .attr("r", 9);
      }
   
    var hoverCircleOff = function() {
      var hoverCircle = d3.select(this);
        hoverCircle.transition().duration(300)
          .attr("r", 6); // leave them bigger for fun
    }

    // Plot circles, colored by the decision being made
    nodeEnter.append("circle")
      .attr("r", 6)
      // set node opacity based on traffic  
      .attr("opacity", function(d) { return 0.1 + d.percent*0.9/100})
      .style("fill", function(d) { return color_for_node(d.name); })
      .on("mouseover", hoverCircleOn )
      .on("mouseout", hoverCircleOff )
      ;

    // Declare the links
    // declare the link variable / function and tell it to make a link based on 
    // all the links that have unique target id’s
    // we only want to draw links between a node and it’s parent.
    var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

    // Enter the links.
    link.enter().insert("line", "g")
      .attr("class", "link")
      // make straight lines: http://www.harrysurden.com/wordpress/archives/581
      .attr("x1", function (d){
        return d.source.x;
      })
     .attr("y1", function (d){
       return d.source.y;
     })
     .attr("x2", function (d){
       return d.target.x;
     })
     .attr("y2", function (d){
       return d.target.y;
     })
    // thickness using the percent of points that went through the node 
    .attr("stroke-width", function(d) {
      //console.log(d.target['percent of samples']); 
      return 1 + d.target['percent']/10;})   
   ; 
   }
}

