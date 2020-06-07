function feature_from_node(node_name) { 
    // parse the node text to figure out what feature is being used at that node.  
    // example:  "Po2_flat > 0.021143555641174316" --> "Po2_flat"
    // test: feature_from_node(root['name'])
    return node_name.match(/^[a-z0-9_]+/gi)[0] ;    
}

function feature_to_color(feature_name) {
    // example: "Po2_flat" --> '#1F77B4'
    tableau10 =  ['#1F77B4', // dark blue
                  '#FF7F0E', // orange
                  '#2CA02C', // green
                  '#D62728', // red
                  '#9467BD', // purple
                  '#8C564B', // brown
                  '#CFECF9', // light blue
                  '#7F7F7F', 
                  '#BCBD22', 
                  '#17BECF']
    // example: "Po2_flat" --> "
    var matching_array = new Array();
    // feature_names = ['Height', 'Potential', 'Phase', 'Amplitude']
    matching_array['Potential'] = '#1F77B4'
    matching_array['Phase'] = '#FF7F0E'
    matching_array['Height'] = '#D62728'
    matching_array['Amplitude'] = '#2CA02C'   // what is the last feature? 

    return matching_array[feature_name]
}

function color_for_node(node_name) {
    // pass in a node name and get the color back
    // get the feature name
    feature_name = feature_from_node(node_name);
    // get the color
    color = feature_to_color(feature_name);
    // return the color
    return color;
}
