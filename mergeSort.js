
/**
 * 归并排序，对数据进行归并排序，并返回这个数组的逆序对个数
 */
function mergeSort(arr){
	var reversePairsCnt = 0;
	__recursion(0, arr.length-1);
	return reversePairsCnt;

	function __recursion(left, right){
		var mid = Math.floor((left + right) / 2);
		if(left >= right) return;
		__recursion(left, mid);
		__recursion(mid+1, right);
		__merge(arr, left, mid, right);
	}
	function __merge(arr, left, mid, right){
		var i = left, j = mid+1;
		var k = 0, arr2 = new Array(right-left+1);
		while(i<=mid && j<=right){
			if(arr[i] > arr[j]){
				arr2[k++] = arr[j++];
				reversePairsCnt += mid - i + 1;
			}else{
				arr2[k++] = arr[i++];
			}
		}
		while(i<=mid){
			arr2[k++] = arr[i++];
		}
		while(j<=right){
			arr2[k++] = arr[j++];
		}
		for(k=0; k<arr2.length; k++){
			arr[k+left] = arr2[k];
		}
	}
}
