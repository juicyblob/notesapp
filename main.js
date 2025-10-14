"use strict";

let notesTotal = document.querySelector('.title__counter');
let notes = document.querySelector('.notes');
let form = document.querySelector('.addnote');
let success = document.querySelector('.success-message');

function updateCounter() {
    notesTotal.textContent = localStorage.length;
}

updateCounter();

function getKeysForNotes() {
    if (localStorage.length == 0) return 'note0';
    let keysArr = [];
    for (let i = 0; i < localStorage.length; i++) {
        keysArr.push(localStorage.key(i));
    }
    return keysArr.sort((a, b) => { return a.localeCompare(b, undefined, { numeric: true})} );
}

function createNote(title, text, date, bgColor, dataId) {
    let div = document.createElement('div');
    div.className = 'note';
    div.dataset.id = dataId;
    div.style.backgroundColor = `var(${bgColor})`;
    div.insertAdjacentHTML('afterbegin', 
    `<h3 class="note__title">${title}</h3>
    <p class="note__text">${text}</p>
    <span class="note__date">${date}</span>
    <button class="note__delete-btn">x</button>`);
    notes.append(div);
}


function showNotes(hasNew) {
    if (localStorage.length != 0) {
        let keysArr = [];
        for (let i = 0; i < localStorage.length; i++) {
            keysArr.push(localStorage.key(i));
        }
        let sortKeys = getKeysForNotes();
        notes.replaceChildren();
        for (let key of sortKeys) {
            let note = JSON.parse(localStorage.getItem(key));
            createNote(note.caption, note.text, note.date, note.bgcolor, key);
        }
        if (hasNew) {
            notes.lastElementChild.classList.add('fadein');
            setTimeout(() => notes.lastElementChild.classList.remove('fadein'), 1400);
        }
    }
}

showNotes(false);

function addNote(caption, text, color) {
    let keysArr = getKeysForNotes();
    let lastNum = keysArr.at(-1).slice(4);
    let noteId = `note${+lastNum + 1}`;
    let noteData = {
        caption: caption,
        text: text,
        bgcolor: `--note-${color}`,
        date: getDate()
    };
    localStorage.setItem(noteId, JSON.stringify(noteData));

    function getDate() {
        let date = new Date();
        let day = addZero(date.getDate());
        let month = addZero(date.getMonth() + 1);
        let year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    function addZero(num) {
        return num < 10 ? "0" + num : num;
    }
}

function removeNote(button) {
    let parentNote = button.parentElement;
    let index = parentNote.dataset.id;
    localStorage.removeItem(index);
    updateCounter();
    showNotes(false);
}

function showSuccess() {
    success.classList.add('show');
    setTimeout(() => {
        success.classList.remove('show');
    }, 3400);
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    let formData = new FormData(this);
    addNote(formData.get('note-caption'), formData.get('note-text'), formData.get('note-color'));
    this.reset();
    showSuccess();
    updateCounter();
    showNotes(true);
});

notes.addEventListener('click', function(e) {
    if (e.target.tagName !== 'BUTTON') return;
    removeNote(e.target);
    
});