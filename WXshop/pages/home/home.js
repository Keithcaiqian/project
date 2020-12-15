import getAllImage from '../../service/home.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],
    recommends:[],
    tabList:['流行','新款','精选'],
    curIndex:0
  },
  curSelected(e){
    this.setData({
      curIndex:e.target.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getAllImage().then(res=>{
      const banners = res.data.data.banner.list
      const recommends = res.data.data.recommend.list
      this.setData({
        banners,
        recommends
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})