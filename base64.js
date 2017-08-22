var base64 = {
	encode: function(str){
		var arrX8 = [];
		for(var i=0; i<str.length; i++){
			var t = this.charToUTF8Code(str[i]);
			if(t.length === 1){
				arrX8.push(this.hackZero(t[0].toString(2), 8));
			}else{
				for(var j=0; j<t.length; j++){
					arrX8.push(t[j].toString(2));
				}
			}
		}
		var t = arrX8.join('');
		var ret = '';
		for(var i=0; i<t.length-6; i+=6){
			ret += this.__map[parseInt(t.substr(i, 6),2)];
		}
		// 判断最后补等号
		if(t.length%6 === 0 && t.length>0){
			ret += this.__map[parseInt(t.slice(-6),2)];
		}else if(t.length%6 === 4){
			ret += this.__map[parseInt(t.slice(-4)+'00',2)] + '=';
		}else if(t.length%6 === 2){
			ret += this.__map[parseInt(t.slice(-2)+'0000',2)] + '==';
		}
		return ret;
	},
	decode: function(str){
		// TODO
		var t = '';
		for(var i=0; i<str.length-3; i++){
			t += this.hackZero(this.__pam[str.charAt(i)].toString(2), 6);
		}
		if(str.slice(-2) === '=='){
			t += this.hackZero((this.__pam[str.charAt(str.length-3)]>>4).toString(2), 2)
		}else if(str.slice(-1) === '='){
			t += this.hackZero(this.__pam[str.charAt(str.length-3)].toString(2), 6);
			t += this.hackZero((this.__pam[str.charAt(str.length-2)]>>2).toString(2), 4)
		}else{
			t += this.hackZero(this.__pam[str.charAt(str.length-3)].toString(2), 6);
			t += this.hackZero(this.__pam[str.charAt(str.length-2)].toString(2), 6);
			t += this.hackZero(this.__pam[str.charAt(str.length-1)].toString(2), 6);
		}

		var ret = '';
		for(var i=0; i<t.length; i+=8){
			if(t.charAt(i) === '0'){
				// 单字节
				ret += String.fromCharCode(parseInt(t.substr(i, 8), 2));
			}else{
				// 多字节字符
				if(t.charAt(i+2) === '0'){
					// 双字节
					var b1 = parseInt(t.substr(i, 8),2) & 0x1F;
					var b2 = parseInt(t.substr(i+8, 8),2) & 0x3F;
					i += 8;
					ret += String.fromCharCode((b1<<6)|b2);
				}else if(t.charAt(i+3) === '0'){
					// 三字节
					var b1 = parseInt(t.substr(i, 8),2) & 0xF;
					var b2 = parseInt(t.substr(i+8, 8),2) & 0x3F;
					var b3 = parseInt(t.substr(i+16, 8),2) & 0x3F;
					i += 16;
					ret += String.fromCharCode((b1<<12)|(b2<<6)|b3);
				}else if(t.charAt(i+4) === '0'){
					// 四字节
					var b1 = parseInt(t.substr(i, 8),2) & 0x7;
					var b2 = parseInt(t.substr(i+8, 8),2) & 0x3F;
					var b3 = parseInt(t.substr(i+16, 8),2) & 0x3F;
					var b4 = parseInt(t.substr(i+24, 8),2) & 0x3F;
					i += 24;
					ret += String.fromCharCode((b1<<18)|(b2<<12)|(b3<<6)|b4);
				}
				// TODO 五六字节
			}
		}
		return ret;
	},

	__map: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','+','/'],
	__pam: {0:52,1:53,2:54,3:55,4:56,5:57,6:58,7:59,8:60,9:61,A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9,K:10,L:11,M:12,N:13,O:14,P:15,Q:16,R:17,S:18,T:19,U:20,V:21,W:22,X:23,Y:24,Z:25,a:26,b:27,c:28,d:29,e:30,f:31,g:32,h:33,i:34,j:35,k:36,l:37,m:38,n:39,o:40,p:41,q:42,r:43,s:44,t:45,u:46,v:47,w:48,x:49,y:50,z:51,'+':62,'/':63},

	// 其实这个过程可以由encodeURIcomponet代替
	charToUTF8Code: function(chr){
		// 得到utf16编码
		var u16code = chr.charCodeAt(0);
		if(0x0 <= u16code && 0x7F >= u16code){
			return [u16code];
		}else if(0x80 <= u16code && 0x7FF >= u16code){
			return [0x60|((u16code>>6)&0x1F), 0x80|(u16code&0x3F)];
		}else if(0x800 <= u16code && 0xFFFF >= u16code){
			return [0xE0|((u16code>>12)&0xF), 0x80|((u16code>>6)&0x3F), 0x80|((u16code)&0x3F)];
		}
		return null;
		// TODO
		/**
		* 转换对照表
		* U+00000000 – U+0000007F   0xxxxxxx (closed)
		* U+00000080 – U+000007FF   110xxxxx 10xxxxxx (closed)
		* U+00000800 – U+0000FFFF   1110xxxx 10xxxxxx 10xxxxxx (closed)
		* U+00010000 – U+001FFFFF   11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
		* U+00200000 – U+03FFFFFF   111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
		* U+04000000 – U+7FFFFFFF   1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
		*/
	},
	hackZero: function(str, length){
		if(!length) length = 2;
		str = str.toString();
		while(str.length < length){
			str = '0' + str;
		}
		return str;
	}
}
