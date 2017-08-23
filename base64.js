var base64 = {
	encode: function(str){
		var arrX8 = [];
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
		// TODO
		var str = str.split('');
		var arrX6 = [];
		for(var i=0; i<str.length-3; i++){
			arrX6.push(this.__pam[str[i]]);
		}
		if(str[str.length-2] === '='){
			arrX6.push(this.__pam[str[str.length-3]]);
		}else if(str[str.length-1] === '='){
			arrX6.push(this.__pam[str[str.length-3]]);
			arrX6.push(this.__pam[str[str.length-2]]);
		}else{
			arrX6.push(this.__pam[str[str.length-3]]);
			arrX6.push(this.__pam[str[str.length-2]]);
			arrX6.push(this.__pam[str[str.length-1]]);
		}

		var arrX8 = [];
		for(var i=0; i<=arrX6.length-4; i+=4){
			arrX8.push((arrX6[i]<<2) | (arrX6[i+1]>>4));
			arrX8.push(((arrX6[i+1]&0xF)<<4) | (arrX6[i+2]>>2));
			arrX8.push(((arrX6[i+2]&0x3)<<6) | arrX6[i+3]);
		}


		if(arrX6.length%4 === 2){
			arrX8.push((arrX6[arrX6.length-2]<<2) | (arrX6[arrX6.length-1]>>4))
		}else if(arrX6.length%4 === 3){
			arrX8.push((arrX6[arrX6.length-3]<<2) | (arrX6[arrX6.length-2]>>4));
			arrX8.push(((arrX6[arrX6.length-2]&0xF)<<4) | (arrX6[arrX6.length-1]>>2));
		}

		var ret = '';
		for(var i=0; i<arrX8.length; i++){
			if((arrX8[i]>>7) === 0x0){
				// 单字节
				ret += String.fromCharCode(arrX8[i]);
			}else if((arrX8[i]>>5) === 0x6){
				// 双字节
				ret += String.fromCharCode( ((arrX8[i]&0x1F)<<6) | (arrX8[i+1]&0x3F) );
				i += 1;
			}else if((arrX8[i]>>4) === 0xE){
				// 三字节
				ret += String.fromCharCode( ((arrX8[i]&0xF)<<12) | ((arrX8[i+1]&0x3F)<<6) | (arrX8[i+2]&0x3F) );
				i += 2;
			}else if((arrX8[i]>>3) === 0x1E){
				// 四字节
				ret += String.fromCharCode( ((arrX8[i]&0x7)<<18) | ((arrX8[i+1]&0x3F)<<12) | ((arrX8[i+2]&0x3F)<<6) | (arrX8[i+3]&0x3F) );
				i += 3;
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
	}
}
