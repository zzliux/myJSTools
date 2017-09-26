function quickSort(arr){
	__recursion(0, arr.length-1);
	function __recursion(left, right){
		if(left >= right) return;
		var i = left, j = right;
		var flag = left;
		while(i < j){
			while(arr[flag] <= arr[j] && i < j) j--;
			while(arr[flag] >= arr[i] && i < j) i++;
			if(i < j){
				var t = arr[i];
				arr[i] = arr[j];
				arr[j] = t;
			}
		}
		var t = arr[flag];
		arr[flag] = arr[i];
		arr[i] = t;
		__recursion(left, i-1);
		__recursion(i+1, right);
	}
}
