import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Note} from 'src/app/shared/note.module';
import { NotesService } from 'src/app/shared/notes.service';
@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
 /* animations: [
    trigger('itemAnim',[
      //entry animations
      transition('void => *',[
        //initial state
        style({
          height: 0,
          opacity:0,
          transfrom: 'scale(0.85)',
          'margin-bottom':0,

          //we have to expand out the padding properties
          paddingTop:0,
          paddingBottom:0,
          paddingRight:0,
          paddingLeft:0,
        }),
        //we first want to animate spacing (which includes height and margin)
        animate('50ms',style({
          height:'*',
          'margin-bottom':'*',

          paddingTop:'*',
          paddingBottom:'*',
          paddingLeft:'*',
          paddingRight:'*',

        })),
        animate(68)
      ]),
      transition('* => void',[
        //first scale up
        animate(50,style({
          transform:'scale(1.05)'
        })),
        //then scale down 
        animate(50,style({
          transform:'scale(1)',
          opacity:0.75
        })),
        animate('120ms ease-out',style({
          transform:'scale(0.68)',
          opacity:0
        })),
        animate('150ms ease-out',style({
          
          'margin-bottom':0,

          //we have to expand out the padding properties
          paddingTop:0,
          paddingBottom:0,
          paddingRight:0,
          paddingLeft:0,
        })),
      ])
    ]),
    trigger('listAnim',[
      transition('* => *',[
        query(':enter',[
          style({
             height: 0,
          opacity:0
          }),
          stagger(100,[
            animate('0.2s ease')
          ])
        ],{
          optional: true
        })
      ])
    ])
  ]*/
  //to implement above animation add [@itemAnim] to notes-list html in app-routerlink below [link] tag 
})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
 filteredNotes: Note[] = new Array<Note>();

 @ViewChild('filterInput') filterInputElRef: ElementRef<HTMLInputElement>; 

  constructor(private notesService: NotesService) { }

  ngOnInit(): void {
    //we want to retrive all notes from NotesService
    this.notes=this.notesService.getAll();
   // this.filteredNotes= this.notesService.getAll();
   this.filter('');
  }

  deleteNote(note: Note){
    let noteId= this.notesService.getId(note);
    this.notesService.delete(noteId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }


  generateNoteURL(note: Note){
    let noteId= this.notesService.getId(note);
    return noteId;
  }



filter(query: string){
  query= query.toLowerCase().trim();
  let allResults: Note[] = new Array<Note>();
  //split up the search into individual words
  let terms: string[] = query.split(' ');//splits on spaces
  //remove duplicate serach
terms= this.removeDuplicates(terms);
//compile all relevant results into all results array
terms.forEach(term => {
  let results: Note[] = this.relevantNotes(term);
  //append results to all results
  allResults =[...allResults, ...results]
});

//all results include duplicate notes and dnt show same note
let uniqueResults= this.removeDuplicates(allResults);
this.filteredNotes = uniqueResults;

//sort by relevancy
this.sortByRelevancy(allResults);


}
removeDuplicates(arr: Array<any>): Array<any>{
  let uniqueResults: Set<any> = new Set<any>();
  // loop through array
  arr.forEach(e => uniqueResults.add(e));


  return Array.from(uniqueResults);
}

relevantNotes(query: string) : Array<Note>{
  query=query.toLowerCase().trim();
  let relevantNotes =this.notes.filter(note => {
    if(note.title && note.title.toLowerCase().includes(query)){
      return true;

    }
    if(note.body && note.body.toLowerCase().includes(query)){
      return true;
    }
    else{
      return false;
    }
  })
  return relevantNotes;
}

sortByRelevancy(searchResults: Note[]){
  //calclate the relevancy of a note based on the number of times it appears in serach
let noteCountObj: Object={}; //format - key:value =>NoteId:number( note object id :count)

searchResults.forEach(note =>{
  let noteId = this.notesService.getId(note);

  if(noteCountObj[noteId]){
    noteCountObj[noteId]+=1;
  }else{
    noteCountObj[noteId]=1;
  }
})
this.filteredNotes= this.filteredNotes.sort((a: Note, b:Note)=>{
  let aId = this.notesService.getId(a);
  let bId = this.notesService.getId(b);

  let aCount =noteCountObj[aId];
  let bCount =noteCountObj[bId];

  return bCount-aCount;

})
}
}
