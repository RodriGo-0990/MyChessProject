const canvas = document.querySelector("canvas");// tag canvas
const context = canvas.getContext("2d"); // essa constante chama os metodos de desenho do canvas
const display1 = document.querySelector("#tempo1");//relogio de cima
const display2 = document.querySelector("#tempo2");//relogio de baixo
const placar1 = document.querySelector("#placar1");//placar 1
const placar2 = document.querySelector("#placar2");//placar 2 
const boardgame = new Array(64);// locais das casas do tabuleiro
let coordenate_x = 0;//horizontal
let coordenate_y = 0;//vertical
let casa = 0;//usado para atualização do tabuleiro
let invertido;// um Boolean: se escolher as pretas o tabuleiro é invertido;
const brancas = 1; //time brancas
const pretas = 0; //time pretas
let isxeque;


//------variaveis IA--------//
let movimentosArray = new Array(10000)
let movimentoEncontrado;
let placarIA;
let timeIA;
//-------------------------//




//----movimentos IA-------//
class Movimentos {

    constructor(casaAtual_, casaDestino_, pieceIa, piecePlayer, pontos_) {
        this.casaAtual = casaAtual_;
        this.casaDestino = casaDestino_;
        this.pieceia = pieceIa;
        this.pieceplayer = piecePlayer;
        this.pontos = pontos_;
    }
    mover() {
        pontuacao(this.pieceplayer);
        casaAtual = this.casaAtual;
        casaDestino = this.casaDestino;
        this.casaAtual.clear(context); //apaga a imagem da peça na casa onde estava anteriormente.
        this.casaAtual.takeOffPiece(); //set null no atributo PEÇA da CASA anterior. 
        this.casaDestino.placePiece(instanciarClasse(this.pieceia, this.casaDestino.x, this.casaDestino.y));
    }
    tomar() {
        pontuacao(this.pieceplayer);
        casaAtual = this.casaAtual;
        casaDestino = this.casaDestino;
        this.casaAtual.clear(context); //apaga a imagem da peça na casa onde estava anteriormente.
        this.casaAtual.takeOffPiece(); //set null no atributo PEÇA da CASA anterior. 
        this.casaDestino.placePiece(instanciarClasse(this.pieceia, this.casaDestino.x, this.casaDestino.y));
        checkXequeMate(this.pieceplayer);
    }
}
function selecionarMovimentoAleatorio(array) {
    // Gera um índice aleatório entre 0 (inclusivo) e o tamanho do array (exclusivo)
    const indiceAleatorio = Math.floor(Math.random() * array.length);

    // Retorna o objeto correspondente ao índice aleatório
    return array[indiceAleatorio];
}

function checkBestMoves() {
    if (timeIA == turno) {
        for (index = 0; index < boardgame.length; index++) {

            if (boardgame[index].getPiece() != null &&
                boardgame[index].getPiece().getTeam() == turno) {

                boardgame[index].getPiece().move(index);

                for (j = 0; j < boardgame.length; j++) {

                    if (boardgame[j].getPiece() != null && boardgame[j].getPiece().getAtacked()) {
                        movimentosArray.unshift(new Movimentos(boardgame[index], boardgame[j], boardgame[index].getPiece(), boardgame[j].getPiece(), boardgame[j].getPiece().getPontos()));
                    }
                    if (boardgame[j].getSetted()) {
                        movimentosArray.unshift(new Movimentos(boardgame[index], boardgame[j], boardgame[index].getPiece(), null, 0));
                    }

                }
            }
            reset();
        }

        movimentosArray.sort((a, b) => b.pontos - a.pontos);
        movimentoEncontrado = movimentosArray[0];

        if (movimentoEncontrado.pontos == 0) {
            // IA MOVE PEÇA ALEATÒRIA
            movimentoEncontrado = selecionarMovimentoAleatorio(movimentosArray);
            if (movimentoEncontrado == undefined) {
                movimentoEncontrado = movimentosArray[Math.floor(Math.random() * 19) + 1];
                movimentoEncontrado.mover()
                playPiece()
            } else {
                movimentoEncontrado.mover();
                playPiece();
            }

        } else {
            //IA TOMA PEÇA
            movimentoEncontrado.tomar();
            playTakePiece();
        }
        checkXeque();
        constRender(context, invertido);

        movimentosArray = [];
    }
}
//-------------------------//





//-----variáveis de tempo--------
var segundosTempo1 = 59;
var minutosTempo1 = 4;
var segundosTempo2 = 59;
var minutosTempo2 = 4;
var tempo1;
var tempo2;
let placarBrancas = 0;
let placarPretas = 0;
//-------------------------------


//----variáveis de movimentação------
let turno;
let casaAtual;
let casaAtualY;
let casaDestino;
let casaDestinoY;
let selectedPiece;
let pecaEliminada;
let casaEnPassant;
let casaRoqueMove;
let casaRoqueDama;
let casaRoqueRei;
let torreDoRoque;
//-----------------------------------


//------cores------------------
const colorgreen = "#70f24885";
const colorred = "#cb343475";
const colorblue = "#068CCA"
const colorgrey = "#6d6315b5";
const colorOrangeRed = "#92060675";
//-----------------------------


//--------sons-------------
const audioButtonPlay = new Audio();
audioButtonPlay.src = "./sounds/botão.mp3";

const audioClockPlay = new Audio();
audioClockPlay.src = "./sounds/clock.mp3";

const audioWinPlay = new Audio();
audioWinPlay.src = "./sounds/win.mp3";

const audioPiece = new Audio();
audioPiece.src = "./sounds/chesspiece.mp3"

const audioClick = new Audio();
audioClick.src = "./sounds/click.mp3";

const audioPromoPawn = new Audio();
audioPromoPawn.src = "./sounds/promocao.mp3"

const audioXeque = new Audio();
audioXeque.src = "./sounds/xeque.mp3"

const audioMusic = new Audio();
audioMusic.src = "./sounds/music.mp3"
//--------------------------------------

//-----turno, xeque, xequemate------------
function trocarTurno() {//trocar vez na tela
    if (turno == brancas) {
        document.getElementById("vez").innerHTML = "é a vez das pretas";
        turno = pretas;

    } else {
        document.getElementById("vez").innerHTML = "é a vez das brancas";
        turno = brancas;
    }
    reset();
}
function verificarTurno() {
    var validarTurno;
    if (selectedPiece != null && selectedPiece.getTeam() == turno) {
        validarTurno = true;
    } else {
        validarTurno = false;
    }
    return validarTurno;
}
function alertTurno() {// para dizer quem ganhou.
    if (turno == brancas) {
        return "Pretas";
    } else {
        return "Brancas";
    }
}
function startTimer() {

    pausarTempo(turno);

    tempo1 = setInterval(function () {
        segundosTempo1--;//regressiva segundos
        if (segundosTempo1 < 0) {
            minutosTempo1--;
            segundosTempo1 = 59;
        }

        minutos = minutosTempo1 < 10 ? "0" + minutosTempo1 : minutosTempo1;
        segundos = segundosTempo1 < 10 ? "0" + segundosTempo1 : segundosTempo1;
        if (!invertido) {
            display1.textContent = minutos + ":" + segundos;
        } else {
            display2.textContent = minutos + ":" + segundos;
        }
        if (minutosTempo1 < 1 && segundosTempo1 < 31) {
            if (!invertido) {
                display1.style.backgroundColor = colorred;
            } else {
                display2.style.backgroundColor = colorred;
            }

            if (segundosTempo1 > 29) {
                playClockSound();
            }
        }

        //fim do tempo
        if (minutos == 0 && segundos == 0) {
            playWinSound()
            clearInterval(tempo1);
            setTimeout(function () {
                playTimeOverAlert();
                window.location.reload()
            }, 100)
        }

    }, 1000)

    tempo2 = setInterval(function () {
        segundosTempo2--;//regressiva segundos

        if (segundosTempo2 < 0) {
            minutosTempo2--;
            segundosTempo2 = 59;
        }

        minutos = minutosTempo2 < 10 ? "0" + minutosTempo2 : minutosTempo2;
        segundos = segundosTempo2 < 10 ? "0" + segundosTempo2 : segundosTempo2;
        if (invertido) {
            display1.textContent = minutos + ":" + segundos;
        } else {
            display2.textContent = minutos + ":" + segundos;
        }
        if (minutosTempo2 < 1 && segundosTempo2 < 31) {
            if (invertido) {
                display1.style.backgroundColor = colorred;
            } else {
                display2.style.backgroundColor = colorred;
            }

            if (segundosTempo2 > 29) {
                playClockSound();
            }
        }

        //fim do tempo
        if (minutos == 0 && segundos == 0) {
            playWinSound();
            clearInterval(tempo2);
            setTimeout(function () {
                playTimeOverAlert();
                window.location.reload();
            }, 100)

        }

    }, 1000)
    pausarTempo(turno);

}
function playTimeOverAlert() {//mensagem tempo esgotado
    alert("Tempo esgotado, " + alertTurno() + " vencem!")
}
function playXequeMateAlert() {//mensagem de xeque-mate
    alert("Xeque-Mate!!! " + alertTurno() + " vencem!");
}
function pausarTempo(turno) {
    if (turno == pretas) {
        clearInterval(tempo2);
    } else {
        clearInterval(tempo1);
    }
}
function checkXeque() {//conferir se o lance está em xeque
    isxeque = false;
    //move todos.
    for (index = 0; index < boardgame.length; index++) {
        if (boardgame[index].getPiece() != null) {
            boardgame[index].getPiece().move(index);
        }
    }
    //acha o rei e verifica se está em xeque
    for (int = 0; int < boardgame.length; int++) {
        var vez = turno == brancas ? "brancas" : "pretas"
        var Wking = new whiteKing(0, 0);
        var Bking = new blackKing(0, 0);
        boardgame[int].setInXeque(false);
        if (boardgame[int].getPiece() != null) {

            if (Object.is(boardgame[int].getPiece().constructor, Bking.constructor)) {

                if (boardgame[int].getPiece().getAtacked()) {
                    document.getElementById("vez").innerHTML = "xeque! é a vez das " + vez;
                    boardgame[int].setInXeque(true);
                    isxeque = true;
                    playXequeSound();
                }
            }//--- operação || (ou) por algum motivo não comparava os dois casos, então foi colocado separadamente.
            if (Object.is(boardgame[int].getPiece().constructor, Wking.constructor)) {

                if (boardgame[int].getPiece().getAtacked()) {
                    document.getElementById("vez").innerHTML = "xeque! é a vez das " + vez;
                    boardgame[int].setInXeque(true);
                    isxeque = true;
                    playXequeSound();
                }
            }

        }

    }
    reset();
    return isxeque;
}
function checkXequeMate(obj) {//xeque-mate!!!
    var Bking = new blackKing(0, 0);
    var Wking = new whiteKing(0, 0);

    if (Object.is(obj.constructor, Wking.constructor)) {
        playWinSound()
        setTimeout(function () {
            playXequeMateAlert();
            window.location.reload()
        }, 100)
    }
    if (Object.is(obj.constructor, Bking.constructor)) {
        playWinSound()
        setTimeout(function () {
            playXequeMateAlert();
            window.location.reload()
        }, 100)
    }
}
//----------------------------------------

//-----toca os Sons---
function playButtonSound() {
    audioButtonPlay.play();
}
function playClockSound() {
    audioClockPlay.play();
}
function playClickSound() {
    audioClick.play();
}
function playWinSound() {
    audioWinPlay.play();
}
function playPiece() {
    audioPiece.play();
}
function playPromoSound() {
    audioPromoPawn.play();
}
function playTakePiece() {
    audioPiece.play();
    audioButtonPlay.play();
}
function playXequeSound() {
    audioXeque.play();
}
function playMusic() {
    audioMusic.play();
}
function stopMusic() {
    if (audioMusic.muted) {
        audioXeque.muted = false;
        audioButtonPlay.muted = false;
        audioClockPlay.muted = false;
        audioWinPlay.muted = false;
        audioPromoPawn.muted = false;
        audioPiece.muted = false;
        audioMusic.muted = false;
        document.querySelector("#volume").style.backgroundImage = "url(./img/volume.png)";

    } else {
        audioXeque.muted = true;
        audioButtonPlay.muted = true;
        audioClockPlay.muted = true;
        audioWinPlay.muted = true;
        audioPromoPawn.muted = true;
        audioPiece.muted = true;
        audioMusic.muted = true;
        document.querySelector("#volume").style.backgroundImage = "url(./img/mudo.png)";
    }
}
//--------------------


//---------movimentação e ataques-------
function instanciarClasse(params, x, y) {
    trocarTurno();
    startTimer();
    /*
    *  Essa função compara as Classes e o Parametro em nível de objeto, 
    *  A classe igual ao parametro precisa ser instanciada no Array de casas para ser desenhada.
    */
    var obj = Object.prototype.constructor(params);

    /*peças brancas*/
    var Wpawn = new whitePawn(x, y);
    var Wbishop = new whiteBishop(x, y);
    var Wking = new whiteKing(x, y);
    var Wcaslte = new whiteCastle(x, y);
    var WKnight = new whiteKnight(x, y);
    var WQueen = new whiteQueen(x, y);

    /*peças pretas */
    var Bpawn = new blackPawn(x, y);
    var Bbishop = new blackBishop(x, y);
    var Bking = new blackKing(x, y);
    var Bcaslte = new blackCastle(x, y);
    var BKnight = new blackKnight(x, y);
    var BQueen = new blackQueen(x, y);

    cancelEnPassant(Wpawn, Bpawn);

    if (Object.is(obj.constructor, Wpawn.constructor)) {
        Wpawn.setFirstMove(false);//regra de primeiro movimento do peão.

        if (casaAtualY - casaDestinoY > 20) {// verifica se é passo duplo do peão, para a regra do EnPassant.
            Wpawn.setDoubleStep(true);
        } else {
            Wpawn.setDoubleStep(false);
        }

        if (casaDestino.bounderyTop()) {//regra de promoção do peão. se chegar ao topo....
            playPromoSound();
            return WQueen;//...promovido!
        } else {
            return Wpawn;//continua peão.
        }

    }
    if (Object.is(obj.constructor, Wbishop.constructor)) {
        return Wbishop;
    }
    if (Object.is(obj.constructor, Wking.constructor)) {
        Wking.setFirstMove(false);
        return Wking;
    }
    if (Object.is(obj.constructor, Wcaslte.constructor)) {
        Wcaslte.setFirstMove(false);
        return Wcaslte;
    }
    if (Object.is(obj.constructor, WKnight.constructor)) {
        return WKnight;
    }
    if (Object.is(obj.constructor, WQueen.constructor)) {
        return WQueen;
    }
    if (Object.is(obj.constructor, Bpawn.constructor)) {
        Bpawn.setFirstMove(false);//regra de primeiro movimento do peão.
        if (casaDestinoY - casaAtualY > 20) {// verifica se é passo duplo do peão, para a regra do EnPassant.
            Bpawn.setDoubleStep(true);
        } else {
            Bpawn.setDoubleStep(false);
        }

        if (casaDestino.bounderyBottom()) {//regra de promoção do peão. se chegar ao topo....
            playPromoSound();
            return BQueen;//...promovido!
        } else {
            return Bpawn;//continua peão.
        }
    }
    if (Object.is(obj.constructor, Bbishop.constructor)) {
        return Bbishop;
    }
    if (Object.is(obj.constructor, Bking.constructor)) {
        Bking.setFirstMove(false);
        return Bking;
    }
    if (Object.is(obj.constructor, Bcaslte.constructor)) {
        Bcaslte.setFirstMove(false);
        return Bcaslte;
    }
    if (Object.is(obj.constructor, BKnight.constructor)) {
        return BKnight;
    }
    if (Object.is(obj.constructor, BQueen.constructor)) {
        return BQueen;
    }
}
function instanciarTorre(x, y) {
    var obj = Object.prototype.constructor(torreDoRoque);
    var Wcaslte = new whiteCastle(x, y);
    var Bcaslte = new blackCastle(x, y);
    if (Object.is(obj.constructor, Wcaslte.constructor)) {
        return Wcaslte;
    }
    if (Object.is(obj.constructor, Bcaslte.constructor)) {
        return Bcaslte;
    }
}
function verificaAtaque(valor) {
    var valida = false;
    if (boardgame[valor].getPiece().getAtacked() && selectedPiece != null) {
        pecaEliminada = boardgame[valor].getPiece();
        casaAtual.clear(context);
        casaAtual.takeOffPiece();
        casaDestino = boardgame[valor];//para o caso de promoção do peão;
        boardgame[valor].clear(context);
        boardgame[valor].takeOffPiece();
        pontuacao(pecaEliminada);
        boardgame[valor].placePiece(instanciarClasse(selectedPiece, boardgame[valor].x, boardgame[valor].y));
        setTimeout(() => {
            checkBestMoves();

        }, 3000)
        checkXeque();
        valida = true;
        reset();
        playTakePiece();
        checkXequeMate(pecaEliminada);
    }
    return valida;
}
function movement(value, thisTeam) {
    //metodo genérico que pinta as casas de movimentação, iterando sobre o Array
    if (value <= boardgame.length && value >= 0) {
        if (boardgame[value].getPiece() == null) { //se a casa está vazia 
            boardgame[value].setSetted(true);// pinta de verde
        } else {
            var piece = boardgame[value].getPiece();//se a casa tem peça
            if (!thisTeam == piece.getTeam()) {//se a peça é do adversário
                piece.setAtacado(true);//pinta a casa de vermelho
            }
        }
    }
}
function pontuacao(peace) {
    var ponto;
    var obj = Object.prototype.constructor(peace);

    if (Object.is(obj.constructor, new whitePawn(0, 0).constructor) || Object.is(obj.constructor, new blackPawn(0, 0).constructor)) {
        ponto = 10;
    }

    if (Object.is(obj.constructor, new whiteKnight(0, 0).constructor) || Object.is(obj.constructor, new blackKnight(0, 0).constructor)) {
        ponto = 30;
    }

    if (Object.is(obj.constructor, new whiteBishop(0, 0).constructor) || Object.is(obj.constructor, new blackBishop(0, 0).constructor)) {
        ponto = 50;
    }

    if (Object.is(obj.constructor, new whiteCastle(0, 0).constructor) || Object.is(obj.constructor, new blackCastle(0, 0).constructor)) {
        ponto = 100;
    }

    if (Object.is(obj.constructor, new whiteQueen(0, 0).constructor) || Object.is(obj.constructor, new blackQueen(0, 0).constructor)) {
        ponto = 500;
    }

    if (Object.is(obj.constructor, new whiteKing(0, 0).constructor) || Object.is(obj.constructor, new blackKing(0, 0).constructor)) {
        ponto = 900;
    }
    pontuar(ponto)
}
function pontuar(ponto) {
    if (ponto == undefined) {
        ponto = 0;
    }
    if (turno == brancas) {
        placarBrancas = parseInt(placarBrancas + ponto);
        placarPretas = parseInt(placarPretas - ponto);
    }
    if (turno == pretas) {
        placarPretas = parseInt(placarPretas + ponto);
        placarBrancas = parseInt(placarBrancas - ponto);

    }
    if (invertido) {
        placarBrancas = placarBrancas == 0 ? placar1.innerHTML = "" : placar1.innerHTML = placarBrancas;
        placarPretas = placarPretas == 0 ? placar2.innerHTML = "" : placar2.innerHTML = placarPretas;
    }
    if (!invertido) {
        placarBrancas = placarBrancas == 0 ? placar2.innerHTML = "" : placar2.innerHTML = placarBrancas;
        placarPretas = placarPretas == 0 ? placar1.innerHTML = "" : placar1.innerHTML = placarPretas;
    }

}
function pawnAttack(value, thisTeam) {
    //método para o ataque do peão, só ele ataca e se move de forma diferente.
    if (value < boardgame.length) {
        if (boardgame[value].getPiece() != null) {
            var piece = boardgame[value].getPiece();
            casaDestino = boardgame[value];//para o caso de promoção;
            if (!thisTeam == piece.getTeam()) {
                piece.setAtacado(true);
            }
        }
    }
}
function checkWhiteRoqueMove(casaDaTorre, casaDoRoque) {
    var roqueValido;
    var obj;
    var WCastle = new whiteCastle(0, 0);
    if (boardgame[casaDaTorre].getPiece() != null) {
        obj = Object.prototype.constructor(boardgame[casaDaTorre].getPiece());
        if (Object.is(obj.constructor, WCastle.constructor)) {
            roqueValido = boardgame[casaDaTorre].getPiece().isFirstMove();
            if (roqueValido != false && isxeque != true) {
                boardgame[casaDoRoque].setRoqueMove(true);
                torreDoRoque = boardgame[casaDaTorre].getPiece();
            }
            if (casaDoRoque < casaDaTorre) {
                casaRoqueRei = boardgame[casaDaTorre];
            } else {
                casaRoqueDama = boardgame[casaDaTorre];
            }
        }
    }
}
function checkBlackRoqueMove(casaDaTorre, casaDoRoque) {
    var roqueValido;
    var obj;
    var BCastle = new blackCastle(0, 0);
    if (boardgame[casaDaTorre].getPiece() != null) {

        obj = Object.prototype.constructor(boardgame[casaDaTorre].getPiece());

        if (Object.is(obj.constructor, BCastle.constructor)) {
            roqueValido = boardgame[casaDaTorre].getPiece().isFirstMove();
            if (roqueValido != false && isxeque != true) {
                boardgame[casaDoRoque].setRoqueMove(true);
                torreDoRoque = boardgame[casaDaTorre].getPiece();
            }
            if (casaDoRoque < casaDaTorre) {
                casaRoqueRei = boardgame[casaDaTorre];
            } else {
                casaRoqueDama = boardgame[casaDaTorre];
            }
        }
    }
}
function checkBlackPawnEnPassant(value) {
    var enpassant;
    var obj;
    var Bpawn = new blackPawn(0, 0);
    if (boardgame[value].getPiece()) {
        obj = Object.prototype.constructor(boardgame[value].getPiece());
        if (Object.is(obj.constructor, Bpawn.constructor)) {
            enpassant = boardgame[value].getPiece().isDoubleStep();
        }
    }
    if (enpassant == true) {
        casaEnPassant = boardgame[value];
        boardgame[value - 8].setEnpassant(true);
    }
}
function checkWhitePawnEnPassant(value) {
    var enpassant
    var obj;
    var Wpawn = new whitePawn(0, 0);
    if (boardgame[value].getPiece()) {
        obj = Object.prototype.constructor(boardgame[value].getPiece());
        if (Object.is(obj.constructor, Wpawn.constructor)) {
            enpassant = boardgame[value].getPiece().isDoubleStep();
        }
    }
    if (enpassant == true) {
        casaEnPassant = boardgame[value];
        boardgame[value + 8].setEnpassant(true);
    }

}
function cancelEnPassant(Wpawn, Bpawn) {

    for (int = 0; int < boardgame.length; int++) {

        if (boardgame[int].getPiece() != null) {
            var obj = Object.prototype.constructor(boardgame[int].getPiece());

            if (Object.is(obj.constructor, Wpawn.constructor) ||
                Object.is(obj.constructor, Bpawn.constructor)) {
                boardgame[int].getPiece().setDoubleStep(false);
            }
        }
    }
}

//---------------------------------------


//------inicialização e atualização do Tabuleiro-------
function reset() {
    //apaga todas as cores nas casas, para alternar as peças escolhidas.
    for (let i = 0; i < boardgame.length; i++) {
        boardgame[i].setSetted(false);
        boardgame[i].setEnpassant(false);
        boardgame[i].setRoqueMove(false);
        if (boardgame[i].getPiece() != null && boardgame[i].getPiece().getAtacked() == true) {
            var piece = boardgame[i].getPiece();
            piece.setAtacado(false);
            piece.select = false;

        }

    }
}
function render(ctx, invertido) {

    // percorre o Array instanciando objetos "casas"
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
    //coloca as peças no jogo
    coordenate_x = 0;
    coordenate_y = 0;
    //peças pretas
    boardgame[0].placePiece(new blackCastle(boardgame[0].x, boardgame[0].y)); boardgame[0].getPiece().printPiece(ctx, invertido);
    boardgame[1].placePiece(new blackKnight(boardgame[1].x, boardgame[1].y)); boardgame[1].getPiece().printPiece(ctx, invertido);
    boardgame[2].placePiece(new blackBishop(boardgame[2].x, boardgame[2].y)); boardgame[2].getPiece().printPiece(ctx, invertido);
    boardgame[3].placePiece(new blackQueen(boardgame[3].x, boardgame[3].y)); boardgame[3].getPiece().printPiece(ctx, invertido);
    boardgame[4].placePiece(new blackKing(boardgame[4].x, boardgame[4].y)); boardgame[4].getPiece().printPiece(ctx, invertido);
    boardgame[5].placePiece(new blackBishop(boardgame[5].x, boardgame[5].y)); boardgame[5].getPiece().printPiece(ctx, invertido);
    boardgame[6].placePiece(new blackKnight(boardgame[6].x, boardgame[6].y)); boardgame[6].getPiece().printPiece(ctx, invertido);
    boardgame[7].placePiece(new blackCastle(boardgame[7].x, boardgame[7].y)); boardgame[7].getPiece().printPiece(ctx, invertido);
    boardgame[8].placePiece(new blackPawn(boardgame[8].x, boardgame[8].y)); boardgame[8].getPiece().printPiece(ctx, invertido);
    boardgame[9].placePiece(new blackPawn(boardgame[9].x, boardgame[9].y)); boardgame[9].getPiece().printPiece(ctx, invertido);
    boardgame[10].placePiece(new blackPawn(boardgame[10].x, boardgame[10].y)); boardgame[10].getPiece().printPiece(ctx, invertido);
    boardgame[11].placePiece(new blackPawn(boardgame[11].x, boardgame[11].y)); boardgame[11].getPiece().printPiece(ctx, invertido);
    boardgame[12].placePiece(new blackPawn(boardgame[12].x, boardgame[12].y)); boardgame[12].getPiece().printPiece(ctx, invertido);
    boardgame[13].placePiece(new blackPawn(boardgame[13].x, boardgame[13].y)); boardgame[13].getPiece().printPiece(ctx, invertido);
    boardgame[14].placePiece(new blackPawn(boardgame[14].x, boardgame[14].y)); boardgame[14].getPiece().printPiece(ctx, invertido);
    boardgame[15].placePiece(new blackPawn(boardgame[15].x, boardgame[15].y)); boardgame[15].getPiece().printPiece(ctx, invertido);

    //peças brancas
    boardgame[48].placePiece(new whitePawn(boardgame[48].x, boardgame[48].y)); boardgame[48].getPiece().printPiece(ctx, invertido);
    boardgame[49].placePiece(new whitePawn(boardgame[49].x, boardgame[49].y)); boardgame[49].getPiece().printPiece(ctx, invertido);
    boardgame[50].placePiece(new whitePawn(boardgame[50].x, boardgame[50].y)); boardgame[50].getPiece().printPiece(ctx, invertido);
    boardgame[51].placePiece(new whitePawn(boardgame[51].x, boardgame[51].y)); boardgame[51].getPiece().printPiece(ctx, invertido);
    boardgame[52].placePiece(new whitePawn(boardgame[52].x, boardgame[52].y)); boardgame[52].getPiece().printPiece(ctx, invertido);
    boardgame[53].placePiece(new whitePawn(boardgame[53].x, boardgame[53].y)); boardgame[53].getPiece().printPiece(ctx, invertido);
    boardgame[54].placePiece(new whitePawn(boardgame[54].x, boardgame[54].y)); boardgame[54].getPiece().printPiece(ctx, invertido);
    boardgame[55].placePiece(new whitePawn(boardgame[55].x, boardgame[55].y)); boardgame[55].getPiece().printPiece(ctx, invertido);
    boardgame[56].placePiece(new whiteCastle(boardgame[56].x, boardgame[56].y)); boardgame[56].getPiece().printPiece(ctx, invertido);
    boardgame[57].placePiece(new whiteKnight(boardgame[57].x, boardgame[57].y)); boardgame[57].getPiece().printPiece(ctx, invertido);
    boardgame[58].placePiece(new whiteBishop(boardgame[58].x, boardgame[58].y)); boardgame[58].getPiece().printPiece(ctx, invertido);
    boardgame[59].placePiece(new whiteQueen(boardgame[59].x, boardgame[59].y)); boardgame[59].getPiece().printPiece(ctx, invertido);
    boardgame[60].placePiece(new whiteKing(boardgame[60].x, boardgame[60].y)); boardgame[60].getPiece().printPiece(ctx, invertido);
    boardgame[61].placePiece(new whiteBishop(boardgame[61].x, boardgame[61].y)); boardgame[61].getPiece().printPiece(ctx, invertido);
    boardgame[62].placePiece(new whiteKnight(boardgame[62].x, boardgame[62].y)); boardgame[62].getPiece().printPiece(ctx, invertido);
    boardgame[63].placePiece(new whiteCastle(boardgame[63].x, boardgame[63].y)); boardgame[63].getPiece().printPiece(ctx, invertido);

}
function constRender(ctx, inv) {

    //aqui é zerado a tela do canvas
    ctx.clearRect(0, 0, canvas.width, canvas.Height);

    //e aqui atualiza a tela,percorrendo o Array,atualizando as casas... esse metodo é chamado várias vezes.
    for (let i = 0; i < boardgame.length; i++) {
        if (boardgame[i].getPiece() != null) {
            boardgame[i].getPiece().printPiece(ctx, inv);

            if (boardgame[i].getPiece().getAtacked()) {
                boardgame[i].printFull(ctx, colorred);
            }


        } else {
            boardgame[i].clear(ctx);
        }
        if (boardgame[i].getCasaInXeque()) {
            boardgame[i].printFull(ctx, colorOrangeRed);
        }
        if (boardgame[i].getSetted()) {
            boardgame[i].printFull(ctx, colorgreen);
        }
        if (boardgame[i].getEnpassant()) {
            boardgame[i].printFull(ctx, colorred);
        }
        if (boardgame[i].getRoqueMove()) {
            boardgame[i].printFull(ctx, colorblue);
        }

    }
}
//-----------------------------------------------------


//-----construtor de peças e classe casas----
class casas {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 33;
        this.height = 16;
        this.isFill = false;
        this.piece = null;
        this.set = false;
        this.casaEnPassant = false;
        this.casaRoqueMove = false;
        this.casainXeque = false;
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
    takeOffPiece() {
        this.piece = null;
        this.isFill = false;
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
    setEnpassant(set) {
        this.casaEnPassant = set;
    }
    setSetted(set) {
        this.set = set;
    }
    setRoqueMove(set) {
        this.casaRoqueMove = set;
    }
    setInXeque(set) {
        this.casainXeque = set;
    }
    setFill(set) {
        this.isFill = set;
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
    getEnpassant() {
        return this.casaEnPassant;
    }
    getRoqueMove() {
        return this.casaRoqueMove;
    }
    getCasaInXeque() {
        return this.casainXeque;
    }
}
class piece {
    //classe pai das classes de peça, todas recebem "coordenadas" quando forem instanciadas
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
//-------------------------------------------


//----desenhar peças-------
function draw(img, ctx, x, y) {//desenha imagem(as figuras das peças)
    ctx.drawImage(img, x, y, 35, 18);
}
function drawInv(img, ctx, x, y) {//desenha imagem invertida(se o tabuleiro está invertido)
    ctx.drawImage(img, x, y, 34, 34, x - 35, x - 18, 35, 18);
}
function printThis(ctx, x, y, inv, img) {//chama os metodos de desenho do canvas
    if (inv == false) {
        draw(img, ctx, x, y);
    } else {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI);
        drawInv(img, ctx, 0, 0);
        ctx.restore();
    }
}
//---------------------------



//--------peças brancas---------
class whiteCastle extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.firstmove = true;
    }
    setAtacado(set) {
        this.atacked = set;
    }
    getPontos() {
        return 100;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return brancas;
    }
    setFirstMove(set) {
        this.firstmove = set;
    }
    isFirstMove() {
        return this.firstmove;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "./img/peças_brancas/white_Castle.png";
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
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                movement(value, brancas);
                break;
            }
            movement(value, brancas)
        }
        value = initial;
        while (!boardgame[value].bounderyLeft()) {
            value--;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                movement(value, brancas);
                break;
            }
            movement(value, brancas);
        }
        value = initial;
        while (!boardgame[value].bounderyBottom()) {
            value += 8;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                movement(value, brancas);
                break;
            }
            movement(value, brancas)
        }
        value = initial;
        while (!boardgame[value].bounderyTop()) {
            value -= 8;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                movement(value, brancas);
                break;
            }
            movement(value, brancas);
        }
    }
}
class whiteKing extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.firstmove = true;
    }

    setAtacado(set) {
        this.atacked = set;
    }
    getPontos() {
        return 900;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return brancas;
    }
    setFirstMove(set) {
        this.firstmove = set;
    }
    isFirstMove() {
        return this.firstmove;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "./img/peças_brancas/white_King.png";
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
            movement(value, brancas)
        }
        value = initial;
        if (!boardgame[value].bounderyLeft()) {
            value--;
            movement(value, brancas)
        }
        value = initial;
        if (!boardgame[value].bounderyBottom()) {
            value += 8;
            movement(value, brancas)
        }
        value = initial;
        if (!boardgame[value].bounderyTop()) {
            value -= 8;
            movement(value, brancas)
        }
        value = initial;
        if (!boardgame[value].bounderyTop() && !boardgame[value].bounderyLeft()) {
            value -= 9;
            movement(value, brancas)
        }
        value = initial;
        if (!boardgame[value].bounderyTop() && !boardgame[value].bounderyRight()) {
            value -= 7;
            movement(value, brancas)
        }
        value = initial;
        if (!boardgame[value].bounderyBottom() && !boardgame[value].bounderyRight()) {
            value += 9;
            movement(value, brancas)
        }
        value = initial;
        if (!boardgame[value].bounderyBottom() && !boardgame[value].bounderyLeft()) {
            value += 7;
            movement(value, brancas)
        }
        value = initial;

        if (this.firstmove == undefined && boardgame[value + 1].getPiece() == null && boardgame[value + 2].getPiece() == null) {
            checkWhiteRoqueMove(value + 3, value + 2);
        }
        if (this.firstmove == undefined && boardgame[value - 1].getPiece() == null && boardgame[value - 2].getPiece() == null && boardgame[value - 3].getPiece() == null) {
            checkWhiteRoqueMove(value - 4, value - 2);
        }
    }
}
class whiteBishop extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
    }
    setAtacado(set) {
        this.atacked = set;
    }
    getPontos() {
        return 50;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return brancas;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "./img/peças_brancas/white_Bishop.png";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {

        var initial = value;// valor inicial, posição da peça no Array

        //valores para ajuste de posição
        const bounderyRightValueAjustDown = value + 7;
        const bounderyRightValueAjustUp = value - 9;
        const bounderyLeftValueAjustDown = value + 9;
        const bounderyLeftValueAjustUp = value - 7;

        //---------------------------------------------------------------------------------------
        //ajusta posição se a peça está na borda direita
        if (boardgame[value].bounderyRight() && bounderyRightValueAjustDown < boardgame.length) {
            if (boardgame[bounderyRightValueAjustDown].getPiece() == null) {
                movement(bounderyRightValueAjustDown, brancas)
                value = bounderyRightValueAjustDown;

            } if (boardgame[bounderyRightValueAjustDown].getPiece() != null && boardgame[bounderyRightValueAjustDown].getPiece().getTeam() == pretas) {
                movement(bounderyRightValueAjustDown, brancas);
            }
        }           //movimenta para a diagonal até chegar a borda esquerda abaixo
        while (!boardgame[value].bounderyRight() && !boardgame[value].bounderyBottom()) {
            if (boardgame[value].bounderyLeft() || boardgame[value].bounderyRight()) {
                break;
            }
            value += 7;
            if (boardgame[value].getPiece() != null) {
                if (boardgame[value].getPiece().getTeam() == brancas) {
                    break;
                } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                    movement(value, brancas);
                    break;
                }
            }
            movement(value, brancas);
        }
        //----------------------------------------------------------------------------------------
        value = initial;//volta a posição inicial

        //ajusta posição se a peça está na borda esquerda
        if (boardgame[value].bounderyLeft() && bounderyLeftValueAjustDown < boardgame.length) {
            if (boardgame[bounderyLeftValueAjustDown].getPiece() == null) {
                movement(bounderyLeftValueAjustDown, brancas)
                value = bounderyLeftValueAjustDown;

            } if (boardgame[bounderyLeftValueAjustDown].getPiece() != null && boardgame[bounderyLeftValueAjustDown].getPiece().getTeam() == pretas) {
                movement(bounderyLeftValueAjustDown, brancas);
            }
        }               //movimenta para a diagonal até chegar a borda direita abaixo
        while (!boardgame[value].bounderyRight() && !boardgame[value].bounderyBottom()) {
            if (boardgame[value].bounderyLeft() || boardgame[value].bounderyRight()) {
                break;
            }
            value += 9;
            if (boardgame[value].getPiece() != null) {
                if (boardgame[value].getPiece().getTeam() === brancas) {
                    break;
                } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                    movement(value, brancas);
                    break;
                }
            }
            movement(value, brancas);
        }
        //------------------------------------------------------------------------------------------
        value = initial;//volta a posição inicial

        //ajusta posição se a peça está na borda esquerda
        if (boardgame[value].bounderyLeft() && bounderyLeftValueAjustUp >= 0) {
            if (boardgame[bounderyLeftValueAjustUp].getPiece() == null) {
                movement(bounderyLeftValueAjustUp, brancas)
                value = bounderyLeftValueAjustUp;

            } if (boardgame[bounderyLeftValueAjustUp].getPiece() != null && boardgame[bounderyLeftValueAjustUp].getPiece().getTeam() == pretas) {
                movement(bounderyLeftValueAjustUp, brancas);
            }

        }               //movimenta para a diagonal até chegar a borda direita acima
        while (!boardgame[value].bounderyLeft() && !boardgame[value].bounderyTop()) {
            if (boardgame[value].bounderyLeft() || boardgame[value].bounderyRight()) {
                break;
            }
            value -= 7;
            if (boardgame[value].getPiece() != null) {
                if (boardgame[value].getPiece().getTeam() == brancas) {
                    break;
                } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                    movement(value, brancas);
                    break;
                }
            }
            movement(value, brancas);
        }
        //-----------------------------------------------------------------------------------------
        value = initial;//volta a posição inicial

        //ajusta posição se a peça está na borda direita
        if (boardgame[value].bounderyRight() && bounderyRightValueAjustUp >= 0) {
            if (boardgame[bounderyRightValueAjustUp].getPiece() == null) {
                movement(bounderyRightValueAjustUp, brancas)
                value = bounderyRightValueAjustUp;

            } if (boardgame[bounderyRightValueAjustUp].getPiece() != null && boardgame[bounderyRightValueAjustUp].getPiece().getTeam() == pretas) {
                movement(bounderyRightValueAjustUp, brancas);
            }
        }
        //movimenta para a diagonal até chegar a borda esquerda acima  
        while (!boardgame[value].bounderyLeft() && !boardgame[value].bounderyTop()) {
            if (boardgame[value].bounderyLeft() || boardgame[value].bounderyRight()) {
                break;
            }
            value -= 9;
            if (boardgame[value].getPiece() != null) {
                if (boardgame[value].getPiece().getTeam() == brancas) {
                    break;
                } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                    movement(value, brancas);
                    break;
                }
            }
            movement(value, brancas);
        }
    }
}
class whiteKnight extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
    }

    setAtacado(set) {
        this.atacked = set;
    }
    getPontos() {
        return 30;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return brancas;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "./img/peças_brancas/white_Knight.png";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {

        //movimento a direita-----------------------------------------
        if (value + 1 < boardgame.length) {
            if (!boardgame[value + brancas].bounderyRight() && !boardgame[value].bounderyRight()) {
                movement(value + 8 + 2, brancas);//L aberto abaixo a direita
                movement(value - 8 + 2, brancas);//L aberto acima a direita
            }

            if (!boardgame[value].bounderyRight()) {
                movement(value + 16 + 1, brancas);//L fechado abaixo a direita
                movement(value - 16 + 1, brancas);//L fechado acima a direita
            }
        }
        //------------------------------------------------------------

        //movimento a esquerda----------------------------------------
        if (value - 1 > 0) {
            if (!boardgame[value - 1].bounderyLeft() && !boardgame[value].bounderyLeft()) {
                if ((value + 8) < boardgame.length) { //ajuste para não causar NullPointer
                    movement(value + 8 - 2, brancas);
                }//L aberto abaixo a esquerda
                movement(value - 8 - 2, brancas);//L aberto acima a esquerda
            }
        }
        if (!boardgame[value].bounderyLeft()) {
            if ((value + 16) < boardgame.length) { //ajuste para não causar NullPointer
                movement(value + 16 - 1, brancas);
            }//L fechado abaixo a esquerda
            movement(value - 16 - 1, brancas);//L fechado acima a esquerda
        }

        //------------------------------------------------------------
    }
}
class whiteQueen extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
    }

    setAtacado(set) {
        this.atacked = set;
    }
    getPontos() {
        return 500;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return brancas;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "./img/peças_brancas/White_Queen.png";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {
        //================================== Movimentação horizontal e vertical ===================================
        var initial = value;
        while (!boardgame[value].bounderyRight()) {
            value++;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                movement(value, brancas);
                break;
            }
            movement(value, brancas)
        }


        value = initial;
        while (!boardgame[value].bounderyLeft()) {
            value--;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                movement(value, brancas);
                break;
            }
            movement(value, brancas);
        }


        value = initial;
        while (!boardgame[value].bounderyBottom()) {
            value += 8;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                movement(value, brancas);
                break;
            }
            movement(value, brancas)
        }


        value = initial;
        while (!boardgame[value].bounderyTop()) {
            value -= 8;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                movement(value, brancas);
                break;
            }
            movement(value, brancas);
        }

        value = initial;

        //===================================== Movimentação diagonal =====================================

        var initial2 = initial;

        //valores para ajuste de posição
        const bounderyRightValueAjustDown = value + 7;
        const bounderyRightValueAjustUp = value - 9;
        const bounderyLeftValueAjustDown = value + 9;
        const bounderyLeftValueAjustUp = value - 7;

        //---------------------------------------------------------------------------------------
        //ajusta posição se a peça está na borda direita
        if (boardgame[initial2].bounderyRight() && bounderyRightValueAjustDown < boardgame.length) {
            if (boardgame[bounderyRightValueAjustDown].getPiece() == null) {
                movement(bounderyRightValueAjustDown, brancas)
                initial2 = bounderyRightValueAjustDown;

            } if (boardgame[bounderyRightValueAjustDown].getPiece() != null && boardgame[bounderyRightValueAjustDown].getPiece().getTeam() == pretas) {
                movement(bounderyRightValueAjustDown, brancas);
            }
        }               //movimenta para a diagonal até chegar a borda esquerda abaixo
        while (!boardgame[initial2].bounderyRight() && !boardgame[initial2].bounderyBottom()) {
            if (boardgame[initial2].bounderyLeft() || boardgame[initial2].bounderyRight()) {
                break;
            }
            initial2 += 7;
            if (boardgame[initial2].getPiece() != null) {
                if (boardgame[initial2].getPiece().getTeam() == brancas) {
                    break;
                } if (boardgame[initial2].getPiece() != null && boardgame[initial2].getPiece().getTeam() == pretas) {
                    movement(initial2, brancas);
                    break;
                }
            }
            movement(initial2, brancas);
        }
        //----------------------------------------------------------------------------------------
        initial2 = initial;//volta a posição inicial

        //ajusta posição se a peça está na borda esquerda
        if (boardgame[initial2].bounderyLeft() && bounderyLeftValueAjustDown < boardgame.length) {
            if (boardgame[bounderyLeftValueAjustDown].getPiece() == null) {
                movement(bounderyLeftValueAjustDown, brancas)
                initial2 = bounderyLeftValueAjustDown;

            } if (boardgame[bounderyLeftValueAjustDown].getPiece() != null && boardgame[bounderyLeftValueAjustDown].getPiece().getTeam() == pretas) {
                movement(bounderyLeftValueAjustDown, brancas);
            }

        }               //movimenta para a diagonal até chegar a borda direita abaixo
        while (!boardgame[initial2].bounderyRight() && !boardgame[initial2].bounderyBottom()) {
            if (boardgame[initial2].bounderyLeft() || boardgame[initial2].bounderyRight()) {
                break;
            }
            initial2 += 9;
            if (boardgame[initial2].getPiece() != null) {
                if (boardgame[initial2].getPiece().getTeam() === brancas) {
                    break;
                } if (boardgame[initial2].getPiece() != null && boardgame[initial2].getPiece().getTeam() == pretas) {
                    movement(initial2, brancas);
                    break;
                }
            }
            movement(initial2, brancas);
        }
        //------------------------------------------------------------------------------------------
        initial2 = initial;//volta a posição inicial

        //ajusta posição se a peça está na borda esquerda
        if (boardgame[initial2].bounderyLeft() && bounderyLeftValueAjustUp >= 0) {
            if (boardgame[bounderyLeftValueAjustUp].getPiece() == null) {
                movement(bounderyLeftValueAjustUp, brancas)
                initial2 = bounderyLeftValueAjustUp;

            } if (boardgame[bounderyLeftValueAjustUp].getPiece() != null && boardgame[bounderyLeftValueAjustUp].getPiece().getTeam() == pretas) {
                movement(bounderyLeftValueAjustUp, brancas);
            }

        }               //movimenta para a diagonal até chegar a borda direita acima
        while (!boardgame[initial2].bounderyLeft() && !boardgame[initial2].bounderyTop()) {
            if (boardgame[initial2].bounderyLeft() || boardgame[initial2].bounderyRight()) {
                break;
            }
            initial2 -= 7;
            if (boardgame[initial2].getPiece() != null) {
                if (boardgame[initial2].getPiece().getTeam() == brancas) {
                    break;
                } if (boardgame[initial2].getPiece() != null && boardgame[initial2].getPiece().getTeam() == pretas) {
                    movement(initial2, brancas);
                    break;
                }
            }
            movement(initial2, brancas);
        }
        //-----------------------------------------------------------------------------------------
        initial2 = initial//volta a posição inicial

        //ajusta posição se a peça está na borda direita
        if (boardgame[initial2].bounderyRight() && bounderyRightValueAjustUp >= 0) {
            if (boardgame[bounderyRightValueAjustUp].getPiece() == null) {
                movement(bounderyRightValueAjustUp, brancas)
                initial2 = bounderyRightValueAjustUp;

            } if (boardgame[bounderyRightValueAjustUp].getPiece() != null && boardgame[bounderyRightValueAjustUp].getPiece().getTeam() == pretas) {
                movement(bounderyRightValueAjustUp, brancas);
            }

        }               //movimenta para a diagonal até chegar a borda esquerda acima  
        while (!boardgame[initial2].bounderyLeft() && !boardgame[initial2].bounderyTop()) {
            if (boardgame[initial2].bounderyLeft() || boardgame[initial2].bounderyRight()) {
                break;
            }
            initial2 -= 9;
            if (boardgame[initial2].getPiece() != null) {
                if (boardgame[initial2].getPiece().getTeam() == brancas) {
                    break;
                } if (boardgame[initial2].getPiece() != null && boardgame[initial2].getPiece().getTeam() == pretas) {
                    movement(initial2, brancas);
                    break;
                }
            }
            movement(initial2, brancas);
        }
    }

}
class whitePawn extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.firstmove = true;
        this.doubleStep = false;
    }
    setAtacado(set) {
        this.atacked = set;
    }
    getPontos() {
        return 10;
    }
    setDoubleStep(value) {
        this.doubleStep = value;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return brancas;
    }
    setFirstMove(set) {
        this.firstmove = set;
    }
    isFirstMove() {
        return this.firstmove;
    }
    isDoubleStep() {
        return this.doubleStep;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "./img/peças_brancas/white_Pone.png";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {
        //movimento para a frente
        if (this.firstmove == undefined && boardgame[value - 8].getPiece() == null && boardgame[value - 16].getPiece() == null) {
            movement(value - 8, brancas);
            movement(value - 16, brancas);
        } else if (boardgame[value - 8].getPiece() == null) {
            movement(value - 8, brancas);
        }
        //ataques na diagonal 
        if (!boardgame[value].bounderyRight()) {//se não tiver na beira direita, para não quebrar a linha
            pawnAttack(value - 7, brancas);
        }
        if (!boardgame[value].bounderyLeft()) {//se não tiver na beira esquerda, para não quebrar a linha
            pawnAttack(value - 9, brancas);
        }
        checkBlackPawnEnPassant(value + 1);
        checkBlackPawnEnPassant(value - 1);
    }
}
//-------------------------------


//---------peças pretas----------
class blackCastle extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.firstmove = true;
    }

    setAtacado(set) {
        this.atacked = set;
    }
    getSelect() {
        return this.select;
    }
    getPontos() {
        return 100;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return pretas;
    }
    setFirstMove(set) {
        this.firstmove = set;
    }
    isFirstMove() {
        return this.firstmove;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "./img/peças_negras/black_Castle.png";
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
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                movement(value, pretas);
                break;
            }
            movement(value, pretas)
        }
        value = initial;
        while (!boardgame[value].bounderyLeft()) {
            value--;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                movement(value, pretas);
                break;
            }
            movement(value, pretas);
        }
        value = initial;
        while (!boardgame[value].bounderyBottom()) {
            value += 8;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                movement(value, pretas);
                break;
            }
            movement(value, pretas)
        }
        value = initial;
        while (!boardgame[value].bounderyTop()) {
            value -= 8;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                movement(value, pretas);
                break;
            }
            movement(value, pretas);
        }
    }
}
class blackKing extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.firstmove = true;
    }

    setAtacado(set) {
        this.atacked = set;
    }
    getSelect() {
        return this.select;
    }
    getPontos() {
        return 900;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return pretas;
    }
    setFirstMove(set) {
        this.firstmove = set;
    }
    isFirstMove() {
        return this.firstmove;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "./img/peças_negras/black_King.png";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {
        var initial = value;
        if (!boardgame[value].bounderyRight()) {
            value++;
            movement(value, pretas)
        }
        value = initial;
        if (!boardgame[value].bounderyLeft()) {
            value--;
            movement(value, pretas)
        }
        value = initial;
        if (!boardgame[value].bounderyBottom()) {
            value += 8;
            movement(value, pretas)
        }
        value = initial;
        if (!boardgame[value].bounderyTop()) {
            value -= 8;
            movement(value, pretas)
        }
        value = initial;
        if (!boardgame[value].bounderyTop() && !boardgame[value].bounderyLeft()) {
            value -= 9;
            movement(value, pretas)
        }
        value = initial;
        if (!boardgame[value].bounderyTop() && !boardgame[value].bounderyRight()) {
            value -= 7;
            movement(value, pretas)
        }
        value = initial;
        if (!boardgame[value].bounderyBottom() && !boardgame[value].bounderyRight()) {
            value += 9;
            movement(value, pretas)
        }
        value = initial;
        if (!boardgame[value].bounderyBottom() && !boardgame[value].bounderyLeft()) {
            value += 7;
            movement(value, pretas)
        }
        value = initial;

        if (this.firstmove == undefined && boardgame[value + 1].getPiece() == null && boardgame[value + 2].getPiece() == null) {
            checkBlackRoqueMove(value + 3, value + 2);
        }
        if (this.firstmove == undefined && boardgame[value - 1].getPiece() == null && boardgame[value - 2].getPiece() == null && boardgame[value - 3].getPiece() == null) {
            checkBlackRoqueMove(value - 4, value - 2);
        }

    }
}
class blackBishop extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
    }

    setAtacado(set) {
        this.atacked = set;
    }
    getPontos() {
        return 50;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return pretas;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "./img/peças_negras/Black_Bishop.png";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {
        var initial = value;// valor inicial, posição da peça no Array

        //valores para ajuste de posição
        const bounderyRightValueAjustDown = value + 7;
        const bounderyRightValueAjustUp = value - 9;
        const bounderyLeftValueAjustDown = value + 9;
        const bounderyLeftValueAjustUp = value - 7;

        //---------------------------------------------------------------------------------------
        //ajusta posição se a peça está na borda direita
        if (boardgame[value].bounderyRight() && bounderyRightValueAjustDown < boardgame.length) {
            if (boardgame[bounderyRightValueAjustDown].getPiece() == null) {
                movement(bounderyRightValueAjustDown, pretas)
                value = bounderyRightValueAjustDown;

            } if (boardgame[bounderyRightValueAjustDown].getPiece() != null && boardgame[bounderyRightValueAjustDown].getPiece().getTeam() == brancas) {
                movement(bounderyRightValueAjustDown, pretas);
            }
        }           //movimenta para a diagonal até chegar a borda esquerda abaixo
        while (!boardgame[value].bounderyRight() && !boardgame[value].bounderyBottom()) {
            if (boardgame[value].bounderyLeft() || boardgame[value].bounderyRight()) {
                break;
            }
            value += 7;
            if (boardgame[value].getPiece() != null) {
                if (boardgame[value].getPiece().getTeam() == pretas) {
                    break;
                } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                    movement(value, pretas);
                    break;
                }
            }
            movement(value, pretas);
        }
        //----------------------------------------------------------------------------------------
        value = initial;//volta a posição inicial

        //ajusta posição se a peça está na borda esquerda
        if (boardgame[value].bounderyLeft() && bounderyLeftValueAjustDown < boardgame.length) {
            if (boardgame[bounderyLeftValueAjustDown].getPiece() == null) {
                movement(bounderyLeftValueAjustDown, pretas)
                value = bounderyLeftValueAjustDown;

            } if (boardgame[bounderyLeftValueAjustDown].getPiece() != null && boardgame[bounderyLeftValueAjustDown].getPiece().getTeam() == brancas) {
                movement(bounderyLeftValueAjustDown, pretas);
            }

        }               //movimenta para a diagonal até chegar a borda direita abaixo
        while (!boardgame[value].bounderyRight() && !boardgame[value].bounderyBottom()) {
            if (boardgame[value].bounderyLeft() || boardgame[value].bounderyRight()) {
                break;
            }
            value += 9;
            if (boardgame[value].getPiece() != null) {
                if (boardgame[value].getPiece().getTeam() === pretas) {
                    break;
                } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                    movement(value, pretas);
                    break;
                }
            }
            movement(value, pretas);
        }
        //------------------------------------------------------------------------------------------
        value = initial;//volta a posição inicial

        //ajusta posição se a peça está na borda esquerda
        if (boardgame[value].bounderyLeft() && bounderyLeftValueAjustUp >= 0) {
            if (boardgame[bounderyLeftValueAjustUp].getPiece() == null) {
                movement(bounderyLeftValueAjustUp, pretas)
                value = bounderyLeftValueAjustUp;

            } if (boardgame[bounderyLeftValueAjustUp].getPiece() != null && boardgame[bounderyLeftValueAjustUp].getPiece().getTeam() == brancas) {
                movement(bounderyLeftValueAjustUp, pretas);
            }


        }               //movimenta para a diagonal até chegar a borda direita acima
        while (!boardgame[value].bounderyLeft() && !boardgame[value].bounderyTop()) {
            if (boardgame[value].bounderyLeft() || boardgame[value].bounderyRight()) {
                break;
            }
            value -= 7;
            if (boardgame[value].getPiece() != null) {
                if (boardgame[value].getPiece().getTeam() == pretas) {
                    break;
                } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                    movement(value, pretas);
                    break;
                }
            }
            movement(value, pretas);
        }
        //-----------------------------------------------------------------------------------------
        value = initial;//volta a posição inicial

        //ajusta posição se a peça está na borda direita
        if (boardgame[value].bounderyRight() && bounderyRightValueAjustUp >= 0) {
            if (boardgame[bounderyRightValueAjustUp].getPiece() == null) {
                movement(bounderyRightValueAjustUp, pretas)
                value = bounderyRightValueAjustUp;
            } if (boardgame[bounderyRightValueAjustUp].getPiece() != null && boardgame[bounderyRightValueAjustUp].getPiece().getTeam() == brancas) {
                movement(bounderyRightValueAjustUp, pretas);
            }
        }
        //movimenta para a diagonal até chegar a borda esquerda acima  
        while (!boardgame[value].bounderyLeft() && !boardgame[value].bounderyTop()) {
            if (boardgame[value].bounderyLeft() || boardgame[value].bounderyRight()) {
                break;
            }
            value -= 9;
            if (boardgame[value].getPiece() != null) {
                if (boardgame[value].getPiece().getTeam() == pretas) {
                    break;
                } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                    movement(value, pretas);
                    break;
                }
            }
            movement(value, pretas);
        }
    }
}
class blackKnight extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
    }

    setAtacado(set) {
        this.atacked = set;
    }
    getPontos() {
        return 30;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return pretas;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "./img/peças_negras/black_knight.png";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {

        //movimento a direita-----------------------------------------
        if (value + 1 < boardgame.length) {
            if (!boardgame[value + 1].bounderyRight() && !boardgame[value].bounderyRight()) {
                movement(value + 8 + 2, pretas);//L aberto abaixo a direita
                movement(value - 8 + 2, pretas);//L aberto acima a direita
            }

            if (!boardgame[value].bounderyRight()) {
                movement(value + 16 + 1, pretas);//L fechado abaixo a direita
                movement(value - 16 + 1, pretas);//L fechado acima a direita
            }
        }
        //------------------------------------------------------------

        //movimento a esquerda----------------------------------------
        if (value - 1 > 0) {
            if (!boardgame[value - 1].bounderyLeft() && !boardgame[value].bounderyLeft()) {
                if ((value + 8) < boardgame.length) { //ajuste para não causar NullPointer
                    movement(value + 8 - 2, pretas);
                }//L aberto abaixo a esquerda
                movement(value - 8 - 2, pretas);//L aberto acima a esquerda
            }
        }
        if (!boardgame[value].bounderyLeft()) {
            if ((value + 16) < boardgame.length) {// ajuste para não causar NullPointer
                movement(value + 16 - 1, pretas);
            }//L fechado abaixo a esquerda
            movement(value - 16 - 1, pretas);//L fechado acima a esquerda
        }


        //------------------------------------------------------------
    }
}
class blackQueen extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
    }

    setAtacado(set) {
        this.atacked = set;
    }
    getPontos() {
        return 500;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return pretas;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "./img/peças_negras/Queen.png";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {
        //================================== Movimentação horizontal e vertical ===================================
        var initial = value;
        while (!boardgame[value].bounderyRight()) {
            value++;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                movement(value, pretas);
                break;
            }
            movement(value, pretas)
        }


        value = initial;
        while (!boardgame[value].bounderyLeft()) {
            value--;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                movement(value, pretas);
                break;
            }
            movement(value, pretas);
        }


        value = initial;
        while (!boardgame[value].bounderyBottom()) {
            value += 8;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                movement(value, pretas);
                break;
            }
            movement(value, pretas);
        }


        value = initial;
        while (!boardgame[value].bounderyTop()) {
            value -= 8;
            if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == pretas) {
                break;
            } if (boardgame[value].getPiece() != null && boardgame[value].getPiece().getTeam() == brancas) {
                movement(value, pretas);
                break;
            }
            movement(value, pretas);
        }

        value = initial;

        //===================================== Movimentação diagonal =====================================

        var initial2 = initial;

        //valores para ajuste de posição
        const bounderyRightValueAjustDown = value + 7;
        const bounderyRightValueAjustUp = value - 9;
        const bounderyLeftValueAjustDown = value + 9;
        const bounderyLeftValueAjustUp = value - 7;

        //---------------------------------------------------------------------------------------
        //ajusta posição se a peça está na borda direita
        if (boardgame[initial2].bounderyRight() && bounderyRightValueAjustDown < boardgame.length) {
            if (boardgame[bounderyRightValueAjustDown].getPiece() == null) {
                movement(bounderyRightValueAjustDown, pretas)
                initial2 = bounderyRightValueAjustDown;

            } if (boardgame[bounderyRightValueAjustDown].getPiece() != null && boardgame[bounderyRightValueAjustDown].getPiece().getTeam() == brancas) {
                movement(bounderyRightValueAjustDown, pretas);
            }
        }               //movimenta para a diagonal até chegar a borda esquerda abaixo
        while (!boardgame[initial2].bounderyRight() && !boardgame[initial2].bounderyBottom()) {
            if (boardgame[initial2].bounderyLeft() || boardgame[initial2].bounderyRight()) {
                break;
            }
            initial2 += 7;
            if (boardgame[initial2].getPiece() != null) {
                if (boardgame[initial2].getPiece().getTeam() == pretas) {
                    break;
                } if (boardgame[initial2].getPiece() != null && boardgame[initial2].getPiece().getTeam() == brancas) {
                    movement(initial2, pretas);
                    break;
                }
            }
            movement(initial2, pretas);
        }
        //----------------------------------------------------------------------------------------
        initial2 = initial;//volta a posição inicial

        //ajusta posição se a peça está na borda esquerda
        if (boardgame[initial2].bounderyLeft() && bounderyLeftValueAjustDown < boardgame.length) {
            if (boardgame[bounderyLeftValueAjustDown].getPiece() == null) {
                movement(bounderyLeftValueAjustDown, pretas)
                initial2 = bounderyLeftValueAjustDown;

            } if (boardgame[bounderyLeftValueAjustDown].getPiece() != null && boardgame[bounderyLeftValueAjustDown].getPiece().getTeam() == brancas) {
                movement(bounderyLeftValueAjustDown, pretas);
            }

        }               //movimenta para a diagonal até chegar a borda direita abaixo
        while (!boardgame[initial2].bounderyRight() && !boardgame[initial2].bounderyBottom()) {
            if (boardgame[initial2].bounderyLeft() || boardgame[initial2].bounderyRight()) {
                break;
            }
            initial2 += 9;
            if (boardgame[initial2].getPiece() != null) {
                if (boardgame[initial2].getPiece().getTeam() == pretas) {
                    break;
                } if (boardgame[initial2].getPiece() != null && boardgame[initial2].getPiece().getTeam() == brancas) {
                    movement(initial2, pretas);
                    break;
                }
            }
            movement(initial2, pretas);
        }
        //------------------------------------------------------------------------------------------
        initial2 = initial;//volta a posição inicial

        //ajusta posição se a peça está na borda esquerda
        if (boardgame[initial2].bounderyLeft() && bounderyLeftValueAjustUp >= pretas) {
            if (boardgame[bounderyLeftValueAjustUp].getPiece() == null) {
                movement(bounderyLeftValueAjustUp, pretas)
                initial2 = bounderyLeftValueAjustUp;

            } if (boardgame[bounderyLeftValueAjustUp].getPiece() != null && boardgame[bounderyLeftValueAjustUp].getPiece().getTeam() == brancas) {
                movement(bounderyLeftValueAjustUp, pretas);
            }

        }               //movimenta para a diagonal até chegar a borda direita acima
        while (!boardgame[initial2].bounderyLeft() && !boardgame[initial2].bounderyTop()) {
            if (boardgame[initial2].bounderyLeft() || boardgame[initial2].bounderyRight()) {
                break;
            }
            initial2 -= 7;
            if (boardgame[initial2].getPiece() != null) {
                if (boardgame[initial2].getPiece().getTeam() == pretas) {
                    break;
                } if (boardgame[initial2].getPiece() != null && boardgame[initial2].getPiece().getTeam() == brancas) {
                    movement(initial2, pretas);
                    break;
                }
            }
            movement(initial2, pretas);
        }
        //-----------------------------------------------------------------------------------------
        initial2 = initial//volta a posição inicial

        //ajusta posição se a peça está na borda direita
        if (boardgame[initial2].bounderyRight() && bounderyRightValueAjustUp >= 0) {
            if (boardgame[bounderyRightValueAjustUp].getPiece() == null) {
                movement(bounderyRightValueAjustUp, pretas)
                initial2 = bounderyRightValueAjustUp;

            } if (boardgame[bounderyRightValueAjustUp].getPiece() != null && boardgame[bounderyRightValueAjustUp].getPiece().getTeam() == brancas) {
                movement(bounderyRightValueAjustUp, pretas);
            }

        }               //movimenta para a diagonal até chegar a borda esquerda acima  
        while (!boardgame[initial2].bounderyLeft() && !boardgame[initial2].bounderyTop()) {
            if (boardgame[initial2].bounderyLeft() || boardgame[initial2].bounderyRight()) {
                break;
            }
            initial2 -= 9;
            if (boardgame[initial2].getPiece() != null) {
                if (boardgame[initial2].getPiece().getTeam() == pretas) {
                    break;
                } if (boardgame[initial2].getPiece() != null && boardgame[initial2].getPiece().getTeam() == brancas) {
                    movement(initial2, pretas);
                    break;
                }
            }
            movement(initial2, pretas);
        }
    }
}
class blackPawn extends piece {
    super(x, y) {
        this.x = x;
        this.y = y;
        this.select = false;
        this.atacked = false;
        this.firstmove = true;
        this.doubleStep = false;
    }
    setAtacado(set) {
        this.atacked = set;
    }
    setDoubleStep(value) {
        this.doubleStep = value;
    }
    getPontos() {
        return 10;
    }
    getSelect() {
        return this.select;
    }
    getAtacked() {
        return this.atacked;
    }
    getTeam() {
        return pretas;
    }
    setFirstMove(set) {
        this.firstmove = set;
    }
    isFirstMove() {
        return this.firstmove;
    }
    isDoubleStep() {
        return this.doubleStep;
    }
    printPiece(ctx, inv) {
        var image = new Image();
        image.src = "./img/peças_negras/black_Pone.png";
        ctx.clearRect(this.x, this.y, 35, 18);
        printThis(ctx, this.x, this.y, inv, image);
    }
    erasePiece(ctx) {
        ctx.clearRect(this.x, this.y, 35, 18);
    }
    move(value) {
        //movimento para a frente

        if (this.firstmove == undefined && boardgame[value + 8].getPiece() == null && boardgame[value + 16].getPiece() == null) {
            movement(value + 8, pretas);
            movement(value + 16, pretas);
        } else if (boardgame[value + 8].getPiece() == null) {
            movement(value + 8, pretas);
        }
        //ataques na diagonal 
        if (!boardgame[value].bounderyLeft()) {//se não tiver na beira esquerda, para não quebrar a linha
            pawnAttack(value + 7, pretas);
        }
        if (!boardgame[value].bounderyRight()) {//se não tiver na beira direita, para não quebrar a linha
            pawnAttack(value + 9, pretas);
        }
        checkWhitePawnEnPassant(value + 1);
        checkWhitePawnEnPassant(value - 1);

    }
}
//-------------------------------


//----botoes da pagina-----------
function desabilitarPlay() {
    document.querySelector("#play").disabled = true;
    document.querySelector("#volume").disabled = true;
}
function habilitarPlay() {
    document.querySelector("#play").disabled = false;
}
function escolherCor(valor) {
    if (valor == "brancas") {
        canvas.style.rotate = "0deg";
        invertido = false;
        timeIA = pretas;
        render(context, invertido);
        habilitarPlay();
        playButtonSound();//som

    } if (valor == "negras") {
        canvas.style.rotate = "180deg";
        invertido = true;
        timeIA = brancas;
        render(context, invertido)
        habilitarPlay();
        playButtonSound();//som

    }

}
function play() {
    document.querySelector("#play").style.border = 0;
    document.querySelector("#play").disabled = true;
    document.querySelector("#brancas").disabled = true;
    document.querySelector("#negras").disabled = true;
    document.getElementById("vez").innerHTML = "é a vez das brancas";
    document.querySelector("#volume").disabled = false;
    turno = brancas;
    playClickSound();//som
    playMusic();

    setTimeout(() => {
        checkBestMoves();

    }, 3000)

    //hover--------------------
    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        let x;
        let y;
        if (!invertido) {
            x = (event.clientX - (rect.left + 23)) * (canvas.width + 50) / rect.width;
            y = (event.clientY - (rect.top + 23)) * (canvas.height + 20) / rect.height;
        }
        if (invertido) {
            x = -(event.clientX - (rect.right - 23)) * (canvas.width + 50) / rect.width;
            y = -(event.clientY - (rect.bottom - 23)) * (canvas.height + 20) / rect.height;
        }
        constRender(context, invertido);
        for (i = 0; i < boardgame.length; i++) {

            if (boardgame[i].calcDistance(x, y)) {
                boardgame[i].printFull(context, colorgrey);
            }
        }
    })
    //---------------------------

    //Selecionar e Mover
    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        let x;
        let y;
        if (!invertido) {
            x = (event.clientX - (rect.left + 23)) * (canvas.width + 50) / rect.width;
            y = (event.clientY - (rect.top + 23)) * (canvas.height + 20) / rect.height;

        }
        if (invertido) {
            x = -(event.clientX - (rect.right - 23)) * (canvas.width + 50) / rect.width;
            y = -(event.clientY - (rect.bottom - 23)) * (canvas.height + 20) / rect.height;
        }

        if (turno != timeIA) {
            for (i = 0; i < boardgame.length; i++) {

                if (boardgame[i].calcDistance(x, y)) {

                    //*****se a casa selecionada estiver preenchida, será guardada a peça e a casa atual 
                    if (boardgame[i].isFilled()) {
                        if (!verificaAtaque(i)) {// verifica se o movimento é um ataque. se não for, segue o fluxo.
                            reset();
                            selectedPiece = boardgame[i].getPiece(); //guarda a peça selecionada
                            casaAtual = boardgame[i]; //guarda a casa da peça selecionada;
                            casaAtualY = boardgame[i].y; //guarda a coordenada da peça selecionada
                            if (verificarTurno()) {
                                selectedPiece.move(i); //chama a função de movimentação da peça;
                            }
                        }

                        //*****se a casa não tiver peça e estiver setada(verde), a peça guardada será colocada na casa clicada 
                    } else {
                        if (boardgame[i].getSetted()) {
                            reset();
                            casaDestino = boardgame[i];  //guarda a casa que será colocada a peça;
                            casaDestinoY = boardgame[i].y; //guarda a coordenada da casa em que será colocada a peça
                            casaAtual.clear(context); //apaga a imagem da peça na casa onde estava anteriormente.
                            casaAtual.takeOffPiece(); //set null no atributo PEÇA da CASA anterior. 
                            casaDestino.placePiece(instanciarClasse(selectedPiece, boardgame[i].x, boardgame[i].y));// instancia a peça na casa selecionada.
                            setTimeout(() => {
                                checkBestMoves();

                            }, 4000)
                            checkXeque();
                            playPiece();//som

                        }
                        //********regra do Enpassant  
                        if (boardgame[i].getEnpassant()) {
                            reset();
                            casaDestino = boardgame[i];  //guarda a casa que será colocada a peça;
                            casaAtual.clear(context); //apaga a imagem da peça na casa onde estava anteriormente.
                            casaAtual.takeOffPiece(); //set null no atributo PEÇA da CASA anterior.
                            pontuacao(casaEnPassant.getPiece());//pontuação
                            casaEnPassant.clear(context); //apaga a imagem da peça
                            casaEnPassant.takeOffPiece(); //set null no atributo PEÇA da CASA.
                            casaDestino.placePiece(instanciarClasse(selectedPiece, boardgame[i].x, boardgame[i].y));// instancia a peça na casa selecionada.
                            setTimeout(() => {
                                checkBestMoves();

                            }, 4000)
                            checkXeque();
                            playTakePiece();

                        }
                        //********regra do Roque
                        if (boardgame[i].getRoqueMove()) {

                            //==================ROQUE DO LADO DO REI=====================

                            if (boardgame[i].x > casaAtual.x) {
                                reset();
                                casaAtual.clear(context); //apaga a imagem da peça na casa onde estava anteriormente.
                                casaAtual.takeOffPiece(); //set null no atributo PEÇA da CASA anterior.
                                casaRoqueRei.clear(context);//apaga a torre da casa
                                casaRoqueRei.takeOffPiece();//set null no atributo PEÇA da CASA.

                                // instancia a peça na casa selecionada.
                                boardgame[i].placePiece(instanciarClasse(selectedPiece, boardgame[i].x, boardgame[i].y));
                                //instancia a torre na nova casa, usa função única *para não quebrar o sistema de turno
                                boardgame[i - 1].placePiece(instanciarTorre(boardgame[i - 1].x, boardgame[i - 1].y));
                                setTimeout(() => {
                                    checkBestMoves();

                                }, 4000)
                                playTakePiece();//som
                                checkXeque();
                                reset();
                            }

                            //==================ROQUE DO LADO DA DAMA=====================

                            if (boardgame[i].x < casaAtual.x) {
                                reset();
                                casaAtual.clear(context); //apaga a imagem da peça na casa onde estava anteriormente.
                                casaAtual.takeOffPiece(); //set null no atributo PEÇA da CASA anterior.
                                casaRoqueDama.clear(context);//apaga a torre da casa
                                casaRoqueDama.takeOffPiece();//set null no atributo PEÇA da CASA.

                                // instancia a peça na casa selecionada.
                                boardgame[i].placePiece(instanciarClasse(selectedPiece, boardgame[i].x, boardgame[i].y));
                                //instancia a torre na nova casa, usa função única *para não quebrar o sistema de turno
                                boardgame[i + 1].placePiece(instanciarTorre(boardgame[i + 1].x, boardgame[i + 1].y));
                                setTimeout(() => {
                                    checkBestMoves();

                                }, 4000)

                                playTakePiece();//som
                                checkXeque();
                                reset();
                            }

                        }
                        else {
                            //*****se a casa não esta ocupada nem setada(verde), só apaga as cores do tabuleiro
                            reset()
                        }

                    }

                }
            }
            constRender(context, invertido);
        }

    })
}
//-------------------------------