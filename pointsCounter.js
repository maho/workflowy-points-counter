  function getItemTags(item) {
    return WF.getItemNameTags(item).concat(WF.getItemNoteTags(item)).map((t) => t.tag.toLowerCase())
  }

  
  function wfitem(item) {
    if (item.data)
    	return item;
    
    return WF.getItemById(item.id);
  }
  
  function get_points_from_name(name) {
   	var re = /[\{\(\[](\d+)[\]\}\)]/;
    var match = name.match(re);
    if (!match) return 0
    
    return parseInt(match[1]) ?? 0
  }

  function get_individual_points(item) {
    var tags = getItemTags(item);
    var points = get_points_from_name(item.data.name);
    
    var ret = {};
    if (points) {
      for (var i in tags) {
        var tag = tags[i].replace(/^#/, "");
        ret[tag] = (ret[tag] ?? 0) + points;
      }
    }
    return ret;
    
  }

  function calc_new_note(old_note, points) {
    var re = /^points:[\S\s]*\n\n/;
    var pure_old_note = old_note.replace(re, "");
    if (!Object.keys(points).length) {
      return pure_old_note;
    };
    
    var formatted_points = ""
    for (var k in points) {
      var v = points[k];
      formatted_points += `    ${k}: ${v}\n`
    }
    
    return 'points: \n'+
    			 `${formatted_points}\n`+
      		 `${pure_old_note}`
  }

  function store_subtasks_points(item, points) {
    var item = wfitem(item);
    
    var old_note = item.data.note;
    var new_note = calc_new_note(old_note, points);
    item.subtasks_points = points;
    
    WF.setItemNote(item, new_note)
  }
  
  function parse_points_recursively(item) {
    if (item.isCompleted())
      return {};
    
  	var ret = {};
    
    var children = item.getChildren()
  	for (var k in children) {
      var v = children[k];
      var subpoints = parse_points_recursively(v);
      for (var tag in subpoints) {
      	var tagpoints = subpoints[tag];
        ret[tag] = (ret[tag] ?? 0) + tagpoints;
      }
    }    
    
    store_subtasks_points(item, ret)
    
    var indpoints = get_individual_points(item);
    for (var k in indpoints) {
      ret[k] = (ret[k] ?? 0) + indpoints[k];
    }
    
    return ret;
  }

  var item = WF.currentItem()
  parse_points_recursively(item)
