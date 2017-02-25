
// GRAPPLE
function Grapple(gameEngine, canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.d2Theta1 = 0;
    this.d2Theta2 = 0;
    this.dTheta1 = 0;
    this.dTheta2 = 0;
    this.Theta1 = 0 * (Math.PI) / 2;
    this.Theta2 = 2.3 * (Math.PI) / 2;
    this.m1 = 10;
    this.m2 = 20;
    this.l1 = 100;
    this.l2 = 100;
    this.X0 = 350;
    this.Y0 = 60;
    this.g = 9.8;
    this.time = 0.05;
}

Grapple.prototype.drawCircle = function(myCircle, context) {
    context.beginPath();
    context.arc(myCircle.x, myCircle.y, myCircle.mass, 0, 2 * Math.PI, false);
    context.fillStyle = '#000';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = 'black';
    context.stroke();
};

Grapple.prototype.drawLine = function(myLine, context) {
    context.beginPath();
    context.moveTo(myLine.x0, myLine.y0);
    context.lineTo(myLine.x, myLine.y);
    context.strokeStyle = 'red';
    context.stroke();


};

Grapple.prototype.animate = function(myCircle1, myCircle2, myLine1, myLine2, canvasX, canvasY, context) {

    mu = 1 + this.m1 / this.m2;

    this.d2Theta1 = (this.g * (Math.sin(this.Theta2) * Math.cos(this.Theta1 - this.Theta2) - mu *
        Math.sin(this.Theta1)) - (this.l2 * this.dTheta2 * this.dTheta2 + this.l1 * this.dTheta1 * this.dTheta1 *
        Math.cos(this.Theta1 - this.Theta2)) * Math.sin(this.Theta1 - this.Theta2)) / (this.l1 * (mu - Math.cos(this.Theta1 - this.Theta2) *
        Math.cos(this.Theta1 - this.Theta2)));

    this.d2Theta2 = (mu * this.g * (Math.sin(this.Theta1) * Math.cos(this.Theta1 - this.Theta2) - Math.sin(this.Theta2)) +
        (mu * this.l1 * this.dTheta1 * this.dTheta1 + this.l2 * this.dTheta2 * this.dTheta2 * Math.cos(this.Theta1 -
            this.Theta2)) * Math.sin(this.Theta1 - this.Theta2)) / (this.l2 * (mu - Math.cos(this.Theta1 - this.Theta2) *
        Math.cos(this.Theta1 - this.Theta2)));
    this.dTheta1 += this.d2Theta1 * this.time;
    this.dTheta2 += this.d2Theta2 * this.time;
    this.Theta1 += this.dTheta1 * this.time;
    this.Theta2 += this.dTheta2 * this.time;

    myCircle1.x = this.X0 + this.l1 * Math.sin(this.Theta1);
    myCircle1.y = this.Y0 + this.l1 * Math.cos(this.Theta1);
    myCircle2.x = this.X0 + this.l1 * Math.sin(this.Theta1) + this.l2 * Math.sin(this.Theta2);
    myCircle2.y = this.Y0 + this.l1 * Math.cos(this.Theta1) + this.l2 * Math.cos(this.Theta2);

    myLine1.x = myCircle1.x;
    myLine1.y = myCircle1.y;
    myLine2.x0 = myCircle1.x;
    myLine2.y0 = myCircle1.y;
    myLine2.x = myCircle2.x;
    myLine2.y = myCircle2.y;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawLine(myLine1, context);
    this.drawLine(myLine2, context);
    // this.drawCircle(myCircle1, context);
    this.drawCircle(myCircle2, context);
};

Grapple.prototype.update = function() {
    this.run(this.ctx);
};

var init = {};

Grapple.prototype.run = function(context) {
    var that = this;
    var myLine1 = { x0: this.X0, y0: this.Y0, x: 0, y: 0 };
    var myLine2 = { x0: 0, y0: 0, x: 0, y: 0 };
    var myCircle1 = {
        x: this.X0 + this.l1 * Math.sin(this.Theta1),
        y: this.Y0 + this.l1 *
            Math.cos(this.Theta1),
        mass: this.m1
    };
    var myCircle2 = {
        x: this.X0 + this.l1 * Math.sin(this.Theta1) + this.l2 *
            Math.sin(this.Theta2),
        y: this.Y0 + this.l1 * Math.cos(this.Theta1) + this.l2 *
            Math.cos(this.Theta2),
        mass: this.m2
    };

    clearInterval(init);
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    init = setInterval(function() {
        that.animate(myCircle1, myCircle2, myLine1, myLine2, this.canvasX, this.canvasY, context);
    }, 10);
};
