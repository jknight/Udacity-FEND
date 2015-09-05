function init() {

  var promises = [];
  promises.push(buildHeader());
  promises.push(populateWork());
  promises.push(populateProjects());
  promises.push(populateEducation());

  $.when.apply($, promises).done(function(bio, work, projects, education)
      {
        var locations = pullLocationsFromJson(bio[0], education[0], work[0]);
        var images = pullImageUrlsFromJson(projects[0]);
        buildMap(locations, images);
      });
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

function pullLocationsFromJson(bio, education, work) {
  //TODO: this should really be a recurisve function to pull anything called 'location' from json 

  var locations = [];

  locations.push(bio.contact.location);

  for (var school in education.schools) {
    locations.push(education.schools[school].location);
  }

  for (var job in work.jobs) {
    locations.push(work.jobs[job].location);
  }

  return locations;
}


function buildHeader() {

  return $.getJSON("js/bio.json", function(data) {
    var header = $("#header");
    header.prepend(HTMLheaderRole.replace("%data%", data.role));
    header.prepend(HTMLheaderName.replace("%data%", data.name));
    header.append(HTMLbioPic.replace("%data%", data.biopic));
    header.append(HTMLwelcomeMsg.replace("%data%", data.welcomeMessage));
    header.append(HTMLskillsStart);
    $.each(data.skills, function(a, skill) {
      header.append(HTMLskills.replace("%data%", skill));
    });

    var tc = $("#topContacts");
    //tc.append(HTMLcontactGeneric.replace("%contact%", "CONTACT").replace("%data%", ""));
    tc.append(HTMLmobile.replace("%data%", data.contact.mobile));
    tc.append(HTMLemail.replace("%data%", data.contact.email));
    tc.append(HTMLtwitter.replace("%data%", data.contact.twitter));
    tc.append(HTMLgithub.replace("%data%", data.contact.github));
    //tc.append(HTMLblog.replace("%data%", data.contact.blog));
    tc.append(HTMLlocation.replace("%data%", data.contact.location)); 
  });
}

function populateWork() {
  return $.getJSON("js/jobs.json", function(data) {
    h2 = $("#workExperience");
    $.each(data.jobs, function(key, val) {
      h2.append(HTMLworkStart);
      h2.append(HTMLworkEmployer.replace("%data%", val.employer));
      h2.append(HTMLworkTitle.replace("%data%", val.title));
      h2.append(HTMLworkDates.replace("%data%", val.dates));
      h2.append(HTMLworkLocation.replace("%data%", val.location));
      h2.append(HTMLworkDescription.replace("%data%", val.description));
    });
  });
}

function populateProjects() {
  return $.getJSON("js/projects.json", function(data) {
    h2 = $("#projects");
    $.each(data.projects, function(key, val) {
      h2.append(HTMLprojectStart);
      h2.append(HTMLprojectTitle.replace("%data%", val.title));
      h2.append(HTMLprojectDates.replace("%data%", val.dates));
      h2.append(HTMLprojectDescription.replace("%data%", val.description));
      $.each(val.images, function(a, image) {
        h2.append(HTMLprojectImage.replace("%data%", image));
      });
    });

  });
}

function populateEducation() {
  return $.getJSON( "js/education.json", function(data) {

    h2 = $("#education");

    $.each(data.schools, function(key, val) {
      h2.append(HTMLschoolStart);
      h2.append(HTMLschoolName.replace("%data%", val.name));
      h2.append(HTMLschoolDegree.replace("%data%", val.degree));
      h2.append(HTMLschoolDates.replace("%data%", val.dates));
      h2.append(HTMLschoolLocation.replace("%data%", val.location));
      $.each(val.majors, function(a, major) {
        h2.append(HTMLschoolMajor.replace("%data%", major));
      });
    });

    h2.append(HTMLonlineClasses);
    $.each(data.onlineCourses, function(key, val) {
      h2.append(HTMLonlineTitle.replace("%data%", val.title));
      h2.append(HTMLonlineSchool.replace("%data%", val.school));
      h2.append(HTMLonlineDates.replace("%data%", val.date));
      h2.append(HTMLonlineURL.replace("%data%", val.url));
    });

  });
}

function populateMap(bio, work, projects, education)
{
  console.log("bio", bio);
  console.log("work", work);
  console.log("projects", projects);
  console.log("education", education);
}

