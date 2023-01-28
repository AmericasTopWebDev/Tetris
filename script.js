

document.addEventListener('DOMContentLoaded', () => {
    var width = 10;
    setInterval(game, 1000);
    

    const ScoreDisplay = document.querySelector("#score");
    const StartButton = document.querySelector("#start-button");
    gridArray = [];


    //The Tetrominos:

    const  LTetromino = [
        [0, width, 2*width, 2*width+1],
        [0, 1, 2, width],
        [1, 2, width+2, 2*width+2],
        [width+2, 2*width, 2*width+1, 2*width+2]
    ];

    const  JTetromino = [
        [2, width+2, 2*width+2, 2*width+1],
        [width, 2*width, 2*width+1, 2*width+2],
        [0, 1, width, 2*width],
        [0, 1, 2, width+2]
    ];

    const  TTetromino = [
        [0, 1, 2, width+1],
        [2,  width+1, width+2, 2*width+2],
        [width+1, 2*width, 2*width+1, 2*width+2],
        [0, width,  width+1, 2*width]
    ];

    const OTetromino = [
        [0, 1, width, width+1]
        ];


    class Tetromino {
        constructor(current_piece, current_rotation=0, name="L") {
            this.current_piece = current_piece;
            this.current_rotation = current_rotation;
            this.name = name;
        }
        get current() {
            return this.current_piece[this.current_rotation];
        }
    }

    const currentT = new Tetromino(LTetromino, 0);

    var currentPosition = 0;
    var currentLateralPos = 0;
    var rotation = 0;
    var the_tetrominos = [LTetromino, JTetromino, TTetromino, OTetromino];
    var names = ["L", "J", "T", "O"];
    // var current = the_tetrominos[0][0];

    for(i = 0; i < 210; i++) {
        const gridDiv = document.querySelector(".grid");
        const newDiv = document.createElement("div");
        gridDiv.appendChild(newDiv);
        gridArray.push(newDiv);
    }
    for(i=200; i<210;i++) {
        gridArray[i].classList.add("floor");
        gridArray[i].classList.add("taken");
    }

    init(); 

    function init() {
        
        draw();
    }

    function game() {
        gravitate();
    }

    function gravitate() {
        undraw();
        if(check_collision()==0){
            currentPosition += width;
            draw();
        }
        else{
            draw();
            currentT.current.forEach(index => {check_row(index + currentPosition)})
            spawnNew();
        }
    }

    function check_collision(pseudo=false) {
        var downstairs_neighbors = [];
        currentT.current.forEach(index => {
            if(!currentT.current.includes(index+width)){
            downstairs_neighbors.push(gridArray[currentPosition + index + width]);
            }
        })

        if(downstairs_neighbors.some(ele => ele.classList.contains('taken'))){
            if(!pseudo){
                currentT.current.forEach(index => gridArray[index+currentPosition].classList.add("taken"))
            }
            console.log("I'm stuck")
            
            return -1;
        }
        else{return 0;}
    }

    function check_row(grid_index) {
        let row = Math.floor(grid_index / width);
        row *= 10;
        let full = true;
        for(i = row; i < (row+10); i++){
            if(!gridArray[i].classList.contains("taken")){
                full = false;
            }
        }
        console.log("I checked indices:"+row+"to"+(row+10))
        console.log("And I think that it is" + full);
        if(full){
            for(i = row; i < (row+10); i++){
                gridArray[i].classList.remove("taken");
                gridArray[i].classList.remove("active");
            }

            for(i = row; i > 0; i--){
                if(gridArray[i].classList.contains("taken")){
                    if(i+width < 200){
                        gridArray[i+width].classList.add("taken", "active");
                        gridArray[i].classList.remove("taken", "active");
                    }
                }
            }
        }
    }

    function draw() {
        
            currentT.current.forEach(index => {
                //For tomorrow: crunch position increments with modulo
                (gridArray[index + currentPosition]).classList.add("active", currentT.name);
                
            })
        }
    

    function undraw() {
        currentT.current.forEach(index => {
            //For tomorrow: crunch position increments with modulo
            (gridArray[index + currentPosition]).classList.remove("active", currentT.name);
        })
    }

    function spawnNew(){
        currentPosition = 0;
        currentLateralPos = 0;
        let selection = Math.floor(Math.random() * the_tetrominos.length)
        currentT.current_piece = the_tetrominos[selection];
        currentT.name = names[selection]
        currentT.current_rotation = 0;
        draw();
    }
    function control(e) {
        if(e.keyCode === 38){
            spin()
        }
        if(e.keyCode === 40){
            gravitate();
        }
        if(e.keyCode === 37){
            goLeft();
        }
        if(e.keyCode === 39){
            goRight();
        }
    }

    function spin() {
        console.log(currentT.current.length)

        rotation = (currentT.current_rotation+1) % currentT.current_piece.length;
        undraw();
        currentT.current_rotation = rotation;
        if(check_collision()==0){
            draw();
        }
        else{
            rotation = Math.abs((rotation -1) % currentT.current_piece.length);
            draw();
        }
        
    }

    function goLeft() {
        undraw();
        let distFromWall = 9;
        currentT.current.forEach(index => {
            if((index+currentPosition)%10 < distFromWall){
                distFromWall = (index+currentPosition)%10;
            }
        })
        if(distFromWall > 0){
            currentPosition--;
        }
        if(check_collision(true)==0){
            draw();
        }
        else{
            currentPosition++;
            draw();
        }
    }

    function goRight() {
        undraw();
        let distFromWall = 9;
        currentT.current.forEach(index => {
            if((9 - (index+currentPosition)%10) < distFromWall){
                distFromWall = (9-(index+currentPosition)%10);
            }
        })
        if(distFromWall > 0){
            currentPosition++;
        }
        if(check_collision(true)==0){
            draw();
        }
        else{
            currentPosition--;
            draw();
        }
    }


    document.addEventListener('keydown', control)

    // draw();

} );