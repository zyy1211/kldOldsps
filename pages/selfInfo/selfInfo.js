// pages/selfInfo/selfInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'吴彦祖本祖',
    address:'浙江省杭州市',
    address:'17816605236',
    textarea:'羽毛球打卡机覅额看来都是风景'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindData:function(e){
    console.log('fs');
    let name = e.currentTarget.dataset.key;
    this.setData({
      [name]:e.detail.value
    });
    this.submitInfo();
  },
  submitInfo:function(){

  }
})