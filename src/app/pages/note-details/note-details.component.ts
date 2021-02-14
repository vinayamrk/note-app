import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Note } from 'src/app/shared/note.module';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {

  note: Note;
 noteId: number;
  new: boolean;


  constructor(private notesService: NotesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    //we want to find out if we are creating a new note or editing an exiting note
    this.note= new Note();
    this.route.params.subscribe((prarams: Params) => {
      if(prarams.id){
        this.note = this.notesService.get(prarams.id);
        this.noteId = prarams.id;
        this.new = false;
      }else{
        this.new=true;
      }
    })
   
  }
   
  

  onSubmit(form: NgForm){
    if(this.new){
      this.notesService.add(form.value);}
    else{
      this.notesService.update(this.noteId,form.value.title,form.value.body);
    }
    this.router.navigateByUrl('/');
}
  
 
  cancel(){
    this.router.navigateByUrl('/');
  }
  
}

