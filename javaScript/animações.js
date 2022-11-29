const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const boardgame = new Array(64);
let coordenate_x = 0;
let coordenate_y = 0;
let casa = 0;
let invertido;
let fals = false;
let tru = true;
let selectedPiece;
const colorgreen = "#70f24885";
const colorred = "#cb343475";
const colorgrey = "#6d6315b5";
const colorinv = "#f1f1f104";
const coloryellow = "#ece675ab";

class casas {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 33;
        this.height = 16;
        this.isFill = false;
        this.piece = null;
        this.set = false;
    }
    print(ctx, color) {
        ctx.strokeStyle = color;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }
    placePiece(obj) {
        this.piece = obj;
        this.isFill = true;

    }
    printFull(ctx, color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x + 1, this.y + 1, this.width, this.height);
        ctx.fill();

    }
    clear(ctx) {
        ctx.clearRect(this.x, this.y, 35, 19);
    }
    calcDistance(mouseX, mouseY) {
        var left = this.x
        var right = this.x + (this.width);
        var top = this.y;
        var bottom = this.y + (this.height);
        if (mouseX > left && mouseX < right && mouseY > top && mouseY < bottom) {
            return true;
        } else {
            return false;
        }
    }
    calcBoundery() {
        var left = this.x
        var right = this.x + (this.width);
        var top = this.y;
        var bottom = this.y + (this.height);


        if (left - 1 < 0 ||
            right + 5 > 300 ||
            top - 1 < 0 ||
            bottom + 10 > 150) {
            return true;
        } else {
            return false;
        }
    }
    bounderyLeft() {
        var left = this.x;
        if (left - 1 < 0) {
            return true;
        } else {
            return false;
        }
    }
    bounderyRight() {
        var right = this.x + (this.width);
        if (right + 5 > 300) {
            return true;
        } else {
            return false;
        }
    }
    bounderyTop() {
        var top = this.y;
        if (top - 1 < 0) {
            return true;
        } else {
            return false;
        }
    }
    bounderyBottom() {
        var bottom = this.y + (this.height);
        if (bottom + 10 > 150) {
            return true;
        } else {
            return false;
        }
    }

    setSetted(set) {
        this.set = set;
    }
    getSetted() {
        return this.set;
    }
    isFilled() {
        return this.isFill;
    }
    getPiece() {
        return this.piece;
    }
    getSetted() {
        return this.set;
    }
}

function render(ctx, invertido) {

    for (let i = 0; i < boardgame.length; i++) {

        boardgame[i] = new casas(coordenate_x, coordenate_y)
        coordenate_x += 37.8;
        casa++;
        if (casa == 8) {
            coordenate_y += 18.8;
            coordenate_x = 0;
            casa = 0;
        }
    }

    coordenate_x = 0;
    coordenate_y = 0;
    //peças negras
    boardgame[0].placePiece(new blackCastle(boardgame[0].x, boardgame[0].y)); boardgame[0].getPiece().printPiece(ctx, invertido);
    boardgame[1].placePiece(new blackKnight(boardgame[1].x, boardgame[1].y)); boardgame[1].getPiece().printPiece(ctx, invertido);
    boardgame[2].placePiece(new blackBishop(boardgame[2].x, boardgame[2].y)); boardgame[2].getPiece().printPiece(ctx, invertido);
    boardgame[3].placePiece(new blackQueen(boardgame[3].x, boardgame[3].y)); boardgame[3].getPiece().printPiece(ctx, invertido);
    boardgame[4].placePiece(new blackKing(boardgame[4].x, boardgame[4].y)); boardgame[4].getPiece().printPiece(ctx, invertido);
    boardgame[5].placePiece(new blackBishop(boardgame[5].x, boardgame[5].y)); boardgame[5].getPiece().printPiece(ctx, invertido);
    boardgame[6].placePiece(new blackKnight(boardgame[6].x, boardgame[6].y)); boardgame[6].getPiece().printPiece(ctx, invertido);
    boardgame[7].placePiece(new blackCastle(boardgame[7].x, boardgame[7].y)); boardgame[7].getPiece().printPiece(ctx, invertido);
    boardgame[8].placePiece(new blackPone(boardgame[8].x, boardgame[8].y)); boardgame[8].getPiece().printPiece(ctx, invertido);
    boardgame[9].placePiece(new blackPone(boardgame[9].x, boardgame[9].y)); boardgame[9].getPiece().printPiece(ctx, invertido);
    boardgame[10].placePiece(new blackPone(boardgame[10].x, boardgame[10].y)); boardgame[10].getPiece().printPiece(ctx, invertido);
    boardgame[11].placePiece(new blackPone(boardgame[11].x, boardgame[11].y)); boardgame[11].getPiece().printPiece(ctx, invertido);
    boardgame[12].placePiece(new blackPone(boardgame[12].x, boardgame[12].y)); boardgame[12].getPiece().printPiece(ctx, invertido);
    boardgame[13].placePiece(new blackPone(boardgame[13].x, boardgame[13].y)); boardgame[13].getPiece().printPiece(ctx, invertido);
    boardgame[14].placePiece(new blackPone(boardgame[14].x, boardgame[14].y)); boardgame[14].getPiece().printPiece(ctx, invertido);
    boardgame[15].placePiece(new blackPone(boardgame[15].x, boardgame[15].y)); boardgame[15].getPiece().printPiece(ctx, invertido);

    //peças brancas
    boardgame[48].placePiece(new whitePone(boardgame[48].x, boardgame[48].y)); boardgame[48].getPiece().printPiece(ctx, invertido);
    boardgame[49].placePiece(new whitePone(boardgame[49].x, boardgame[49].y)); boardgame[49].getPiece().printPiece(ctx, invertido);
    boardgame[50].placePiece(new whitePone(boardgame[50].x, boardgame[50].y)); boardgame[50].getPiece().printPiece(ctx, invertido);
    boardgame[51].placePiece(new whitePone(boardgame[51].x, boardgame[51].y)); boardgame[51].getPiece().printPiece(ctx, invertido);
    boardgame[52].placePiece(new whitePone(boardgame[52].x, boardgame[52].y)); boardgame[52].getPiece().printPiece(ctx, invertido);
    boardgame[53].placePiece(new whitePone(boardgame[53].x, boardgame[53].y)); boardgame[53].getPiece().printPiece(ctx, invertido);
    boardgame[54].placePiece(new whitePone(boardgame[54].x, boardgame[54].y)); boardgame[54].getPiece().printPiece(ctx, invertido);
    boardgame[55].placePiece(new whitePone(boardgame[55].x, boardgame[55].y)); boardgame[55].getPiece().printPiece(ctx, invertido);
    boardgame[56].placePiece(new whiteCastle(boardgame[56].x, boardgame[56].y)); boardgame[56].getPiece().printPiece(ctx, invertido);
    boardgame[27].placePiece(new whiteKnight(boardgame[27].x, boardgame[27].y)); boardgame[27].getPiece().printPiece(ctx, invertido);
    boardgame[58].placePiece(new whiteBishop(boardgame[58].x, boardgame[58].y)); boardgame[58].getPiece().printPiece(ctx, invertido);
    boardgame[59].placePiece(new whiteQueen(boardgame[59].x, boardgame[59].y)); boardgame[59].getPiece().printPiece(ctx, invertido);
    boardgame[47].placePiece(new whiteKing(boardgame[47].x, boardgame[47].y)); boardgame[47].getPiece().printPiece(ctx, invertido);
    boardgame[37].placePiece(new whiteBishop(boardgame[37].x, boardgame[37].y)); boardgame[37].getPiece().printPiece(ctx, invertido);
    boardgame[62].placePiece(new whiteKnight(boardgame[62].x, boardgame[62].y)); boardgame[62].getPiece().printPiece(ctx, invertido);
    boardgame[30].placePiece(new whiteCastle(boardgame[30].x, boardgame[30].y)); boardgame[30].getPiece().printPiece(ctx, invertido);

}
function constRender(ctx, inv) {
    ctx.clearRect(0, 0, canvas.width, canvas.Height);

    for (let i = 0; i < boardgame.length; i++) {
        if (boardgame[i].getPiece() != null) {
            boardgame[i].getPiece().printPiece(ctx, inv);

            if (boardgame[i].getPiece().getSelect()) {
                boardgame[i].printFull(ctx, coloryellow);
            }

            if (boardgame[i].getPiece().getAtacked()) {
                boardgame[i].printFull(ctx, colorred);
            }

        } else {
            boardgame[i].clear(ctx);
        }
        if (boardgame[i].getSetted()) {
            boardgame[i].printFull(ctx, colorgreen);
        }
    }
}

function movement(value) {
    if (value < boardgame.length) {
        if (boardgame[value].getPiece() == null) {
            boardgame[value].setSetted(true);
        } else {
            boardgame[value].getPiece().atacked = true;
        }
    }
}

class piece {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function draw(img, ctx, x, y) {
    ctx.drawImage(img, x, y, 35, 18);
}
function drawInv(img, ctx, x, y) {
    ctx.drawImage(img, x, y, 34, 34, x - 35, x - 18, 35, 18);
}
function printThis(ctx, x, y, inv, img) {

    if (inv == fals) {
        draw(img, ctx, x, y);
    } else {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI);
        drawInv(img, ctx, 0, 0);
        ctx.restore();
    }
}

class whiteCastle extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = fals;
        this.atacked = fals;
        this.team = 1;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return this.team;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "img/peças_brancas/white_Castle.ico";
        this.erasePiece(ctx);
        printThis(ctx, this.x, this.y, inv, image)
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {
        var initial = value;
        while (!boardgame[value].bounderyRight()) {
            value++;
            movement(value)
        }
        value = initial;
        while (!boardgame[value].bounderyLeft()) {
            value--;
            movement(value)
        }
        value = initial;
        while (!boardgame[value].bounderyBottom()) {
            value += 8;
            movement(value)
        }
        value = initial;
        while (!boardgame[value].bounderyTop()) {
            value -= 8;
            movement(value)
        }
    }
}

class whiteKing extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.team = 1;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return this.team;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "img/peças_brancas/white_King.ico";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image)

    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {
        var initial = value;
        if (!boardgame[value].bounderyRight()) {
            value++;
            movement(value)
        }
        value = initial;
        if (!boardgame[value].bounderyLeft()) {
            value--;
            movement(value)
        }
        value = initial;
        if (!boardgame[value].bounderyBottom()) {
            value += 8;
            movement(value)
        }
        value = initial;
        if (!boardgame[value].bounderyTop()) {
            value -= 8;
            movement(value)
        }
        value = initial;
        if (!boardgame[value].bounderyTop()) {
            value -= 9;
            movement(value)
        }
        value = initial;
        if (!boardgame[value].bounderyTop()) {
            value -= 7;
            movement(value)
        }
        value = initial;
        if (!boardgame[value].calcBoundery()) {
            value += 9;
            movement(value)
        }
        value = initial;
        if (!boardgame[value].bounderyRight()) {
            value += 7;
            movement(value)
        }
    }
}
class whiteBishop extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.team = 1;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        this.team = 1;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "img/peças_brancas/white_Bishop.ico";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {
        var initial = value;
        while (!boardgame[value].calcBoundery()) {
            value += 7;
            movement(value);
        }
        value = initial;
        while (!boardgame[value].calcBoundery()) {
            value += 9;
            movement(value);
        }
        value = initial;
        while (!boardgame[value].calcBoundery()) {
            value -= 7;
            movement(value);
        }
        value = initial;
        while (!boardgame[value].calcBoundery()) {
            value -= 9;
            movement(value);
        }

    }
}
class whiteKnight extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.team = 1;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return this.team;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "img/peças_brancas/white_Knight.ico";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {
        movement(value + 16 - 1);
        movement(value + 16 + 1);
        movement(value - 16 + 1);
        movement(value - 16 - 1);

        movement(value + 8 - 2);
        movement(value + 8 + 2);
        movement(value - 8 + 2);
        movement(value - 8 - 2);
    }
}
class whiteQueen extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.team = 1;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return this.team;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "img/peças_brancas/White_Queen.ico";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {
        var initial = value;
        while (!boardgame[value].bounderyRight()) {
            value++;
            movement(value)
        }
        value = initial;
        while (!boardgame[value].bounderyLeft()) {
            value--;
            movement(value)
        }
        value = initial;
        while (!boardgame[value].bounderyBottom()) {
            value += 8;
            movement(value)
        }
        value = initial;
        while (!boardgame[value].bounderyTop()) {
            value -= 8;
            movement(value)
        }
        value = initial;
        while (!boardgame[value].calcBoundery()) {
            value -= 9;
            movement(value)
        }
        value = initial;
        while (!boardgame[value].calcBoundery()) {
            value -= 7;
            movement(value)
        }
        value = initial;
        while (!boardgame[value].bounderyBottom()) {
            value += 9;
            movement(value)
        }
        value = initial;
        while (!boardgame[value].bounderyBottom()) {
            value += 7;
            movement(value)
        }
    }
}
class whitePone extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.firstMove = true;
        this.team = 1;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return this.team;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "img/peças_brancas/white_Pone.ico";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {
        if (!this.firstMove) {
            movement(value - 8);
            movement(value - 16);
        } else {
            movement(value - 8);
        }
    }
}

class blackCastle extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.team = 0;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return this.team;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "img/peças_negras/black_Castle.ico";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
}
class blackKing extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.team = 0;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return this.team;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "img/peças_negras/King.ico";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
}
class blackBishop extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.team = 0;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return this.team;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "img/peças_negras/Black_Bishop.ico";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
}
class blackKnight extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.team = 0;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return this.team;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "img/peças_negras/black_Knight.ico";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
}
class blackQueen extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.team = 0;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return this.team;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "img/peças_negras/Queen.ico";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
}
class blackPone extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.team = 0;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return this.team;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "img/peças_negras/black_Pone.ico";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
}

function desabilitarPlay() {
    document.querySelector("#play").disabled = true;
}
function habilitarPlay() {
    document.querySelector("#play").disabled = false;
}

function escolherCor(valor) {
    if (valor == "brancas") {
        canvas.style.rotate = "0deg";
        invertido = fals;
        render(context, invertido);
        habilitarPlay();

    } if (valor == "negras") {
        canvas.style.rotate = "180deg";
        invertido = tru;
        render(context, invertido)
        habilitarPlay();

    }

}


function play() {
    document.querySelector("#play").style.border = 0;
    document.querySelector("#play").disabled = true;
    document.querySelector("#brancas").disabled = true;
    document.querySelector("#negras").disabled = true;
    document.getElementById("vez").innerHTML = "é a vez das brancas";

    //hover
    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();

        let x = (event.clientX - rect.left) * canvas.width / rect.width;
        let y = (event.clientY - rect.top) * canvas.height / rect.height;

        constRender(context, invertido);
        for (i = 0; i < boardgame.length; i++) {

            if (boardgame[i].calcDistance(x, y)) {
                boardgame[i].printFull(context, colorgrey);
            }
        }
    })

    let valor;
    //select
    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        let x = (event.clientX - rect.left) * canvas.width / rect.width;
        let y = (event.clientY - rect.top) * canvas.height / rect.height;

        for (i = 0; i < boardgame.length; i++) {
            boardgame[i].setSetted(false);
            if (boardgame[i].getPiece() != null) {
                boardgame[i].getPiece().select = fals;
                boardgame[i].getPiece().atacked = fals;
            }
            if (boardgame[i].calcDistance(x, y)) {
                if (boardgame[i].getPiece() != null) {
                    boardgame[i].getPiece().select = tru;
                    selectedPiece = boardgame[i].getPiece();
                    valor = i;
                }

            } if (boardgame[i].getSetted()) {
                console.log(boardgame[i])
            }
        }
        selectedPiece.move(valor);
        constRender(context, invertido);

    })
    //mover
    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        let x = (event.clientX - rect.left) * canvas.width / rect.width;
        let y = (event.clientY - rect.top) * canvas.height / rect.height;

        for (i = 0; i < boardgame.length; i++) {
            if (boardgame[i].calcDistance(x, y)) {
             if (boardgame[i].getSetted()) {
               console.log("clicado")
            }
        }
        }
        constRender(context, invertido);


    })
}
