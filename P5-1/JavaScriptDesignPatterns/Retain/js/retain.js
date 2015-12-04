/* Udacity.com JavaScript Design Patterns course - 
   sample MVC app.

   - Does the model ever talk to the view directly ?
   - How about the view to the model ?

*/

$(function(){

    /* What dependencies does the model have?
    - localStorage.notes
    - NO dependency on 'octopus' or view
   */ 
    var model = {
        init: function() {
            if (!localStorage.notes) {
                localStorage.notes = JSON.stringify([]);
            }
        },
        add: function(obj) {
            //this will add the note object to the list, whatever it is
            var data = JSON.parse(localStorage.notes);
            data.push(obj);
            localStorage.notes = JSON.stringify(data);
        },
        getAllNotes: function() {
            return JSON.parse(localStorage.notes);
        }
    };


    /* Dependencies:
       - model
       - view
    */
    var octopus = {
        addNewNote: function(theDate, noteStr) {
            model.add({
                date: theDate, 
                content: noteStr
            });
            view.render();
        },

        getNotes: function() {
            return model.getAllNotes();
        },

        init: function() {
            model.init();
            view.init();
        }
    };

    /* Dependencies:
       - octopus
       - the html itself
    */
    var view = {
        init: function() {
            this.noteList = $('#notes');
            var newNoteForm = $('#new-note-form');
            var newNoteContent = $('#new-note-content');
            newNoteForm.submit(function(e){
                octopus.addNewNote(new Date().toDateString(), newNoteContent.val());
                newNoteContent.val('');
                e.preventDefault();
            });
            view.render();
        },
        render: function(){
            var htmlStr = '';
            octopus.getNotes().forEach(function(note){
                htmlStr += '<li class="note">'+
                        '<span class="note-date">' + note.date + "</span>" + note.content;
                    '</li>';
            });
            this.noteList.html( htmlStr );
        }
    };

    octopus.init();
});
