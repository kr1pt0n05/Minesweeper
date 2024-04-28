const local_logic = {
    clickCounter : 0,
    size : 0,
    mines : 0,

    field : [],
    uncoveredCells : [],

    init : function(size, mines){
        this.clickCounter = 0;
        this.size = size;
        this.mines = mines;

        for(let i = 0; i < size; i++){
            this.field[i] = [];
            this.uncoveredCells[i] = [];
            for(let j = 0; j < size; j++){
                this.field[i].push(false);
                this.uncoveredCells[i].push(false);
            }
        }
    },

    placeMines : function(click_x, click_y){
        for(let i = 0; i < this.mines; i++){
            let minePlaced = false;

            while(minePlaced == false){
                const x = Math.floor(Math.random() * this.size);
                const y = Math.floor(Math.random() * this.size);

                if(this.field[x][y] != true && Math.abs(click_x - x) > 1 || Math.abs(click_y - y) > 1){
                    this.field[x][y] = true;
                    minePlaced = true;
                }
            }
        }
    },

    getNeighbors : function(x, y){
        const neighbors = [];
        let x_ = +x + +2;
        let y_ = +y + +2;

        for(let i = x-1; i < x_; i++){
            if(i < 0 || i > this.size-1) continue;

            for(let j = y-1; j < y_; j++){
                if(j < 0 || j > this.size-1) continue;
                    neighbors.push({"x": i, "y": j});
            }
        }
        return neighbors;
    },

    isInList: function(arr, x, y) {
        return arr.some(function(element) {
            return element.x == x && element.y == y;
        });
    },

         // check every adjacent cell of todo's cells if they got mines around them
            // if so: check if they got a bomb
                // if not: check if they are in done
                    // if not: put them into done
            // else: check if they are in todo, check if they are in done
                // if not: put them into todo
        // when finished: delete neighbor's checked cell out of todo and push into done
        // loop, until todo is empty

    getEmptyCells : function(x, y){
        const todo = [];
        const done = [];

        // put first cell into todo
        todo.push({"x": x, "y": y, "minesAround": 0});
        while(todo.length > 0){
            current_cell = todo[0];
            // get all neighboring cells
            const neighbors = this.getNeighbors(current_cell.x, current_cell.y);
            // handle neighbor depending, if they got a mine, mines around them or are already in done
            neighbors.forEach((neighbor) => {
                const x = neighbor.x;
                const y = neighbor.y;
                if(this.field[x][y] == false && !this.isInList(done, x, y)){
                    const mines = this.countMinesAroundCell(x, y);
                    const obj = {"x": x, "y": y, "minesAround": mines};

                    if(mines > 0){
                        done.push(obj);
                    }else{
                        if(!this.isInList(todo, x, y)){
                            todo.push(obj);
                        }
                    }
                }
            });
            // delete checked cell out of todo
            // and push into done
            todo.shift();
            done.push(current_cell);
        }
       return done;
    },

    countUncoveredCells : function(){
        let count = 0;
        this.uncoveredCells.forEach((row) => {
            row.forEach((cell) =>{
                if(cell) count++;
            })
        })
        return count;
    },

    sweep : function(x, y){
        this.clickCounter++;

        if(this.clickCounter == 1){
            this.placeMines(x, y);
        }

        this.uncoveredCells[x][y] = true;

        if(this.field[x][y] == true){
            return {"mineHit": true}

        }else{
            const mines = this.countMinesAroundCell(x,y);
            if(mines > 0){
                return {"mineHit": false, "mines": mines};

            }else{
                const emptyCells = this.getEmptyCells(x, y);
                emptyCells.forEach((cell) =>{
                    this.uncoveredCells[cell.x][cell.y] = true;
                })
                return {"mineHit": false, "mines": mines, "emptyCells": emptyCells};
            }   
        }
    },

    countMinesAroundCell : function(x, y){
        let mines = 0;
        
        let x_ = +x + +2;
        let y_ = +y + +2;

        for(let i = x-1; i < x_; i++){
            if(i < 0) continue;
            if(i > this.size-1) continue;

            for(let j = y-1; j < y_; j++){
                if(j < 0) continue;
                if(j > this.size-1) continue;

                if(this.field[i][j] == true){
                    mines++;
                }
            }
        }
        return mines;
    },

    getMines : function(){
        const mines = [];
        for(let i = 0; i<this.size; i++){
            for(let j = 0; j<this.size; j++){
                if(this.field[i][j]) mines.push({"x": i, "y": j});
            }
        }
        return mines;
    }
};

const minesweeper = {
    logic : local_logic,    

    difficulty : [
        {
            name : "easy",
            size : 8,
            mines: 10
        },
        {
            name : "medium",
            size : 12,
            mines : 22,
        },
        {
            name : "hard",
            size : 16,
            mines : 40,
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
        
        div.appendChild(p1);
        div.appendChild(document.createElement("br"));   
        div.innerHTML = `
        Credits:
        <br><a href="https://www.flaticon.com/free-icons/91" title="91 icons">Number icons created by Md Tanvirul Haque - Flaticon</a>
        <br><a href="https://www.flaticon.com/free-icons/bomb" title="bomb icons">Bomb icons created by Freepik - Flaticon</a>
        <br><a href="https://www.flaticon.com/free-icons/flag" title="flag icons">Flag icons created by Pixel perfect - Flaticon</a>
        <br><a href="https://www.artstation.com/artwork/XnY2XL" title="bomb background">Bomb background created by Sibylle Hell - Artstation</a>
    `; 
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

    rightClick : function(x, y){
        const cell = this.getCell(x, y);
        cell.classList.toggle("cell-symbol-flag");
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
                    event.preventDefault();
                    this.cellClicked(event);
                });

                cell.addEventListener("contextmenu", (event) =>{
                    event.preventDefault();
                    const x = event.target.dataset.x;
                    const y = event.target.dataset.y;
                    this.rightClick(x, y);
                });

                cell.addEventListener("touchstart", (event) =>{
                    event.preventDefault();
                    this.time = Date.now();
                });

                cell.addEventListener("touchend", (event) =>{
                    event.preventDefault();
                    const time_elapsed = Date.now() - this.time;
                    if(time_elapsed < 100){
                        this.cellClicked(event);
                    }else{
                        const x = event.target.dataset.x;
                        const y = event.target.dataset.y;
                        this.rightClick(x, y);
                    }
                });
                
                playarea.appendChild(cell);
            }
        }

    },

    startGame : function(gametype){
        this.difficulty.forEach((diff) => {
            if(gametype == diff.name){
                this.initPlayground(diff.size);
                this.logic.init(diff.size, diff.mines)
            }
        });
    },

    getCell : function(x, y){
        const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        return cell;
    },

    uncoverCell : function(x, y){
        const cell = this.getCell(x, y);
        cell.classList = "cell";
    },

    displayNumber : function(x, y, mines){
        const cell = this.getCell(x, y);
        cell.classList += ` cell-symbol-${mines}`;
    },

    playerWon : function(){
        return (this.logic.countUncoveredCells() + this.logic.mines) == (this.logic.size**2);
    },

    cellClicked : function(event){
        event.preventDefault();
        const x = event.target.dataset.x;
        const y = event.target.dataset.y;

        if(!this.getCell(x, y).classList.contains("cell-symbol-flag")){

            const hasHitMine = this.logic.sweep(x, y);
        
        if(hasHitMine.mineHit){
            this.uncoverCell(x, y);
            const cell = this.getCell(x, y);
            cell.style.backgroundColor = "crimson";

            const minesLeft = this.logic.getMines();
            minesLeft.forEach((mine) =>{
                const x = mine.x;
                const y = mine.y;
                const cell = this.getCell(x, y);

                this.uncoverCell(x, y);
                cell.classList += " cell-symbol-bomb";
            })
            this.displayOverlay("You lost!");
        }else{
            const emptyCells = hasHitMine.emptyCells;

            this.uncoverCell(x, y);
            const mines = hasHitMine.mines;
            this.displayNumber(x, y, mines);

            if(emptyCells != undefined){
                emptyCells.forEach((cell) =>{
                    this.uncoverCell(cell.x, cell.y);
                    this.displayNumber(cell.x, cell.y, cell.minesAround);
                })
            }
        }
        if(this.playerWon()) this.displayOverlay("Congrats, you won!");
        }

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

    },

    displayOverlay : function(text){
        const overlay = document.createElement("div");
        const textholder = document.createElement("div");
        const playarea = document.getElementById("playarea");

        overlay.classList = "overlay";
        textholder.innerText = text;

        overlay.appendChild(textholder);
        playarea.appendChild(overlay);

    }
};


window.addEventListener("DOMContentLoaded", () => {
    minesweeper.init();
  });