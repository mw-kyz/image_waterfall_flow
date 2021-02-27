;(function(doc) {
	// 外层盒子 oWrapper
	// 列数 column
	// 间隙 gap
	
	var Waterfall = function(wrapper, opt) {
		this.oWrapper = doc.getElementsByClassName(wrapper)[0];
		this.column = opt.column;
		this.gap = opt.gap;
		this.imgApi = opt.imgApi;
		this.itemWidth = (this.oWrapper.offsetWidth - (this.column - 1) * this.gap) / this.column;
		this.pageNum = 0;
		this.pageSize = 0;
		this.heightArr = [];
	}

	Waterfall.prototype.init = function() {
		this.getImgDatas(this.pageNum);
		this.bindEvent();
	}

	Waterfall.prototype.bindEvent = function() {
		window.addEventListener('scroll', this.scrollToBottom.bind(this), false);
	}

	Waterfall.prototype.scrollToBottom = function() {
		if(Math.ceil(getScrollTop() + getWindowHeight()) == getScrollHeight()) {
			this.pageNum++;
			if(this.pageNum <= this.pageSize - 1) {
				this.getImgDatas(this.pageNum);
			}
		}
	}

	Waterfall.prototype.getImgDatas = function(pageNum) {
		var _self = this;

		xhr.ajax({
			url: this.imgApi,
			type: 'POST',
			dataType: 'JSON',
			data: {
				pageNum: pageNum
			},
			success: function(data) {
				if(data != 'NO DATA') {
					var pageData = JSON.parse(data.pageData);
					_self.pageSize = parseInt(data.pageSize);
					_self.renderList(pageData, pageNum);
				}
			}
		});
	}

	Waterfall.prototype.renderList = function(data, pageNum) {
		var oFrag = doc.createDocumentFragment();

		data.forEach(function(elem, idx) {

			var oItem = doc.createElement('div'),
					oImg = new Image(),//创建一个img对象
					oTitle = doc.createElement('div');

			var	itemHeight = elem.height * this.itemWidth / elem.width;

			oItem.className = 'wf-item';
			oItem.style.width = this.itemWidth + 'px';
			oItem.style.height = elem.height * this.itemWidth / elem.width + 44 + 'px';//高随着宽等比例缩放
			oImg.src = elem.img;
			oImg.className = 'wf-img';
			oTitle.innerHTML = '<p>银定了</p>';
			oTitle.className = 'title-box';

			oItem.appendChild(oImg);
			oItem.appendChild(oTitle);
			oFrag.appendChild(oItem);

			if(idx < this.column && pageNum == 0) {
				var itemLeft = (idx + 1) % this.column === 1 ? '0' : idx * (this.itemWidth + this.gap);

				this.heightArr.push(itemHeight + 44);
				oItem.style.top = '0';
				oItem.style.left = itemLeft + 'px';
			}else {
				var minIdx = getMinIdx(this.heightArr),
						minHeightElemLeft = minIdx === 0 ? 0 : (minIdx * (this.itemWidth + this.gap));
				
				oItem.style.left = minHeightElemLeft  + 'px';
				oItem.style.top = (this.heightArr[minIdx] + this.gap) + 'px';
				this.heightArr[minIdx] += itemHeight + this.gap + 44;
			}

			oImg.style.opacity = 1;
			oTitle.style.opacity = 1;

		}, this);

		this.oWrapper.appendChild(oFrag);
	}

	function getMinIdx(arr) {
		return [].indexOf.call(arr, Math.min.apply(null, arr));
	}

	window.Waterfall = Waterfall;

})(document);