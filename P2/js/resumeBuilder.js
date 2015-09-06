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

    var tc = $("#topContacts");
    populateContacts(bioJson, tc);

    var tc = $("#footerContacts");
    populateContacts(bioJson, tc);

    populateHeader(bioJson);
    populateWork(workJson);
    populateProjects(projectsJson);
    populateEducation(educationJson);

    var locationName = "location";
    var locations = []
    locations = locations.concat(pullValuesFromJson(bioJson, locationName));
    locations = locations.concat(pullValuesFromJson(educationJson, locationName));
    locations = locations.concat(pullValuesFromJson(workJson, locationName));

    var images = pullImageUrlsFromJson(projectsJson);

    //in mapHelper.js:
    buildMap(locations, images);
  });
}

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

function pullImageUrlsFromJson(projects) {
  var images = [];
  $.each(projects.projects, function(key, val) {
    $.each(val.images, function(key, image) {
      images.push(image);
    });
  });
  return images;
}

function populateHeader(data) {
  var header = $("#header");

  //skipping these - don't really need them:
  //header.prepend(HTMLheaderRole.replace("%data%", data.role)); 
  //header.append(HTMLskillsStart); 
  
  header.prepend(HTMLheaderName.replace("%data%", data.name));
  header.append(HTMLbioPic.replace("%data%", data.biopic));
  header.append(HTMLwelcomeMsg.replace("%data%", data.welcomeMessage));
  $.each(data.skills, function(a, skill) {
    header.append(HTMLskills.replace("%data%", skill));
  });
}

function populateContacts(data, tc) {
  var htmlContact = HTMLcontactTemplate.replace("%mobile%", data.contact.mobile)
    .replace("%email%", data.contact.email)
    .replace("%twitter%", data.contact.twitter)
    .replace("%github%", data.contact.github)
    .replace("%location%", data.contact.location);

  tc.append(htmlContact);
}

function populateWork(data) {
  h2 = $("#workExperience");
  $.each(data.jobs, function(key, val) {
    var workItemHtml = HTMLworkTemplate.replace("%employer%", val.employer)
      .replace("%employerUrl%", val.employerUrl)
      .replace("%title%", val.title)
      .replace("%dates%", val.dates)
      .replace("%location%", val.location)
      .replace("%description%", val.description);

    h2.append(HTMLworkStart);
    h2.append(workItemHtml);
  });
}

function populateProjects(data) {
  h2 = $("#projects");
  $.each(data.projects, function(key, val) {
    var projectHtml = HTMLprojectTemplate.replace("%title%", val.title)
      .replace("%dates%", val.dates)
      .replace("%description%", val.description);

    $.each(val.images, function(a, image) {
      projectHtml += HTMLprojectTemplateImage.replace("%image%", image);
    });

    h2.append(HTMLprojectStart);
    h2.append(projectHtml);
  });
}

function populateEducation(data) {
  h2 = $("#education");

  h2.append(HTMLschoolStart);
  $.each(data.schools, function(key, val) {
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
  $.each(data.onlineCourses, function(key, val) {
    var onlineClassesHtml = HTMLonlineClassesTemplate.replace("%title%", val.title)
      .replace("%school%", val.school)
      .replace("%date%", val.date)
      .replace("%url%", val.url);
    h2.append(onlineClassesHtml);
  });
}
