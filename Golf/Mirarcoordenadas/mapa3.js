var canvas = document.querySelector('canvas')
var c = canvas.getContext('2d')

canvas.width = 1020;
canvas.height = 275;

var g = 1;
var fricciony = 0.7;
var friccionx = 0.9;
var radius = 10;
var mousePos;
var potenciaMax = 200;
var mouseDown = false;
var mouseUp = false;
var golpeomax = 30;
var t = 1;
var dago = false;
var i = 0;

function Marras(x0, y0, x1, y1, tipo) {
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
    this.tipo = tipo;
}

var M1 = new Marras(0,254,170,254,"normal"); // El suelo del principio
var M2 = new Marras(170,173,198,173,"normal"); // El techo del suelo del principio
var M3 = new Marras(198,254,308,254,"normal"); // El suelo del final
var M4 = new Marras(364,254,479,254,"normal"); // Es la priemra pared
var M5 = new Marras(479,225,580,225,"normal"); // El suelo que esta debajo de la cuesta
var M6 = new Marras(637,90,661,90,"normal");
var M7 = new Marras(720,117,744,117,"normal");
var M8 = new Marras(747,254,909,254,"normal");
var M9 = new Marras(909,143,940,143,"normal");
var M10 = new Marras(940,198,1020,198,"normal");
var M11 = new Marras(308,143,444,143,"normal");
var M12 = new Marras(308,89,335,89,"normal");
var M13 = new Marras(335,115,444,115,"normal");
var M14 = new Marras(801,61,828,61,"normal");
var M15 = new Marras(801,170,828,170,"normal");
var M16 = new Marras(555,34,746,34,"normal");
var Mapa = [M1, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11, M12, M13, M14, M15, M16];

function calcularMalda(M) {
    let malda;
    malda = (M.y0 - M.y1) / (M.x0 - M.x1);
    return (malda);
}

function calcularColisionLinea(M) {
    if ((pilota.y + pilota.radius > M.y0 - 15 + (calcularMalda(M) * (pilota.x + pilota.radius - M.x0)))
        &&
        (pilota.y + pilota.radius < M.y0 + 15 + (calcularMalda(M) * (pilota.x + pilota.radius - M.x0)))
    ) {
        return true;
    }
    else {
        return false;
    }
}

function enQueParte(Mapa, x, radius, y) {
    if (x + radius >= Mapa.x0 && x + radius <= Mapa.x1) {
        return true;
    } else {
        return false;
    }
}

function enQuePartev2(Mapa, x, radius, y) {
    let talka = false;
    if (x + radius >= Mapa.x0 && x + radius <= Mapa.x1) {
        talka = calcularColisionLinea(Mapa);
        if (talka === true) {
            return true;
        }
    } else {
        talka = false;
    }
    return talka;
}

var mouse = {
    x: undefined,
    y: undefined
}

// Event Listeners
addEventListener('mousemove', function (evt) {
    mousePos = getMousePos(canvas, evt);
    this.console.log(mouse.x);
});

addEventListener('mousedown', function (evt) {
    mousePos = getMousePos(canvas, evt);
    mouseDown = true;
    mouseUp = false;
});

addEventListener('mouseup', function (evt) {
    mousePos = getMousePos(canvas, evt);
    mouseDown = false;
    mouseUp = true;
});

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX,
        y: evt.clientY
    };
}

var distanciaEntre = function (p1, p2) {
    return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
};

var anguloEntre = function (p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

// Objects
function Pilota(x, y, dy, dx, radius, color) {
    this.x = x;
    this.y = y;
    this.dy = dy;
    this.dx = dx;
    this.radius = radius;
    this.color = color;
    this.posicion = {
        x: this.x,
        y: this.y
    }

    this.update = function () {
        //console.log(this.dy);
        //console.log(mouseUp);
        //console.log(mousePos.x);
        //console.log(anguloEntre(mousePos, this.posicion));
        //console.log(this.dx);

        i = 0;
        dago = false;

        while (i < Mapa.length && dago === false) {
            //Llamo a la funcion y dago se va a hacer true si está en la parte del mapa del array map
            //dago = enQueParte(Mapa[i], this.x, this.radius, this.y);
            dago = enQuePartev2(Mapa[i], this.x, this.radius, this.y);
            if (dago === false) {
                i++;
            }
        }


        if (mouseUp === true) {
            //Mapa[i].tipo === 'normal'
            //Mapa[i].tipo === 'rampa' &&
            if (dago === true && Mapa[i].tipo === 'normal') {
                this.dy = -this.dy * fricciony;
                if (this.dy < 0) {
                    this.y = Mapa[i].y0 + this.radius + 15;
                } else {
                    this.y = Mapa[i].y0 - this.radius - 15;
                }
                this.dx = this.dx * friccionx;
            } else if (dago === true && Mapa[i].tipo === 'rampa') {
                if (this.dx > 0) {
                    this.dx = -this.dx * friccionx;
                }
                this.dy = -this.dy * fricciony;
                let malda = (calcularMalda(Mapa[i]));
                this.x = this.x + ((((Mapa[i].y0 - Mapa[i].y1) / malda) + Mapa[i].x0) - (this.radius * 2));
            } else {
                this.y = this.y - this.dy * t + 0.5 * g * t;
                this.x = this.x + this.dx * t;
            }

            //Rebote en los bordes del mapa
            if (this.x - this.radius < 0) {
                this.dx = -this.dx * friccionx;
                this.x = 0 + this.radius;

            } else if (this.x + this.radius > 1020) {
                this.dx = -this.dx * friccionx;
                this.x = 1020 - radius;
            }

            if ((this.y + this.radius >= canvas.height)) {
                this.dx = this.dx * friccionx;
            } else {
                this.dx = this.dx;
            }

            //PAREDES A MANO
            
            //Primera p1
            if (this.x + this.radius > 170 && this.y - this.radius > 173 && this.x < 180 ) {
                this.dx = -this.dx * friccionx;
                this.x = 170 - this.radius;
            }

            //Primera p2
            if (this.x - radius < 198 && this.y - radius > 173 && this.x > 180) {
                this.dx = -this.dx * friccionx;
                this.x = 198 + this.radius;
            }

            // 2
            if (this.x + this.radius > 479 && this.y - this.radius > 225 && this.x < 480)
            {
                this.dx = -this.dx * friccionx;
                this.x = 479 - this.radius;
            }

            //3 p1
            if (this.x + this.radius > 637 && this.y - this.radius > 90 && this.x < 640 ) {
                this.dx = -this.dx * friccionx;
                this.x = 637 - this.radius;
            }

            //3 p2
            if (this.x - radius < 661 && this.y - radius > 90 && this.x > 640) {
                this.dx = -this.dx * friccionx;
                this.x = 661 + this.radius;
            }

            //4 p1
            if (this.x + this.radius > 720 && this.y - this.radius > 117 && this.x < 730) {
                this.dx = -this.dx * friccionx;
                this.x = 720 - this.radius;
            }

            //4 p2
            if (this.x - radius < 744 && this.y - radius > 117 && this.x > 730) {
                this.dx = -this.dx * friccionx;
                this.x = 744 + this.radius;
            }

            //5 p1
            if (this.x + this.radius > 909 && this.y - this.radius > 143 && this.x < 920) {
                this.dx = -this.dx * friccionx;
                this.x = 909 - this.radius;
            }

            //5 p2
            if (this.x - radius < 940 && this.y - radius > 143 && this.x > 920) {
                this.dx = -this.dx * friccionx;
                this.x = 940 + this.radius;
            }

            //6 p1
            if (this.x + this.radius > 308 && this.y - this.radius > 89 && this.x < 315 && this.y + radius < 143) {
                this.dx = -this.dx * friccionx;
                this.x = 308 - this.radius;
            }

            //6 p2
            if (this.x - radius < 335 && this.y - radius > 89 && this.x > 315 && this.y + radius < 143) {
                this.dx = -this.dx * friccionx;
                this.x = 335 + this.radius;
            }

            //7
            if (this.x - radius < 444 && this.y - radius > 115 && this.x > 440 && this.y + radius < 143) {
                this.dx = -this.dx * friccionx;
                this.x = 444 + this.radius;
            }


            //8 p1
            if (this.x + this.radius > 801 && this.y - this.radius > 61 && this.x < 815 && this.y + radius < 170) {
                this.dx = -this.dx * friccionx;
                this.x = 801 - this.radius;
            }

            //8 p2
            if (this.x - radius < 828 && this.y - radius > 61 && this.x > 815 && this.y + radius < 170) {
                this.dx = -this.dx * friccionx;
                this.x = 828 + this.radius;
            }

            //7
            if (this.x - radius < 580 && this.y - radius > 225 && this.x > 570 ) {
                this.dx = -this.dx * friccionx;
                this.x = 580 + this.radius;
            }

            //Solucion de la pelota desapareciendo del mapa
            if(this.y > 254)
            {
                this.y = 254 - this.radius;
            }

            if(Mapa[i] === M10)
            {
                alert("Oso ondo, irabazi duzu");
                location.href = "menu.html";
            }
            
            this.dy = this.dy - g * t;
            this.dx = this.dx;

        }

        this.posicion.x = this.x;
        this.posicion.y = this.y;

        this.draw();
        if (mouseDown === true) {
            this.golpeo();
        }

    };

    this.golpeo = function () {
        if (potenciaMax > distanciaEntre(mousePos, this.posicion)) {
            if (mousePos.x > pilota.x) {
                this.dx = -((distanciaEntre(mousePos, this.posicion) / 4 * Math.sin((anguloEntre(mousePos, this.posicion) - (Math.PI / 2)))));
            }
            else if (mousePos.x < pilota.x) {
                this.dx = -((distanciaEntre(mousePos, this.posicion) / 4 * Math.sin((anguloEntre(mousePos, this.posicion) - (Math.PI / 2)))));
            }
            if (mousePos.y > pilota.y) {
                this.dy = -((distanciaEntre(mousePos, this.posicion) / 4 * Math.cos((anguloEntre(mousePos, this.posicion) - (Math.PI / 2)))));
            }
            else if (mousePos.y < pilota.y) {
                this.dy = -((distanciaEntre(mousePos, this.posicion) / 4 * Math.cos((anguloEntre(mousePos, this.posicion) - (Math.PI / 2)))));
            }

        } else {
            if (mousePos.x > pilota.x) {
                this.dx = -golpeomax * Math.sin((anguloEntre(mousePos, this.posicion) - (Math.PI / 2)));
            }
            else if (mousePos.x < pilota.x) {
                this.dx = -golpeomax * Math.sin((anguloEntre(mousePos, this.posicion) - (Math.PI / 2)));
            }
            if (mousePos.y > pilota.y) {
                this.dy = -golpeomax * Math.cos((anguloEntre(mousePos, this.posicion) - (Math.PI / 2)));
            }
            else if (mousePos.y < pilota.y) {
                this.dy = -golpeomax * Math.cos((anguloEntre(mousePos, this.posicion) - (Math.PI / 2)));
            }
        }
    }
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();

        if (mouseDown === true) {
            if (potenciaMax < distanciaEntre(mousePos, this.posicion)) {

            } else {
                c.beginPath();
                c.moveTo(this.x, this.y);
                c.lineTo(mousePos.x, mousePos.y);
                c.stroke();
            }
        }
    }
};


var pilota;
function init() {
    pilota = new Pilota(20 + radius * 2, 254 - radius - 20, Pilota.dy, Pilota.dx, radius, 'red');
}
// Animation Loop
function animate() {
    requestAnimationFrame(animate); // Create an animation loop

    c.clearRect(0, 0, canvas.width, canvas.height); // Erase whole canvas
    pilota.update();
}
init();
animate();