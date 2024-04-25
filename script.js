const minesweeper = {

    difficulty : {
        easy : {
            name : "easy",
            size : 8,
            mines: 10
        },
        medium : {
            name : "medium",
            size : 16,
            mines : 40
        },
        hard : {
            name : "hard",
            size : 24,
            mines : 150
        }
    },

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

    initPlayground : function(diff){
        const playarea = document.getElementById("playarea");
        playarea.innerHTML = "";

        size = this.difficulty.easy.size;
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                const cell = document.createElement("div");
                cell.classList = "cell covered";
                cell.dataset.x = i;
                cell.dataset.y = j;
                playarea.appendChild(cell);
            }
        }

    },

    init : function(){
        const body = document.body;
        const content = this.createContentDiv();
        const header = this.createHeader();
        const footer = this.createFooter();
        const playfield = this.createPlayarea();
        const buttonbar = this.createButtonbar();

        content.appendChild(header);
        content.appendChild(playfield);
        content.appendChild(buttonbar);
        buttonbar.appendChild(this.createSingleButton(1, "Easy"))
        buttonbar.appendChild(this.createSingleButton(2, "Medium"))
        buttonbar.appendChild(this.createSingleButton(3, "Hard"))
        content.appendChild(footer);
        body.appendChild(content);

        this.initPlayground("easy");
        
    }
};


window.addEventListener("DOMContentLoaded", () => {
    minesweeper.init();
  });