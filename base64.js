/**
 * 高效Base64加解密
 */
var base64 = {
	encode: function(str){
		var arrX8 = [];
		// str = str.split('');
		for(var i=0; i<str.length; i++){
			var t = this.charToUTF8Code(str[i]);
			if(t.length === 1){
				arrX8.push(t[0]);
			}else{
				for(var j=0; j<t.length; j++){
					arrX8.push(t[j]);
				}
			}
		}
		var ret = '';
		for(var i=0; i<=arrX8.length-3; i+=3){
			ret += this.__map[arrX8[i]>>2];
			ret += this.__map[((arrX8[i]<<4)&0x3F)|(arrX8[i+1]>>4)];
			ret += this.__map[((arrX8[i+1]<<2)&0x3F)|(arrX8[i+2]>>6)];
			ret += this.__map[arrX8[i+2]&0x3F];
		}
		if(arrX8.length%3 === 2){
			ret += this.__map[arrX8[arrX8.length-2]>>2];
			ret += this.__map[(arrX8[arrX8.length-2]<<4)&0x3F|(arrX8[arrX8.length-1]>>4)];
			ret += this.__map[(arrX8[arrX8.length-1]<<2)&0x3F];
			ret += '=';
		}else if(arrX8.length%3 === 1){
			ret += this.__map[arrX8[arrX8.length-1]>>2];
			ret += this.__map[(arrX8[arrX8.length-1]<<4)&0x3F];
			ret += '==';
		}
		return ret;
	},
	decode: function(str){
		// var reg = /^([a-zA-Z0-9\+\/]{4})*(([a-zA-Z0-9\+\/]{4})|([a-zA-Z0-9\+\/]{3}=)|([a-zA-Z0-9\+\/]{2}==))$/;
		// if(!reg.test(str)) return null;
		// str = str.split('');
		var arrX8 = [];
		var b1, b2, b3, b4;
		for(var i=0; i<str.length-4; i+=4){
			b1 = this.__pam(str[i]);
			b2 = this.__pam(str[i+1]);
			b3 = this.__pam(str[i+2]);
			b4 = this.__pam(str[i+3]);
			arrX8.push((b1<<2) | (b2>>4));
			arrX8.push(((b2&0xF)<<4) | (b3>>2));
			arrX8.push(((b3&0x3)<<6) | b4);
		}
		if(str[str.length-2] === '='){
			arrX8.push((this.__pam(str[str.length-4])<<2) | (this.__pam(str[str.length-3])>>4));
		}else if(str[str.length-1] === '='){
			arrX8.push((this.__pam(str[str.length-4])<<2) | (this.__pam(str[str.length-3])>>4));
			arrX8.push(((this.__pam(str[str.length-3])&0xF)<<4) | (this.__pam(str[str.length-2])>>2));
		}else{
			arrX8.push((this.__pam(str[str.length-4])<<2) | (this.__pam(str[str.length-3])>>4));
			arrX8.push(((this.__pam(str[str.length-3])&0xF)<<4) | (this.__pam(str[str.length-2])>>2));
			arrX8.push(((this.__pam(str[str.length-2])&0x3)<<6) | this.__pam(str[str.length-1]));
		}

		var ret = '';
		for(var i=0; i<arrX8.length; i++){
			if((arrX8[i]>>7) === 0x0){
				ret += String.fromCharCode(arrX8[i]);
			}else if((arrX8[i]>>5) === 0x6){
				ret += String.fromCharCode( ((arrX8[i]&0x1F)<<6) | (arrX8[i+1]&0x3F) );
				i += 1;
			}else{
				ret += String.fromCharCode( ((arrX8[i]&0xF)<<12) | ((arrX8[i+1]&0x3F)<<6) | (arrX8[i+2]&0x3F) );
				i += 2;
			}
		}
		return ret;
	},

	__map: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','+','/'],
	__pam: function(chr){
		var u16code = chr.charCodeAt(0);
		if(u16code > 47 && u16code < 58) {
			return u16code + 4;
		}else if(u16code > 64 && u16code < 91){
			return u16code - 65;
		}else if(u16code > 96 && u16code < 123){
			return u16code - 71;
		}else if(u16code === 43){
			return 62;
		}else {
			return 63;
		}
	},

	charToUTF8Code: function(chr){
		var u16code = chr.charCodeAt(0);
		if(0x0 <= u16code && 0x7F >= u16code){
			return [u16code];
		}else if(0x80 <= u16code && 0x7FF >= u16code){
			return [0x60|((u16code>>6)&0x1F), 0x80|(u16code&0x3F)];
		}else{
			return [0xE0|((u16code>>12)&0xF), 0x80|((u16code>>6)&0x3F), 0x80|((u16code)&0x3F)];
		}
		return null;
	}
}
