function editDistance(s1, s2){
	var v0 = [], v1 = [];
	v0.push(0);
	v1.push(0);
	for(var i=0; i<s2.length; i++){
		v0.push(i+1);
		v1.push(0);
	}

	for(var i=1; i<=s1.length; i++){
		v1[0] = i;
		for(var j=1; j<=s2.length; j++){
			var cost = s1[i-1] === s2[j-1] ? 0 : 1;
			v1[j] = min(v1[j-1]+1, v0[j]+1, v0[j-1]+cost);
		}
		for(var j=0; j<v1.length; j++){
			v0[j] = v1[j];
		}
	}

	return v0[s2.length];

	function min(a, b, c){
		var t = a;
		if(t > b) t = b;
		if(t > c) t = c;
		return t;
	}
}
