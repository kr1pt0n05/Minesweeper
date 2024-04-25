const minesweeper = {

    difficulty : [
        {
            name : "easy",
            size : 8,
            mines: 10
        },
        {
            name : "medium",
            size : 12,
            mines : 40
        },
        {
            name : "hard",
            size : 16,
            mines : 150
        }
    ],

    time : 0,

    createContentDiv : function(){
        const content = document.createElement("div");
        content.classList = "content";
        return content;
    },

    createHeader : function(){
        const header = document.createElement("header");
        const div = document.createElement("div");

        const heading = document.createElement("h1");
        heading.innerText = "Minesweeper";
        const heading2 = document.createElement("h4");
        heading2.innerText = "by Sandro Lipinski";

        div.appendChild(heading);
        div.appendChild(heading2);
        header.appendChild(div);
        
        return header;
    },

    createFooter : function(){
        const footer = document.createElement("footer");
        const div = document.createElement("div");
        const p1 = document.createElement("p");
        
        p1.innerText = "Credits:";

        div.appendChild(p1);
        div.appendChild(document.createElement("br"));
        div.innerHTML = "&copy Sandro Lipinski";    
        footer.appendChild(div);

        return footer;
    },

    createPlayarea : function(){
        const div = document.createElement("div");
        div.id = "playarea";

        return div;
    },

    createButtonbar : function(){
        const div = document.createElement("div");
        div.classList = "buttons";

        return div;
    },

    createSingleButton : function(id, desc){
        div = document.createElement("button");
        div.id = id;
        div.innerText = desc;

        return div;
    },

    initPlayground : function(size){
        const playarea = document.getElementById("playarea");
        playarea.innerHTML = "";
        const style_width = `calc((100%/ ${size}) - 2*var(--shadowsize))`;
        const style_height = `calc((100%/ ${size}) - 2*var(--shadowsize))`;

        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                const cell = document.createElement("div");
                cell.classList = "cell covered";
                cell.dataset.x = j;
                cell.dataset.y = i;
                cell.style.width = style_width;
                cell.style.height = style_height;

                cell.addEventListener("click", (event) =>{
                    this.cellClicked(event);
                });

                cell.addEventListener("contextmenu", (event) =>{
                    this.cellClicked(event);
                });

                cell.addEventListener("touchstart", (event) =>{
                    this.time = Date.now();
                });

                cell.addEventListener("touchend", (event) =>{
                    const time_elapsed = Date.now() - this.time;
                    if(time_elapsed < 200){
                        alert("left click");
                    }else{
                        alert("right click");
                    }

                    //this.cellClicked(event);
                });
                
                playarea.appendChild(cell);
            }
        }

    },

    startGame : function(gametype){
        this.difficulty.forEach((diff) => {
            if(gametype == diff.name){
                this.initPlayground(diff.size);
            }
        });
    },

    cellClicked : function(event){
        event.preventDefault();
        const x = event.target.dataset.x;
        const y = event.target.dataset.y;
        console.log(event);

    
    },

    init : function(){
        const body = document.body;
        const content = this.createContentDiv();
        const header = this.createHeader();
        const footer = this.createFooter();
        const playfield = this.createPlayarea();
        const buttonbar = this.createButtonbar();
        const button_easy = this.createSingleButton(1, "Easy");
        const button_medium = this.createSingleButton(2, "Medium");
        const button_hard = this.createSingleButton(3, "Hard");

        content.appendChild(header);
        content.appendChild(playfield);
        content.appendChild(buttonbar);
        buttonbar.appendChild(button_easy)
        buttonbar.appendChild(button_medium)
        buttonbar.appendChild(button_hard)
        content.appendChild(footer);
        body.appendChild(content);

        button_easy.addEventListener("click", () =>{
            this.startGame("easy");
        });

        button_medium.addEventListener("click", () =>{
            this.startGame("medium");
        });

        button_hard.addEventListener("click", () =>{
            this.startGame("hard");
        });

    }
};


window.addEventListener("DOMContentLoaded", () => {
    minesweeper.init();
  });