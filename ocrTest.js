var ocr = {
	canvas: null,
	ctx: null,
	img: null,
	imgData: null,
	redChannel: null,
	init: function(){
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext('2d');
	},
	loadImage: function(arg){
		if(typeof arg === 'string'){
			this.img = document.createElement('img');
			this.img.setAttribute('src', arg);
		}else{
			this.img = arg;
		}
		this.canvas.setAttribute('width', this.img.width);
		this.canvas.setAttribute('height', this.img.height);
		this.ctx.drawImage(this.img, 0, 0);
		this.imgData = this.ctx.getImageData(0, 0, this.img.width, this.img.height);

		this.redChannel = [];
		for(var i=0; i<this.img.height; i++){
			this.redChannel.push([]);
			for(var j=0; j<this.img.width; j++){
				this.redChannel[i].push([]);
				this.redChannel[i][j] = this.imgData.data[this.img.width*4*i + 4*j];
			}
		}
	}
};
