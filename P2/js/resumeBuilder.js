//Main entry point. 
// - gets json (async)
// - uses json to build html snippets from templates (see strings.js)
// - pulls image and location info out of json to build the map
function init() {

  var promises = [$.getJSON("js/bio.json"),
    $.getJSON("js/jobs.json"),
    $.getJSON("js/projects.json"),
    $.getJSON("js/education.json")
  ];

  $.when.apply($, promises).done(function(bio, work, projects, education) {

    //TODO: could do more here to check for failure to get JSON ...

    var bioJson = bio[0];
    var workJson = work[0];
    var projectsJson = projects[0];
    var educationJson = education[0];

    var bio = new Bio(bioJson);
    var tc = $("#topContacts");
    var fc= $("#footerContacts");
    bio.populateContacts(tc);
    bio.populateContacts(fc);
    bio.populateHeader();

    var work = new Work(workJson);
    work.populate();

    var projects = new Projects(projectsJson);
    projects.populate();

    var education = new Education(educationJson);
    education.populate();

    var locations = []
    var name = "location";
    locations = locations.concat(pullValuesFromJson(bioJson, name));
    locations = locations.concat(pullValuesFromJson(educationJson, name));
    locations = locations.concat(pullValuesFromJson(workJson, name));

    var images = projects.pullImageUrls();

    //in mapHelper.js:
    new Map().build(locations, images);
  });
}

// -- Json Helper Functions --
function pullValuesFromJson(json, name, output) {
  if (output == null)
    output = [];

  for (var item in json) {
    if (typeof json[item] == "object" && json[item] !== null)
      pullValuesFromJson(json[item], name, output);
    else if (item == name)
      output.push(json[item]);
  }
  return output;
}

//=================
//Class Definitions
//=================
//
//TODO: class defintions for bio, work, projects, education below. Going forward, I'd probably 
//      put these each in their own files

//---------
//Bio class
//---------
function Bio(data) {
  this.data = data;
}

Bio.prototype.populateHeader = function() {
  var header = $("#header");
  header.prepend(HTMLheaderName.replace("%data%", this.data.name));
  header.append(HTMLbioPic.replace("%data%", this.data.biopic));
  header.append(HTMLwelcomeMsg.replace("%data%", this.data.welcomeMessage));
  $.each(this.data.skills, function(a, skill) {
    header.append(HTMLskills.replace("%data%", skill));
  });
};

Bio.prototype.populateContacts = function(obj) {
  var htmlContact = HTMLcontactTemplate.replace("%mobile%", this.data.contact.mobile)
    .replace("%email%", this.data.contact.email)
    .replace("%twitter%", this.data.contact.twitter)
    .replace("%github%", this.data.contact.github)
    .replace("%location%", this.data.contact.location);

  obj.append(htmlContact);
};

//----------
//Work class
//----------
function Work(data) {
  this.data = data;
}

Work.prototype.populate = function() {
  h2 = $("#workExperience");
  $.each(this.data.jobs, function(key, val) {
    var workItemHtml = HTMLworkTemplate.replace("%employer%", val.employer)
      .replace("%employerUrl%", val.employerUrl)
      .replace("%title%", val.title)
      .replace("%dates%", val.dates)
      .replace("%location%", val.location)
      .replace("%description%", val.description);

    h2.append(HTMLworkStart);
    h2.append(workItemHtml);
  });
};

//--------------
//Projects class
//--------------
function Projects(data) {
  this.data = data;
}

Projects.prototype.populate = function() {
  h2 = $("#projects");
  $.each(this.data.projects, function(key, val) {
    var projectHtml = HTMLprojectTemplate.replace("%title%", val.title)
      .replace("%dates%", val.dates)
      .replace("%description%", val.description);

    $.each(val.images, function(a, image) {
      projectHtml += HTMLprojectTemplateImage.replace("%image%", image);
    });

    h2.append(HTMLprojectStart);
    h2.append(projectHtml);
  });
};

Projects.prototype.pullImageUrls = function() {
  var images = [];
  $.each(this.data.projects, function(key, val) {
    $.each(val.images, function(key, image) {
      images.push(image);
    });
  });
  return images;
};

//---------------
//Education class
//---------------
function Education(data) {
  this.data = data;
}

Education.prototype.populate = function() {
  h2 = $("#education");

  h2.append(HTMLschoolStart);
  $.each(this.data.schools, function(key, val) {
    var schoolHtmlMajors = "";
    $.each(val.majors, function(a, major) {
      schoolHtmlMajors += HTMLschoolTemplateMajor.replace("%major%", major);
    });

    var schoolHtml = HTMLschoolTemplate.replace("%name%", val.name)
      .replace("%degree%", val.degree)
      .replace("%dates%", val.dates)
      .replace("%location%", val.location)
      .replace("%majors%", schoolHtmlMajors);

    h2.append(schoolHtml);
  });

  h2.append(HTMLonlineClassesStart);
  $.each(this.data.onlineCourses, function(key, val) {
    var onlineClassesHtml = HTMLonlineClassesTemplate.replace("%title%", val.title)
      .replace("%school%", val.school)
      .replace("%date%", val.date)
      .replace("%url%", val.url);
    h2.append(onlineClassesHtml);
  });
};
